# Cómo aplicar migraciones de base de datos

## Opción 1: Supabase Dashboard (Recomendado)

1. Ve a [Supabase Dashboard](https://app.supabase.com)
2. Selecciona tu proyecto
3. Ve a **SQL Editor** en el menú lateral
4. Crea una nueva query
5. Copia y pega el contenido de `supabase/migrations/0002_add_is_favorite.sql`
6. Ejecuta la query con el botón **Run**

## Opción 2: Supabase CLI

Si tienes Supabase CLI instalado:

```bash
# Conectar a tu proyecto
supabase link --project-ref <your-project-ref>

# Aplicar migraciones pendientes
supabase db push
```

## Verificar que la migración se aplicó

Ejecuta esta query en el SQL Editor:

```sql
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'recipes' AND column_name = 'is_favorite';
```

Deberías ver un resultado que muestra la columna `is_favorite` de tipo `boolean` con default `false`.

## Contenido de la migración 0002_add_is_favorite.sql

```sql
-- Add is_favorite column to recipes table
alter table public.recipes
add column if not exists is_favorite boolean not null default false;

-- Create index for better performance when filtering by favorites
create index if not exists recipes_is_favorite_idx on public.recipes (is_favorite) where is_favorite = true;

-- Add comment for documentation
comment on column public.recipes.is_favorite is 'Indicates if this recipe is marked as favorite by the user';
```

## Troubleshooting

Si obtienes errores 500 al usar el botón de favoritos, probablemente la migración no se ha aplicado aún. Sigue los pasos anteriores para aplicarla.
