# Bitácora de Cambios — TR4INER Funnels

Registro de decisiones, cambios y resultados del proyecto de funnels de adquisición.  
Cada entrada incluye: qué cambió, por qué, y resultado esperado o medido.

---

## 2026-05-18 — Setup inicial del proyecto

### Decisión estratégica
Inicio de la migración de ClickFunnels a páginas web custom alojadas en Vercel.  
Objetivo: control total sobre diseño, analítica, tecnología y escalabilidad de adquisición.

**Rol:** CMO + Analista General del Negocio (auditor y constructor del éxito de adquisición).

### Infraestructura creada
- **Repo GitHub:** https://github.com/gcessar/tr4iner-funnels
- **Proyecto Vercel:** `tr4iner-funnels` (metodotr4iners-projects)
- **Directorio local:** `/Users/gulhioolortetegui/FUNNEL CASO DE ESTUDIO/`

---

## 2026-05-18 — Funnel #1: Casos de Estudio (BRIDGE V3)

### Qué es
Lead magnet de captura. El usuario llega, lee casos de éxito de clientes TR4INER,
completa un formulario (nombre + email + sexo) y es redirigido a un testimonio personalizado.

### URL en producción
https://tr4iner-funnels.vercel.app

### Lógica de conversión
1. Usuario llega a la página (con o sin UTMs)
2. Lee el contenido (headline animada, bullet points, video thumbnail)
3. Abre el modal → completa formulario
4. Datos enviados via webhook a Railway → n8n
5. Redirección personalizada:
   - **Mujer** → `https://metodo.tr4iner.com/testimonio-flor`
   - **Hombre** → `https://metodo.tr4iner.com/testimonio-dashiel`
6. Countdown de 3 segundos antes del redirect automático

### Detalles técnicos
- **Webhook:** `https://primary-production-0efa.up.railway.app/webhook/casos-estudio`
- **UTMs capturados:** `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`
- **Anti-spam:** honeypot field + bloqueo de dominios falsos (mailinator, guerrillamail, yopmail, etc.)
- **Diseño:** Warm paper — `#F2EEE2` bg, `#F5C518` acento amarillo
- **Tipografías:** Fraunces (titulares serif), Instrument Sans (cuerpo), JetBrains Mono (labels)
- **SEO:** `noindex, nofollow` — no indexado en buscadores

### Por qué estas decisiones
- Testimonio por sexo: personalización aumenta conversión
- Sin framework ni build step: deploy instantáneo, sin dependencias que romper
- Countdown 3s: reduce fricción del redirect, sensación de "acción tomando lugar"

### Resultado esperado
Reemplazar el funnel equivalente en ClickFunnels con mayor control analítico
y la misma o mejor tasa de conversión.

### KPIs a medir
- [ ] Tasa de apertura del modal (scroll depth)
- [ ] Tasa de envío del formulario
- [ ] Tasa de completion por sexo
- [ ] Drop-off en cada paso del formulario

---

## 2026-05-22 — Incidente: webhook Typeform → CRM desactivado durante ~67h

### Qué cambió
Vendedores reportaron columna LEADS vacía en el CRM por 2-3 días. Investigación encontró que el webhook saliente de Typeform al n8n (`https://primary-production-0efa.up.railway.app/webhook/typetobrevo`) estaba **desactivado en la UI de Typeform** desde el 2026-05-19 ~22:17 UTC hasta el 2026-05-22 17:22 UTC (~67 horas / 2.8 días).

El workflow n8n `Typeform → Brevo → CRM` (`7beLlD29cUp8DiDN`) figuraba como `active: true` durante todo el incidente — el problema era 100% upstream en Typeform. Sin requests entrantes, n8n no tiene cómo darse cuenta.

### Por qué se rompió
Causa raíz desconocida. El webhook estaba configurado y funcionando hasta el 19/05 22:17. Hipótesis (no confirmadas):
- Cambio manual accidental desde Typeform UI
- Cambio en Typeform que desactivó webhooks de cuentas gratis (verificar plan)
- Expiración de token o credencial — improbable porque el webhook es saliente sin auth

### Cómo se detectó
- n8n MCP `search_executions` workflow `7beLlD29cUp8DiDN` startedAfter `2026-05-21` → **0 resultados**
- Última ejecución exitosa: `2026-05-19T22:17:07Z` (execution `429520`)
- Typeform API mostraba 114 respuestas en el período sin generar executions n8n correspondientes

### Cómo se resolvió
1. **Reactivación del webhook** en Typeform UI (manual)
2. **Backfill** usando workflow existente `DwjdZncS1A2eWuCJ` (Backfill Typeform CRM) que:
   - Fetchea Typeform API desde 2026-05-10
   - Filtra contra sheets ManyChat (Tr4iner + Vero)
   - POST directo al CRM saltando `Update Brevo` (que requeriría que el contacto ya exista en Brevo)
3. Recovery final con script Python externo con retry exponential (el workflow falló a la mitad por un 500 transitorio del CRM en item 4)

### Resultado medido
- **+46 leads nuevos** creados en el CRM (stage LEAD) del período del corte
- 165+ leads ya existentes recibieron un TouchPoint "re-entry" + nota de backfill (pollution menor del journey, sin pérdida de datos)
- 2 leads no recuperables: sin email + inversión $300-$600 (la lógica del flow los descarta — no es regresión sino comportamiento esperado del flow original)
- Total Typeform durante el corte: 113 respuestas. Tasa real de "ground truth leads perdidos": ~46/113 = 40% (el resto era tráfico ya en ManyChat)

### Prevención implementada
- **Workflow n8n nuevo:** `TR4INER Pipeline Health Summary` (ID `fZG5M02PLxRYY26n`) — cron 2x/día (8am + 8pm Lima) que envía resumen al correo `analisis@tr4iner.com` con conteo de respuestas Typeform de últimas 12h. Permite detectar el patrón "0 respuestas" en menos de 12h en lugar de los 2-3 días que llevó esta vez. Requiere activación manual: ver instrucciones en [doc del incidente](../crm-ventas/docs/incidents/2026-05-22-typeform-webhook-outage.md#alerta-de-health-check).

### Mejoras pendientes al workflow principal
- Reemplazar `Update Brevo` PUT por POST con `updateEnabled=true` → evita el 404 que rompió un intento de backfill
- Agregar retry con backoff al nodo `Enviar Lead CRM` → evita pérdida por 500 transitorios
- Capturar errores silenciosos del Webhook trigger

### Doc completa del incidente
[`crm-ventas/docs/incidents/2026-05-22-typeform-webhook-outage.md`](../../crm-ventas/docs/incidents/2026-05-22-typeform-webhook-outage.md) — análisis completo, comandos de diagnóstico, lista de leads no recuperados

---

<!-- TEMPLATE para próximas entradas:

## AAAA-MM-DD — [Nombre del cambio]

### Qué cambió
...

### Por qué
...

### Resultado esperado
...

### Resultado medido (completar después)
...

-->
