import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { LogoutButton } from "@/components/logout-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AddGameForm,
  UpdateGameForm,
  DeleteGameForm,
} from "@/components/action-form";
import { Upload, ImageIcon, RefreshCw, Trash2 } from "lucide-react";

const page = async () => {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="dark min-h-svh bg-zinc-950 text-zinc-100">
      <header className="border-b border-zinc-800">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-md border border-emerald-700 text-emerald-400">
              <Upload className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-semibold">Panel admina</h1>
              <p className="text-xs text-zinc-400">{user.email}</p>
            </div>
          </div>
          <LogoutButton />
        </div>
      </header>

      <main className="mx-auto grid max-w-5xl gap-6 px-6 py-10 md:grid-cols-2">
        <Card className="border-zinc-800 bg-zinc-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-zinc-100">
              <ImageIcon className="h-5 w-5 text-emerald-500" />
              Dodaj zestaw zdjęć dnia
            </CardTitle>
            <CardDescription className="text-zinc-400">
              Wgraj wszystkie 5 zdjęć dla wybranego dnia. Pliki zostaną
              automatycznie skonwertowane do WebP.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AddGameForm today={today} />
          </CardContent>
        </Card>

        <Card className="border-zinc-800 bg-zinc-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-zinc-100">
              <RefreshCw className="h-5 w-5 text-emerald-500" />
              Aktualizuj jedno zdjęcie
            </CardTitle>
            <CardDescription className="text-zinc-400">
              Zmień pojedynczy slot (1–5) dla istniejącego dnia.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <UpdateGameForm today={today} />
          </CardContent>
        </Card>

        <Card className="border-zinc-800 bg-zinc-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-zinc-100">
              <Trash2 className="h-5 w-5 text-red-500" />
              Usuń cały row dnia
            </CardTitle>
            <CardDescription className="text-zinc-400">
              Usuwa wiersz z bazy oraz wszystkie powiązane pliki z R2.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DeleteGameForm today={today} />
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default page;
