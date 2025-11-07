# Arquitectura

```mermaid
graph TD
  subgraph Cliente
    App[Tastebook PWA]
  end
  subgraph Backend
    Supabase[(Supabase Postgres + Auth)]
  end
  App -->|Supabase JS SDK| Supabase
```

- **Next.js 14 (App Router)** con React 18 y TypeScript estricto.
- **TanStack Query** para caché de datos en cliente.
- **Tailwind + shadcn/ui** para UI consistente accesible.
- **Supabase** aporta autenticación y Postgres con RLS. De momento consumimos la tabla `recipes` vía service role hasta integrar Auth; Drizzle quedará alineado con Supabase en próximos hitos.
- **next-pwa** genera el service worker y manifiesto para instalación en iOS.

## Flujo de «Pegar receta»

1. El usuario abre el diálogo `PasteRecipeDialog`.
2. El texto pegado se procesa localmente con `parseRecipeFromText`.
3. Se muestra vista previa con título, ingredientes, pasos, porciones, duración y tags heurísticos.
4. El usuario pulsa «Guardar en Tastebook» y se invoca `/api/recipes` (POST) que inserta la receta en Supabase.
5. React Query invalida la caché `recipes` para refrescar el listado en `/app`.

## Decisiones clave

- Todo el parsing se ejecuta en el cliente para evitar coste en API externas.
- Servicio worker cachea HTML (network-first) y assets (stale-while-revalidate / cache-first).
- Iconos se generan a partir de script local para evitar dependencias de pago.
