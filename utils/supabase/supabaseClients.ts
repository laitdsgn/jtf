import {createClient} from "@supabase/supabase-js";
import {cookies} from "next/headers";
import { createClient as createServerClient } from "../supabase/server";
export async function supabaseNormalClient() {
    const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY! );

    return sb;
}

export  async function supabaseCookieAuthenciatedClient() {
    const cookieStore = await cookies();
    const supabase = await createServerClient(cookieStore);
}