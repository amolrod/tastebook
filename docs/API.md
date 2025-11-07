# API Tastebook

> **Estado:** pendiente de hitos M3-M7. No se exponen endpoints HTTP nuevos en M3.5/M4.

## Convenciones

- Base URL producción: `https://tastebook.vercel.app`.
- Autenticación: Supabase Auth con sesión JWT (pendiente de habilitar).
- Respuestas JSON con `camelCase`.

## Próximos endpoints

| Endpoint | Método | Descripción | Estado |
| --- | --- | --- | --- |
| `/api/recipes` | `GET` | Listado paginado con filtros y búsqueda FTS | M3 |
| `/api/recipes` | `POST` | Crear receta validada con Zod | M3 |
| `/api/recipes/[id]` | `PATCH` | Actualizar receta existente | M3 |
| `/api/recipes/[id]` | `DELETE` | Eliminar receta | M3 |
| `/api/extract-recipe` | `POST` | (Opcional) Extracción con IA controlada por `FEATURE_AI_EXTRACT` | ADR pendiente |

## Ejemplos (borrador)

```http
POST /api/recipes
Content-Type: application/json
Authorization: Bearer <token>
```

```json
{
  "title": "Tarta de queso",
  "servings": 8,
  "durationMinutes": 50,
  "ingredients": ["200 g queso crema"],
  "steps": ["Mezclar"],
  "tags": ["postre"]
}
```
