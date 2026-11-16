-- Ankur Worldwide: blog posts and the people allowed to write them.
-- Run once in Supabase → SQL Editor, after schema.sql. Safe to run again.
--
-- Rules enforced by the database itself:
--   • Anyone can read PUBLISHED posts. Nobody can read drafts without signing in.
--   • Only a signed-in user listed in public.blog_admins, who has also passed two-factor
--     authentication in this session (aal2), can create, edit or delete posts.

-- 1. Who may write. Add the owner's user id after creating the account (see DEPLOY.md, Blog).
create table if not exists public.blog_admins (
  user_id uuid primary key references auth.users (id) on delete cascade
);
alter table public.blog_admins enable row level security;
revoke all on public.blog_admins from anon, authenticated;
-- A signed-in user may check whether they themselves are an admin, nothing more.
drop policy if exists "read own admin row" on public.blog_admins;
create policy "read own admin row" on public.blog_admins for select to authenticated using (user_id = auth.uid());
grant select on public.blog_admins to authenticated;

-- 2. Posts. Length checks are a second line of defence behind the admin page.
create table if not exists public.posts (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and char_length(slug) <= 80),
  title        text not null check (char_length(title) between 1 and 140),
  excerpt      text not null check (char_length(excerpt) between 1 and 300),
  body         text not null check (char_length(body) <= 40000),
  published    boolean not null default false,
  published_at timestamptz,
  updated_at   timestamptz not null default now()
);
alter table public.posts enable row level security;
revoke all on public.posts from anon, authenticated;
grant select on public.posts to anon, authenticated;
grant insert, update, delete on public.posts to authenticated;

-- True only for a listed admin who has completed two-factor login in this session.
-- SECURITY DEFINER so that visitors, who may not read blog_admins, can still be evaluated by the posts policy
-- (they simply get false). It reveals nothing: it only answers "is the CALLER an admin".
create or replace function public.is_blog_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(auth.jwt() ->> 'aal', '') = 'aal2'
     and exists (select 1 from public.blog_admins where user_id = auth.uid());
$$;
revoke all on function public.is_blog_admin() from public;
grant execute on function public.is_blog_admin() to anon, authenticated;

drop policy if exists "public reads published" on public.posts;
create policy "public reads published" on public.posts for select to anon, authenticated
  using (published or public.is_blog_admin());

drop policy if exists "admin writes" on public.posts;
create policy "admin writes" on public.posts for all to authenticated
  using (public.is_blog_admin()) with check (public.is_blog_admin());

-- Keep updated_at and published_at correct no matter what the browser sends.
create or replace function public.posts_stamp()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  if new.published and (tg_op = 'INSERT' or not old.published) then
    new.published_at := coalesce(new.published_at, now());
  end if;
  if not new.published then
    new.published_at := null;
  end if;
  return new;
end $$;

drop trigger if exists posts_stamp on public.posts;
create trigger posts_stamp before insert or update on public.posts
  for each row execute function public.posts_stamp();
