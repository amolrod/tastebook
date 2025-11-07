# ADR-001: Parser heurístico local para «Pegar receta»

- **Fecha:** 2025-11-07
- **Estado:** Aprobado

## Contexto

Necesitamos transformar texto pegado por el usuario en recetas estructuradas sin depender de servicios de pago ni IA propietaria. La función debe funcionar offline y respetar privacidad.

## Decisión

Implementamos `parseRecipeFromText` en TypeScript con expresiones regulares y reglas heurísticas:

- Detectamos encabezados comunes (Ingredientes, Elaboración, etc.).
- Identificamos ingredientes mediante viñetas, números y unidades en español.
- Estimamos duración cuando no existe en el texto (5 min/paso, 10-90 min).
- Etiquetamos automáticamente (`horno`, `postre`, `rápida`).
- Todo se ejecuta en cliente, sin llamadas externas.

## Consecuencias

- ✅ Coste 0€, mantenemos datos en el dispositivo.
- ✅ Fácil de testear con Vitest.
- ⚠️ Resultados dependen de la calidad del texto; casos ambiguos requieren mejoras iterativas.
- 🔜 Documentamos límites en `docs/EXTRACCION.md` y dejamos bandera `FEATURE_AI_EXTRACT` para experimentos futuros con modelos gratuitos (ej. Open Source en edge).
