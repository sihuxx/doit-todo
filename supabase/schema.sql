-- =============================================
-- DoIt 투두 앱 — Supabase 테이블 설계 SQL
-- Supabase Dashboard > SQL Editor 에 붙여넣기
-- =============================================

-- 1. users 테이블
create table if not exists public.users (
  id            uuid primary key default gen_random_uuid(),
  nickname      text not null unique,
  password_hash text not null,
  created_at    timestamptz not null default now()
);

-- 2. categories 테이블
create table if not exists public.categories (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.users(id) on delete cascade,
  name       text not null,
  color      text not null default '#3B82F6',
  created_at timestamptz not null default now()
);

-- 3. todos 테이블
create table if not exists public.todos (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references public.users(id) on delete cascade,
  category_id  uuid references public.categories(id) on delete set null,
  title        text not null,
  is_completed boolean not null default false,
  due_date     date,
  created_at   timestamptz not null default now(),
  completed_at timestamptz
);

-- =============================================
-- 인덱스 (성능 최적화)
-- =============================================
create index if not exists idx_todos_user_id     on public.todos(user_id);
create index if not exists idx_todos_category_id on public.todos(category_id);
create index if not exists idx_categories_user   on public.categories(user_id);

-- =============================================
-- Row Level Security (RLS) — Service Role로
-- API Route에서 접근하므로 RLS는 disable 유지
-- =============================================
alter table public.users      disable row level security;
alter table public.categories disable row level security;
alter table public.todos      disable row level security;

-- =============================================
-- (선택) 테스트 데이터 — 확인 후 삭제 권장
-- =============================================
-- insert into public.users (nickname, password_hash) values ('test', 'hash');
