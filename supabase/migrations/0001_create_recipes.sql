create extension if not exists "pgcrypto";

create table if not exists public.recipes (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid,
  title text not null,
  ingredients jsonb not null,
  steps jsonb not null,
  servings smallint,
  duration_minutes smallint not null,
  tags text[] not null default '{}',
  source_text text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists recipes_owner_idx on public.recipes (owner_id);
create index if not exists recipes_created_at_idx on public.recipes (created_at desc);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trigger_set_updated_at
before update on public.recipes
for each row execute function public.set_updated_at();

alter table public.recipes enable row level security;

drop policy if exists "recipes_owner_select" on public.recipes;
create policy "recipes_owner_select"
  on public.recipes
  for select
  using (auth.uid() = owner_id);

drop policy if exists "recipes_owner_modify" on public.recipes;
create policy "recipes_owner_modify"
  on public.recipes
  for all
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);
