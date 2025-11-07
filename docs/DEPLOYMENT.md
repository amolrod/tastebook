# Despliegue

## Vercel

1. Crear proyecto en Vercel (plan Hobby gratuito).
2. Configurar variables de entorno:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `SUPABASE_DB_PASSWORD`
   - `FEATURE_AI_EXTRACT` (opcional, `false` por defecto)
   - `NEXT_PUBLIC_SENTRY_DSN` (opcional)
3. Añadir script `pnpm generate:icons` como paso previo (local) antes del primer despliegue para asegurar iconos presentes.
4. Vercel ejecutará `pnpm install` + `pnpm build` automáticamente.

## Supabase

- Plan gratuito (Free Tier).
- Provisionar proyecto y copiar URL + anon key.
- Configurar base de datos Postgres y RLS en M2.

## GitHub Actions (CI/CD)

- Workflow pendiente en próximo hito (lint + test + build + e2e).

## PWA

- `next-pwa` genera `public/sw.js` durante `pnpm build` (excluido del repo `.gitignore`).
- Verificar en Vercel: Lighthouse "PWA Installable" debe ser verde.
