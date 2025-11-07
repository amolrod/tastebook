# API Tastebook

## Endpoints activos (M4)

| Endpoint | Método | Descripción |
| --- | --- | --- |
| `/api/recipes` | `GET` | Devuelve las últimas 50 recetas guardadas en Supabase. |
| `/api/recipes` | `POST` | Inserta una receta generada por el parser. |
| `/api/recipes` | `PUT` | Devuelve el JSON del parser dado un texto (uso interno/debug). |

## Convenciones

- Base URL producción: `https://tastebook.vercel.app`.
- Autenticación: Supabase Auth con sesión JWT (pendiente de habilitar). Mientras tanto, el API usa `SUPABASE_SERVICE_ROLE_KEY` y fija `owner_id` a un usuario demo.
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

Error `503`: Supabase no configurado.

Error `422`: validación de datos fallida.

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
