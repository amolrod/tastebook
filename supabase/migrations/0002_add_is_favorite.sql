-- Add is_favorite column to recipes table
alter table public.recipes
add column if not exists is_favorite boolean not null default false;

-- Create index for better performance when filtering by favorites
create index if not exists recipes_is_favorite_idx on public.recipes (is_favorite) where is_favorite = true;

-- Add comment for documentation
comment on column public.recipes.is_favorite is 'Indicates if this recipe is marked as favorite by the user';
