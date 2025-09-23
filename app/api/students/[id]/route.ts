import { NextResponse } from "next/server";
import { authenticate } from "../../../../lib/auth";
import { createServerSupabase } from "../../../../lib/supabase/server";
import { StudentUpdateSchema } from "../../../../lib/validation";
import { jsonProblem, problem } from "../../../../lib/errors";
import { rateLimit } from "../../../../lib/rate-limit";

export const runtime = "nodejs";

export async function GET(_req: Request, { params }: any) {
  const auth = await authenticate(_req);
  if (!auth) return jsonProblem(problem(401, "Unauthorized"));
  const supabase = await createServerSupabase();
  const { data, error } = await supabase.from("students").select("*").eq("id", params.id).single();
  if (error) return jsonProblem(problem(404, "Not found"));
  return NextResponse.json(data);
}

export async function PATCH(req: Request, { params }: any) {
  const auth = await authenticate(req);
  if (!auth) return jsonProblem(problem(401, "Unauthorized"));
  const ip = req.headers.get("x-forwarded-for") || "local";
  const rl = await rateLimit(`students:update:${ip}`, { limit: 30, window: 60 });
  if (!rl.allowed) return jsonProblem(problem(429, "Too Many Requests"), { headers: { "Retry-After": rl.retryAfter.toString() } });
  const payload = await req.json().catch(() => null);
  const parsed = StudentUpdateSchema.safeParse(payload);
  if (!parsed.success) return jsonProblem(problem(400, "Invalid payload", parsed.error.message));
  const supabase = await createServerSupabase();
  const { data, error } = await supabase.from("students").update(parsed.data).eq("id", params.id).select("*").single();
  if (error) return jsonProblem(problem(400, "Update failed", error.message));
  return NextResponse.json(data);
}

export async function DELETE(req: Request, { params }: any) {
  const auth = await authenticate(req);
  if (!auth) return jsonProblem(problem(401, "Unauthorized"));
  const ip = req.headers.get("x-forwarded-for") || "local";
  const rl = await rateLimit(`students:delete:${ip}`, { limit: 20, window: 60 });
  if (!rl.allowed) return jsonProblem(problem(429, "Too Many Requests"), { headers: { "Retry-After": rl.retryAfter.toString() } });
  const supabase = await createServerSupabase();
  const { error } = await supabase.from("students").delete().eq("id", params.id);
  if (error) return jsonProblem(problem(400, "Delete failed", error.message));
  return NextResponse.json({ ok: true });
}
