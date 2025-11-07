# Extracción de recetas

## Objetivo

Transformar texto plano pegado por el usuario en una estructura JSON coherente (`ParsedRecipe`) lista para persistir en Supabase.

## Flujo

1. Normalizamos saltos de línea y eliminamos espacios sobrantes.
2. Detectamos título como la primera línea no vacía (`extractTitle`).
3. Buscamos encabezados de ingredientes y pasos mediante regex (`INGREDIENT_HEADINGS`, `STEP_HEADINGS`).
4. Si existen encabezados, usamos `collectList` y `collectSteps` para agrupar las secciones.
5. Si faltan encabezados, aplicamos heurística: primeras líneas con unidades/viñetas se consideran ingredientes y el resto pasos.
6. Extraemos porciones (`extractServings`) buscando frases como “para 4 personas”.
7. Calculamos duración:
   - Sumamos horas (`X h`) y minutos (`Y min`).
   - Si no hay datos, estimamos 5 minutos por paso (mín. 10, máx. 90).
8. Generamos tags:
   - `horno` si detectamos “horno”, “hornear”, “°C” o “grados C”.
   - `postre` ante palabras clave (brownie, bizcocho, tarta, etc.).
   - `rápida` si la duración ≤ 30 min.
9. Devolvemos `ParsedRecipe` con arrays normalizados y duración acotada.

## Regex clave

- Ingredientes: detecta unidades (`kg`, `g`, `ml`, `taza`, `cda`, `pizca`, etc.) y viñetas `-`, `•`, `*`, números.
- Encabezados: variantes con tilde (`Elaboración`, `Preparación`) y plurales.
- Porciones: `\b(?:para|rinde|salen)\s+(\d{1,2})\s+(?:porciones?|personas|raciones?)\b`.
- Duración: horas `(?:h|hora(s)?)` + minutos `(?:min|minutos?)`.

## Limitaciones

- No analiza subconjuntos (ej. “Para el frosting”) más allá de títulos genéricos.
- Recetas sin unidades ni viñetas podrían malinterpretarse como pasos.
- No deduce temperaturas en Fahrenheit.
- No identifica ingredientes compuestos en varias líneas.

## Extensiones futuras

- Activar `/api/extract-recipe` con IA opcional (`FEATURE_AI_EXTRACT=true`).
- Mejorar clasificación de tags con FTS y aprendizaje ligero.
- Soportar subtítulos múltiples (“Para la masa”, “Para el relleno”) preservando agrupaciones.
