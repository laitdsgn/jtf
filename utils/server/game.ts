"use server";
import { createClient } from "../supabase/server";
import { cookies } from "next/headers";
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import crypto from "crypto";
import { z } from "zod";
import sharp from "sharp";

type Zdjecie = {
  url: string;
  nazwa: string;
};

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

const fileSchema = z
  .instanceof(File)
  .refine((f) => f.size > 0, "Plik jest pusty.")
  .refine((f) => f.size <= MAX_FILE_SIZE, "Plik jest za duży (max 10 MB).")
  .refine((f) => ACCEPTED_TYPES.includes(f.type), "Niedozwolony typ pliku.");

const formSchema = z.object({
  day: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Nieprawidłowa data (YYYY-MM-DD)."),
  image1: fileSchema,
  image2: fileSchema,
  image3: fileSchema,
  image4: fileSchema,
  image5: fileSchema,
});

export type ActionResult =
  | { ok: true }
  | { ok: false; error: string };

export async function AddGame(formData: FormData): Promise<ActionResult> {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  const r2 = new S3Client({
    region: "auto",
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`!,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID!,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
  });

  const uploadedKeys: string[] = [];

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { ok: false, error: "Brak zalogowanego użytkownika." };

    const parsed = formSchema.safeParse({
      day: formData.get("day"),
      image1: formData.get("image1"),
      image2: formData.get("image2"),
      image3: formData.get("image3"),
      image4: formData.get("image4"),
      image5: formData.get("image5"),
    });

    if (!parsed.success) {
      const messages = parsed.error.issues
        .map((i) => `${i.path.join(".")}: ${i.message}`)
        .join("; ");
      return { ok: false, error: `Walidacja nie powiodła się — ${messages}` };
    }

    const { day, image1, image2, image3, image4, image5 } = parsed.data;
    const files = [image1, image2, image3, image4, image5];

    const { data: existingRow, error: fetchError } = await supabase
      .from("daily_images")
      .select("image1,image2,image3,image4,image5")
      .eq("day", day)
      .maybeSingle();

    if (fetchError) return { ok: false, error: fetchError.message };

    if (existingRow) {
      const taken: number[] = [];
      const row = existingRow as Record<string, unknown>;
      for (let i = 1; i <= 5; i++) {
        if (row[`image${i}`]) taken.push(i);
      }
      if (taken.length > 0) {
        return {
          ok: false,
          error: `Zdjęcia dla tego dnia są już wypełnione (sloty: ${taken.join(", ")}). Użyj formularza aktualizacji.`,
        };
      }
    }

    const [year, , dayPadded] = day.split("-");
    const dayNum = String(parseInt(dayPadded, 10));

    const imageColumns: Record<string, Zdjecie> = {};

    for (let idx = 0; idx < files.length; idx++) {
      const file = files[idx];
      const slotNum = idx + 1;
      const webpBuffer = await sharp(Buffer.from(await file.arrayBuffer()))
        .webp({ quality: 80 })
        .toBuffer();
      const fileName = `film_pic-${dayNum}-${year}-${slotNum}.webp`;

      await r2.send(
        new PutObjectCommand({
          Bucket: process.env.R2_BUCKET!,
          Key: fileName,
          Body: webpBuffer,
          ContentType: "image/webp",
        }),
      );
      uploadedKeys.push(fileName);

      imageColumns[`image${slotNum}`] = {
        url: `${process.env.R2_PUBLIC_URL}/${fileName}`,
        nazwa: fileName,
      };
    }

    const productionId = formData.get("production_id") as string | null;
    if (!productionId){
      return {
        ok: false,
        error: `Ta produkcja nie istnieje`,
      };
    }

    let dbError;
    if (existingRow) {
      const updateData: Record<string, unknown> = { ...imageColumns, production_id: productionId };

      const { error } = await supabase
        .from("daily_images")
        .update(updateData)
        .eq("day", day);
      dbError = error;
    } else {
      const insertData: Record<string, unknown> = { day, ...imageColumns, production_id: productionId };

      const { error } = await supabase
        .from("daily_images")
        .insert(insertData);
      dbError = error;
    }

    if (dbError) {
      throw new Error(dbError.message);
    }

    console.log("Dodano zdjęcia dla dnia:", day);
    return { ok: true };
  } catch (err) {
    console.error("AddGame error:", err);
    if (uploadedKeys.length > 0) {
      await Promise.all(
        uploadedKeys.map((key) =>
          r2
            .send(
              new DeleteObjectCommand({
                Bucket: process.env.R2_BUCKET!,
                Key: key,
              }),
            )
            .catch((cleanupErr) =>
              console.error("Rollback R2 failed for", key, cleanupErr),
            ),
        ),
      );
    }
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Wystąpił nieoczekiwany błąd.",
    };
  }
}

export async function UpdateGame(formData: FormData): Promise<ActionResult> {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  const r2 = new S3Client({
    region: "auto",
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`!,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID!,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
  });

  const uploadedKeys: string[] = [];
  const replacedOldKeys: string[] = [];

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { ok: false, error: "Brak zalogowanego użytkownika." };

    const slotRaw = formData.get("slot") as string;
    const slotNum = Number(slotRaw);
    if (!Number.isInteger(slotNum) || slotNum < 1 || slotNum > 5) {
      return { ok: false, error: "Slot musi być liczbą od 1 do 5." };
    }

    const parsedFile = fileSchema.safeParse(formData.get("file"));
    if (!parsedFile.success) {
      return {
        ok: false,
        error: parsedFile.error.issues.map((i) => i.message).join("; "),
      };
    }

    const day = (formData.get("day") as string)?.trim();
    if (!day || !/^\d{4}-\d{2}-\d{2}$/.test(day)) {
      return { ok: false, error: "Nieprawidłowa data (YYYY-MM-DD)." };
    }

    const { data: existingRow, error: fetchError } = await supabase
      .from("daily_images")
      .select("id, image1, image2, image3, image4, image5")
      .eq("day", day)
      .maybeSingle();

    if (fetchError) return { ok: false, error: fetchError.message };
    if (!existingRow) {
      return {
        ok: false,
        error:
          "Brak wiersza dla tego dnia — użyj najpierw formularza dodawania.",
      };
    }

    const columnKey = `image${slotNum}` as
      | "image1"
      | "image2"
      | "image3"
      | "image4"
      | "image5";
    const oldImage = (existingRow as Record<string, unknown>)[
      columnKey
    ] as Zdjecie | null;

    const file = parsedFile.data;
    const [year, , dayPadded] = day.split("-");
    const dayNum = String(parseInt(dayPadded, 10));
    const fileName = `film_pic-${dayNum}-${year}-${slotNum}.webp`;

    const webpBuffer = await sharp(Buffer.from(await file.arrayBuffer()))
      .webp({ quality: 80 })
      .toBuffer();

    await r2.send(
      new PutObjectCommand({
        Bucket: process.env.R2_BUCKET!,
        Key: fileName,
        Body: webpBuffer,
        ContentType: "image/webp",
      }),
    );
    uploadedKeys.push(fileName);

    const newImage: Zdjecie = {
      url: `${process.env.R2_PUBLIC_URL}/${fileName}`,
      nazwa: fileName,
    };

    const { error: updateError } = await supabase
      .from("daily_images")
      .update({ [`image${slotNum}`]: newImage })
      .eq("id", existingRow.id);

    if (updateError) throw new Error(updateError.message);

    if (oldImage?.nazwa && oldImage.nazwa !== fileName) {
      replacedOldKeys.push(oldImage.nazwa);
    }

    await Promise.all(
      replacedOldKeys.map((key) =>
        r2
          .send(
            new DeleteObjectCommand({
              Bucket: process.env.R2_BUCKET!,
              Key: key,
            }),
          )
          .catch((err) =>
            console.error("Cleanup old R2 file failed:", key, err),
          ),
      ),
    );

    console.log("Zaktualizowano slot", slotNum, "dla dnia", day);
    return { ok: true };
  } catch (err) {
    console.error("UpdateGame error:", err);
    if (uploadedKeys.length > 0) {
      await Promise.all(
        uploadedKeys.map((key) =>
          r2
            .send(
              new DeleteObjectCommand({
                Bucket: process.env.R2_BUCKET!,
                Key: key,
              }),
            )
            .catch((cleanupErr) =>
              console.error("Rollback R2 failed for", key, cleanupErr),
            ),
        ),
      );
    }
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Wystąpił nieoczekiwany błąd.",
    };
  }
}

const deleteSchema = z
  .object({
    mode: z.enum(["id", "day"]),
    id: z.string().optional(),
    day: z.string().optional(),
  })
  .refine((v) => (v.mode === "id" ? !!v.id : !!v.day), {
    message: "Musisz podać wartość dla wybranego trybu.",
  });

export async function DeleteGame(formData: FormData): Promise<ActionResult> {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  const r2 = new S3Client({
    region: "auto",
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`!,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID!,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
  });

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { ok: false, error: "Brak zalogowanego użytkownika." };

    const parsed = deleteSchema.safeParse({
      mode: formData.get("mode"),
      id: formData.get("id"),
      day: formData.get("day"),
    });

    if (!parsed.success) {
      return {
        ok: false,
        error:
          "Nieprawidłowe dane: " +
          parsed.error.issues.map((i) => i.message).join("; "),
      };
    }

    const { mode, id, day } = parsed.data;

    let query = supabase
      .from("daily_images")
      .select("id, day, image1, image2, image3, image4, image5");
    if (mode === "id") {
      query = query.eq("id", id!);
    } else {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(day!)) {
        return { ok: false, error: "Nieprawidłowa data (YYYY-MM-DD)." };
      }
      query = query.eq("day", day!);
    }

    const { data: row, error: fetchError } = await query.maybeSingle();
    if (fetchError) return { ok: false, error: fetchError.message };
    if (!row) {
      return { ok: false, error: "Nie znaleziono wiersza." };
    }

    const imageKeys: string[] = [];
    const r = row as Record<string, unknown>;
    for (let i = 1; i <= 5; i++) {
      const img = r[`image${i}`] as Zdjecie | null;
      if (img?.nazwa) imageKeys.push(img.nazwa);
    }

    const { error: deleteError } = await supabase
      .from("daily_images")
      .delete()
      .eq("id", row.id);

    if (deleteError) throw new Error(deleteError.message);

    await Promise.all(
      imageKeys.map((key) =>
        r2
          .send(
            new DeleteObjectCommand({
              Bucket: process.env.R2_BUCKET!,
              Key: key,
            }),
          )
          .catch((err) =>
            console.error("R2 cleanup failed for", key, err),
          ),
      ),
    );

    console.log("Usunięto wiersz", row.id, "oraz pliki:", imageKeys);
    return { ok: true };
  } catch (err) {
    console.error("DeleteGame error:", err);
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Wystąpił nieoczekiwany błąd.",
    };
  }
}

export async function loginAndCreateCookie(email: string, password: string) {
  const secretKey = process.env.ADMIN_GATEWAY_PASSWORD;

  if (!secretKey) {
    return { success: false, error: "Błąd konfiguracji serwera." };
  }

  try {
    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore); // Upewnij się, że przekazujesz ew. cookies/context jeśli lib tego wymaga
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    const expiresAt = Date.now() + 1000 * 60 * 60 * 24; // 24 godziny
    const payload = `modadm:${expiresAt}`;

    const hash = crypto
      .createHmac("sha256", secretKey)
      .update(payload)
      .digest("hex");

    const cookieValue = `${payload}.${hash}`;

    cookieStore.set("admin_gate_token", cookieValue, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    return { success: true };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Wystąpił nieoczekiwany błąd",
    };
  }
}

export async function logoutAndClearCookie() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_gate_token");
}
