# Plan de Mejora Integral - Tastebook
## Fecha: 8 de noviembre de 2025

---

## 🎯 VISIÓN DEL PLAN

Convertir Tastebook en una aplicación **production-ready** con:
- ✅ Experiencia de usuario excepcional
- ✅ Funcionalidades completas de recetario moderno
- ✅ Arquitectura escalable y mantenible
- ✅ Seguridad y rendimiento optimizados
- ✅ Preparada para despliegue público

---

## 📊 ANÁLISIS ACTUAL

### ✅ Fortalezas
1. **Parser heurístico funcional** con tests completos
2. **Autenticación Supabase** implementada (magic link + GitHub OAuth)
3. **PWA configurada** con manifest e iconos
4. **RLS activo** en Supabase con políticas por usuario
5. **TypeScript estricto** + ESLint + Prettier
6. **Arquitectura limpia** App Router de Next.js 14
7. **Documentación técnica** completa (ADRs, API, seguridad)

### ⚠️ Áreas de mejora críticas
1. **UX limitada**: No hay edición, búsqueda, filtros ni favoritos
2. **Parser básico**: No reconoce temperaturas, tiempos complejos, fracciones
3. **Sin imágenes**: Recetas solo texto
4. **Sin compartir**: No hay URLs públicas ni exportación
5. **Sin plan semanal**: Falta funcionalidad clave de organización
6. **Sin lista de compras**: No genera lista desde recetas seleccionadas
7. **Testing incompleto**: Faltan tests E2E y de integración
8. **Sin observabilidad**: No hay logging ni analytics
9. **Performance sin optimizar**: No hay caché agresivo ni lazy loading
10. **Sin onboarding**: Usuario nuevo no sabe qué hacer

---

## 🚀 PLAN DE IMPLEMENTACIÓN (4 FASES)

---

## **FASE 1: CORE UX & FUNCIONALIDADES ESENCIALES** (Prioridad ALTA)
**Objetivo**: Hacer la app realmente usable y atractiva para usuarios diarios

### 1.1 Edición de recetas guardadas
- [ ] Endpoint `PATCH /api/recipes/:id` con validación Zod
- [ ] Formulario de edición inline en `/app/[id]`
- [ ] Botón "Editar receta" con estado de guardado
- [ ] Validación cliente con React Hook Form
- [ ] Invalidación de caché React Query tras editar

### 1.2 Eliminación de recetas
- [ ] Endpoint `DELETE /api/recipes/:id`
- [ ] Diálogo de confirmación con advertencia
- [ ] Soft delete opcional (campo `deleted_at`)
- [ ] Redirección a `/app` tras eliminar
- [ ] Toast de confirmación

### 1.3 Búsqueda y filtros
- [ ] Barra de búsqueda en `/app` (título, ingredientes, tags)
- [ ] Filtros por: tags, duración (<30, 30-60, >60), porciones
- [ ] Debounce en búsqueda (300ms)
- [ ] Estado de URL sincronizado (`useSearchParams`)
- [ ] Indicadores visuales de filtros activos

### 1.4 Sistema de favoritos
- [ ] Nueva tabla `favorites` con RLS
- [ ] Endpoint `POST /api/recipes/:id/favorite`
- [ ] Botón corazón en tarjeta y página detalle
- [ ] Vista `/app/favorites` con listado filtrado
- [ ] Optimistic update en UI

### 1.5 Imágenes de recetas
- [ ] Campo `image_url` en tabla `recipes`
- [ ] Upload a Supabase Storage con URLs firmadas
- [ ] Redimensionado automático (thumbnail 400x300, full 1200x900)
- [ ] Componente `Image` de Next.js con lazy loading
- [ ] Placeholder mientras carga (skeleton)
- [ ] Fallback si no hay imagen (gradiente + emoji)

### 1.6 Mejoras del parser
- [ ] Reconocer temperaturas (°F, °C, gas mark)
- [ ] Parsear fracciones (1/2, ¼, ⅓)
- [ ] Detectar subtítulos múltiples ("Para la masa", "Para el glaseado")
- [ ] Extraer notas finales ("Trucos", "Consejos")
- [ ] Tests adicionales para casos edge

### 1.7 Toast notifications
- [ ] Instalar `sonner` o `react-hot-toast`
- [ ] Mensajes de éxito/error en operaciones
- [ ] Posición configurable (top-right)
- [ ] Auto-dismiss en 3s

---

## **FASE 2: ORGANIZACIÓN & PLANIFICACIÓN** (Prioridad ALTA)
**Objetivo**: Convertir Tastebook en asistente de cocina semanal

### 2.1 Plan semanal
- [ ] Tabla `weekly_plan` (user, date, recipe_id, meal_type)
- [ ] Vista calendario semanal (`/app/plan`)
- [ ] Drag & drop de recetas a días
- [ ] Tipos de comida: desayuno, comida, cena, merienda
- [ ] Duplicar semana anterior
- [ ] Exportar PDF del plan

### 2.2 Lista de compras
- [ ] Tabla `shopping_list` (user, item, quantity, checked, category)
- [ ] Botón "Añadir al carrito" desde receta
- [ ] Consolidación automática de ingredientes duplicados
- [ ] Categorización por tipo (verduras, carnes, lácteos, etc.)
- [ ] Check/uncheck items
- [ ] Borrar completados
- [ ] Compartir lista por WhatsApp

### 2.3 Etiquetas personalizadas
- [ ] Tabla `user_tags` para tags custom
- [ ] CRUD de tags en `/app/settings/tags`
- [ ] Autocompletado al editar receta
- [ ] Filtro por tags personalizados
- [ ] Colores/iconos configurables

### 2.4 Colecciones/carpetas
- [ ] Tabla `collections` (user, name, description)
- [ ] Tabla puente `recipe_collections`
- [ ] Vista `/app/collections` con grid
- [ ] Mover recetas entre colecciones (drag & drop)
- [ ] Compartir colección pública

---

## **FASE 3: SOCIAL & COMPARTIR** (Prioridad MEDIA)
**Objetivo**: Permitir viralidad y uso colaborativo

### 3.1 Compartir recetas públicas
- [ ] Campo `is_public` en tabla `recipes`
- [ ] Generación de `share_slug` único
- [ ] Ruta pública `/r/:slug` sin auth
- [ ] Botón "Hacer pública/privada"
- [ ] Vista previa Open Graph (og:image con screenshot)
- [ ] Botón "Copiar enlace"

### 3.2 Importar desde link público
- [ ] Botón "Guardar en mi recetario" en `/r/:slug`
- [ ] Duplicación de receta al usuario actual
- [ ] Atribución al creador original (campo `forked_from`)

### 3.3 Comentarios y valoraciones
- [ ] Tabla `recipe_reviews` (user, recipe, rating, comment)
- [ ] Estrellas 1-5 en página detalle
- [ ] Lista de comentarios con paginación
- [ ] Ordenar por: recientes, mejor valoradas
- [ ] Moderación básica (reportar)

### 3.4 Perfil público de usuario
- [ ] Ruta `/u/:username`
- [ ] Bio, avatar, redes sociales
- [ ] Grid de recetas públicas del usuario
- [ ] Contador de seguidores (opcional)

### 3.5 Exportación/importación
- [ ] Exportar receta a JSON, Markdown, PDF
- [ ] Importar desde JSON de otros usuarios
- [ ] Batch export de todas las recetas

---

## **FASE 4: OPTIMIZACIÓN & PRODUCCIÓN** (Prioridad MEDIA-ALTA)
**Objetivo**: App robusta, rápida y monitoreada

### 4.1 Performance
- [ ] Lazy loading de imágenes con `next/image`
- [ ] Virtual scrolling en listas largas (react-window)
- [ ] Caché React Query más agresivo (staleTime: 5min)
- [ ] Prefetch de recetas al hover en cards
- [ ] Code splitting por ruta
- [ ] Bundle analysis (webpack-bundle-analyzer)
- [ ] Lighthouse score >90 en todas las métricas

### 4.2 Observabilidad
- [ ] Integrar Sentry para errores (plan gratuito)
- [ ] Logging estructurado con pino
- [ ] Analytics con Vercel Analytics o Plausible
- [ ] Dashboard de métricas clave (recetas creadas/día, usuarios activos)
- [ ] Alertas de errores críticos

### 4.3 Testing completo
- [ ] Tests E2E con Playwright:
  - [ ] Flujo completo: pegar → guardar → editar → eliminar
  - [ ] Autenticación magic link (mock email)
  - [ ] Búsqueda y filtros
  - [ ] Plan semanal
- [ ] Tests de integración API (Vitest + MSW)
- [ ] Tests de componentes (Testing Library)
- [ ] Cobertura mínima: 70%

### 4.4 Seguridad endurecida
- [ ] CSP headers en `next.config.mjs`
- [ ] Rate limiting en API (upstash/rate-limit)
- [ ] Validación de tipos de archivo en uploads
- [ ] Sanitización de HTML en campos de texto
- [ ] HTTPS forzado en producción
- [ ] Auditoría de dependencias (npm audit)

### 4.5 Mejoras PWA
- [ ] Notificaciones push (recordatorios de recetas)
- [ ] Offline mode robusto (fallback UI)
- [ ] Background sync para guardados fallidos
- [ ] App shortcuts en menú PWA
- [ ] Badging API para contador de plan semanal

### 4.6 Onboarding y UX
- [ ] Tour guiado al primer login (react-joyride)
- [ ] Página de bienvenida con video demo
- [ ] Empty states ilustrados en todas las listas
- [ ] Skeleton loaders en carga inicial
- [ ] Animaciones suaves (framer-motion)
- [ ] Modo oscuro (dark mode)

### 4.7 Internacionalización (i18n)
- [ ] Instalar `next-intl`
- [ ] Soporte inglés y español
- [ ] Detección automática de idioma
- [ ] Traducción de UI y documentación

### 4.8 CI/CD
- [ ] GitHub Actions workflow:
  - [ ] Lint + typecheck + test en PRs
  - [ ] Deploy preview en Vercel por PR
  - [ ] Deploy automático a producción en merge a main
  - [ ] Notificación de deploy exitoso
- [ ] Versioning automático (semantic-release)

### 4.9 Documentación usuario final
- [ ] Landing page atractiva (`/`)
- [ ] FAQ (`/help`)
- [ ] Video tutoriales en YouTube
- [ ] Blog con recetas ejemplo
- [ ] Changelog público (`/changelog`)

---

## 📅 CRONOGRAMA ESTIMADO

| Fase | Duración | Funcionalidades clave |
|------|----------|----------------------|
| **Fase 1** | 2-3 semanas | Edición, búsqueda, favoritos, imágenes, parser mejorado |
| **Fase 2** | 2-3 semanas | Plan semanal, lista de compras, colecciones |
| **Fase 3** | 2 semanas | Compartir público, comentarios, exportación |
| **Fase 4** | 3-4 semanas | Performance, testing E2E, observabilidad, onboarding |
| **TOTAL** | **9-12 semanas** | App production-ready |

---

## 🎯 KPIs DE ÉXITO

### Al finalizar Fase 1
- [ ] Usuario puede editar/eliminar recetas en <5 clicks
- [ ] Búsqueda retorna resultados en <200ms
- [ ] Parser reconoce correctamente 95% de recetas con temperaturas

### Al finalizar Fase 2
- [ ] Usuario puede planificar semana completa en <10 min
- [ ] Lista de compras genera items consolidados automáticamente
- [ ] 80% de usuarios crean al menos 1 colección

### Al finalizar Fase 3
- [ ] 30% de recetas se hacen públicas
- [ ] 20% de usuarios importan al menos 1 receta ajena
- [ ] Tasa de compartir en redes >10%

### Al finalizar Fase 4
- [ ] Lighthouse score >90 en todas las métricas
- [ ] 0 errores críticos en Sentry durante 7 días
- [ ] Cobertura de tests >70%
- [ ] Tiempo de carga inicial <1.5s
- [ ] Onboarding completado por >60% de nuevos usuarios

---

## 🛠️ STACK TECNOLÓGICO ADICIONAL

### Nuevas dependencias sugeridas
```json
{
  "dependencies": {
    "sonner": "^1.4.0",              // Toast notifications
    "react-window": "^1.8.10",       // Virtual scrolling
    "date-fns": "^3.3.1",            // Manejo de fechas
    "react-hook-form": "^7.51.3",    // Ya instalado
    "next-intl": "^3.11.0",          // i18n
    "@dnd-kit/core": "^6.1.0",       // Drag & drop
    "@dnd-kit/sortable": "^8.0.0",   // Drag & drop ordenable
    "react-joyride": "^2.8.0",       // Tour guiado
    "framer-motion": "^11.0.0",      // Animaciones
    "@upstash/ratelimit": "^1.0.0",  // Rate limiting
    "pino": "^8.19.0"                // Logging
  },
  "devDependencies": {
    "msw": "^2.1.5",                 // Mock Service Worker
    "@sentry/nextjs": "^7.100.0",    // Error tracking
    "webpack-bundle-analyzer": "^4.10.0"
  }
}
```

---

## 🚀 PRÓXIMOS PASOS INMEDIATOS

### Esta semana (semana 1 de Fase 1)
1. **Día 1-2**: Implementar edición de recetas (PATCH endpoint + formulario)
2. **Día 3**: Añadir eliminación con confirmación
3. **Día 4-5**: Búsqueda básica por título e ingredientes
4. **Día 6-7**: Sistema de favoritos (tabla + endpoint + UI)

### Siguiente semana (semana 2 de Fase 1)
1. **Día 1-3**: Integrar Supabase Storage para imágenes
2. **Día 4-5**: Mejorar parser (temperaturas + fracciones)
3. **Día 6-7**: Toast notifications + refinamientos UX

---

## 📝 NOTAS FINALES

### Decisiones arquitectónicas pendientes
- **Base de datos**: Mantener Supabase Postgres (suficiente para MVP y escala media)
- **Caché**: Considerar Redis para hot data si >10k usuarios activos
- **Storage**: Supabase Storage suficiente; migrar a Cloudflare R2 si >100GB
- **Analytics**: Empezar con Vercel Analytics; mover a Plausible si privacidad crítica

### Riesgos y mitigaciones
- **Riesgo**: Parser no cubre todos los formatos → **Mitigación**: Permitir edición manual post-parse
- **Riesgo**: Costes Supabase escalan → **Mitigación**: Límites por usuario (50 recetas free, 500 pro)
- **Riesgo**: Abuse de compartir público → **Mitigación**: Rate limiting + moderación reportes

### Modelo de monetización (futuro)
- **Freemium**: 50 recetas gratis, ilimitadas en plan Pro ($5/mes)
- **Pro features**: Plan semanal ilimitado, colecciones sin límite, exportación PDF premium
- **B2B**: API para blogs de cocina ($50/mes por 10k requests)

---

## ✅ CHECKLIST DE DEPLOY A PRODUCCIÓN

Antes de lanzar públicamente:
- [ ] Tests E2E pasando al 100%
- [ ] Lighthouse score >90 en mobile y desktop
- [ ] CSP headers configurados
- [ ] Rate limiting activo en todos los endpoints
- [ ] Sentry capturando errores en producción
- [ ] Analytics funcionando
- [ ] Dominio custom configurado (tastebook.app)
- [ ] SSL certificado activo
- [ ] Backups automáticos de DB (Supabase)
- [ ] Documentación de ayuda publicada
- [ ] Landing page con CTA claro
- [ ] Legal: Términos de servicio + Política de privacidad
- [ ] GDPR compliance (banner cookies)

---

**Creado por**: GitHub Copilot  
**Última actualización**: 8 de noviembre de 2025  
**Versión**: 1.0
