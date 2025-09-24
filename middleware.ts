import { NextRequest, NextResponse } from "next/server";
import { authenticate } from "./lib/auth";

// Protect admin API routes by requiring a valid Supabase JWT.
// Admin membership is enforced by Postgres RLS policies; we forward the user id.
export async function middleware(req: NextRequest) {
  const url = new URL(req.url);

  // Allow public/auth routes without checks to avoid loops
  if (url.pathname.startsWith("/api/auth/") || url.pathname === "/login" || url.pathname === "/api/health") {
    return NextResponse.next();
  }

  // Protect admin data APIs
  const needsAuth = url.pathname.startsWith("/api/students") || url.pathname.startsWith("/api/registrations");
  if (!needsAuth) return NextResponse.next();

  const auth = await authenticate(req as unknown as Request);
  if (!auth) {
    return new NextResponse(JSON.stringify({ type: "about:blank", title: "Unauthorized", status: 401 }), {
      status: 401,
      headers: { "content-type": "application/problem+json" },
    });
  }

  // Forward user id for logging/downstream logic
  const res = NextResponse.next({ request: { headers: new Headers(req.headers) } });
  res.headers.set("x-user-id", auth.userId);
  return res;
}

export const config = {
  matcher: ["/api/students/:path*", "/api/registrations"],
};
