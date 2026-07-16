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
