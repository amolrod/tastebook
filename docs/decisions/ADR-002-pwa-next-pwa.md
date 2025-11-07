# ADR-002: Configurar PWA con next-pwa en plan gratuito

- **Fecha:** 2025-11-07
- **Estado:** Aprobado

## Contexto

Debemos ofrecer instalación en iPhone (sin App Store) con presupuesto 0€. Next.js no genera service workers de serie.

## Decisión

- Usamos [`next-pwa`](https://github.com/shadowwalker/next-pwa) (open source) para generar el service worker.
- Configuramos caches diferenciadas: documentos (`NetworkFirst`), assets (`StaleWhileRevalidate`), imágenes (`CacheFirst`) y Supabase (`NetworkFirst`).
- Desactivamos el SW en desarrollo.
- Generamos manifest + iconos con script propio (`pnpm generate:icons`).

## Consecuencias

- ✅ Compatible con Vercel Hobby y Safari iOS (apple-touch-icon + meta tags).
- ✅ Controlamos qué rutas se cachean para no interferir con auth.
- ⚠️ Debemos regenerar iconos si cambiamos branding.
- ⚠️ Limitaciones de `next-pwa` con App Router requieren revisar futuras actualizaciones.
