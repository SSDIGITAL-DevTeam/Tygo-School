import { jwtVerify } from "jose";

export type AuthContext = {
  userId: string;
  token: string;
};

export function getBearer(req: Request) {
  const h = req.headers.get("authorization") || req.headers.get("Authorization");
  if (!h) return null;
  const m = /^Bearer\s+(.+)$/i.exec(h);
  return m ? m[1] : null;
}

export function getCookie(name: string, cookieHeader?: string | null) {
  const raw = cookieHeader ?? "";
  const parts = raw.split(/;\s*/);
  for (const p of parts) {
    const [k, v] = p.split("=");
    if (k === name) return decodeURIComponent(v || "");
  }
  return null;
}

export async function verifyJwt(token: string): Promise<AuthContext | null> {
  const secret = process.env.SUPABASE_JWT_SECRET;
  if (!secret) return null;
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
    const sub = payload.sub as string | undefined;
    if (!sub) return null;
    return { userId: sub, token };
  } catch (e) {
    return null;
  }
}

export async function authenticate(req: Request): Promise<AuthContext | null> {
  const bearer = getBearer(req);
  const cookie = getCookie("sb-access-token", req.headers.get("cookie"));
  const token = bearer || cookie;
  if (!token) return null;
  return verifyJwt(token);
}

