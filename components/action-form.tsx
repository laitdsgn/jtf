"use client";

import { useActionState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, ImageIcon, RefreshCw } from "lucide-react";
import {
  AddGame,
  UpdateGame,
  DeleteGame,
  type ActionResult,
} from "@/utils/server/game";

function ResultBanner({ result }: { result: ActionResult | null }) {
  if (!result) return null;
  if (result.ok) {
    return (
      <div className="rounded border border-emerald-800 bg-emerald-950/40 px-3 py-2 text-sm text-emerald-300">
        Operacja zakończona sukcesem.
      </div>
    );
  }
  return (
    <div className="rounded border border-red-900 bg-red-950/40 px-3 py-2 text-sm text-red-300">
      {result.error}
    </div>
  );
}

export function AddGameForm({ today }: { today: string }) {
  const [state, formAction, pending] = useActionState<
    ActionResult | null,
    FormData
  >(async (prev, formData) => AddGame(formData), null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.ok) formRef.current?.reset();
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-5">
      <ResultBanner result={state} />

      <div className="grid gap-2">
        <Label
          htmlFor="a-day"
          className="flex items-center gap-2 text-zinc-300"
        >
          <Calendar className="h-4 w-4 text-emerald-500" />
          Data
        </Label>
        <Input
          id="a-day"
          type="date"
          name="day"
          required
          defaultValue={today}
          className="border-zinc-800 bg-zinc-950 text-zinc-100 focus-visible:ring-emerald-600"
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {[1, 2, 3, 4, 5].map((n) => (
          <div key={n} className="grid gap-2">
            <Label htmlFor={`a-image${n}`} className="text-zinc-300">
              Zdjęcie {n}
            </Label>
            <Input
              id={`a-image${n}`}
              type="file"
              name={`image${n}`}
              accept="image/*"
              required
              className="h-fit border-zinc-800 bg-zinc-950 text-zinc-100 file:rounded file:border-0 file:bg-zinc-800 file:px-3 file:py-1 file:mr-3 file:cursor-pointer file:text-emerald-400 hover:file:bg-zinc-700 focus-visible:ring-emerald-600"
            />
          </div>
        ))}
      </div>

      <Button
        type="submit"
        disabled={pending}
        className="mt-2 w-full border border-emerald-700 bg-transparent text-emerald-400 hover:bg-emerald-950 sm:w-auto sm:self-end disabled:opacity-50"
      >
        {pending ? "Wysyłanie..." : "Zapisz 5 zdjęć"}
      </Button>
    </form>
  );
}

export function UpdateGameForm({ today }: { today: string }) {
  const [state, formAction, pending] = useActionState<
    ActionResult | null,
    FormData
  >(async (prev, formData) => UpdateGame(formData), null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.ok) formRef.current?.reset();
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-5">
      <ResultBanner result={state} />

      <div className="grid gap-2">
        <Label
          htmlFor="u-day"
          className="flex items-center gap-2 text-zinc-300"
        >
          <Calendar className="h-4 w-4 text-emerald-500" />
          Data
        </Label>
        <Input
          id="u-day"
          type="date"
          name="day"
          required
          defaultValue={today}
          className="border-zinc-800 bg-zinc-950 text-zinc-100 focus-visible:ring-emerald-600"
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="u-slot" className="text-zinc-300">
          Slot (1–5)
        </Label>
        <Input
          id="u-slot"
          type="number"
          name="slot"
          min={1}
          max={5}
          required
          defaultValue={1}
          className="border-zinc-800 bg-zinc-950 text-zinc-100 focus-visible:ring-emerald-600"
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="u-file" className="text-zinc-300">
          Nowe zdjęcie
        </Label>
        <Input
          id="u-file"
          type="file"
          name="file"
          accept="image/*"
          required
          className="h-fit border-zinc-800 bg-zinc-950 text-zinc-100 file:rounded file:border-0 file:bg-zinc-800 file:px-3 file:py-1 file:mr-3 file:cursor-pointer file:text-emerald-400 hover:file:bg-zinc-700 focus-visible:ring-emerald-600"
        />
      </div>

      <Button
        type="submit"
        disabled={pending}
        className="mt-2 w-full border border-emerald-700 bg-transparent text-emerald-400 hover:bg-emerald-950 sm:w-auto sm:self-end disabled:opacity-50"
      >
        {pending ? "Wysyłanie..." : "Zaktualizuj slot"}
      </Button>
    </form>
  );
}

export function DeleteGameForm({ today }: { today: string }) {
  const [state, formAction, pending] = useActionState<
    ActionResult | null,
    FormData
  >(async (prev, formData) => DeleteGame(formData), null);
  return (
    <form action={formAction} className="flex flex-col gap-5">
      <ResultBanner result={state} />
      <input type="hidden" name="mode" value="id" />

      <div className="flex flex-row gap-6">
        <label className="flex items-center gap-2 text-zinc-300 cursor-pointer">
          <input type="radio" defaultChecked className="accent-emerald-500" />
          Usuń po ID
        </label>
        <label className="flex items-center gap-2 text-zinc-300 cursor-pointer">
          <input type="radio" className="accent-emerald-500" />
          Usuń po dacie
        </label>
      </div>

      <div className="grid gap-2">
        <Label
          htmlFor="d-day"
          className="flex items-center gap-2 text-zinc-300"
        >
          <Calendar className="h-4 w-4 text-emerald-500" />
          Data
        </Label>
        <Input
          id="d-day"
          type="date"
          name="day"
          defaultValue={today}
          className="border-zinc-800 bg-zinc-950 text-zinc-100 focus-visible:ring-emerald-600 disabled:opacity-40 disabled:cursor-not-allowed"
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="d-id" className="flex items-center gap-2 text-zinc-300">
          <RefreshCw className="h-4 w-4 text-emerald-500" />
          ID
        </Label>
        <Input
          id="d-id"
          type="number"
          name="id"
          defaultValue={1}
          min={1}
          className="border-zinc-800 bg-zinc-950 text-zinc-100 focus-visible:ring-emerald-600 disabled:opacity-40 disabled:cursor-not-allowed"
        />
      </div>

      <Button
        type="submit"
        disabled={pending}
        className="mt-2 w-full border border-red-900 bg-transparent text-red-400 hover:bg-red-950 sm:w-auto sm:self-end disabled:opacity-50"
      >
        {pending ? "Usuwanie..." : "Usuń row"}
      </Button>
    </form>
  );
}

export { ImageIcon };
