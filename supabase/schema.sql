-- Ankur Worldwide: inquiry storage.
-- Run once in Supabase → SQL Editor. Safe to run again.
--
-- Result: the browser (anon key) can do nothing at all. Only the website's server,
-- holding the service-role key, can add an inquiry, and only through submit_inquiry().

-- 1. Keep any earlier "inquiries" table (and its data) under a new name, locked down.
do $$
begin
  if exists (select 1 from information_schema.tables where table_schema = 'public' and table_name = 'inquiries')
     and not exists (select 1 from information_schema.columns
                     where table_schema = 'public' and table_name = 'inquiries' and column_name = 'ip_hash')
     and not exists (select 1 from information_schema.tables where table_schema = 'public' and table_name = 'inquiries_legacy')
  then
    alter table public.inquiries rename to inquiries_legacy;
    alter table public.inquiries_legacy enable row level security;
    revoke all on public.inquiries_legacy from anon, authenticated;
  end if;
end $$;

-- 2. The table. Length checks repeat the server's validation as a second line of defence.
create table if not exists public.inquiries (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz not null default now(),
  name            text not null check (char_length(name) <= 100),
  company         text not null check (char_length(company) <= 150),
  email           text not null check (char_length(email) <= 254),
  phone           text check (char_length(phone) <= 30),
  country         text not null check (char_length(country) <= 80),
  product         text not null check (char_length(product) <= 80),
  quantity        text not null check (char_length(quantity) <= 100),
  message         text check (char_length(message) <= 2000),
  wants_documents boolean not null default false,
  ip_hash         text not null check (char_length(ip_hash) = 64)
);

create index if not exists inquiries_ip_recent on public.inquiries (ip_hash, created_at desc);

-- 3. Row Level Security on, with no policies: every request from anon/authenticated is denied.
alter table public.inquiries enable row level security;
revoke all on public.inquiries from anon, authenticated;

-- 4. Rate limit and insert in one call. Returns false (and stores nothing) after 5 inquiries
--    from the same hashed IP within one hour.
create or replace function public.submit_inquiry(p jsonb, p_ip_hash text)
returns boolean
language plpgsql
security invoker
set search_path = ''
as $$
begin
  if (select count(*) from public.inquiries
      where ip_hash = p_ip_hash and created_at > now() - interval '1 hour') >= 5 then
    return false;
  end if;

  insert into public.inquiries
    (name, company, email, phone, country, product, quantity, message, wants_documents, ip_hash)
  values
    (p->>'name', p->>'company', p->>'email', p->>'phone', p->>'country', p->>'product',
     p->>'quantity', p->>'message', coalesce((p->>'documents')::boolean, false), p_ip_hash);
  return true;
end $$;

revoke all on function public.submit_inquiry(jsonb, text) from public, anon, authenticated;
grant execute on function public.submit_inquiry(jsonb, text) to service_role;

-- 5. Retention (privacy policy: 24 months). Run this from time to time, or schedule it with pg_cron:
--    delete from public.inquiries where created_at < now() - interval '24 months';
