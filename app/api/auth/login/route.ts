import { NextResponse } from "next/server";
import { LoginSchema } from "../../../../lib/validation";
import { jsonProblem, problem } from "../../../../lib/errors";
import { rateLimit } from "../../../../lib/rate-limit";
import { createServerSupabase } from "../../../../lib/supabase/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for") || "local";
  const rl = await rateLimit(`login:${ip}`, { limit: 10, window: 60 });
  if (!rl.allowed) return jsonProblem(problem(429, "Too Many Requests"), { headers: { "Retry-After": rl.retryAfter.toString() } });

  const body = await req.json().catch(() => null);
  const parsed = LoginSchema.safeParse(body);
  if (!parsed.success) return jsonProblem(problem(400, "Invalid payload", parsed.error.message));
  const { email, password } = parsed.data;

  // Use @supabase/ssr server client so cookies are set automatically
  let supabase;
  try {
    supabase = await createServerSupabase();
  } catch (e: any) {
    const detail = `Supabase env not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY (or SUPABASE_URL and SUPABASE_ANON_KEY). ${e?.message || ""}`;
    return jsonProblem(problem(500, "Server configuration error", detail));
  }
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data?.session) return jsonProblem(problem(401, "Invalid email or password"));
  // Create response after cookie mutations so Next attaches them
  return NextResponse.json({ user: { id: data.user.id, email: data.user.email } });
}
