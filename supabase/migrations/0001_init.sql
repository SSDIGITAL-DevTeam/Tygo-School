-- Enable required extensions
create extension if not exists pgcrypto;

-- Admins table (links to auth.users)
create table if not exists public.admins (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  created_at timestamptz not null default now()
);

-- Students table
create table if not exists public.students (
  id text primary key, -- business student id
  name text not null,
  email text,
  current_class text not null,
  status text not null check (status in ('Active','Non Active')),
  flag text not null check (flag in ('green','yellow','red')),
  created_at timestamptz not null default now()
);

-- Student registrations
create table if not exists public.student_registrations (
  id uuid primary key default gen_random_uuid(),
  student_id text not null,
  name text not null,
  email text,
  current_class text not null,
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  created_at timestamptz not null default now()
);

-- Indexes for performance
create index if not exists idx_students_created_at_desc on public.students (created_at desc);
create index if not exists idx_students_name on public.students (name);
create index if not exists idx_students_status on public.students (status);
create index if not exists idx_students_flag on public.students (flag);

create index if not exists idx_regs_status_created on public.student_registrations (status, created_at desc);

-- RLS policies: admins only for students & registrations
alter table public.students enable row level security;
alter table public.student_registrations enable row level security;

create policy if not exists students_admin_all on public.students
  for all using (exists (select 1 from public.admins a where a.id = auth.uid()))
  with check (exists (select 1 from public.admins a where a.id = auth.uid()));

create policy if not exists regs_select_admin on public.student_registrations
  for select using (exists (select 1 from public.admins a where a.id = auth.uid()));
create policy if not exists regs_modify_admin on public.student_registrations
  for all using (exists (select 1 from public.admins a where a.id = auth.uid()))
  with check (exists (select 1 from public.admins a where a.id = auth.uid()));

-- Admin seed step (manual):
-- 1) Create a user in Supabase Auth (Dashboard or CLI)
-- 2) Insert into admins (replace <auth_uid> and <email>):
-- insert into public.admins (id, email) values ('<auth_uid>', '<email>');

