# Estrategia de testing

## Herramientas

- **Vitest** + Testing Library para pruebas unitarias y de integración de UI.
- **Playwright** para E2E (pendiente de flujos completos en hitos posteriores).

## Suites actuales

- `tests/unit/parse-recipe.spec.ts`: valida heurísticas de `parseRecipeFromText` (cabeceras, porciones, duración, tags).

## Cómo ejecutar

```bash
pnpm test          # Vitest en modo run
pnpm test:watch    # Vitest con watcher
pnpm test:e2e      # Playwright (requiere instalar browsers)
```

En CI usamos `pnpm ci` que encadena lint + typecheck + test.

## Cobertura

- Configurada con `v8` en Vitest (`coverage.reporter`: text, json-summary, html).
- Reportes disponibles bajo `coverage/` tras ejecutar `pnpm test --coverage`.
