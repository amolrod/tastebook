# API Tastebook

## Endpoints activos (M4)

| Endpoint | Método | Descripción |
| --- | --- | --- |
| `/api/recipes` | `GET` | Devuelve las últimas 50 recetas guardadas en Supabase. |
| `/api/recipes` | `POST` | Inserta una receta generada por el parser. |
| `/api/recipes` | `PUT` | Devuelve el JSON del parser dado un texto (uso interno/debug). |

## Convenciones

- Base URL producción: `https://tastebook.vercel.app`.
- Autenticación: Supabase Auth (enlace mágico u OAuth) con sesiones gestionadas via cookies HttpOnly.
- Respuestas JSON con `camelCase`.

## Esquemas

### POST `/api/recipes`

- Request body (Zod `requestSchema`):

```ts
{
  title: string;
  ingredients: string[]; // min 1
  steps: string[];       // min 1
  servings?: number | null; // 1-20
  durationMinutes: number;  // 1-600
  tags: string[];           // max 10
  sourceText?: string;
}
```

- Response `201`:

```json
{
  "recipe": {
    "id": "uuid",
    "title": "Bizcocho",
    "ingredients": ["200 g harina"],
    "steps": ["Mezclar"],
    "duration_minutes": 35,
    "tags": ["postre"],
    "created_at": "2025-11-08T10:00:00Z",
    "updated_at": "2025-11-08T10:00:00Z"
  }
}
```

Errores posibles:

- `401`: sesión inexistente o expirada.
- `422`: validación de datos fallida.
- `503`: Supabase no configurado (faltan variables de entorno).

### GET `/api/recipes`

- Response `200`:

```json
{
  "recipes": [
    {
      "id": "uuid",
      "title": "Bizcocho",
      "tags": ["postre"],
      "duration_minutes": 35
    }
  ]
}
```

- Error `401`: requiere sesión válida.
- Error `503`: Supabase no configurado.

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
