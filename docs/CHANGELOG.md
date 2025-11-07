# Changelog

Formato basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/) y adherido a [SemVer](https://semver.org/lang/es/).

## [0.4.0] - 2025-11-08

### Añadido

- API `/api/recipes` (GET/POST) respaldada por Supabase para guardar recetas pegadas.
- Migración inicial `supabase/migrations/0001_create_recipes.sql` con tabla `recipes` y RLS.
- Vista `/app` con listado de recetas, tarjetas y botón de pegado.
- Integración del diálogo **Pegar receta** con guardado remoto y feedback de éxito/error.

### Cambiado

- README y documentación de despliegue actualizados con pasos de Supabase.
- Parser ajustado para no consumir cantidades, con pruebas reforzadas.

## [0.3.5] - 2025-11-07

### Añadido

- Diálogo «Pegar receta» con vista previa y heurísticas locales.
- Motor `parseRecipeFromText` con detección de porciones, duración y tags (`horno`, `postre`, `rápida`).
- Pruebas unitarias para el parser (Vitest).
- Configuración PWA (`manifest.json`, `next-pwa`, iconos iOS/Android, guía /docs/pwa-ios).
- Documentación actualizada (README, arquitectura, pruebas, despliegue, seguridad, extracción).

### Cambiado

- Layout global con metadatos iOS y enlaces a documentación.

[0.4.0]: https://github.com/angel/tastebook/releases/tag/v0.4.0
[0.3.5]: https://github.com/angel/tastebook/releases/tag/v0.3.5
