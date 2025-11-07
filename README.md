# Tastebook

Recetario colaborativo con instalación como PWA, sincronizado con Supabase y extracción inteligente de recetas pegadas desde texto plano.

## Requisitos

- Node.js 18.17+ y pnpm 8+
- Cuenta gratuita en Supabase y Vercel

## Puesta en marcha

```bash
pnpm install
pnpm run dev
```

Crea un archivo `.env.local` a partir de `.env.example` con las claves de Supabase y banderas de características.

## Scripts clave

- `pnpm dev`: arranca la aplicación en modo desarrollo.
- `pnpm build`: genera la build optimizada para Vercel.
- `pnpm test`: ejecuta la suite de Vitest.
- `pnpm test:e2e`: ejecuta Playwright (requiere `pnpm exec playwright install`).
- `pnpm lint`: ejecuta ESLint y reglas de estilo.
- `pnpm typecheck`: verifica los tipos con TypeScript estricto.

## Pegar recetas desde texto

El botón **Pegar receta** abre un diálogo que usa `parseRecipeFromText` para detectar título, ingredientes, pasos, porciones, duración y tags heurísticos (`horno`, `postre`, `rápida`).

Consulta `docs/EXTRACCION.md` para conocer el algoritmo y sus limitaciones.

## PWA en iPhone

- Manifesto en `public/manifest.json`.
- Iconos generados por `scripts/generate-icons.mjs` (`pnpm generate:icons`).
- Metadatos iOS en `src/app/layout.tsx` y guía en `/docs/pwa-ios`.
- `next-pwa` configura el service worker para cachear recursos estáticos y documentos.

## Documentación adicional

Toda la documentación de arquitectura, API, seguridad, despliegue y pruebas está en `docs/`.
