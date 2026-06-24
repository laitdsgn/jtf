"use client";

import { useRouter } from "next/navigation";
import { logoutAndClearCookie } from "@/utils/server/game";
import { createClient } from "@/lib/client";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
  const router = useRouter();

  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    try {
      await logoutAndClearCookie();
    } catch (err) {
      console.error(err);
    }
    router.push("/auth/login");
  };

  return <Button onClick={logout}>Logout</Button>;
}
