# Esquema de base de datos

## Estado actual (M4)

Tabla `recipes` en Postgres (Supabase) para almacenar los resultados del parser.

| Columna            | Tipo        | Descripción                                               |
| ------------------ | ----------- | --------------------------------------------------------- |
| `id`               | `uuid`      | Identificador primario (`gen_random_uuid()`).             |
| `owner_id`         | `uuid`      | Usuario propietario (obligatorio, lo aplica `auth.uid()`). |
| `title`            | `text`      | Título de la receta.                                      |
| `ingredients`      | `jsonb`     | Lista de ingredientes en texto plano.                     |
| `steps`            | `jsonb`     | Lista de pasos (ordenados).                               |
| `servings`         | `smallint`  | Número de porciones (opcional).                           |
| `duration_minutes` | `smallint`  | Duración total estimada/minutos.                          |
| `tags`             | `text[]`    | Tags heurísticos (`horno`, `postre`, `rápida`).           |
| `source_text`      | `text`      | Texto original pegado (opcional).                         |
| `created_at`       | `timestamptz` | Fecha de creación.                                      |
| `updated_at`       | `timestamptz` | Fecha de actualización.                                 |

- Migración: `supabase/migrations/0001_create_recipes.sql` (incluye índices y trigger `updated_at`).
- RLS habilitado (`recipes_owner_select`, `recipes_owner_modify`). Todas las operaciones pasan por `createRouteHandlerClient` con la sesión del usuario.

## Modelo previsto (hoja de ruta)

```mermaid
ergdiagram
  profiles ||--o{ recipes : "autor"
  recipes ||--o{ ingredients : "compone"
  recipes ||--o{ steps : "define"
  recipes ||--o{ recipe_tags : "clasifica"
  recipes }o--o{ favorites : "favoritos"
  recipes ||--o{ share_links : "comparar"
  profiles ||--o{ favorites : "guarda"
  profiles ||--o{ shopping_list : "compras"
  profiles ||--o{ weekly_plan : "plan"
  tags ||--o{ recipe_tags : "catalogo"
```

## RLS

- Todas las tablas aplican RLS por `auth.uid()`.
- Tablas relacionales usan políticas `USING` y `WITH CHECK` para garantizar pertenencia al usuario.
- Storage con URLs firmadas para imágenes (pendiente de implementación).

## Migraciones

- Se gestionarán con `drizzle-kit` (`pnpm drizzle-kit generate` + `pnpm drizzle-kit migrate`).
