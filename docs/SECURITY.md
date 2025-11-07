# Seguridad

## Objetivos

- Cumplir OWASP ASVS L1 en frontend y backend.
- Minimizar PII almacenada.
- Aplicar RLS en Supabase para aislamiento por usuario.

## Medidas en este hito

- El parser se ejecuta exclusivamente en el cliente; no se envía texto sensible al servidor.
- El service worker excluye endpoints de autenticación (`/auth/*`) al cachear (configurado en `next-pwa`).
- PWA solo cachea respuestas exitosas (HTTP 200/204) y limita número de entradas por caché.

## Próximos pasos

- Integrar Sentry (plan gratuito) para observabilidad sin exponer datos personales.
- Políticas CSP endurecidas mediante encabezados en Next.js.
- Habilitar Supabase Auth y políticas RLS (M1/M2).
- Uso de URLs firmadas para almacenamiento en Supabase Storage.
