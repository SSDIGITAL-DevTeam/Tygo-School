import { NextResponse } from "next/server";
import { RegistrationSchema } from "../../../lib/validation";
import { jsonProblem, problem } from "../../../lib/errors";
import { createServiceSupabase } from "../../../lib/supabase/server";
import { rateLimit } from "../../../lib/rate-limit";

export const runtime = "nodejs";

// Public endpoint to create a pending registration (rate-limited)
export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for") || "local";
  const rl = await rateLimit(`registrations:create:${ip}`, { limit: 10, window: 60 });
  if (!rl.allowed) return jsonProblem(problem(429, "Too Many Requests"), { headers: { "Retry-After": rl.retryAfter.toString() } });

  const payload = await req.json().catch(() => null);
  const parsed = RegistrationSchema.safeParse(payload);
  if (!parsed.success) return jsonProblem(problem(400, "Invalid payload", parsed.error.message));

  // Use service role to insert pending registration (bypasses RLS for public endpoint)
  const db = createServiceSupabase();
  const { data, error } = await db.from("student_registrations").insert({ ...parsed.data, status: "pending" }).select("*").single();
  if (error) return jsonProblem(problem(400, "Insert failed", error.message));
  return NextResponse.json(data, { status: 201 });
}
