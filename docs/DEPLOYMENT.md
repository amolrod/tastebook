# Despliegue

## Vercel

1. Crear proyecto en Vercel (plan Hobby gratuito).
2. Configurar variables de entorno:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `FEATURE_AI_EXTRACT` (opcional, `false` por defecto)
   - `NEXT_PUBLIC_SENTRY_DSN` (opcional)
3. Añadir script `pnpm generate:icons` como paso previo (local) antes del primer despliegue para asegurar iconos presentes.
4. Vercel ejecutará `pnpm install` + `pnpm build` automáticamente.

## Supabase

- Plan gratuito (Free Tier).
- Provisionar proyecto y copiar URL + anon key.
- Ejecutar la migración `supabase/migrations/0001_create_recipes.sql` (CLI `supabase db push` o consola SQL).
- RLS activo: los endpoints usan sesiones Supabase (`createRouteHandlerClient`); asegúrate de activar el correo mágico y/o GitHub en la consola de Supabase.

## GitHub Actions (CI/CD)

- Workflow pendiente en próximo hito (lint + test + build + e2e).

## PWA

- `next-pwa` genera `public/sw.js` durante `pnpm build` (excluido del repo `.gitignore`).
- Verificar en Vercel: Lighthouse "PWA Installable" debe ser verde.
