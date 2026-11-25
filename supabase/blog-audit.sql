-- Ankur Worldwide: audit log for the blog. Run once in Supabase > SQL Editor, after blog.sql.
-- Every add, change or delete of a post is written here by the database itself, with who did it and when.
-- Nobody can edit or delete these rows through the API: there are no write grants and no write policies.

create table if not exists public.blog_audit (
  id      bigint generated always as identity primary key,
  at      timestamptz not null default now(),
  actor   uuid,                    -- the signed-in admin (auth.uid()); null if done from the SQL Editor
  action  text not null check (action in ('add', 'change', 'remove')),
  post_id uuid not null,
  slug    text not null,
  title   text not null,
  published boolean not null
);
alter table public.blog_audit enable row level security;
revoke all on public.blog_audit from anon, authenticated;
grant select on public.blog_audit to authenticated;
create index if not exists blog_audit_post on public.blog_audit (post_id, at desc);

drop policy if exists "admins read the log" on public.blog_audit;
create policy "admins read the log" on public.blog_audit for select to authenticated
  using ((select public.is_blog_admin()));

-- SECURITY DEFINER so the log is written even though admins themselves cannot insert into it.
create or replace function public.posts_audit()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare r public.posts;
begin
  r := case when tg_op = 'DELETE' then old else new end;
  insert into public.blog_audit (actor, action, post_id, slug, title, published)
  values (auth.uid(),
          case tg_op when 'INSERT' then 'add' when 'UPDATE' then 'change' else 'remove' end,
          r.id, r.slug, r.title, r.published);
  return null;
end $$;
revoke all on function public.posts_audit() from public, anon, authenticated;

drop trigger if exists posts_audit on public.posts;
create trigger posts_audit after insert or update or delete on public.posts
  for each row execute function public.posts_audit();
