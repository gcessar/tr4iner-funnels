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

## 2026-06-08 — Atribución por video de YouTube (estilo getrevtrack)

### Qué cambió
La landing ahora captura el parámetro `?video=VIDEO_ID` de la URL (igual que getrevtrack) y lo lleva hasta el CRM pegado al Lead, para saber qué video genera cada lead y cada venta.

**Mecanismo:** YouTube NO le pasa a la página de qué video viene un clic (el referrer se pierde). Por eso cada video necesita su propio link con su ID en la descripción: `https://tr4iner-funnels.vercel.app/?video=VIDEO_ID`. No hay forma automática.

### Archivos
- **`track.js`** (nuevo): snippet reusable de captura. Expone `window.TR4Track.getAttribution()` → `{ video, utm_* }`. Lee de URL + persiste el video en `localStorage` (`tr4_video`) como first-touch. **Para futuras páginas migradas basta con `<script src="/track.js">` + llamar la función antes de enviar el form.**
- **`index.html`**: carga `track.js`, añade `video` al payload del webhook, copia el video a `utm_content` si está vacío (para GA4/Meta), y propaga `?video=` en el redirect a `metodo.tr4iner.com`.
- **CRM (`crm-ventas`)**: `Lead.videoId` + `VideoMeta` (cache de títulos), webhook acepta `video`, nuevo panel `/admin/videos` (leads/ventas/facturado por video, títulos vía YouTube Data API).

### ⚠️ Paso manual pendiente — n8n
El workflow `7beLlD29cUp8DiDN` (Railway) recibe el payload de la landing y hace POST al CRM `/api/webhook`. **Hay que añadir el campo `video` al mapeo de salida hacia el CRM.** Sin esto, el video llega a n8n pero no al CRM. Se edita en la UI de n8n.

### Cómo crear los links por video
En la descripción de cada video de YouTube, poner: `https://tr4iner-funnels.vercel.app/?video=` + el ID del propio video (el de `youtu.be/<ID>`). Ese ID es el que aparecerá en el panel `/admin/videos` con su título resuelto.

### Resultado esperado
Saber qué videos de YouTube generan leads que terminan comprando, no solo qué campaña.

### Resultado medido (completar después)
- [ ] n8n forwarding del campo `video` activado
- [ ] Primer lead atribuido a un video visible en `/admin/videos`

---

## 2026-07-07 — Páginas de agendamiento y confirmación Calendly

### Qué cambió
Se construyó una nueva capa de páginas custom para el tramo final del funnel: leads que ya calificaron en Typeform y pasan a agendar una sesión.

### Páginas nuevas
- **`/calendly-an-optimizado.html`**
  Página de agendamiento para tráfico/caso Anthoni. Mantiene la línea gráfica del funnel de casos de estudio: fondo crema, tipografías Lexend/Poppins, CTA negro/dorado y layout directo.

- **`/calendly-va`** (`calendly-va/index.html`)
  Variante para Veronika. Misma estructura y comportamiento que la página AN, pero con video Vidalytics específico:
  - `vidalytics_embed_2s1vpHRi_hOARyIm`
  - URL embed: `https://fast.vidalytics.com/embeds/IoH8SL8U/2s1vpHRi_hOARyIm/`

- **`/calendly-confirma`** (`calendly-confirma/index.html`)
  Página de confirmación post-Calendly. Muestra datos de la reserva, video de preparación y botón flotante de WhatsApp para confirmar asistencia.

### Decisiones de CRO
- Se redujo fricción en la página de agenda: título + descripción, video, CTA de agenda, prueba social.
- Calendly ya no se carga al abrir la página. Se abre como popup dentro de la misma web y el iframe se inyecta solo después del clic.
  **Objetivo:** mejorar velocidad inicial y mantener al lead dentro del contexto de la página.
- Se eliminó copy innecesario que explicaba demasiado el proceso. El CTA principal quedó más claro: elegir horario.
- Se mantuvo prueba social debajo del CTA con carrusel horizontal y lightbox de videos.
- El carrusel quedó hecho en JavaScript nativo, sin jQuery/Slick/Fancybox, para reducir peso y dependencias.
- Las cards de testimonios respetan las imágenes originales: no se recortan con `object-fit: cover`; el texto HTML queda encima del área amarilla diseñada para eso.

### Lógica de UTMs
En las páginas de agendamiento:
- Se preservan `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`, `email`, `first_name` y `name`.
- Esos parámetros se pasan al iframe/popup de Calendly para mantener atribución.

En `/calendly-confirma`:
- Si cualquier parámetro `utm_*` contiene `-VA-`, se muestra el video de confirmación VA:
  - `Mb4FA69mwzRO27Er`
  - URL settings: `https://fast.vidalytics.com/embeds/IoH8SL8U/Mb4FA69mwzRO27Er/player.settings.json`
- Si contiene `-AN-`, cualquier otra UTM o no hay UTM, se muestra el video original del código adjunto:
  - `vidalytics_embed_eSFGvAyB_NIHVP9e`
  - URL embed: `https://fast.vidalytics.com/embeds/IoH8SL8U/eSFGvAyB_NIHVP9e/`

### WhatsApp de confirmación
La página `/calendly-confirma` lee parámetros de Calendly:
- `assigned_to`
- `invitee_first_name`
- `invitee_last_name`
- `event_start_time`

Con esos datos:
- Muestra asesor asignado y fecha/hora.
- Genera mensaje automático para WhatsApp.
- Mantiene tracking `ClicConfir-Agenda-WS` para GA4/Clarity si existen en la página.
- Se eliminó **Diego Ramos** del mapa de asesores/números.

### Archivos afectados en esta rama
- `calendly-an-optimizado.html`
- `calendly-va/index.html`
- `calendly-confirma/index.html`

### Validación realizada
- Sintaxis JS inline verificada con `node vm.Script`.
- Conteo de llaves CSS verificado.
- Pruebas en navegador local:
  - `/calendly-va/` carga con el embed VA correcto.
  - `/calendly-confirma/?utm_source=Instagram-VA-perfil` carga video VA.
  - `/calendly-confirma/?utm_source=Instagram-AN-perfil` carga video original.
  - `/calendly-confirma/` sin UTMs carga video original.
  - Popup de Calendly conserva UTMs y datos del lead.
  - Carrusel de testimonios abre/cierra lightbox correctamente.
  - Sin overflow horizontal en desktop ni mobile.

### Fix render en ClickFunnels 2.0 (mismo día)
**Síntoma:** al pegar `calendly-confirma/index.html` en un bloque de código de CF, los estilos se "movían" y el botón flotante de WhatsApp quedaba asimétrico/descentrado.

**Causa raíz:** CF no renderiza el HTML aislado — lo inyecta en su propia página. Los selectores globales del `<style>` (`*`, `body`, `html`, `h1`, `a`) chocaban con el tema de CF (y viceversa), y el `position: fixed` del botón se anclaba al contenedor de CF (posible ancestro con `transform`) en vez del viewport → asimetría.

**Solución:** se aísla todo dentro de un `<iframe srcdoc>`.
- `index.html` sigue siendo la fuente de verdad (funciona standalone en Vercel).
- Nuevo `calendly-confirma/build-clickfunnels.mjs` empaqueta `index.html` en base64 y genera `calendly-confirma/clickfunnels.html` (el archivo a pegar en CF). El base64 evita que el sanitizador de CF toque los `<script>/<style>` internos.
- Las UTMs + parámetros de Calendly del top de CF se pasan al iframe vía `window.__TR4_SEARCH__` (inyectado en runtime tras `<head>`). `index.html` lee esa variable con fallback a `window.location.search`.
- Regenerar tras editar `index.html`: `node calendly-confirma/build-clickfunnels.mjs`.

**Fix adicional:** en `hasVaUtm()` se eliminó un `decodeURIComponent()` redundante (doble-decode). `URLSearchParams` ya decodifica; un UTM con `%` suelto lanzaba `URI malformed` y el video no cargaba.

**Verificado en navegador (iframe aislado):**
- `?utm_source=Instagram-VA-perfil` → video VA `Mb4FA69mwzRO27Er` ✓
- `?utm_source=Instagram-AN-perfil` → video original `eSFGvAyB_NIHVP9e` ✓
- `assigned_to`, fecha/hora y link de WhatsApp (número por asesor) correctos ✓
- Botón flotante simétrico y fijo en desktop y mobile ✓

### Commits locales relacionados
- `f8c1d4e` — Add Calendly popup booking page
- `abfd13d` — Add Veronika Calendly booking page
- `886dc35` — Add Calendly confirmation page

### Estado de despliegue
Los cambios están guardados localmente en la rama:
- `codex/add-calendly-popup-page`

Pendiente:
- Autenticación de GitHub para poder hacer push y activar deploy en Vercel.

Bloqueo actual:
- HTTPS GitHub: `could not read Username`
- SSH GitHub: `Permission denied (publickey)`
- GitHub connector: `403 Resource not accessible by integration`

Comando sugerido para completar:
```bash
gh auth login -h github.com
git push -u origin codex/add-calendly-popup-page
```

### Resultado esperado
Aumentar la tasa de agendamiento y asistencia a llamadas reduciendo carga inicial, manteniendo al lead dentro de la página, reforzando prueba social y diferenciando el video de confirmación según origen AN/VA.

### Resultado medido (completar después)
- [ ] Preview Vercel generado
- [ ] Rutas verificadas en producción: `/calendly-va`, `/calendly-confirma`, `/calendly-an-optimizado.html`
- [ ] Conversión a agenda vs página anterior
- [ ] Clics en WhatsApp de confirmación
- [ ] Show-up rate de llamadas después de implementar `/calendly-confirma`

---

## 2026-07-09 — Funnel nuevo: Videoteca TR4INER (3 páginas)

### Qué cambió
Se creó el funnel "Videoteca" replicando la estructura del funnel de biblioteca de Eneryia, adaptado a TR4INER:

1. **`/biblioteca/`** — Registro. Campos: nombre, WhatsApp (prefijo internacional, default +51), correo y **sexo** (campo nuevo para segmentar contenido). Honeypot + bloqueo de dominios temporales, mismo patrón anti-spam del funnel de casos de estudio. Preview del contenido con miniaturas reales de YouTube en escala de grises + candado.
2. **`/biblioteca/confirma/`** — Aviso de confirmación de correo (doble opt-in). Barra de progreso "Paso 2 de 3", mock de bandeja de entrada con el correo que va a recibir, botones "Abrir Gmail"/"Abrir Outlook", aviso SPAM/Promociones. Personaliza titular y copy con nombre/sexo (URL o localStorage).
3. **`/biblioteca/videos/`** — La videoteca: 18 vídeos del canal en 5 bloques (Cómo comer ×6, Cómo entrenar ×4, Perder grasa ×4, Ganar músculo ×3, Hormonas y ciclo ×1). Filtro por bloque + interruptor Mujer/Hombre: a hombres se les ocultan los 3 vídeos de fisiología femenina (ciclo menstrual, entrenamiento/ejercicios para mujeres) y el bloque Hormonas desaparece. Reproductor en lightbox (youtube-nocookie) con enlace a YouTube.

### Detalles técnicos
- **Webhook:** `https://primary-production-0efa.up.railway.app/webhook/biblioteca` — ⚠️ **el workflow n8n aún no existe**; hay que crearlo (payload: `funnel, nombre, whatsapp, email, sexo, video, utm, page_url, timestamp`). Si el POST falla, el usuario avanza igual (mismo patrón que casos-estudio).
- **Atribución:** `/track.js` (TR4Track) en las 3 páginas; `?video=` + UTMs viajan en el payload y `utm_content` se rellena con el video si viene vacío.
- **Estado del lead:** `localStorage.tr4_lead` (`{nombre, email, sexo}`) — lo escriben el registro y el toggle de la videoteca; lo leen las páginas 2 y 3. El correo de confirmación debe enlazar a `/biblioteca/videos/?sexo=...&nombre=...` para que funcione cross-device.
- **Diseño:** misma familia visual del funnel (papel `#F4EFE6`, tinta `#16130E`, amarillo `#F5C518`, Fraunces + Instrument Sans + JetBrains Mono). Concepto: la videoteca como programa de entrenamiento (fichas, bloques B1–B5); firma visual: subrayado de plumón amarillo animado. Sin dependencias JS, `noindex`, `prefers-reduced-motion` respetado.
- Links legales como `#` (placeholder), igual que el resto de páginas.

### Por qué
Lead magnet de captura con segmentación por sexo desde el registro, para personalizar contenido (videoteca filtrada) y campañas de email/WhatsApp por fisiología. El contenido en bloques ordenados diferencia la entrega de "una lista de vídeos" y empuja consumo secuencial.

### Resultado esperado
Nueva fuente de leads cualificados desde el canal de YouTube con atribución por vídeo, y base de contactos segmentada por sexo para las secuencias de Brevo.

### Resultado medido (completar después)
- [ ] Workflow n8n `webhook/biblioteca` creado y conectado a Brevo/CRM
- [ ] Correo de confirmación (doble opt-in) enlazando a `/biblioteca/videos/`
- [ ] Tasa de envío del formulario
- [ ] Tasa de confirmación de correo
- [ ] Reproducciones por bloque / por sexo

---

## 2026-07-09 — Concepto creativo «Programa Cero» (reescritura del funnel Videoteca)

### Qué cambió
El funnel deja de comunicarse como "videoteca de vídeos del canal" y pasa a ser **«Programa Cero»: el plan gratuito de 5 bloques con el que arrancas por tu cuenta, antes de que te entrenemos nosotros**. Vocabulario en todo el funnel: vídeos → **sesiones**, grupos → **bloques**, registro → **inscripción / reservar plaza**, confirmar correo → **activar tu plaza**. La palabra "videoteca" y "vídeos de YouTube" desaparecen de la comunicación (YouTube solo queda como enlace secundario del reproductor).

Además, dos piezas nuevas en `/biblioteca/videos/`:
1. **Progreso de sesiones**: cada sesión se puede marcar como completada (check en la tarjeta). Persiste en `localStorage.tr4_progreso`, con barra de avance por bloque y avance global en el hero. Da razón de volver a la página.
2. **Bisagra a la asesoría**: sección final en tinta — "El siguiente bloque no es una sesión: es tu plan" — con CTA "Conocer la asesoría" a `metodo.tr4iner.com/testimonio-flor|dashiel` según sexo, con `first_name`, `email`, `sexo` y atribución (video + UTMs) en la URL.

### Por qué
Si el copy dice "vídeos del canal", el lead piensa "eso ya lo tengo gratis en YouTube" y no se registra. El valor no es el contenido sino el criterio (qué ver, en qué orden, para tu caso). "Programa Cero" además: (a) convierte la secuencia de correos en parte del producto ("tu coach te guía sesión a sesión"), y (b) deja implícita la venta: el Programa 1 es la asesoría.

### Implicaciones
- Rutas y webhook NO cambian (`/biblioteca/…`, `webhook/biblioteca`, payload igual) — solo naming visible.
- El correo de activación y las listas de Brevo deben usar el naming nuevo (asunto: "Tu plaza en el Programa Cero (activación requerida)"). Avisado a la sesión que construye el workflow n8n.
- El destino de la bisagra (testimonio-flor/dashiel) es ajustable si conviene apuntar a otra página de venta.

### Resultado esperado
Mayor tasa de registro (se elimina la objeción "lo veo gratis en YouTube") y mayor apertura de la secuencia de correos al enmarcarla como sesiones del programa.

### Resultado medido (completar después)
- [ ] Conversión de registro vs. versión "videoteca" (si se llega a testear)
- [ ] % de leads que marcan ≥1 sesión completada
- [ ] Clics en "Conocer la asesoría" desde la bisagra

---

## 2026-07-13 — Fix: UTMs no se reenviaban a flor/dashiel + regularización de leads

### Qué cambió
- **Bug:** la página de registro (`index.html`) pasaba solo `first_name`, `email`, `sexo` a las páginas destino `testimonio-flor` / `testimonio-dashiel`, **sin reenviar las UTMs** (`utm_source/medium/campaign`). Corregido en el HTML (Codex).
- **Impacto:** desde "Santa Torres" (11-jul 20:20) hasta el 13-jul, los leads guardados en el Google Sheet `LEADS` (id `1Tdf7SP70…`, tab gid 783595842) quedaron con las 3 columnas UTM vacías: **223 filas**.

### Alcance real (importante)
- El bug afecta **solo al Sheet opt-in**, NO al CRM. El opt-in de flor/dashiel no fluye al CRM (0 de 99 emails de Clarity existían en Neon). El CRM se nutre de Typeform y sus leads sí traen UTMs.

### Regularización (2 capas)
- **Capa 1 — Clarity (exacta):** export de Microsoft Clarity ata email↔UTM (entrada `casos-de-estudio?utm_*` + salida `testimonio-flor/dashiel?email=…` en la misma sesión). Se usaron 3 exports combinados (casos-de-estudio + filtrados por testimonio-flor/dashiel) → 163 identidades, 158 con UTM → **113 filas rellenadas** por match de email. Límite: Clarity graba una *muestra* de sesiones; a muchos leads nunca los grabó.
- **Capa 2 — GA4 (inferida, alta confianza):** GA4 conserva la atribución correcta (atribuye desde la entrada casos-de-estudio, no desde la página de registro). Regla: cruzar minuto de registro (FECHA sheet, UTC→Lima UTC-5) contra page_view de `testimonio-flor/dashiel` en GA4, filtrando por sexo (flor=Mujer/dashiel=Hombre), descartando `(direct)`/VA/redirection/fb, y exigiendo **minuto aislado** (una sola registración de ese sexo). **Validado 100% (50/50)** contra la verdad de Clarity antes de aplicar → **42 filas más** (31 AN-org, 11 MetaAds). Log: `ga4_inferred_log.json`.
- **OJO GA4:** cuando dice `(direct)` está mal (usuarios de in-app browser TikTok/FB/IG pierden atribución) → esas predicciones se descartan; Clarity es la verdad ahí.
- Escritura vía service account `mcpga4@gen-lang-client-0260292295.iam.gserviceaccount.com` (Editor en la planilla). Backups: `sheet_backup_window/v2/v3.json`.

### Resultado (13-jul-2026)
- Ventana 341 filas: **271 con UTM** (155 recuperadas: 113 Clarity + 42 GA4), 70 sin UTM.
- De las 70 restantes: ~26 son **spam de bots** (nombres en latín, correos desechables, sin fecha — no son del bug), ~44 leads reales que ni Clarity grabó ni GA4 pudo aislar.

### Efecto colateral encontrado: sync Typeform→CRM caído
Investigando el impacto en el CRM se descubrió que el pipeline **Typeform → n8n → CRM** (workflow `7beLlD29cUp8DiDN`) estaba perdiendo casi todos los leads desde ~4-jul por dos bugs:
1. El **email llegaba URL-encoded (`%40`)** al hidden field del Typeform → el n8n no lo detectaba (chequeaba `@` literal). El `%40` se origina en la cadena de páginas del funnel que pasa el email al Typeform (la solución de fondo es decodificar el `@` en esa página, igual que `index.html` hace `p.toString().replace(/%40/g,'@')` en `buildRedirectUrl`).
2. Al **agregar la pregunta de rango de edad** al Typeform (~10-jul) se corrieron los índices de respuestas que el n8n leía por posición.
Se arregló el workflow n8n (decode + lectura por `field.ref`) y se recuperaron 66 leads perdidos. Detalle completo en `crm-ventas/BITACORA.md` (entrada 2026-07-13) y en la memoria del CRM. **Si tocás cómo el funnel pasa el email al Typeform, verificá que llegue con `@` literal, no `%40`.**

## 2026-07-14 — Biblioteca: sexo automático y versión ClickFunnels 2.0

### Qué cambió
- Se eliminó el switch Hombre/Mujer de `/biblioteca/videos/`; el contenido se filtra automáticamente usando `sexo` desde la URL o `localStorage.tr4_lead`.
- Se agregó `biblioteca/videos/build-clickfunnels.mjs`, que genera `biblioteca/videos/clickfunnels.html` con un iframe aislado para pegar en ClickFunnels 2.0.
- La versión ClickFunnels pasa los parámetros de la URL al iframe, incluye `track.js` inline y ajusta automáticamente su altura.
- Se eliminó la dependencia visual de los reveals para que las tarjetas no queden transparentes si ClickFunnels bloquea o altera el JavaScript de animación.

### Por qué
El lead ya eligió su sexo en el registro; pedirle que lo elija otra vez agrega fricción. El render invisible en ClickFunnels era un fallo de compatibilidad: la tarjeta existía y recibía clics, pero quedaba con `opacity: 0`.

### Resultado esperado
Menos fricción después del registro, contenido personalizado por sexo y tarjetas visibles/clickeables al insertar la biblioteca en ClickFunnels 2.0.

### Resultado medido (completar después)
- [ ] Reproducción correcta en ClickFunnels 2.0 desktop y mobile
- [ ] UTMs y `sexo` conservados al CTA de asesoría
- [ ] Clics y reproducciones por bloque / sexo

## 2026-07-14 — Arquitectura unificada en Vercel para Caso de Estudio y Programa Cero

### Decisión
Se confirma que este repositorio y un único proyecto de Vercel alojarán **dos funnels independientes**:

1. **Caso de Estudio:** landing principal → VSL Flor/Dashiel → Typeform → Calendly → confirmación.
2. **Biblioteca / Programa Cero:** registro MQL → confirmación de correo → biblioteca personalizada de videos, todo bajo `/biblioteca/`.

El dominio canónico será `metodo.tr4iner.com` cuando todas las páginas terminen de migrarse desde ClickFunnels. Hasta entonces, la cadena completa debe poder probarse dentro de una URL de preview de Vercel sin saltar al dominio de ClickFunnels.

### Rutas objetivo
- `/` → landing de Caso de Estudio.
- `/testimonio-flor` → `registro-typeform-flor.html`.
- `/testimonio-dashiel` → `registro-typeform-optimizado.html`.
- `/calendly-*` → tramo de agenda del Caso de Estudio.
- `/biblioteca/`, `/biblioteca/confirma/`, `/biblioteca/videos/` → Programa Cero.

Las versiones y generadores específicos para ClickFunnels quedan como compatibilidad temporal y se ignoran al ordenar, desplegar y validar el proyecto Vercel, salvo pedido explícito.

### Problemas encontrados antes de implementar
- `index.html` captura UTMs, pero todavía redirige con URLs absolutas a `metodo.tr4iner.com/testimonio-flor|dashiel`; por eso un registro hecho en preview abandona el deployment de Vercel.
- No existe todavía un `vercel.json` que publique los HTML Flor/Dashiel bajo las rutas limpias `/testimonio-flor` y `/testimonio-dashiel`.
- La atribución no es consistente en toda la cadena: algunas páginas reenvían solo cinco UTMs y pueden perder `utm_id`, `video`, `fbclid`, `gclid`, `fbc_id`, `h_ad_id` u otros parámetros.
- Vercel tiene dos proyectos distintos:
  - **Original:** `tr4iner-funnels` (`prj_9PxYgSJyjri8KjC4F6xAyd3NNqtK`), creado en mayo de 2026. El `projectId` local apunta aquí y actualmente posee `tr4iner-funnel-casos-estudio.vercel.app`.
  - **Duplicado:** `tr4iner-funnel-casos-estudio` (`prj_87jygC6G47q5oUW4HO6QrOT5BlOa`), creado el 14-jul-2026 por el deployment manual de preview. Posee `tr4iner-funnel-casos-estudio-eight.vercel.app`.
- El `.vercel/project.json` tiene el ID del proyecto original pero un `projectName` desactualizado que coincide con el duplicado. El ID es la referencia fiable.

### Regla acordada de atribución
Cada navegación, redirect, CTA, Typeform y Calendly debe preservar todos los parámetros `utm_*`, IDs publicitarios y `video`, además de `first_name`, `email` y `sexo` cuando correspondan. Los destinos internos deben construirse con el origen actual o rutas relativas: preview permanece en preview y producción permanece en `metodo.tr4iner.com`.

### Próximos pasos
- [ ] Confirmar el proyecto Vercel canónico y eliminar/archivar duplicados solo después de revisar dominios y Git Integration.
- [x] Crear rutas limpias para Flor y Dashiel.
- [x] Cambiar redirects hardcodeados por destinos internos del mismo origen.
- [x] Auditar y unificar propagación de atribución de extremo a extremo.
- [x] Probar ambos recorridos con UTMs sintéticas en preview antes de producción.

### Resultado esperado
Un solo deployment verificable, sin saltos accidentales a ClickFunnels, con separación clara entre funnels y atribución intacta en toda la cadena.

## 2026-07-14 — Preview integral en Vercel listo para pruebas

### Qué cambió
- Se publicaron únicamente las páginas canónicas en el proyecto Vercel original `tr4iner-funnels`; se excluyeron las variantes `-A` y los archivos específicos de ClickFunnels.
- Se agregaron rutas limpias para `/casos-de-estudio`, `/testimonio-flor`, `/testimonio-dashiel` y `/calendly-an` mediante `vercel.json`.
- Los redirects internos ahora conservan el origen actual: un recorrido iniciado en preview continúa en ese preview; en producción continuará en `metodo.tr4iner.com`.
- Se unificó la propagación de todos los parámetros `utm_*`, identidad, `video` e IDs publicitarios hacia Typeform, Calendly, confirmación, biblioteca y CTA final.
- `attribution.js` queda como nombre canónico del script de atribución para reducir bloqueos de extensiones; `track.js` se conserva por compatibilidad.

### Verificación
- Sintaxis JavaScript validada en las nueve páginas canónicas y en ambos scripts de atribución.
- Probadas en navegador las rutas de Caso de Estudio, Flor, Dashiel, Calendly, confirmación y las tres páginas de Biblioteca.
- Typeform visible y con hidden fields completos; Calendly recibe UTMs dinámicas, identidad, `video` e IDs publicitarios.
- Biblioteca personalizada sin switch: prueba Hombre mostró 15 tarjetas y CTA final conservando la atribución.

### Pendiente de prueba humana
- Envío real del registro de Biblioteca al webhook de n8n y recepción del correo de Brevo.
- Envío real de Typeform y redirect configurado externamente hacia Calendly.

### Preview
`https://tr4iner-funnels-ctb3f97rd-metodotr4iners-projects.vercel.app`

## 2026-07-14 — Flor y Dashiel: variante A promovida a canónica

### Qué cambió
- Las páginas editoriales que estaban nombradas como `registro-typeform-optimizado-A.html` y `registro-typeform-flor-A.html` pasaron a ser los archivos canónicos sin sufijo.
- Las páginas que ocupaban los nombres canónicos quedaron archivadas como `registro-typeform-optimizado-B.html` y `registro-typeform-flor-B.html`.
- Las rutas públicas permanecen iguales: `/testimonio-dashiel` y `/testimonio-flor`. Todavía no se implementó distribución A/B.
- Se portó a las nuevas canónicas la propagación dinámica de todos los `utm_*`, identidad, `video` e IDs publicitarios, manteniendo el correo con `@` literal.

### Por qué
La variante A coincide con la dirección visual aprobada: Fraunces para títulos, Instrument Sans para lectura y JetBrains Mono para etiquetas, alineada con la landing de registro de Caso de Estudio.

### Verificación
- Sintaxis de los cuatro HTML validada.
- Dashiel y Flor comparados en navegador local y en el preview desplegado.
- En ambas rutas se confirmó el título editorial, Typeform visible y hidden fields completos.
- Preview Vercel: `https://tr4iner-funnels-7rhrb2914-metodotr4iners-projects.vercel.app`.

### Resultado esperado
Continuidad visual desde el registro hacia el caso de estudio, sin romper las URLs actuales ni la atribución.

## 2026-07-14 — Línea editorial unificada en Calendly y confirmación

### Qué cambió
- Las antiguas variantes A de `calendly-an-optimizado.html` y `calendly-va/index.html` pasaron a ser canónicas; las anteriores quedaron archivadas como B.
- `calendly-confirma/index.html` se adaptó a la misma línea visual: Fraunces, Instrument Sans, JetBrains Mono, fondo papel, acento óxido y estructura editorial.
- Las rutas permanecen iguales: `/calendly-an`, `/calendly-va/` y `/calendly-confirma/`.
- Calendly conserva todos los `utm_*`, identidad, `video` e IDs publicitarios.

### Lógica preservada
- AN mantiene Vidalytics `w0UY0FRGIQo11cXX`.
- VA mantiene Vidalytics `2s1vpHRi_hOARyIm`.
- Confirmación carga `Mb4FA69mwzRO27Er` cuando cualquier valor `utm_*` contiene `-VA-`; de lo contrario carga `eSFGvAyB_NIHVP9e`.

### Verificación
- Sintaxis JavaScript validada en las seis páginas canónicas/B.
- Calendly abierto en AN y VA con parámetros sintéticos; ambos iframes conservaron UTMs, identidad, `video` y click IDs.
- Confirmación probada con campaña normal y campaña `-VA-`; cada caso cargó únicamente el ID de video correspondiente.
- Diseño revisado en navegador desktop antes del despliegue.
- Preview Vercel: `https://tr4iner-funnels-dszb3pfpn-metodotr4iners-projects.vercel.app`.

### Resultado esperado
Continuidad visual completa desde el registro y los casos de estudio hasta la reserva y confirmación, sin alterar atribución ni segmentación VA.

## 2026-07-14 — Sistema tipográfico unificado

### Qué cambió
- Se tomó la Biblioteca como referencia visual y se normalizó la carga de Fraunces, Instrument Sans y JetBrains Mono en registro, casos de estudio, Calendly y confirmación.
- Se unificaron pesos, optical sizing, interlineado, tracking y escala de cuerpo, títulos y metadatos sin alterar layouts ni lógica del funnel.
- Se corrigió en móvil el espacio entre el nombre del caso y “El análisis” en Flor y Dashiel.

### Verificación
- Sintaxis JavaScript y `git diff --check` sin errores.
- Revisión responsive en 375, 768 y 1280 px sin desbordes nuevos.
- Se preservaron Typeform, Calendly, Vidalytics, redirects y propagación de UTMs.
- Preview Vercel: `https://tr4iner-funnels-ivqe72btv-metodotr4iners-projects.vercel.app`.

### Resultado esperado
Mayor coherencia y percepción profesional durante todo el recorrido, sin impacto funcional ni cambios de atribución.

## 2026-07-14 — Ruta pública para Flor VA

### Qué cambió
- Se agregó el rewrite `/testimonio-flor-va` hacia `registro-typeform-flor-va.html`.
- La página se alineó al sistema tipográfico canónico: Fraunces, Instrument Sans y JetBrains Mono.
- El copy visible se igualó al de `/testimonio-flor`; la variante VA se diferencia por su video, no por el mensaje.
- Typeform ahora recibe cualquier `utm_*`, identidad, `video` e IDs publicitarios, manteniendo el correo con `@` literal.

### Lógica preservada
- Se mantiene el Vidalytics VA `gIbYz9eSdIofNh2D`, el temporizador y el Typeform existentes.
- Preview Vercel corregido: `https://tr4iner-funnels-8tbpb4xab-metodotr4iners-projects.vercel.app/testimonio-flor-va`.

### Resultado esperado
Flor VA queda disponible mediante una URL pública limpia y conserva la atribución completa.

## 2026-07-14 — Testimonios unificados en Calendly AN y VA

### Qué cambió
- Calendly AN ahora usa los mismos copys específicos y cuantificados de testimonios que Calendly VA.
- Se eliminó el degradado oscuro de las tarjetas y el texto pasó a negro sobre el espacio inferior incluido en cada imagen.
- Las imágenes respetan su proporción real `500×740` con `object-fit: contain`; las tarjetas usan anchos responsive limitados para evitar recortes y tamaños descontrolados.

### Lógica preservada
- No se modificaron Calendly, Vidalytics, lightbox, redirects ni atribución.
- Preview Vercel: `https://tr4iner-funnels-lpkpjyqjv-metodotr4iners-projects.vercel.app`.

### Resultado esperado
Testimonios más creíbles y legibles, con las piezas gráficas completas tanto en móvil como en escritorio.

## 2026-07-14 — Publicación integral a producción

### Qué cambió
- Se desplegaron las páginas canónicas de Caso de Estudio, Flor, Flor VA, Dashiel, Calendly y Biblioteca en el proyecto original `tr4iner-funnels` (`prj_9PxYgSJyjri8KjC4F6xAyd3NNqtK`).
- Deployment de producción: `dpl_DVNQmyGkzNrFVc71DvP8sACyYe5T`, estado `READY`.
- Alias principal actualizado: `https://tr4iner-funnel-casos-estudio.vercel.app`.
- Se corrigió el `projectName` local de `.vercel/project.json`; el `projectId` ya era correcto.

### Duplicado identificado
- `tr4iner-funnel-casos-estudio` (`prj_87jygC6G47q5oUW4HO6QrOT5BlOa`) fue creado el 14-jul-2026 por un deploy manual desde una carpeta no enlazada.
- Tiene un solo deployment, no posee metadata de Git y únicamente usa dominios Vercel secundarios (`*-eight.vercel.app`). No recibe esta publicación.

### Verificación
- Las diez páginas canónicas pasaron validación de sintaxis JavaScript y `vercel.json` válido.
- El paquete publicado contiene 19 archivos y excluye versiones ClickFunnels.
- Vercel confirmó el deployment y los alias de producción sin `aliasError`.

### Pendiente
- `metodo.tr4iner.com` todavía no está asociado al proyecto; se conectará cuando termine la migración desde ClickFunnels.

## 2026-07-14 — Proyecto duplicado eliminado de Vercel

### Qué cambió
- Se eliminó definitivamente `tr4iner-funnel-casos-estudio` (`prj_87jygC6G47q5oUW4HO6QrOT5BlOa`).
- Sus dominios secundarios `*-eight.vercel.app` y el deployment aislado dejaron de formar parte de la cuenta.

### Verificación
- La lista de proyectos de Vercel ya no contiene el duplicado.
- `tr4iner-funnels` (`prj_9PxYgSJyjri8KjC4F6xAyd3NNqtK`) sigue activo con producción `READY` y el alias `tr4iner-funnel-casos-estudio.vercel.app`.

### Regla vigente
Todo despliegue de este repo debe ir únicamente a `tr4iner-funnels` (`prj_9Px…`).

## 2026-07-15 — Biblioteca: lead scoring MQL→SQL + test de macros + tracking real

### Qué cambió
- **Capa de eventos** en `attribution.js`: `TR4Track.track(evento, props)` manda actividad por `sendBeacon` (fallback `fetch keepalive`, body `text/plain` para evitar preflight CORS) al webhook nuevo `webhook/biblioteca-eventos`. Identidad desde `localStorage.tr4_lead`.
- **Workflow n8n nuevo** `Biblioteca → Eventos + Lead Scoring (Programa Cero)` (`iMiNGcGxsmdd7nyt`, activo): valida el evento, lo loguea en la Data Table `biblioteca_eventos` (log crudo, fuente de verdad), acumula el agregado por email en `biblioteca_leads`, calcula score y stage, y espeja en Brevo (`LEAD_SCORE`, `LEAD_STAGE`, `OBJETIVO`, `KCAL`, `SESIONES_COMPLETADAS` — los 4 primeros atributos se crearon hoy, `OBJETIVO` ya existía).
- **Scoring:** registro +5 · plaza_activada +10 · test de macros +20 · sesión completada +5 (cap 6) · bloque completado +10 (cap 5) · visita de retorno +5 (cap 3) · clic bisagra +15. **Regla SQL:** clic en bisagra, o score ≥ 60 con test hecho. Stage: `LEAD → MQL (plaza activada) → SQL`, con `sql_at`.
- **Wizard nuevo `/biblioteca/plan/`** ("Diseña tu plan"): porta las preguntas y fórmulas exactas de `test-macros.tr4iner.com` (Mifflin-St Jeor / Katch-McArdle → TDEE ×1.3/1.4/1.5 → ±10% por objetivo → macros con cap proteína 2.5 g/kg y reducción de carbos en PG). Sexo/nombre/email llegan prefilled; pide email solo si no lo conoce (DOI cross-device). Resultado: kcal + macros + "Tu ruta" (bloques reordenados por objetivo+sexo). Guarda `localStorage.tr4_plan` y emite `test_macros_iniciado` / `test_macros_completado`.
- **`/biblioteca/videos/` personalizada:** sin plan muestra onboarding "Diseñar mi plan (2 min)"; con plan muestra chip de macros, tarjeta "Tu siguiente sesión", bloques reordenados según la ruta y etiquetas "Paso NN de tu ruta". Reproductor migrado a **YouTube IFrame API**: ≥85% visto autocompleta la sesión (fallback a iframe simple si un adblocker bloquea la API). Eventos: `plaza_activada`, `visita_retorno`, `sesion_play`, `sesion_completada` (auto/manual), `bloque_completado`.
- **Bisagra dinámica de 3 estados:** A (sin plan, copy original) · B (plan hecho: "Ya sabes tus {kcal} kcal…") · C (plan + ≥3 sesiones o 1 bloque: prueba social Flor/Dashiel por sexo). El clic emite `bisagra_click` → marca SQL aunque no complete el VSL. El CTA sigue reenviando `first_name`, `email`, `sexo` y toda la atribución a `/testimonio-flor|dashiel`.
- `biblioteca/index.html` emite `biblioteca_view` y `registro`.
- **Portón de identidad en `/biblioteca/videos/`** (agregado en la misma fecha): la identidad de la URL ya no se adopta a ciegas. Tres casos: (a) link con identidad y dispositivo sin expediente → "Esta plaza está a nombre de {nombre}. ¿Eres tú?" con opción "No soy yo" (limpia todo y pide correo); (b) identidad de la URL distinta a la local → confirmación explícita antes de cambiar de expediente (cambiar borra plan/avance locales); (c) sin identidad en ningún lado → pide el correo de la inscripción para continuar el tracking (idea de Anthoni), con link a inscribirse. Tras resolver, **email/nombre se eliminan de la barra de direcciones** (`history.replaceState`), así compartir el link no regala el expediente. `/biblioteca/plan/` aplica la misma regla (no adopta identidad conflictiva y limpia la URL).

### Por qué
La biblioteca capturaba MQL sin ninguna medición de actividad: imposible saber qué lead estaba listo para venta. Con el test de macros como onboarding, la experiencia pasa de "lista de videos" a "tu plan" (concepto Programa Cero), entrega datos de calificación (objetivo, kcal, peso, actividad) y el engagement real (reproducción medida, no checkbox) alimenta un score que define cuándo un lead pasa a SQL y debe ser contactado.

### Verificación (2026-07-15, preview local + n8n/Brevo producción)
- Cadena completa con UTMs sintéticas: registro → videos → plan → bisagra; cada salto arrastra `utm_*`, `video`, email, nombre, sexo.
- Cálculo validado contra el proyecto original: mujer 30a/165cm/65kg/ligera/PG → 1727 kcal, P138 C163 G54 (idéntico a `test-macros`).
- Lead de prueba `prueba-scoring@tr4iner.com` recorrió LEAD→MQL→SQL: score final 70, `LEAD_STAGE=SQL` visible en Brevo (contacto 136717). *No está en la lista 28 (entró por eventos, no por registro); se puede borrar desde Brevo.*
- Mobile 375px verificado en videos y plan.

### Estado del riesgo de concurrencia
El agregado `biblioteca_leads` de n8n todavía puede perder un incremento si recibe escrituras simultáneas. El CRM ya no depende de ese agregado: la rama `codex/biblioteca-pipeline-hardening` (`d28172e`) recalcula desde su propio log, serializa por email con `pg_advisory_xact_lock` y deduplica eventos puntuables en PostgreSQL.

### CRM y pendientes operativos
1. El endpoint, modelos separados, scoring y pipeline admin ya están implementados y probados en `crm-ventas`; producción sigue en 404 hasta completar staging y deploy.
2. La base Vercel/Neon debe conectarse al proyecto con branching para Preview antes del push del CRM. No desplegar un Preview que herede `DATABASE_URL` productiva.
3. El usuario revisará manualmente el workflow nuevo de n8n. No editarlo, activarlo ni publicarlo desde agentes.
4. Rotar `WEBHOOK_SECRET` de forma coordinada entre Vercel y todos los consumidores n8n; el valor histórico estuvo versionado en el CRM.
5. El `confirmUrl` del email DOI todavía debe revisarse manualmente para confirmar que reenvía email, video y toda la atribución cross-device.

### Deploy
Producción publicada el 2026-07-15: `dpl_TzNoZ6XyYfHGos8acsCxuFPjQHVV` (`READY`) en `tr4iner-funnels`, alias `https://tr4iner-funnel-casos-estudio.vercel.app`. Paquete curado de 20 archivos (10 páginas canónicas + `/biblioteca/plan/` nueva + variantes B archivadas + `attribution.js`/`track.js`/`vercel.json`), sin versiones ClickFunnels ni `.md`, mismo método que el 14-jul. Verificado: `/biblioteca/plan/` y `/biblioteca/videos/` 200, `attribution.js` en producción incluye `TR4Track.track`.

### Resultado medido (completar después)
- % de MQL que completa el test de macros.
- % de sesiones completadas reales (auto) vs manuales.
- Leads SQL/semana y tasa SQL→agenda.

## 2026-07-15 — Regularización Git y compatibilidad ClickFunnels

### Qué cambió
- Se creó la rama `codex/funnels-programa-cero` y se separó el trabajo acumulado en commits por responsabilidad: recorrido canónico/Calendly, Programa Cero, Fit4 y documentación.
- `CLAUDE.md` quedó como symlink de `AGENTS.md`: Codex y Claude Code leen exactamente las mismas reglas, rutas y decisiones.
- Se repararon los generadores `biblioteca/build-clickfunnels.mjs` y `biblioteca/videos/build-clickfunnels.mjs`, que todavía buscaban `/track.js` y una redirección anterior. Ahora incrustan `attribution.js`, conservan la query del documento padre y vuelven a generar sus salidas sin error.
- `attribution.js` entiende `window.__TR4_SEARCH__` en embeds `srcdoc`; en Vercel sigue usando `window.location.search` como siempre.

### Verificación
- JavaScript válido en las 11 páginas canónicas y ambos scripts de atribución.
- Cero enlaces o rutas internas rotas en las páginas canónicas.
- Render local correcto en landing, Flor, Calendly AN/VA, confirmación y las cuatro páginas de Biblioteca; sin overlays de error.
- Ambos generadores ClickFunnels ejecutan y producen archivos deterministas.

### Límite
No se modificó el workflow n8n. La comprobación visual de Biblioteca pudo emitir un `biblioteca_view` anónimo por caché del navegador; no llevaba email ni datos de lead.

## 2026-07-15 — Biblioteca: test obligatorio, grasa visual y desbloqueo guiado

### Qué cambió
- La pregunta de punto de partida ahora acepta todas las respuestas que correspondan y exige al menos una antes de avanzar.
- El porcentaje de grasa pasó a ser obligatorio y se elige con un slider exacto de 1% en 1%, con referencias corporales realistas distintas para mujer y hombre. El cálculo usa siempre Katch-McArdle y guarda/envía el porcentaje elegido.
- Las dos láminas generadas se sirven como WebP de 66/73 KB para no castigar la carga móvil.
- Sin un plan calculado, `/biblioteca/videos/` oculta sesiones, filtros y bisagra: el lead ve únicamente el paso para diseñar su plan.
- Al completar el test se muestra el resultado y el CTA `Ver mi ruta`; al entrar por primera vez a la Biblioteca desbloqueada aparece un tour nativo de 3 pasos, descartable y persistido en `localStorage`.

### Por qué
El test deja de ser una recomendación secundaria y se convierte en el onboarding real del Programa Cero. La selección visual reduce el abandono por desconocer el porcentaje de grasa, y el desbloqueo convierte el cálculo en una acción con recompensa clara.

### Verificación
- Flujo completo probado en navegador: selección múltiple, slider obligatorio, Katch-McArdle, resultado, desbloqueo y tour.
- Estado sin plan comprobado: `program-content` oculto y único CTA hacia el test.
- Responsive validado en 375, 768 y 1280 px sin overflow; grid de sesiones 1/2/3 columnas.
- Sintaxis JavaScript válida, consola sin errores y `git diff --check` limpio.

### Resultado esperado
Mayor tasa de finalización del test, mejor calidad del dato de grasa corporal y más leads que empiezan su primera sesión con una ruta entendida.

### Resultado medido (completar después)
- % de leads que mueven el slider y completan el test.
- % de leads que cierran el tour e inician la primera sesión.

## 2026-07-15 — Biblioteca: interfaz de YouTube reducida sin cambiar la reproducción

### Qué cambió
- El reproductor conserva la barra nativa y el comportamiento anterior.
- La carga por IFrame API agrega `playsinline=1`, `rel=0` e `iv_load_policy=3`: evita anotaciones, mantiene la reproducción dentro de móvil y limita las recomendaciones finales al mismo canal.
- El iframe de respaldo usa los mismos parámetros cuando la API es bloqueada por un adblocker.

### Límite real
YouTube ya no permite eliminar por parámetro el título, avatar, logo o enlaces de su reproductor. Pueden reaparecer al tocar, pausar o terminar el video; cubrirlos con capas propias rompería interacción y políticas del reproductor.

### Verificación
- Barra de reproducción original preservada; no se agregaron controles TR4INER alternativos.
- Autocompletado al 85%, cierre del modal y fallback sin cambios funcionales.

### Deploy
- Preview `dpl_31JsDDNHtLskRoFEgVhnRASt8pDM` verificado en estado `READY`.
- Producción `dpl_81RzFb3wqvunr6YMHzuHwyfG2C4e` publicada en `tr4iner-funnels`, estado `READY` y alias `https://tr4iner-funnel-casos-estudio.vercel.app`.
- Paquete curado de 22 archivos: conserva las 20 piezas canónicas anteriores, agrega las dos láminas WebP y excluye `.md`, generadores y versiones ClickFunnels temporales.
- `/biblioteca/videos/`, `/biblioteca/plan/` y ambos assets de grasa responden `200` desde el alias público.

## 2026-07-16 — GENESIS: entrada por sexo y Biblioteca personalizada

### Qué cambió
- Se creó `/biblioteca/inicio/` como pre-registro independiente: pregunta Mujer u Hombre y reenvía a `/biblioteca/?sexo=` conservando todos los parámetros presentes en la URL.
- `/biblioteca/` ya no vuelve a preguntar el sexo. Preselecciona el valor recibido, oculta ese campo y personaliza promesa, argumentos, cantidad de sesiones, miniaturas, formulario y CTA.
- El nombre visible de Programa Cero pasó a `GENESIS` en registro, confirmación, test de macros y videoteca.
- Se revisaron los 14 videos más recientes del canal femenino público `@Veronikaalavarado` y se incorporaron como contenido exclusivo para Mujer: 5 en Cómo comer, 3 en Cómo entrenar, 1 en Perder grasa y 5 en el nuevo bloque `Empezar y sostener`.
- La ruta Mujer queda con 32 sesiones en 6 bloques; Hombre conserva 15 sesiones en 4 bloques. El plan calculado usa los mismos conteos y orden por objetivo.

### Por qué
El sexo se usa antes del opt-in para que la primera promesa ya hable del problema correcto y para eliminar una pregunta repetida del formulario. El bloque de constancia separa los videos de abandono, confianza y adherencia de los videos técnicos, en línea con el estudio 2026: falta de estructura y desorden con la comida pesan más que desconocer ejercicios.

### Verificación local
- Selector y registros Mujer/Hombre probados con UTMs sintéticas; `sexo` y atribución permanecen en la URL.
- Mujer: 32 sesiones, 6 bloques, campo sexo oculto y bloques femeninos visibles. Hombre: 15 sesiones, 4 bloques y bloques de ciclo/constancia ocultos.
- Los 14 IDs recientes de `@Veronikaalavarado` están presentes; no quedaron videos del scrape inicial del canal equivocado.
- Responsive comprobado en 375, 768 y 1280 px; JavaScript válido, consola limpia y `git diff --check` sin errores.

### Deploy
- Preview `dpl_C2HbeNjD1c73ssbZsUTEBHrZ7DWd` validado en estado `READY`.
- Producción `dpl_6HxgGcsH5ZsS5XAoMsRoAkozkYwS` publicada en `tr4iner-funnels`, estado `READY`.
- Alias principal actualizado: `https://tr4iner-funnel-casos-estudio.vercel.app`.
- Paquete curado de 23 archivos públicos: conserva las 22 piezas del deployment anterior y agrega `/biblioteca/inicio/`; excluye `.md`, generadores y versiones ClickFunnels.
- Rama de implementación: `codex/biblioteca-sex-entry`, commit funcional `d99ee04`.

## 2026-07-18 — Lead magnet “10 platos para perder grasa”

### Qué cambió
- Se migró el funnel completo desde ClickFunnels a cuatro páginas estáticas: `/10platospg` (registro), `/10platospg-regd` (confirmación), `/10platospg-h` y `/10platospg-m` (video + descarga por sexo).
- El formulario mantiene nombre, email y sexo; envía el payload al webhook existente `/webhook/leadmagnet1` del flujo n8n `xW4IFABjMJQaoYwN` y redirige aunque el navegador no pueda leer la respuesta.
- Cada salto conserva todos los parámetros recibidos, incluidos futuros identificadores, y agrega `first_name`, `email` y `sexo`. Los UTMs, `video`, `fbclid` y demás atribución también viajan dentro del payload.
- Los dos PDFs, mockup, retrato y miniaturas quedaron servidos desde este proyecto. Los videos usan fachada local y cargan YouTube sin cookies recién al hacer clic.
- La landing usa la identidad tipográfica canónica y un “pase de cocina” como única firma visual. Confirmación y descargas comparten el sistema sin repetir la misma composición.

### SEO / GEO
- Solo `/10platospg` es indexable. Tiene canonical, hreflang, metadatos sociales, contenido que responde la intención de búsqueda y JSON-LD de `Organization`, `Person`, `WebPage` y `BreadcrumbList`.
- Confirmación y páginas de descarga usan `noindex, nofollow` por ser superficies operativas y delgadas.
- Se agregaron `robots.txt` y `sitemap.xml`; el sitemap incluye únicamente la landing indexable.

### Verificación
- Las cuatro páginas respondieron `200` y se revisaron en Chrome a 375, 768 y 1280 px: sin overflow, imágenes rotas ni errores de consola.
- El formulario se probó con el webhook interceptado para no crear un lead falso: payload correcto y redirección con nombre, email, sexo, UTMs, `fbclid` y `video` preservados.
- Ambos PDFs, mockup, `robots.txt` y `sitemap.xml` respondieron `200`; los dos botones de video crearon el iframe correcto.
- JavaScript, JSON-LD, XML y `git diff --check` pasaron sin errores.

### Resultado esperado
- Mejorar la conversión de visita a lead al mostrar el formulario completo arriba del pliegue y eliminar el popup de ClickFunnels.
- Capturar correctamente el sexo y la atribución sin mezclar este funnel con Caso de Estudio ni Biblioteca.
- Crear una puerta de entrada orgánica para búsquedas sobre platos y comidas para perder grasa.

### Deploy
No desplegado. Queda listo para Preview y prueba real contra n8n/Brevo antes de mover producción. Rama `codex/10-platos-lead-magnet`; commit funcional `c40bc6f`.

### Resultado medido (completar después)
- Conversión visita → registro total y por dispositivo.
- Entregabilidad del correo y clic hacia `/10platospg-h` o `/10platospg-m`.
- Tráfico orgánico, consultas y posiciones de `/10platospg`.

## 2026-07-18 — Rediseño directo del lead magnet “10 platos”

### Qué cambió
- Se reemplazó la estética editorial crema/serif por la identidad real del ebook: Poppins, blanco, negro cálido y amarillo.
- `/10platospg` quedó reducido a título, descripción, tres beneficios, mockup y formulario. Se eliminaron el encabezado de marca y las secciones largas posteriores al registro.
- `/10platospg-regd`, `/10platospg-h` y `/10platospg-m` perdieron sus barras superiores y adoptaron el mismo sistema visual del producto.
- Tras la revisión visual, los soportes negros del mockup se cambiaron por gris piedra; el negro quedó reservado para la sección de video y el amarillo para la base del producto.
- Se conservaron el webhook, el payload, la redirección y la propagación completa de parámetros sin cambios funcionales.

### Por qué
La estética anterior ya parecía una plantilla generada por IA y competía con el producto. El nuevo diseño usa el mockup como pieza principal y reduce la página de captación a una decisión directa: entender la promesa y dejar los datos.

### Verificación
- Las cuatro rutas respondieron `200` en Chrome y se revisaron a 375, 768 y 1280 px sin desbordes horizontales.
- El registro interceptado envió nombre, correo, sexo, UTMs, `fbclid` y `video`; la confirmación recibió los mismos valores con `@` literal.
- Ambos videos cargaron el ID correcto y los PDFs para hombre y mujer respondieron `200`.
- `git diff --check` pasó sin errores.

### Resultado esperado
- Mejorar la conversión visita → registro reduciendo fricción y evitando scroll innecesario antes del formulario.
- Aumentar coherencia y recordación al hacer que las páginas se sientan parte del ebook, no de una plantilla genérica.

### Deploy
No desplegado. Pendiente de aprobación visual y Preview.

## 2026-07-19 — Analítica completa del funnel Caso de Estudio

### Qué cambió
- Se instaló `GTM-T88G63P` en las siete páginas canónicas: landing, testimonios Flor/Dashiel, variante Flor VA, agendamiento AN/VA y confirmación.
- GA4 `G-CGWMFER9V4`, Clarity `m58dvc10t1` y Meta Pixel `841122323338135` quedan gobernados por el contenedor existente de GTM; no se agregaron inicializaciones directas que dupliquen `page_view`.
- Cada página conserva los fallbacks `noscript` de GTM y Meta para navegadores sin JavaScript.
- Las variantes archivadas `-B` y los archivos de compatibilidad ClickFunnels quedaron fuera.
- Se agregó al contexto del repo la regla obligatoria de optimización SEO/GEO para toda página nueva o rediseñada, manteniendo `noindex` en pasos operativos o delgados.

### Por qué
La migración a `metodo.tr4iner.com` necesita continuidad de medición sin heredar la duplicación de Pixel detectada en ClickFunnels. GTM conserva los disparadores y etiquetas ya configurados por el negocio.

### Verificación
- La prueba local confirmó que el contenedor inyecta una sola carga de GA4, Google Ads, Clarity y Meta en las siete páginas, sin errores de consola. Durante la revisión se detectaron y eliminaron las cargas directas redundantes antes de cerrar el cambio.
- Cada página canónica contiene una sola inicialización de GTM y no se tocaron las páginas archivadas.
- `git diff --check` pasó sin errores.

### Resultado esperado
- Mantener sesiones, conversiones, audiencias y grabaciones durante el corte de dominio sin doble conteo de visitas.
- Poder validar el recorrido completo en Preview antes de mover producción.

### Deploy
No desplegado. Pendiente de Preview, validación en Tag Assistant/GA4 DebugView, Meta Pixel Helper y Clarity, y recién después migración de producción.

## 2026-07-19 — SEO/GEO multiruta y VSL FIT4CHALLENGE

### Qué cambió
- `/casos-de-estudio` quedó como URL canónica e indexable del funnel principal; `/` redirige con `308` a esa ruta mediante una función mínima que conserva la query completa.
- La landing recibió descripción, canonical, `hreflang`, metadatos sociales y JSON-LD de `Organization`, `Person`, `WebPage` y `BreadcrumbList`. La entidad TR4INER apunta al dominio principal `tr4iner.com` para no fragmentar autoridad entre WordPress y el subdominio de funnels.
- Las rutas internas de Caso de Estudio, GENESIS, 10 Platos y FIT4 recibieron título, descripción y canonical propios, pero conservan `noindex, nofollow` porque son pasos operativos, privados o delgados.
- El sitemap contiene únicamente `/casos-de-estudio` y `/10platospg`. `.vercelignore` evita publicar variantes `-B`, generadores y archivos temporales de ClickFunnels.
- GTM `GTM-T88G63P` se extendió a las cinco páginas canónicas de GENESIS, las cuatro de 10 Platos y la nueva FIT4; GA4, Clarity y Meta siguen gobernados por el contenedor sin inicializaciones directas duplicadas.
- Se creó `/fit4`: cualquier `utm_*` que contenga `-VA-` carga `Rl_cXuqDVuhtabtp`; cualquier otro tráfico carga `T7Hop2PBd6tWQl0W`. El CTA se desbloquea al segundo 180 y reenvía a Hotmart todos los parámetros presentes más la atribución persistida.
- FIT4 expone en `dataLayer` los eventos `fit4_vsl_loaded`, `fit4_offer_unlocked` y `fit4_checkout_click`, con la dimensión `fit4_variant` (`AN` o `VA`).

### Por qué
El proyecto Vercel pasa a funcionar como un alojamiento multiruta de funnels. La indexación selectiva evita que páginas de confirmación, VSL privadas y variantes compitan entre sí, mientras las superficies con intención orgánica sí consolidan señales SEO/GEO. FIT4 reemplaza la página ClickFunnels destinada actualmente a menores de edad sin perder la selección AN/VA ni la atribución.

### Verificación
- JavaScript válido en las 17 páginas canónicas; JSON-LD, `vercel.json`, sitemap XML y `git diff --check` sin errores.
- Las 17 páginas tienen robots, descripción, canonical, una sola inicialización de GTM y un solo fallback `noscript`.
- `vercel dev` confirmó `308` de `/` a `/casos-de-estudio` conservando UTMs, `fbclid` y un identificador futuro. Las 17 rutas canónicas, `robots.txt`, sitemap y `attribution.js` respondieron `200`; variantes `-B` y la página ClickFunnels de FIT4 respondieron `404`.
- `/fit4` revisada en Chrome a 375, 768 y 1280 px: sin overflow, overlays ni errores de consola.
- Con UTMs sintéticas, VA y AN cargaron exclusivamente el embed correspondiente. Hotmart recibió UTMs, `fbclid`, nombre, email y un identificador futuro no previsto.
- Se simuló el segundo 181: la oferta apareció, `fit4_offer_unlocked` se emitió y el clic produjo `fit4_checkout_click` sin navegar al checkout durante la prueba.

### Límite y experimento futuro
- No se cambió la lógica externa de Typeform. Hoy FIT4 sigue mostrándose solo a menores de edad; el destino debe actualizarse manualmente de `/fit4challenge-b` a `/fit4` al migrar.
- Incluir también el rango de 19 a 25 años queda como experimento futuro. Antes de activarlo se debe comparar conversión a agenda, compra FIT4 y valor por lead por edad y variante.

### Resultado esperado
- Migrar funnels a un único proyecto Vercel sin generar duplicados indexables ni perder atribución o medición.
- Mantener el desvío low ticket de menores con la VSL correcta y datos suficientes para decidir si conviene ampliar la oferta a 19–25 años.

### Deploy
No desplegado. Pendiente de Preview, validación de routing limpio y revisión de eventos en GTM/GA4 antes de producción.

## 2026-07-20 — Variante completa de Veronika: registro, tipografía y FIT4 separado

### Qué cambió
- Se creó `/casos-de-estudio-va` con la composición aprobada de Veronika y la lámina `caso-veronika.jpg`. El ZIP de Mont traía archivos DEMO que imprimían marcas dentro de los glifos; la verificación visual los rechazó y se retiraron del proyecto. Se usa Montserrat Black 900/Light 300, aprobada como reemplazo.
- El popup conserva únicamente nombre y correo. `sexo=Mujer` se fija en HTML y JavaScript, y el copy aclara “Solo para mujeres”.
- El registro sigue usando `webhook/casos-estudio`: entra a Brevo lista 14 y al Sheet LEADS, pero no crea una tarjeta en el CRM. Después continúa a `/testimonio-flor-va`; el CRM sigue recibiendo únicamente a quienes completan Typeform mediante `Typeform → Brevo → CRM`.
- Si el enlace VA llega sin UTMs, se agregan `utm_source=LANDING-VA-DIRECTO` y `utm_campaign=CASOS-VA`; nunca se pisan UTMs existentes. También viajan `funnel=VA` y `funnel_variant` para el mapeo posterior.
- El sistema Montserrat 900/300 se aplicó a `/testimonio-flor-va`, `/calendly-va` y dinámicamente a `/calendly-confirma` cuando la atribución identifica VA. Las marcas visibles de esas páginas ahora dicen Veronika Alvarado.
- Se creó `/fit4-va` como ruta fija de Veronika con su VSL `Rl_cXuqDVuhtabtp`, canonical propio y eventos `fit4_*` marcados con `fit4_variant=VA` y `funnel_variant=fit4-va`.

### SEO / GEO y medición
- Las rutas VA mantienen canonical, descripción semántica y GTM `GTM-T88G63P`; siguen en `noindex, nofollow` porque son variantes operativas y no deben competir con `/casos-de-estudio`.
- `/casos-de-estudio-va` agrega Open Graph, Twitter Card y JSON-LD de `Organization`, `Person` y `WebPage` sin inventar reseñas ni resultados cuantificados.
- `/fit4-va` reenvía a Hotmart todos los parámetros recibidos, la atribución persistida y las marcas explícitas de variante.

### Verificación
- Vercel Dev respondió `200` en `/casos-de-estudio-va`, `/testimonio-flor-va`, `/calendly-va`, `/calendly-confirma?funnel=VA` y `/fit4-va`.
- Las cinco superficies se verificaron en Chrome con viewport real de 375, 768 y 1280 px: `scrollWidth` coincidió con el viewport, Montserrat 900 cargó y no hubo excepciones JavaScript. Se eliminó el CTA móvil duplicado de Calendly VA porque tapaba la prueba social.
- El formulario se ejecutó con `fetch` interceptado para no crear un lead real. El payload llevó nombre, correo, `sexo=Mujer`, UTMs, `fbclid`, `funnel` y variante; el redirect llegó a `/testimonio-flor-va` con el `@` literal. Una segunda prueba sin UTMs generó correctamente `LANDING-VA-DIRECTO` + `CASOS-VA`.
- FIT4 VA emitió `fit4_vsl_loaded` con variante VA y construyó el checkout Hotmart con `funnel=VA`, `funnel_variant=fit4-va` y las UTMs.
- Meta Pixel mostró el bloqueo esperado de permisos sobre `localhost`; debe repetirse la comprobación de tags en un Preview Vercel autorizado antes de producción.

### Resultado esperado
- Medir el recorrido Veronika por ruta aunque una integración externa pierda una UTM opcional.
- Reducir fricción del registro femenino eliminando la pregunta de sexo sin perder segmentación en Brevo, Sheet, Typeform ni CRM posterior.
- Evitar mezclar compras o vistas FIT4 de Anthoni y Veronika al mapear el low ticket en el CRM.

### Deploy
No desplegado. Pendiente de Preview y comprobación de los eventos GTM/Meta en dominio Vercel antes de producción.

## 2026-07-22 — GENESIS privado conectado al CRM

### Qué cambió
- `/biblioteca/inicio/` conserva la selección por sexo y suma “Ya soy miembro”, reenviando `?video=` y toda la query.
- Se crearon `/biblioteca/acceso/` y `/biblioteca/verificar/` para solicitar y consumir enlaces mágicos sin contraseña.
- El registro mantiene n8n/atribución y también llama al CRM GENESIS. Solo avanza a confirmación cuando el CRM acepta el envío del correo.
- Las funciones `/api/genesis/*` hacen de proxy same-origin: el secreto interno queda en Vercel y la sesión de 30 días vive en cookie HttpOnly.
- Plan y videos exigen sesión real. La URL con correo ya no autentica y el portón anterior que aceptaba cualquier email quedó reemplazado por recuperación vía correo.
- El catálogo, la segmentación por sexo y el banner de contenido nuevo llegan desde el CMS del CRM; si el CRM no responde, el catálogo actual embebido funciona como respaldo.
- El reproductor conserva “Ver en YouTube” y envía heartbeats únicamente mientras YouTube está reproduciendo y la pestaña está visible. El check manual no suma scoring.
- `?video=ID` abre el video solicitado a miembros con plan; un lead nuevo conserva ese destino a través de registro, correo y cálculo de macros.

### Seguridad, SEO y atribución
- Todas las páginas operativas nuevas usan `noindex, nofollow`, canonical de `metodo.tr4iner.com` y el sistema tipográfico GENESIS.
- Ningún correo, nombre o token de sesión se guarda en la URL después de autenticar. El token mágico vence y se usa una sola vez en el CRM.
- Se preservan UTMs y cualquier `video` existente en los saltos. El payload n8n lleva `suppress_access_email=true` para desactivar su DOI heredado cuando se actualice ese workflow.

### Verificación
- Los scripts inline de las siete páginas Biblioteca compilan con JavaScript válido.
- Las nueve funciones proxy nuevas pasan `node --check`; `git diff --check` pasó.
- No se desplegó ni se probaron correos reales: falta enlazar Preview del funnel con Preview CRM/Neon y configurar `GENESIS_CRM_API_URL` + `GENESIS_INTERNAL_SECRET`.

### Resultado esperado
- Evitar que compartir el link comparta el expediente, medir consumo real por lead y permitir publicar contenido/avisos sin editar HTML.
- Mantener YouTube como canal abierto mientras GENESIS funciona como club privado de nutrición y calificación.

### Deploy
No desplegado. Requiere primero migración Neon Preview, secretos cruzados, ajuste n8n para no duplicar correo y prueba integral multi-dispositivo.

## 2026-07-22 — Puentes condicionales de salida para Typeform

### Qué cambió
- Se crearon `/redirectionutmstr4iner` para presupuesto de USD 100 y `/redirectionutmstr4iner2` para presupuesto de USD 300, conservando las rutas usadas actualmente en ClickFunnels.
- Se creó `/fit4challenge-b` como reemplazo transparente de la salida FIT4 actual de Typeform: campañas o marcadores VA van a `/fit4-va`; el resto va a `/fit4` de Anthoni.
- El primer puente envía `TR4INER-VA`/`CASOS-VA` al WhatsApp de VA, tráfico `MetaAds + Caso_Estudio` al WhatsApp AN con su mensaje corto y el resto al WhatsApp AN con el mensaje general.
- El segundo envía campañas VA a `/calendly-va` y el resto a `/calendly-an`, preservando la query completa. Usa el origen actual para que Preview permanezca en Preview y, tras migrar el dominio, funcione igual en `metodo.tr4iner.com`.
- FIT4 reconoce `TR4INER-VA`, `CASOS-VA`, `funnel=VA`, `funnel_variant` y cualquier valor `utm_*` donde VA sea un segmento completo, incluso al final del valor; corrige el caso que no detectaba campañas terminadas en `-VA`.
- Los tres puentes son operativos, usan `noindex, nofollow` y reemplazan el historial para que Atrás no devuelva al puente.

### Resultado esperado
- Cambiar el dominio de ClickFunnels a Vercel sin modificar las salidas condicionales de Typeform ni perder atribución.

### Deploy
Pendiente de Preview y prueba de las ramas VA, MetaAds y fallback antes de mover `metodo.tr4iner.com`.

## 2026-07-22 — Recuperación de rutas antiguas con 404 orientado a conversión

### Qué cambió
- Se creó `404.html` para que cualquier URL retirada después de la migración ofrezca tres salidas útiles: asesoría 1 a 1, plan gratuito GENESIS y casos reales.
- La asesoría abre WhatsApp con “Hola, quiero empezar.”: AN usa `17439014239` y VA usa `15677024560`.
- GENESIS recibe la query completa en `/biblioteca/inicio/`; casos reales envía AN a `/casos-de-estudio` y VA a `/casos-de-estudio-va`, también sin perder parámetros.
- La detección VA comparte la regla robusta de los puentes Typeform. Tráfico desconocido cae en AN.
- La página usa `noindex, follow`, el sistema visual canónico y los eventos `legacy_route_recovery_view` / `legacy_route_recovery_click` para medir recuperación por acción y variante.

### Resultado esperado
- Recuperar tráfico de enlaces antiguos, campañas guardadas o URLs compartidas en lugar de perderlo en un error técnico sin salida.

### Deploy
Pendiente de Preview y prueba real de una ruta inexistente antes de migrar `metodo.tr4iner.com`.

## 2026-07-22 — Confirmación de compra FIT4CHALLENGE

### Qué cambió
- Se creó `/gracias-fit4-challenge` conservando la ruta configurada en Hotmart para compras aprobadas.
- La página confirma el acceso, explica la entrega de credenciales por WhatsApp/correo y dirige a `https://club.tr4iner.com/`.
- La confirmación usa un sello circular animado y una ráfaga de confeti inline de 1.5 segundos, sin Lottie ni CDN. Se reproduce una sola vez por sesión y respeta `prefers-reduced-motion`.
- El saludo usa `first_name`, `firstName`, `name` o `nombre` cuando están disponibles. FIT4 conserva temporalmente el nombre y la variante en `sessionStorage` para cubrir el regreso desde Hotmart sin exponer datos nuevos.
- Se agregaron `fit4_thankyou_view` y `fit4_club_click`. La página no emite `Purchase`: la confirmación de pago continúa dependiendo de Hotmart para evitar duplicados por recarga.

### Resultado esperado
- Reducir dudas inmediatamente después de pagar y aumentar el ingreso efectivo al club y la evaluación inicial.

### Deploy
No desplegado. Pendiente de Preview y validación del retorno real desde una compra aprobada de Hotmart.

## 2026-07-22 — Preview integral antes de migrar `metodo.tr4iner.com`

### Consolidación y deploy
- La rama `codex/genesis-platform` se consolidó en commits separados para 10 Platos, variante VA, confirmación FIT4, routing Vercel, documentación y atribución.
- El Preview final de código quedó en `https://tr4iner-funnels-19bxprgsa-metodotr4iners-projects.vercel.app`, asociado al commit `9036570` y con target `preview`; no se promovió a producción ni se modificó DNS.
- Durante la prueba se corrigió el formulario AN para reenviar toda la query recibida, incluidos identificadores futuros, antes de sobrescribir nombre, correo y sexo con los valores validados.

### Verificación
- Las 27 superficies respondieron en el deployment final: `/` devolvió `308`, las 25 páginas públicas `200` y una ruta inexistente `404` con la página de recuperación.
- La raíz y los alias técnicos conservaron UTMs, `video`, correo y un identificador sintético futuro hasta su URL canónica.
- Las ramas Typeform quedaron comprobadas sin enviar leads reales: USD 100 selecciona el WhatsApp AN/VA correcto; USD 300 selecciona Calendly AN/VA; FIT4 selecciona la VSL AN/VA y conserva la query completa.
- Los dos PDFs, videos, mockup, imagen VA, `robots.txt`, sitemap y `attribution.js` respondieron `200` con su tipo de contenido correcto.
- Las 26 superficies HTML, incluido el 404, contienen metadata base; los 53 scripts inline compilan sin errores de sintaxis.

### Bloqueo encontrado
- El funnel Preview tiene `GENESIS_CRM_API_URL` y `GENESIS_INTERNAL_SECRET`, pero `/api/genesis/me` recibe `401 Protected deployment` al intentar llegar al CRM Preview. La protección SSO de Vercel corta la llamada antes de la API y de Neon.
- Para cerrar la prueba GENESIS hace falta habilitar un bypass de automatización en el CRM Preview y enviarlo desde el proxy del funnel, o publicar un hostname de staging protegido por el secreto interno. No se alteró esa barrera de seguridad en este paso.

### Estado
- Caso de Estudio, salidas Typeform, FIT4, 10 Platos, 404 y routing: listos en Preview.
- GENESIS: UI y funciones desplegadas, recorrido E2E detenido en la frontera Funnel Preview → CRM Preview.
- Producción y DNS: intactos.

## 2026-07-22 — Promoción de `metodo.tr4iner.com` a Producción

### Deploy
- Se promovió sin reconstruir el Preview auditado del commit `a1e2be0` al deployment productivo `dpl_5vecQACfHCsy5c357VfFqHjM3whM`.
- Vercel confirmó estado `READY`, target `production`, región `iad1` y el alias `metodo.tr4iner.com` sin errores.
- El artifact promovido conserva la auditoría previa de 27 superficies: raíz `308`, 25 páginas públicas `200` y recuperación `404`.

### DNS
- Vercel verificó `metodo.tr4iner.com` dentro del proyecto canónico `tr4iner-funnels`.
- Durante la promoción, Cloudflare DNS y Quad9 ya resolvían el CNAME de Vercel; Google DNS y el resolvedor local todavía conservaban ClickFunnels por caché.
- La disponibilidad pública puede ser mixta hasta que expire la propagación del registro anterior.

### Observabilidad y pendiente
- El escaneo de Vercel no encontró errores de ejecución en los 15 minutos posteriores a la promoción.
- Falta repetir la auditoría pública cuando todos los resolvedores entreguen Vercel y validar el recorrido dinámico completo de GENESIS contra el CRM productivo.

## 2026-07-22 — Peso tipográfico VA y retiro de imágenes ClickFunnels

### Qué cambió
- El cuerpo y la interfaz VA conservan Montserrat, pero todos los títulos usan Poppins 500 en `/casos-de-estudio-va`, `/testimonio-flor-va`, `/calendly-va`, la confirmación con contexto VA y `/fit4-va`. Biblioteca no se modificó.
- Los HTML base de las cinco superficies también declaran Poppins 500; así la identidad se mantiene al abrir un archivo local sin cargar el tema compartido.
- El avatar inferior de `/casos-de-estudio-va` usa la nueva foto de Veronika alojada en `/assets/va/vero-perfil-footer.webp`.
- Se descargaron al repositorio los once retratos del carrusel de testimonios de Calendly y la foto de Anthoni usada en Flor/Dashiel. Las páginas públicas y sus variantes B ya no cargan imágenes desde `images.clickfunnels.com` ni `statics.myclickfunnels.com`.

### Por qué
- Reducir el peso visual de la identidad VA sin cambiar familia, copy, layout ni lógica de conversión.
- Evitar que la cancelación de ClickFunnels deje imágenes rotas en el funnel servido por Vercel.

### Resultado esperado
- Una jerarquía VA menos pesada y consistente en todo su recorrido.
- Cero dependencia de la suscripción de ClickFunnels para servir imágenes del funnel.

### Verificación
- Las cinco superficies VA renderizan Poppins 500 en sus títulos a 375, 768 y 1280 px, sin overflow ni imágenes visibles rotas. La fuente 500 cargó realmente en el navegador.
- El nuevo avatar de Veronika se revisó visualmente en móvil y conserva un recorte legible dentro del círculo.
- Los trece archivos locales migrados respondieron `200` desde Vercel Dev con `image/png` o `image/webp` correcto. El repositorio quedó sin referencias activas a dominios de imágenes de ClickFunnels.
- El navegador no mostró overlays ni errores de la aplicación. Meta Pixel mantuvo únicamente el aviso esperado de permisos sobre localhost.

### Deploy
Desplegado en Producción dentro del artifact `dpl_2bnDKjAo5A8dwaPxm7sTzJvvJqaE`.

## 2026-07-22 — Formulario VA sin desplazamiento automático

### Qué cambió
- En `/testimonio-flor-va`, el Paso 2 sigue apareciendo y cargando Typeform después de 10 segundos, pero ya no desplaza la página automáticamente hacia el formulario.
- El botón flotante conserva su enlace al formulario para que el desplazamiento ocurra únicamente por acción de la usuaria.

### Resultado esperado
- Evitar interrumpir la lectura o el video cuando se habilita la aplicación, sin retrasar ni ocultar el siguiente paso.

### Deploy
Desplegado en Producción dentro del artifact `dpl_2bnDKjAo5A8dwaPxm7sTzJvvJqaE`.

## 2026-07-22 — CTA y testimonios más legibles en Calendly VA

### Qué cambió
- En `/calendly-va`, el botón principal ahora dice “Elige tu horario”.
- El nombre de cada testimonio subió de 12 a 15 px y su descripción de 11 a 14 px.

### Resultado esperado
- Hacer más directa la acción de agendar y facilitar la lectura de la prueba social antes de elegir horario.

### Verificación
- Revisado a 375, 768 y 1280 px: el texto permanece dentro de las tarjetas y la página no presenta overflow horizontal.

### Deploy
Desplegado en Producción dentro del artifact `dpl_2bnDKjAo5A8dwaPxm7sTzJvvJqaE`.

## 2026-07-22 — Fondo unificado en las páginas VA

### Qué cambió
- El tema compartido VA usa `#FAF7F2`, tomado de `/testimonio-flor-va`, como fondo común de `/casos-de-estudio-va`, `/testimonio-flor-va`, `/calendly-va`, `/fit4-va` y la variante VA de `/calendly-confirma`.
- La confirmación sin contexto VA conserva su fondo AN y Biblioteca no carga este tema.
- Los metadatos `theme-color` de Caso de Estudio VA y FIT4 VA se alinearon con el nuevo fondo.

### Resultado esperado
- Dar continuidad visual al recorrido completo de Veronika sin modificar estructura, contenido ni lógica de conversión.

### Verificación
- Las cinco superficies VA calculan `#FAF7F2`; se revisaron a 375, 768 y 1280 px sin overflow horizontal.
- `/calendly-confirma` sin parámetros VA conserva el fondo AN `#F2EEE2`.

### Deploy
Desplegado en Producción dentro del artifact `dpl_2bnDKjAo5A8dwaPxm7sTzJvvJqaE`.

## 2026-07-22 — Publicación de los ajustes VA en Producción

### Consolidación
- Se publicó la rama `codex/va-assets-vercel` en el proyecto canónico `tr4iner-funnels`, desde el commit `e6bf564`.
- El alcance incluye la migración local de imágenes de ClickFunnels, foto inferior de Veronika, títulos Poppins 500, fecha de julio, formulario sin scroll automático, CTA y testimonios legibles en Calendly VA, y fondo VA unificado.

### Verificación y promoción
- Vercel construyó el Preview `dpl_3inMs6smc2edQGgCJDKB1SPcnrEa` y confirmó target `preview` con estado `Ready`.
- Ese mismo artifact se promovió a Producción como `dpl_2bnDKjAo5A8dwaPxm7sTzJvvJqaE`, sin una reconstrucción manual distinta.
- Vercel confirmó target `production`, estado `Ready` y el alias `https://metodo.tr4iner.com`.

### Estado
Producción actualizada. No se modificaron DNS, Biblioteca ni las páginas AN fuera del tema compartido condicionado por contexto VA.

## 2026-07-22 — UTMs duplicados conservan la nomenclatura original

### Incidente
- Instagram agregó `utm_source=ig`, `utm_medium=social` y `utm_content=link_in_bio` a un enlace que ya incluía la nomenclatura editorial AN.
- La landing recorría todos los parámetros duplicados y sobrescribía cada clave con su última aparición; por eso el registro llegaba a Dashiel con `utm_source=ig`.

### Qué cambió
- `/casos-de-estudio` consolida los parámetros duplicados antes de cargar GTM, para que analítica, webhook y redirect trabajen con la misma query.
- La regla compartida en `attribution.js` conserva el primer valor no vacío de cada clave de atribución. Un valor posterior solo completa una aparición anterior vacía; los parámetros funcionales quedan fuera de esta normalización.
- El redirect a Flor/Dashiel recibe una sola copia de cada parámetro y continúa preservando identificadores futuros.

### Verificación
- Una prueba sintética con UTMs duplicados conservó `utm_source=Instagram-AN-perfil` y `utm_medium=Social`, completó el `utm_content` inicialmente vacío y produjo una URL única hacia `/testimonio-dashiel`.
- Los scripts inline y `attribution.js` compilan sin errores.

### Deploy
- Preview `dpl_2CqaQraCnRc4V9BGsuiCDpYZ78Uo` validado con target `preview` y estado `Ready`.
- Promovido sin reconstrucción manual a Producción como `dpl_WsVLwaLtLRuovTc4n5KgAe5rgWvA`.
- Vercel confirmó target `production`, estado `Ready` y el alias `https://metodo.tr4iner.com`.

## 2026-07-23 — Paso 2 visible a los tres segundos

### Qué cambió
- `/testimonio-flor`, `/testimonio-dashiel` y `/testimonio-flor-va` muestran el Paso 2 a los 3 segundos en lugar de 10.
- Los modos de prueba `tf_debug` y `trigger_seconds` mantienen su comportamiento.
- Las variantes `-B` archivadas no se modificaron.

### Resultado esperado
- Reducir la espera para iniciar la aplicación sin cambiar Typeform, atribución ni navegación.

### Deploy
- Preview `dpl_32bsUVcnBRzQvP7MBRrVpALJUmKP` validado con target `preview` y estado `Ready`.
- Promovido a Producción como `dpl_8JCaQ3x5VZuD3i4saS3MozTEnw4o`.
- Vercel confirmó target `production`, estado `Ready` y el alias `https://metodo.tr4iner.com`.

## 2026-07-23 — Paridad visual VA entre local y Producción

### Incidente
- Las pruebas abiertas con `file://` no cargaban `/assets/va/va-theme.css`; por eso local mostraba los pesos inline mientras Producción sí aplicaba el tema compartido.
- El tema forzaba metadata a Montserrat 900 y las descripciones de testimonios heredaban 900 desde el botón contenedor.

### Qué cambió
- La metadata VA, la frase destacada de Flor y el contador de FIT4 usan peso 500.
- En Calendly VA se conservan los tamaños aprobados de 15 px y 14 px, con pesos 500 y 300.
- El footer de Flor VA usa `vero-perfil-footer.webp`, con un encuadre más abierto que mantiene visible la cabeza.
- Las cinco superficies VA versionan `va-theme.css` con `?v=20260723-1` para invalidar el CSS anterior en caché.

### Verificación
- Revisado por HTTP a 375, 808 y 1280 px sin overflow horizontal.
- Verificado nuevamente sobre `https://metodo.tr4iner.com`: Flor, Calendly y FIT4 calculan los pesos nuevos y reciben el CSS versionado.

### Deploy
- Preview `dpl_DtKk6hc5fRnCHawoQ9C8vtAS7N1d` validado con target `preview` y estado `Ready`.
- Promovido a Producción como `dpl_GeWD4UpNPuxsWpfHPBxX3M3BG1kU`.
- Vercel confirmó target `production`, estado `Ready` y el alias `https://metodo.tr4iner.com`.

## 2026-07-23 — Tipografías VA preservadas entre local y Producción

### Incidente
- `va-theme.css` reemplazaba las variables tipográficas propias de cada página por Montserrat y también sobreescribía títulos, metadata y botones.
- La comparación con `file://` ocultaba esa cascada porque las rutas absolutas del tema no cargaban.

### Qué cambió
- El tema compartido VA queda limitado a fondo, colores, avatar y comportamiento común; ya no modifica familias, pesos ni tracking.
- FIT4, Flor, Calendly y la confirmación VA conservan Poppins para títulos, Instrument Sans para lectura y JetBrains Mono para metadata, contador y CTAs definidos como mono.
- Caso de Estudio VA conserva su lectura Montserrat y sus títulos Poppins, igual que en su CSS local.
- Las cinco superficies actualizan el tema a `va-theme.css?v=20260723-2` para invalidar la versión anterior en caché.

### Verificación
- Revisado por HTTP a 375, 768 y 1280 px sin overflow horizontal.
- Verificado nuevamente en `https://metodo.tr4iner.com`: las familias calculadas coinciden con local y el navegador recibe el CSS versionado.

### Deploy
- Preview `dpl_AFAmBAWmKaLvSHfZ3KZegiuhN67j` validado con target `preview` y estado `Ready`.
- Promovido a Producción como `dpl_8ZmwsnGvKMut15s62DQy1uoqf7xu`.
- Vercel confirmó target `production`, estado `Ready` y el alias `https://metodo.tr4iner.com`.

## 2026-07-23 — Metadata y modal móvil del registro VA

### Qué cambió
- `/casos-de-estudio-va` usa JetBrains Mono 500 en la firma superior, el nombre de Veronika y el pie legal.
- El nombre deja de usar Montserrat 900.
- En móvil, el formulario deja de ser un bottom sheet: aparece centrado horizontalmente en la zona superior, conserva bordes completos y usa scroll interno con overscroll contenido.

### Verificación
- Revisado por HTTP a 375, 768 y 1280 px sin overflow horizontal.
- A 375 × 812 px, la tarjeta mide 343 px, inicia a unos 31 px del borde superior y mantiene todo el formulario accesible mediante scroll.

### Deploy
- Preview `dpl_9itL4FkE21EGqMAP3SgB8ScykakH` validado con target `preview` y estado `Ready`.
- Pendiente de aprobación antes de promover a Producción.

## 2026-07-23 — Firma editorial de Veronika unificada

### Qué cambió
- Se auditaron las cinco superficies VA canónicas; solo `/casos-de-estudio-va` y `/testimonio-flor-va` incluyen una firma de autora.
- `/casos-de-estudio-va` adopta el patrón ya aprobado en Flor VA: avatar de 46 px, etiqueta “Producción · TR4INER” en JetBrains Mono y nombre en Instrument Sans con “· Coach” en tono secundario.
- Se eliminó la tercera línea descriptiva para mantener la firma compacta y consistente.

### Verificación
- Comparados los estilos calculados de ambas firmas por HTTP: etiqueta 9.5 px/400, nombre 13.5 px/500, rol 13.5 px/400 y avatar 46 × 46 px.
- Verificado en `https://metodo.tr4iner.com/casos-de-estudio-va`: tipografías, avatar, encuadre y ausencia de overflow horizontal coinciden con el Preview aprobado.

### Deploy
- Preview `dpl_DxqdukwjdJBWahM9YcZEJQHnMW9J` validado con target `preview` y estado `Ready`.
- Promovido a Producción como `dpl_HzoSWnABBwnHdBAm25zXfRjg1K1o`.
- Vercel confirmó target `production`, estado `Ready` y el alias `https://metodo.tr4iner.com`.

## 2026-07-23 — GitHub recupera la autoridad + protocolo Codex/Claude

### Qué cambió
- `main` avanzó por fast-forward de `c982aa2` a `6de12f4` (48 commits). `main`, `origin/main` y el working tree quedaron idénticos.
- Producción ya corría `e33b49c` de `codex/va-assets-vercel`; entre ese commit y la punta solo cambiaba `BITACORA.md`, así que el deployment resultante fue funcionalmente idéntico.
- Deploy de Producción `dpl_9eJ8avRUmN7VrTcWczMyuqTuqphS`, estado `Ready`, alias `metodo.tr4iner.com`, sin errores de runtime en los 30 min posteriores.
- `AGENTS.md` incorpora reglas duras de trabajo con dos agentes, el ciclo de una tarea y la tabla de fuentes oficiales.

### Por qué
Se venía promoviendo Previews desde ramas locales sin integrar `main`. Eso dejaba a Vercel por delante de GitHub: durante semanas el repo publicado no describía lo que estaba en producción, y los 48 commits de GENESIS/biblioteca existían **solo en el disco local**, sin copia en ningún remoto. Además había 9 ramas `codex/*` huérfanas donde ya no era evidente cuál era producción.

### Resultado esperado
- GitHub vuelve a ser la fuente de verdad del código publicado.
- Ningún agente trabaja directamente sobre `main` (es Production Branch: cada push publica).
- El trabajo va en ramas `work/<tarea>` compartidas por turnos entre Codex y Claude, con push obligatorio al cerrar cada turno.

### Resultado medido (completar después)
- Pendiente: limpieza de las ramas `codex/*` absorbidas y del worktree huérfano `.claude/worktrees/xenodochial-noyce-1ed3ec`, verificando cada una con `git branch --merged main` antes de borrar.

## 2026-07-23 — Placeholder de Nombre personalizado por sexo en `/biblioteca`

### Qué cambió
- `biblioteca/index.html`: el placeholder del campo Nombre de la ficha de inscripción ahora sigue el perfil de `PROFILES` (`Mujer`/`Hombre`), igual que el resto de textos del formulario (título, dek, botón).
- Mujer conserva `Ej. Veronika…`; Hombre pasa de heredar el mismo texto a `Ej. Anthoni…`.

### Por qué
El campo era el único texto de la ficha que no se personalizaba por sexo: en la ruta `/biblioteca?sexo=Hombre` el ejemplo de nombre seguía siendo "Veronika", inconsistente con el resto del copy ya adaptado (hero, dek, botón "Abrir mi GENESIS para hombres").

### Resultado esperado
- `/biblioteca?sexo=Hombre` muestra `Ej. Anthoni…` en el campo Nombre.
- `/biblioteca?sexo=Mujer` no cambia de comportamiento.

### Resultado medido
- Verificado en local (`localhost:4599`) con ambos valores de `sexo`: `document.getElementById('nombre').placeholder` devuelve `Ej. Anthoni…` y `Ej. Veronika…` respectivamente.
- Pendiente: validar en Preview de Vercel antes de aprobar promoción a Producción.

---

## 2026-07-23 — Rollout GENESIS: acceso mágico y CRM MQL

### Diagnóstico
- Producción registró cuatro `401` en `POST /api/genesis/register`.
- El registro sí llegaba a n8n, pero el proxy del funnel y el CRM tenían valores distintos de `GENESIS_INTERNAL_SECRET`; el error visible no provenía de Brevo.

### Cambios de infraestructura
- Se rotó `GENESIS_INTERNAL_SECRET` con un único valor sensible en los proyectos Vercel `tr4iner-funnels` y `crm-ventas`, para Preview y Producción, sin leerlo ni escribirlo en el repo.
- `GENESIS_CRM_API_URL` de Producción se corrigió de un Preview protegido del CRM a `https://hub.tr4iner.com`.
- El rollout conserva los deployments anteriores como rollback hasta terminar la prueba real.

### Verificación
- CRM Preview `dpl_6Uor32b4oig6BkNwVp3avmvjTZkX`: `Ready`.
- Funnel Preview `dpl_DAMzZpUmr2FTRHSWrGdYJsTLcdSh`: `Ready`; `/api/genesis/me` llegó al CRM y respondió `Sesión vencida`, la respuesta correcta sin cookie.
- CRM Producción `dpl_FG7GqynB533gM1fm4eTSKAp8Yzwz`: `Ready`, alias `https://hub.tr4iner.com`.
- Funnel Producción inicial `dpl_GmVitJw5PSm2xVr2sDbG6rKHk18t`: `Ready`. La prueba detectó que aún heredaba la URL del Preview del CRM; se corrigió la variable antes del deployment final.
- Funnel Producción final `dpl_4vur9pnqhGKJc6MmC17Q9kJG7VHH`: `Ready`, commit `7277aa5`. En `https://metodo.tr4iner.com/api/genesis/me`, una petición sin cookie responde `Sesión vencida`; un registro inválido llega al CRM y devuelve `400`, no el `401` interno anterior.
- El workflow n8n público `iMiNGcGxsmdd7nyt` se publicó en versión `555a0332-e591-4131-b546-0f1f0dbf0540` sin cambiar `biblioteca-eventos`. `biblioteca_sexo_view` quedó validado en Producción (`475698`) y un registro duplicado recorrió Data Table → CRM → Brevo (`475699`), ambos `success`.
- Vercel no registró errores runtime en funnel ni CRM durante los 30 minutos posteriores.
- Pendiente humano: repetir registro → correo mágico → acceso → regreso en otro dispositivo con autorización explícita del destinatario del correo.

---

## 2026-07-28 — Biblioteca orientada a salud + testimonios Bunny

### Qué cambió
- `/biblioteca/` deja de presentar GENESIS como una suma de bloques, sesiones y lecciones; el registro ahora parte de energía, movilidad, bienestar y señales que ya afectan la vida diaria.
- La ruta Mujer destaca a Mayra Razo y la ruta Hombre a Carlos Márquez. Ambas muestran otras seis experiencias en un índice editorial sin convertir la página en una galería estética.
- Los siete videos verticales de Bunny usan un único `<dialog>` 9:16. No existe ningún iframe al cargar: se crea después del clic y se elimina al cerrar.
- Se añadieron portadas locales optimizadas para que la prueba social no dependa del thumbnail remoto.
- El evento anónimo `biblioteca_testimonial_open` llega a `dataLayer` solo con el identificador de la historia y la ruta; no envía síntomas, diagnósticos ni datos del lead.
- El formulario conserva el webhook de n8n, `/api/genesis/register`, `suppress_access_email`, el acceso mágico y el reenvío de UTMs hacia `/biblioteca/confirma/`.

### Por qué
- Ventas reportó leads con baja conciencia y demasiada orientación estética. Las personas que compran suelen reaccionar cuando reconocen deterioro en energía, salud, movilidad, trabajo o vida familiar.
- Mostrar módulos y cantidades hacía que GENESIS se percibiera como un curso de bajo valor, en vez de una ruta privada de orientación.

### SEO / GEO
- `/biblioteca/` mantiene `noindex, nofollow`: es un paso de registro, no una página que deba competir en búsqueda.
- El canonical continúa en `https://metodo.tr4iner.com/biblioteca/` y el contenido rastreable identifica a GENESIS y TR4INER sin prometer diagnóstico, tratamiento ni curación.

### Verificación
- Scripts inline compilados y `git diff --check` sin errores.
- Matriz local Mujer/Hombre en 375, 768 y 1280 px: cero overflow horizontal, Mayra/Carlos destacados según ruta y seis historias secundarias en el orden correcto.
- Reproductor: cero iframes al cargar, uno después del clic, proporción 9:16, cierre de 44 × 44 px, limpieza del iframe y restauración del foco.
- Envío interceptado sin tocar servicios reales: payloads de n8n y GENESIS conservaron WhatsApp, sexo, `suppress_access_email` y UTMs; la confirmación recibió nombre, email, sexo y atribución.
- El cambio directo de ruta y la entrada sin `sexo` preservaron las UTMs sintéticas completas.

### Deploy
- Preview `dpl_91MLKg6AhSNX3gEh8JWCGC9nRQsH`, commit `dcd924f`, target `preview`, estado `READY` y build sin errores.
- La URL protegida se validó con acceso temporal: copy, rutas Mujer/Hombre, portadas, formulario y UTMs corresponden al commit.
- Bunny quedó autorizado para `metodo.tr4iner.com`: los siete embeds de la librería `658343` respondieron `200` con Referer de Producción.
- El alias estable de Preview todavía responde `403`; queda como pendiente de la whitelist de Bunny, pero no bloquea Producción porque el dominio público ya está validado.
- Producción `dpl_4QFjtLA7RvFwwypMVs491mnNvAsE`, commit `0162502`, target `production`, estado `READY`, build sin errores y alias `https://metodo.tr4iner.com`.
- Verificación pública con Chrome: Mayra en Mujer y Carlos en Hombre, seis historias secundarias por ruta, cero overflow, UTMs preservadas, iframe eliminado al cerrar y respuesta Bunny `200` en ambos reproductores. No se enviaron formularios ni correos.
- No hubo errores de página. El único recurso ausente observado fue el `favicon.ico` histórico (`404`), fuera del alcance de este cambio y sin impacto en el recorrido.

---

## 2026-07-28 — Recorrido GENESIS completo y señal principal privada

### Qué cambió
- `/biblioteca/inicio/`, `/biblioteca/confirma/`, `/biblioteca/plan/` y `/biblioteca/videos/` adoptan la propuesta editorial aprobada: expediente privado, punto de partida y orientaciones, sin presentarse como curso ni exhibir cantidades de módulos o lecciones.
- El test conserva objetivo, edad, altura, peso, porcentaje de grasa y actividad, pero reemplaza el multiselect anterior por una sola pregunta obligatoria: la señal que más preocupa hoy.
- El resultado mantiene el cálculo de calorías y macronutrientes, contextualiza el primer foco sin diagnosticar y muestra el descargo educativo/médico.
- La ruta privada prioriza la siguiente orientación, resume señal/base/foco, conserva catálogo CMS, YouTube público, progreso y la bisagra a Flor o Dashiel.
- Los títulos visibles del catálogo embebido y del CMS reciben una capa editorial que elimina promesas agresivas o estéticas sin cambiar IDs, videos ni administración.
- `/biblioteca/verificar/` conserva cualquier `utm_*` y los identificadores de atribución conocidos al recuperar o continuar el acceso; nunca reenvía el token mágico.
- `attribution.js` reconoce también `fbc`, `fbp`, `ttclid`, `msclkid`, `wbraid`, `gbraid` y `ctwa_clid`, para que el test, la ruta y los casos de estudio no pierdan identificadores al avanzar.

### Privacidad y compatibilidad
- La señal viaja únicamente en el `POST /api/genesis/plan` privado como `senal` y `situacion` string compatible.
- La señal no se añade a URL, UTMs, `dataLayer`, Meta ni `TR4Track`; el CTA posterior conserva identidad funcional y atribución, no la respuesta sensible.
- Se mantienen sesión HttpOnly, acceso mágico, `?video=`, rutas por sexo, progreso, anuncios y scoring en sombra.

### SEO / GEO
- Todas las rutas operativas mantienen `noindex, nofollow` y canonical bajo `https://metodo.tr4iner.com`.
- El contenido identifica a GENESIS como orientación educativa en nutrición y entrenamiento y evita promesas de diagnóstico, tratamiento o curación.

### Verificación
- Scripts inline compilados y `git diff --check` sin errores.
- Test completo validado en 375, 768 y 1280 px: cálculo, POST privado, evento sin señal, CTA sin señal, cero overflow y disclaimer visible.
- Ruta privada validada con sesión, plan, catálogo y progreso simulados: señal visible solo dentro del expediente, títulos editoriales, CTA Flor con UTMs y cero errores JavaScript.
- Recorrido de navegador repetido en 375, 768 y 1280 px: enlaces legales reales, `EMPIEZA AQUÍ` estable, `1.760 kcal` con formato editorial y atribución ampliada preservada sin filtrar la señal.
- Preview `dpl_9JCwtkA9awmzu4RcGDMWmY3DHF8X`, commit `322152e`, target `preview`, estado `READY`; el artefacto desplegado conservó la pregunta, las seis señales y el cierre del CRM sin credenciales.
- Producción coordinada: primero CRM `dpl_FVWqUSaE5mTX5fdNZRw3VCnebKzh` (`READY`) y después funnel `dpl_AZRd541mdwK6T99DMvmzgbK3h3Df` (`READY`), sin promover un Preview por fuera de `main`.
- Verificación pública en `https://metodo.tr4iner.com`: registro con siete testimonios y cero iframes iniciales, test con seis señales, descargo profesional, UTMs preservadas y proxy GENESIS respondiendo `Sesión vencida` sin cookie.
- Pendiente humano no bloqueante: completar una vez registro → correo mágico → acceso → segundo dispositivo con un destinatario real autorizado.

---

## 2026-07-28 — Meta CAPI: fbc/fbp en el funnel y evento Schedule unificado

### Qué cambió

**Funnel (este repo, rama `work/meta-capi-schedule`)**
- `attribution.js` captura los identificadores de Meta: lee la cookie `_fbp` y construye
  `fbc` desde `?fbclid` cuando la cookie `_fbc` no existe, persistiendo el timestamp del
  primer aterrizaje en `localStorage` (`tr4_fbc`).
- Las tres páginas de Typeform (`registro-typeform-flor`, `-flor-va`, `-optimizado`) no
  cargaban `attribution.js`: `window.TR4Track` no existía en ellas. Se agregó el script y
  `fbc`/`fbp` viajan ahora como hidden fields.

**n8n**
- `TR4INER Qualified Lead → Meta CAPI` (`dPHG5G4OrpYOplo8`, versión activa
  `d462947a`): envía `fbc`/`fbp` sin hashear, corrige `event_source_url` de
  `form.typeform.com` al dominio propio, y lanza error si las refs de edad/presupuesto
  del Typeform desaparecen.
- Nuevo `TR4INER Schedule → Meta CAPI` (`NzshDBl2sb13DrmQ`, **inactivo**): unifica
  Calendly directo (webhook `invitee.created`) y agendas setteadas (webhook desde el CRM)
  en el evento estándar `Schedule`. Data table `meta_capi_schedule_events`.

### Por qué
Meta reportaba EMQ 6.6/10 sobre el evento `Cliente potencial`, cobertura de eventos 0% y
deduplicación sin configurar, señalando explícitamente que el servidor no manda `fbc`.
Sin `fbc`/`fbp` el evento solo se empareja por email/teléfono hasheados.

Además, el filtro de `QualifiedLead | Typeform` compara strings exactos en español y UUIDs
de campo hardcodeados: si alguien edita el Typeform, todo se descarta en silencio. Por eso
la falla ruidosa.

El `event_source_url` apuntaba a un dominio de terceros; el Typeform está **embebido** en
las páginas propias, así que la URL de origen real es `metodo.tr4iner.com`.

### Dato relevante encontrado (medido el 28-jul, corrige una estimación previa)
Contando filas reales en `meta_capi_stripe_events` (`payment_stage='qualified_lead'`):
**393 envíos entre el 24-jul 04:01 y el 28-jul 19:26** = 4,64 días → **~85/día ≈ 2.540/mes**.
Sobre 435 ejecuciones en la misma ventana, el filtro deja pasar el **90%**.

`QualifiedLead | Typeform` no es un lead calificado: es "completó el Typeform y no es menor
de edad", medido del lado servidor. Supera en volumen al `TypeformSubmit` de navegador
(61/día) porque el evento de browser pierde ~30% por bloqueadores y salidas tempranas.

Los 128 leads calificados/mes del negocio son otra cosa: ~20x menos. Decisión pendiente de
si se ajusta el filtro o se renombra la conversión.

### Resultado esperado
EMQ del evento Lead de 6.6 hacia ~8 una vez que existan los hidden fields `fbc`/`fbp` en
Typeform. `Schedule` habilita las conversiones `Agenda | All / Calendly / Setter`.

### Publicación (29-jul-2026)

- `main` = `fd600c2`. Deployment Vercel `CvaW4L18tBEsve4DZikaPFQL6zM7`: **success**.
- El merge llegó con la rama 10+ commits atrás de `main`. `attribution.js` había sido
  modificado por `322152e` (genesis), que sumó `fbc`, `fbp` y cinco click IDs nuevos
  (`ttclid`, `msclkid`, `wbraid`, `gbraid`, `ctwa_clid`) a `UTM_KEYS`. El auto-merge
  conservó esa lista completa **y** la lógica de cookies. Diff contra `main`: 156
  inserciones, 0 borrados.

### Resultado medido

Ejecutando el `attribution.js` **servido por producción** (6334 bytes, antes 4149) con
un `fbclid` simulado, sin abrir la página para no inyectar un PageView falso al píxel:

- `?fbclid` sin cookie `_fbc` → construye `fb.1.<ts>.<fbclid>` y lo persiste en
  `tr4_fbc`.
- Segundo salto del funnel → **mismo `fbc`, mismo timestamp**. Es lo que evita que
  cada página mande un identificador distinto para el mismo clic.
- Cookie `_fbp` presente → se lee tal cual, sin hashear.
- Sin `fbclid` ni cookies → devuelve `{}`; no inventa identificadores.
- Las tres rutas (`/testimonio-flor`, `-flor-va`, `-dashiel`) cargan el script y usan
  `getMetaIds()` en producción.

### Pendiente

- Confirmar con tráfico real que los hidden fields `fbc`/`fbp` llegan a Typeform y de
  ahí a n8n: lo verificado es la construcción del identificador, no el viaje completo.
- Conversiones personalizadas `Agenda | All / Calendly / Setter` en Meta: requieren que
  primero aterrice un evento `Schedule` real.
- Confirmar el EMQ a los 7 días.
- Decidir qué hacer con `QualifiedLead | Typeform`, que dispara ~2.540 eventos/mes.

---

## 2026-07-29 — Renovación privada de exclientes por WhatsApp

### Qué cambió

- Nueva ruta `/renueva`, construida en `work/renueva`, para una campaña de Meta Ads
  dirigida a un público personalizado de exclientes.
- El primer Preview fue descartado visualmente. El rediseño aprobado como dirección usa
  fondo blanco, jerarquía más comercial y solo el logo y la foto de equipo oficiales.
- El plan anual domina la primera decisión con el copy “Ya conoces el método. Ahora
  vuelve con ventaja.”; 6 y 3 meses quedan como alternativas compactas.
- En móvil y tablet la propuesta anual aparece antes del contador para adelantar el CTA.
  En desktop, copy/contador y anual comparten el primer bloque.
- Los tres planes ofrecen 20%: 6 meses suma 15 días gratis y anual suma un mes gratis más
  una videollamada con nutricionista.
- Cada CTA abre `+51 922 551 745` con un mensaje específico para el plan elegido. No se
  publican precios porque el asesor calcula la condición desde la última membresía.
- La promoción vence el 1-ago-2026 a las 23:59:59 de Lima. El contador corrige el reloj
  local con la cabecera `Date` del servidor; al vencer elimina los tres `href` de WhatsApp.
- GTM recibe `renueva_whatsapp_click` con el plan y la atribución de `attribution.js`.
- Decisión SEO/GEO: `noindex, nofollow, noarchive`; es una ventana comercial temporal y
  no debe entrar al sitemap.

### Por qué

La página muestra todas las condiciones antes del chat para que el vendedor reciba
exclientes que ya eligieron horizonte de renovación, no consultas de curiosidad. El plan
anual funciona como ancla sin esconder las alternativas.

### Resultado esperado

- Mayor proporción de conversaciones de WhatsApp con intención explícita de renovar.
- Menos tiempo del vendedor explicando la promoción desde cero.
- Más selección del plan anual por jerarquía, bonos y CTA “Quiero activar”, sin esconder
  ni bloquear las alternativas.

### Resultado medido

- Chrome real sin overflow documental en 375, 768 y 1280 px.
- Los tres enlaces resolvieron al número y mensaje correctos.
- Prueba temporal posterior al vencimiento: la oferta completa queda oculta, se muestra
  un único cierre claro y quedan 0 enlaces de WhatsApp con `href`.
- UTMs sintéticas y `fbclid` conservaron `utm_source`, `utm_medium`, `utm_campaign`,
  `fbclid` y el `fbc` derivado.
- La foto oficial del equipo usa carga diferida y se verificó con dimensiones naturales
  `919 × 824`; el CTA anual aparece a 881 px desde el inicio en viewport móvil de 375 px.
- El Preview anterior (`dpl_8Ny8j6TjvotK3ZLvK14RdwEis8n5`) queda reemplazado por el
  rediseño del commit `c5943ae`.
- Nuevo Preview del rediseño: Vercel `dpl_C5AXHeU5goVHFrULM8Kof4rTFHfz`, commit
  `b4d0453`, target `preview`, estado **READY**.
- Producción aprobada: merge `c2ab129` en `main`; Vercel
  `dpl_6ifBohXDivoQt56gc4EVrXcHqcka`, target `production`, estado **READY** y alias
  canónico `https://metodo.tr4iner.com`.

---

## 2026-07-29 — Conceptos Meta Ads para renovación

### Qué cambió

- Se crearon seis anuncios verticales `1080 × 1350` bajo `assets/ads/renueva/`:
  reactivación emocional con el equipo, oferta directa con Anthoni, comparación de
  planes, continuidad de la experiencia, valor del plan anual y cierre de promoción.
- Los fondos editoriales fueron generados como bases sin texto, personas ni logos. La
  composición final usa el logo, la foto de Anthoni y la foto del equipo oficiales.
- `concepts.html` conserva el montaje editable y renderiza los textos de forma
  determinista para evitar errores tipográficos o rostros reinterpretados por IA.

### Por qué

Las seis rutas prueban intenciones distintas: identificación emocional, respuesta directa,
selección informada, continuidad, valor acumulado y urgencia concreta. La comparación de
planes prioriza calidad de conversación por encima de CTR al mostrar las opciones antes
del clic.

### Resultado medido

- Los seis PNG finales miden exactamente `1080 × 1350`.
- Chrome cargó todos los recursos sin excepciones; los únicos desbordes detectados son
  recortes inferiores intencionales de la foto del equipo.
- La landing `/renueva` no fue modificada; el cambio publicado incorpora únicamente los
  anuncios, sus fondos y el montaje editable.
- Preview final después de integrar el `main` vigente: commit `0bd05fa`, Vercel
  `dpl_9wANHHFV1wWncjey52nnivjmtw14`, target `preview`, estado **READY**.
- Producción aprobada: merge `0569646` en `main`; Vercel
  `dpl_AmWbBUchVYTorCvD9fBhhcQpGGMC`, target `production`, estado **READY** y alias
  canónico `https://metodo.tr4iner.com`.

---

## 2026-07-30 — Selector móvil de ruta GENESIS

### Qué cambió

- `/biblioteca/inicio/` adelanta la decisión Mujer/Hombre y elimina el bloque editorial
  duplicado que escondía ambas rutas debajo del primer viewport móvil.
- Las dos rutas pasan a ser controles oscuros de igual jerarquía, con texto de acción,
  flecha amarilla, foco visible y targets táctiles de 98 px en móvil.
- Se mantienen sin cambios `data-sexo`, `biblioteca_sexo_view`,
  `biblioteca_sexo_select`, la entrada de miembros y la propagación completa de la query.
- SEO/GEO se mantiene explícitamente como `noindex, nofollow` con canonical productivo:
  es un paso operativo del funnel, no una página que deba competir en buscadores.

### Por qué

El feedback móvil fue correcto: las filas anteriores tenían área clicable grande, pero
visualmente parecían contenido editorial. Además, el primer control empezaba debajo de un
viewport de 390 × 844. El rediseño convierte la selección en la acción dominante sin usar
un footer sticky que tape contenido o agregue una segunda mecánica de navegación.

### Resultado esperado

- Más selecciones de ruta por visita a `/biblioteca/inicio/`.
- Menor abandono antes de abrir Mujer/Hombre.
- Cero sesgo visual entre ambas rutas.

### Resultado medido

- En 375 × 844, Mujer ocupa `y=391–489` y Hombre `y=501–599`: ambas decisiones aparecen
  completas en el primer viewport.
- Sin overflow documental en 375, 768 y 1280 px; targets de 98 px en móvil y 130 px en
  tablet/desktop.
- Una query sintética con `utm_source`, `utm_medium`, `utm_campaign`, `video` y `fbclid`
  llegó completa a Mujer, Hombre y “Ya tengo acceso”; cada ruta agregó solo su `sexo`.
- Los dos scripts inline parsearon correctamente y `git diff --check` pasó.
- Preview final: commit `2a949a1`, Vercel `dpl_CtK6Vbp87uVjrnjHUz24JRrk83LU`,
  target `preview`, estado **READY**.
- Producción: merge `0a559bc`, Vercel `dpl_qgjVtv1o6BLevzzjRgGotDtmwmna`,
  target `production`, estado **READY** y alias `https://metodo.tr4iner.com`.
- El dominio canónico repitió las posiciones móviles `y=391–489` y `y=501–599`,
  preservó los UTMs en las tres salidas y no emitió errores de consola.

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
