Tygo School OS — API + Auth (Next.js App Router)

Overview
- Next.js 13+ App Router backend integrated with Supabase (Auth + Postgres).
- Secure by default: JWT verification, RLS policies, rate limiting, and RFC7807 errors.
- Scalable: indexed queries, keyset pagination, and connection pooling via Supabase.

Prerequisites
- Node.js 18+
- A Supabase project

Environment
1) Copy .env.example to .env.local and fill values:
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
   - SUPABASE_SERVICE_ROLE_KEY (server-only)
   - SUPABASE_JWT_SECRET (from Supabase Settings → API)
   - Optional: REDIS_URL/REDIS_TOKEN for rate limiting (Upstash). Fallback is in-memory.

Database
1) Apply migrations in supabase/migrations/0001_init.sql to your project (psql or SQL editor).
2) Seed an admin:
   - Create a user in Supabase Auth (email/password).
   - Insert into admins: insert into public.admins (id, email) values ('<auth_uid>', '<email>');

Run
- npm run dev
- /api/health should return { ok: true }

Auth cookies & troubleshooting
- The login route uses @supabase/ssr with Next's cookies() so sb-access-token/sb-refresh-token are set as httpOnly cookies.
- Dev: cookies are not Secure on http://localhost; in production, Secure is automatically applied by Supabase.
- Ensure env keys (NEXT_PUBLIC_SUPABASE_URL/ANON) match your Supabase project. Restart the dev server after changes.
- If POST /api/auth/login succeeds but you don't see cookies, check you didn't guard /api/auth/* in middleware.

Auth
- POST /api/auth/login { email, password }
  - Sets secure httpOnly cookies sb-access-token and sb-refresh-token.
- POST /api/auth/logout clears cookies.

Students (admin only via RLS)
- GET /api/students?limit=20&cursor=<iso>&q=...&status=Active|Non%20Active&flag=green|yellow|red
- POST /api/students (validated)
- GET /api/students/[id]
- PATCH /api/students/[id]
- DELETE /api/students/[id]

Registrations
- POST /api/registrations creates a pending registration (rate limited).

Security
- middleware.ts verifies Supabase JWT from Authorization: Bearer or sb-access-token cookie.
- Postgres RLS enforces admin-only access: exists(select 1 from admins where id = auth.uid()).
- Rate limiting via Redis (sliding window) or in-memory fallback.
- Responses use application/problem+json where errors occur.

Notes
- Never expose SUPABASE_SERVICE_ROLE_KEY to the browser.
- Use HTTPS in production to secure cookies (Secure, HttpOnly, SameSite=Lax).
