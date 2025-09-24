import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { createClient as createAdminClient } from "@supabase/supabase-js";

function getEnv(key: string) {
  return process.env[key];
}

function resolveUrlAndAnon() {
  // Prefer NEXT_PUBLIC_* but support SUPABASE_URL/SUPABASE_ANON_KEY to match common setups
  const url = getEnv("NEXT_PUBLIC_SUPABASE_URL") || getEnv("SUPABASE_URL");
  const anon = getEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY") || getEnv("SUPABASE_ANON_KEY");
  if (!url || !anon) {
    throw new Error(
      "Missing Supabase env. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY (or SUPABASE_URL and SUPABASE_ANON_KEY)."
    );
  }
  return { url, anon } as const;
}

// Server client that integrates with Next.js cookies (httpOnly) so auth
// cookies are set/cleared automatically on Route Handlers.
export async function createServerSupabase() {
  const cookieStore = await (cookies() as any);
  const { url, anon } = resolveUrlAndAnon();
  return createServerClient(url, anon, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: any) {
        cookieStore.set({ name, value, ...options });
      },
      remove(name: string, options: any) {
        cookieStore.set({ name, value: "", ...options, maxAge: 0 });
      },
    },
  });
}

// Admin/service client for backend administrative tasks (do NOT import client-side)
export function createServiceSupabase() {
  const { url } = resolveUrlAndAnon();
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createAdminClient(url, service, { auth: { persistSession: false, autoRefreshToken: false } });
}
