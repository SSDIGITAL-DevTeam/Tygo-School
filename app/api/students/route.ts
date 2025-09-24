import { NextResponse } from "next/server";
import { authenticate } from "../../../lib/auth";
import { createServerSupabase } from "../../../lib/supabase/server";
import { StudentSchema } from "../../../lib/validation";
import { parseLimit, encodeCursor } from "../../../lib/pagination";
import { jsonProblem, problem } from "../../../lib/errors";
import { rateLimit } from "../../../lib/rate-limit";

export const runtime = "nodejs";

// GET /api/students?limit=20&cursor=<iso>&q=...&status=&flag=
export async function GET(req: Request) {
  const auth = await authenticate(req);
  if (!auth) return jsonProblem(problem(401, "Unauthorized"));

  const ip = req.headers.get("x-forwarded-for") || "local";
  const rl = await rateLimit(`students:list:${ip}`, { limit: 60, window: 60 });
  if (!rl.allowed) return jsonProblem(problem(429, "Too Many Requests"), { headers: { "Retry-After": rl.retryAfter.toString() } });

  const url = new URL(req.url);
  const limit = parseLimit(url.searchParams.get("limit"), 20, 100);
  const cursor = url.searchParams.get("cursor");
  const q = url.searchParams.get("q") || "";
  const status = url.searchParams.get("status");
  const flag = url.searchParams.get("flag");

  const supabase = await createServerSupabase();
  let query = supabase.from("students").select("*", { count: "exact" }).order("created_at", { ascending: false }).limit(limit);
  if (cursor) query = query.lt("created_at", cursor);
  if (q) query = query.ilike("name", `%${q}%`);
  if (status) query = query.eq("status", status);
  if (flag) query = query.eq("flag", flag);

  const { data, error, count } = await query;
  if (error) return jsonProblem(problem(500, "Database error", error.message));
  const nextCursor = data && data.length ? encodeCursor(data[data.length - 1].created_at) : null;
  return NextResponse.json({ items: data, nextCursor, total: count ?? null });
}

// POST /api/students
export async function POST(req: Request) {
  const auth = await authenticate(req);
  if (!auth) return jsonProblem(problem(401, "Unauthorized"));

  const ip = req.headers.get("x-forwarded-for") || "local";
  const rl = await rateLimit(`students:create:${ip}`, { limit: 20, window: 60 });
  if (!rl.allowed) return jsonProblem(problem(429, "Too Many Requests"), { headers: { "Retry-After": rl.retryAfter.toString() } });

  const payload = await req.json().catch(() => null);
  const parsed = StudentSchema.safeParse(payload);
  if (!parsed.success) return jsonProblem(problem(400, "Invalid payload", parsed.error.message));

  const supabase = await createServerSupabase();
  const { data, error } = await supabase.from("students").insert(parsed.data).select("*").single();
  if (error) return jsonProblem(problem(400, "Insert failed", error.message));
  return NextResponse.json(data, { status: 201 });
}
