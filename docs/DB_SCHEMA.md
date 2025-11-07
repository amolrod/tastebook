# Esquema de base de datos

> Este hito no introduce cambios en la base de datos. Se mantiene el modelo planificado para M2.

## Modelo previsto

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
