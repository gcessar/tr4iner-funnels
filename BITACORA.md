# Bitácora de Cambios — TR4INER Funnels

Registro de decisiones, cambios y resultados del proyecto de funnels de adquisición.  
Cada entrada incluye: qué cambió, por qué, y resultado esperado o medido.

> **Cómo leer este archivo.** Cada entrada empieza con `## AAAA-MM-DD — Título`. El
> índice de abajo lista todas por fecha, de la más nueva a la más vieja, para poder
> responder "¿qué hicimos en agosto?" sin leer 3.000 líneas. El cuerpo del archivo **no**
> está ordenado: arriba hay un bloque reciente y abajo uno cronológico desde mayo. Buscá
> por la fecha del índice, no por posición.
>
> Para filtrar un mes: `grep -n "^## 2026-08" BITACORA.md`

---

## Índice por fecha

**Septiembre 2026**

- `2026-09-01` — La ruta dice en qué paso está: rótulo del paso y botón que cambia

**Agosto 2026**

- `2026-08-31` — El botón del WhatsApp abre la ruta: entrada por `/r/<token>`
- `2026-08-30` — Las UTMs llegaban rotas a Calendly y al sheet AGENDAS: el Typeform guardaba el texto encodeado
- `2026-08-27` — `/empezar` deja de ser un redirect y pasa a ser página propia: VSL + aplicación
- `2026-08-27` — La ruta no mostraba el video arriba a quien no hizo el test
- `2026-08-26` — 47 rutas muertas de ClickFunnels dejan de ser 404, y el origen viaja con el lead
- `2026-08-26` — La ruta abre en el paso 1: sin portada, acordeón de uno y recomendación de orden
- `2026-08-25` — El test de macros se rehace: 14 cambios y una sección oculta hasta nuevo aviso
- `2026-08-25` — El popup del video muestra descripción y recursos editables desde el CMS
- `2026-08-25` — El test de macros deja de ser paso obligado: del correo se entra directo a la ruta
- `2026-08-25` — `/biblioteca/confirma/` se despeja y el correo de acceso cambia de piel
- `2026-08-25` — Médicos convierte la landing en la historia concreta de Flor (producción)
- `2026-08-22` — C gana el test de copy y pasa a servirse a todo el tráfico
- `2026-08-19` — GENESIS pasa a llamarse Ruta Tr4iner
- `2026-08-19` — Copy de la landing de GENESIS afinado desde Claude Design
- `2026-08-19` — Rango de edad en el wizard, WhatsApp al final y confirmación de dos canales
- `2026-08-17` — B gana, el funnel se uniforma y arranca el test de copy
- `2026-08-15` — A/B en D+3: B duplica registros, los pierde abajo, y el criterio cambia
- `2026-08-13` — Nueva oferta de Ruta Tr4iner en `/biblioteca/inicio/` (rama de Preview)
- `2026-08-13` — GENESIS móvil centrado en una sola orientación (producción)
- `2026-08-13` — Reproductor de GENESIS centrado en móvil (producción)
- `2026-08-11` — A/B real de `/casos-de-estudio`: variante B de salud, solo contra tráfico pago
- `2026-08-11` — Bot de WhatsApp de Vero: sin países excluidos, detección de patologías y cierre en chat
- `2026-08-10` — Especificación del A/B de `/casos-de-estudio` (sin implementar todavía)
- `2026-08-08` — El poster sale del HTML y el CTA sube al hero (PRUEBA EN CURSO: sáb 8 → dom 9)
- `2026-08-07` — Velocidad de carga en las páginas de Veronika (Rosita y Flor)
- `2026-08-07` — Typeform de `/testimonio-rosita-va/video` con el SDK
- `2026-08-07` — El tope de alto del Typeform también estaba en Flor, Flor VA y Dashiel
- `2026-08-07` — Fecha del masthead a agosto 2026 y el piso de alto que no llegaba al iframe
- `2026-08-05` — Prueba de agosto: tráfico VA a WhatsApp vs. `/fit4-va`
- `2026-08-05` — `/fit4-va` a producción · contrato de datos para CRM y n8n
- `2026-08-05` — `/fit4` toma la estructura de `/fit4-va` sin perder su piel
- `2026-08-05` — `/redirectfit4`: puente de tráfico a FIT4 por UTMs
- `2026-08-04` — `/fit4-va` pasa de VSL con muro a landing de venta completa
- `2026-08-03` — GENESIS: unidades imperiales en el test de macros
- `2026-08-03` — GENESIS: retirar salida externa a YouTube
- `2026-08-03` — GENESIS: corregir referencia masculina del 10% de grasa
- `2026-08-03` — La bisagra de GENESIS recupera la atribución desde el CRM

**Julio 2026**

- `2026-07-31` — Texto del CTA de agenda AN
- `2026-07-30` — Selector móvil de ruta GENESIS
- `2026-07-30` — Funnel VA de Rosita
- `2026-07-30` — Centrado del play en el prerregistro de Rosita
- `2026-07-30` — Nombre legible en el Typeform de Rosita
- `2026-07-29` — Renovación privada de exclientes por WhatsApp
- `2026-07-29` — Conceptos Meta Ads para renovación
- `2026-07-28` — Biblioteca orientada a salud + testimonios Bunny
- `2026-07-28` — Recorrido GENESIS completo y señal principal privada
- `2026-07-28` — Meta CAPI: fbc/fbp en el funnel y evento Schedule unificado
- `2026-07-23` — Paso 2 visible a los tres segundos
- `2026-07-23` — Paridad visual VA entre local y Producción
- `2026-07-23` — Tipografías VA preservadas entre local y Producción
- `2026-07-23` — Metadata y modal móvil del registro VA
- `2026-07-23` — Firma editorial de Veronika unificada
- `2026-07-23` — GitHub recupera la autoridad + protocolo Codex/Claude
- `2026-07-23` — Placeholder de Nombre personalizado por sexo en `/biblioteca`
- `2026-07-23` — Rollout GENESIS: acceso mágico y CRM MQL
- `2026-07-22` — GENESIS privado conectado al CRM
- `2026-07-22` — Puentes condicionales de salida para Typeform
- `2026-07-22` — Recuperación de rutas antiguas con 404 orientado a conversión
- `2026-07-22` — Confirmación de compra FIT4CHALLENGE
- `2026-07-22` — Preview integral antes de migrar `metodo.tr4iner.com`
- `2026-07-22` — Promoción de `metodo.tr4iner.com` a Producción
- `2026-07-22` — Peso tipográfico VA y retiro de imágenes ClickFunnels
- `2026-07-22` — Formulario VA sin desplazamiento automático
- `2026-07-22` — CTA y testimonios más legibles en Calendly VA
- `2026-07-22` — Fondo unificado en las páginas VA
- `2026-07-22` — Publicación de los ajustes VA en Producción
- `2026-07-22` — UTMs duplicados conservan la nomenclatura original
- `2026-07-20` — Variante completa de Veronika: registro, tipografía y FIT4 separado
- `2026-07-19` — Analítica completa del funnel Caso de Estudio
- `2026-07-19` — SEO/GEO multiruta y VSL FIT4CHALLENGE
- `2026-07-18` — Lead magnet “10 platos para perder grasa”
- `2026-07-18` — Rediseño directo del lead magnet “10 platos”
- `2026-07-16` — GENESIS: entrada por sexo y Biblioteca personalizada
- `2026-07-15` — Biblioteca: lead scoring MQL→SQL + test de macros + tracking real
- `2026-07-15` — Regularización Git y compatibilidad ClickFunnels
- `2026-07-15` — Biblioteca: test obligatorio, grasa visual y desbloqueo guiado
- `2026-07-15` — Biblioteca: interfaz de YouTube reducida sin cambiar la reproducción
- `2026-07-14` — Biblioteca: sexo automático y versión ClickFunnels 2.0
- `2026-07-14` — Arquitectura unificada en Vercel para Caso de Estudio y Programa Cero
- `2026-07-14` — Preview integral en Vercel listo para pruebas
- `2026-07-14` — Flor y Dashiel: variante A promovida a canónica
- `2026-07-14` — Línea editorial unificada en Calendly y confirmación
- `2026-07-14` — Sistema tipográfico unificado
- `2026-07-14` — Ruta pública para Flor VA
- `2026-07-14` — Testimonios unificados en Calendly AN y VA
- `2026-07-14` — Publicación integral a producción
- `2026-07-14` — Proyecto duplicado eliminado de Vercel
- `2026-07-13` — Fix: UTMs no se reenviaban a flor/dashiel + regularización de leads
- `2026-07-09` — Funnel nuevo: Videoteca TR4INER (3 páginas)
- `2026-07-09` — Concepto creativo «Programa Cero» (reescritura del funnel Videoteca)
- `2026-07-07` — Páginas de agendamiento y confirmación Calendly

**Junio 2026**

- `2026-06-08` — Atribución por video de YouTube (estilo getrevtrack)

**Mayo 2026**

- `2026-05-22` — Incidente: webhook Typeform → CRM desactivado durante ~67h
- `2026-05-18` — Setup inicial del proyecto
- `2026-05-18` — Funnel #1: Casos de Estudio (BRIDGE V3)

---

## 2026-09-01 — La ruta dice en qué paso está: rótulo del paso y botón que cambia

### Qué cambió

En `/biblioteca/videos/`, la tarjeta de la orientación recomendada estrena un rótulo amarillo:
sobre la miniatura en escritorio, montado sobre el borde de la tarjeta en teléfono. Tiene dos
estados y arrastra al botón:

- Sin ninguna orientación terminada y sin el video empezado → **«Este es el Paso 1»**, botón
  **«Ver Paso 1»**.
- En cualquier otro caso → **«Continuar viendo donde te quedaste»**, botón **«Continuar viendo»**.

El rótulo de escritorio reemplaza a «RECOMENDADO PARA TI»: ocupaba exactamente ese lugar dentro
de `.guide-visual` y dos etiquetas encimadas en la misma esquina no se leen.

Tipografía: **JetBrains Mono, versalitas, tracking abierto**, o sea la misma receta que ya usan
`RUTA ACTIVA`, `TU SIGUIENTE ENFOQUE` y el resto de los rótulos de estado de la página. El primer
intento fue Instrument Sans en caja mixta y quedaba como el único objeto de su clase fuera del
sistema. El botón sí sigue en Instrument Sans: mono para el estado, sans para la acción.

De paso se arregló un defecto anterior: entre 861 y 1000 px conviven las dos columnas del
expediente con las dos de la tarjeta, y la miniatura se aplastaba hasta **68 px de ancho**. El
rótulo viejo no lo delataba porque se salía del contenedor y quedaba recortado. En esa franja la
tarjeta ahora se apila, con la imagen arriba a 220 px.

La condición vive en `esPasoUno()` y se pinta desde `renderNextCard()`, que ya corría al entrar,
al completarse un video (≥85 %, `completarAuto`) y al marcarlo a mano (`toggleDone`). No hay
estado nuevo que guardar: sale del progreso que ya existía. Si dejó el video a medias
(`lastPositionSeconds > 5`) el rótulo también dice «continuar», porque el reproductor retoma solo
donde iba y prometer «empezar» sería mentira.

### Por qué

Quien entraba por primera vez no sabía qué se esperaba de él. La tarjeta decía «Ver esta
orientación» tanto el primer día como el décimo, así que el lead tenía que deducir en qué punto de
la ruta estaba. El rótulo nombra el paso y el botón dice la acción.

### Resultado esperado

Más aperturas del video recomendado, sobre todo en la primera sesión, y menos gente que entra,
mira la tarjeta y se va sin abrir nada.

### Resultado medido (completar después)

Pendiente.

### Verificación

Probado contra el servidor estático local con la sesión de miembro simulada por `/api/genesis/me`,
en los dos estados y a 320, 360, 390, 430, 540, 620, 650, 700, 768, 860, 880, 900, 960, 1000, 1024,
1120 y 1440 px. El relevo a los 640 px queda limpio: arriba la tarjeta de escritorio con su rótulo,
abajo la de teléfono con el suyo, sin ningún ancho que se quede sin rótulo y sin desborde
horizontal. El rótulo largo entra en **una sola línea en todos los anchos**, con dos escalones de
tamaño (10,5 px de base y 9 px por debajo de 1120 px, donde la columna de la miniatura se angosta).
Falta verificar en producción.

---

## 2026-08-31 — El botón del WhatsApp abre la ruta: entrada por `/r/<token>`

### Qué pasaba

Un registro de prueba recibió el WhatsApp de bienvenida con el botón **Ver mi Ruta** apuntando a
`https://metodo.tr4iner.com/biblioteca/https://metodo.tr4iner.com/biblioteca/acceso`. Comprobado
con `curl`: 308 → `https:/metodo…` (con una sola barra) → **404**.

Son dos fallas encimadas:

1. **La plantilla concatena.** WhatsApp sólo admite la variable al final de una URL estática, y
   la plantilla de ManyChat tiene `https://metodo.tr4iner.com/biblioteca/` como base más
   `{{ce_ruta_path}}`. Con `ce_ruta_path` guardando la URL **absoluta**
   (`https://metodo.tr4iner.com/biblioteca/acceso`), el resultado es la URL pegada dos veces.
2. **Aun sin el 404, iba al portón.** `/biblioteca/acceso/` vuelve a pedir el correo y manda otro
   enlace: quien acaba de registrarse tendría que pedir acceso de nuevo para entrar.

El token de 24 horas que resuelve esto **ya existe en el CRM** desde el 27-ago
(`POST /api/genesis/whatsapp-token`; verificado hoy: `hub.tr4iner.com` devuelve 401 sin el
secreto, o sea está desplegado y vivo). Lo que faltaba era **por dónde entra ese token**.

### Qué cambió

**Ruta nueva `/r/<token>`.** `vercel.json` la **reescribe** —no redirige— a
`/biblioteca/verificar/`, y `biblioteca/verificar/index.html` ahora lee el token del último tramo
del path además de `?token=`. El correo sigue entrando por `?token=` sin cambios.

**Por qué el token va en el path y no en la query.** WhatsApp encodea lo que se le concatena al
final de la URL del botón: un `?` llega como `%3F` y una `/` como `%2F` —el mismo `%2F` que ya
rompió el enlace el 27-ago—. El token es `base64url` (`randomBytes(32).toString("base64url")`),
o sea sólo `A-Z a-z 0-9 - _`: **no hay nada que encodear**. Es la única forma de URL que sobrevive
a la plantilla pase lo que pase con el encoding.

**El segundo clic ya no expulsa.** El token es de un solo uso, pero el botón se queda en el chat
para siempre. Antes el segundo clic mostraba «Este enlace ya no abre»; ahora `fail()` consulta
primero `/api/genesis/me` y, si la sesión de 30 días sigue viva, entra a la ruta igual.

**Fallback sin token.** Si el CRM devuelve `token: null` —no encuentra el lead—, n8n escribe
`acceso` y `/r/acceso` redirige al portón. `/r` a secas también.

### Cómo se verificó

En local, con el rewrite de Vercel simulado (copia de la página en `r/<token>/index.html` sobre el
server estático, borrada después):

- `/r/TESTTOKEN-abc_123/` dispara `POST /api/genesis/verify`. Ese POST **sólo** sale si hubo
  token, así que la extracción desde el path funciona.
- `/biblioteca/verificar/?token=…` lo sigue disparando: el camino del correo quedó intacto.
- `/biblioteca/verificar/` sin nada **no** dispara el POST y va derecho a comprobar la sesión.
- El regex `^\/r\/([A-Za-z0-9_-]+)\/?$` contra 8 casos: acepta con y sin barra final, rechaza
  `/r/`, `/r/uno/dos` y cualquier valor con `%2F`.

El rewrite en sí **sólo se comprueba en el Preview de Vercel**: `python -m http.server` no lee
`vercel.json`.

### n8n: la causa real no era la que decía la bitácora del CRM

El pendiente anotado el 27-ago —«activar `Pedir token al CRM` y corregirle la URL»— **ya estaba
resuelto**: el nodo está activo y apunta bien a `https://hub.tr4iner.com/api/genesis/whatsapp-token`.
La bitácora del CRM quedó desactualizada y mandó a buscar donde no era.

**El problema es la credencial.** El nodo autentica con **«CRM Webhook Secret»**, que manda
`x-webhook-secret` con el `WEBHOOK_SECRET`. Pero `/api/genesis/whatsapp-token` valida
`x-genesis-internal-secret` contra `GENESIS_INTERNAL_SECRET`: otro header y otro secreto. El CRM
devuelve **401**, el nodo tiene `onError: continueRegularOutput`, y la ejecución figura **en
verde** mientras el token llega vacío. Es el mismo patrón de fallo silencioso del 27-ago.

Comprobado en la ejecución `516695` (31-ago 20:21): `Pedir token al CRM` →
`401 - {"error":"No autorizado"}`; `Armar enlace de la ruta` → `tieneToken: false`;
`Escribir campos` → `success`. De los cuatro nodos del sistema que usan esa credencial, es el
único que apunta a un endpoint `/api/genesis/*`; los otros tres van a `/api/webhook/*` y
`/api/leads/sync-refund`, donde sí corresponde.

### Qué se cambió en n8n hoy

`Armar enlace de la ruta` deja de armar una URL y escribe **sólo el token**, con `acceso` de
fallback. Publicado y vivo: `versionId === activeVersionId`, contador 50 → 51. Esa comprobación
es obligatoria — n8n separa la versión guardada de la publicada, y el 27-ago un cambio quedó en
borrador mientras el workflow seguía corriendo la versión vieja sin ningún error a la vista.

### Cerrado el mismo día

**El secreto no se pudo reusar.** `GENESIS_INTERNAL_SECRET` quedó cargado en Vercel como
variable sensible: `vercel env pull` la lista con el valor vacío y el dashboard tampoco lo
muestra, en los **dos** proyectos. Se resolvió con un secreto propio de n8n
(`GENESIS_N8N_SECRET`, header `x-genesis-n8n-secret`), aceptado sólo por
`/api/genesis/whatsapp-token`. Detalle en la bitácora del CRM, entrada `2026-09-01`.

- **Producción del funnel:** merge `540b39c`. `/r/<token>` responde 200 y `/r/acceso` 307 al
  portón, los dos con el `?fbclid=…` que agrega WhatsApp intacto.
- **n8n:** `Pedir token al CRM` apunta a la credencial `GENESIS n8n Secret`; publicado,
  contador 52.
- **ManyChat:** botón con base `https://metodo.tr4iner.com/r/` y `ce_ruta_path` al final.
- **CRM:** merge `e3331ed`, deployment `Ready`.

**Verificado contra producción, no simulado:** pedir token como lo hace n8n → 43 caracteres
base64url; canjearlo por `/api/genesis/verify` → 200 con `Set-Cookie` de sesión de 30 días.

⚠️ **El `fbclid` de WhatsApp valida la decisión de poner el token en el path.** Meta le pega su
parámetro de clic al final de la URL del botón. Con `verificar/?token=XYZ` la URL habría quedado
con dos `?` y el token se habría leído como `XYZ?fbclid=…`. Con `/r/<token>`, el `fbclid` cae en
la query, no estorba, y encima viaja como atribución a la ruta.

⚠️ Si alguien renombra o borra `ce_ruta_path` en ManyChat, `Escribir campos` falla entero, el
botón sale vacío y la ejecución igual figura en verde. Anotado también en la bitácora del CRM
(27-ago).

---

## 2026-08-30 — Las UTMs llegaban rotas a Calendly y al sheet AGENDAS: el Typeform guardaba el texto encodeado

### Qué cambió

**`attribution.js`** suma dos helpers: `decodeUtmValue()` (mismo motor que `decodeUtmValue` del
CRM en `src/lib/utm.ts`) y `hiddenFieldValue()`, que prepara un valor para `data-tf-hidden`
escapando **solo la coma** —el separador del atributo— con `\,`.

**Las 6 páginas que alimentan el Typeform** (`registro-typeform-optimizado[-B]`,
`registro-typeform-flor[-B]`, `registro-typeform-flor-va`, `empezar/`) dejan de pasar los
campos ocultos por `encodeURIComponent`. Ahora van crudos, y con un decode previo por si el
valor ya venía doble-encodeado de afuera. Con eso desaparece también el parche del `%40` del
correo, que era este mismo bug visto por un solo agujero.

**Las 4 páginas de Calendly** (`calendly-an-optimizado[-B]`, `calendly-va/index[-B]`) cargan
`attribution.js` y decodifican el valor antes de ponerlo en la URL del iframe. Es la última
barrera: lo que Calendly registra ahí es lo que después aparece en el sheet AGENDAS y en el
CAPI, y de ahí ya no se puede arreglar. Cubre a quien abrió la página antes del deploy y
agenda después.

### Por qué

Las agendas de Meta Ads venían llegando al sheet con la campaña ilegible:
`%5BTR4INER%5D%20%5BCE%5D%20%5BCOLD%5D%20%5BLATAM-US-CA%5D%20%5BB3%5D%20%5BMEDICOS%5D` en vez
de `[TR4INER] [CE] [COLD] [LATAM-US-CA] [B3] [MEDICOS]`.

La causa está en el embed de Typeform: **no decodifica** lo que lee de `data-tf-hidden`. Su
parser (`embed.typeform.com/next/embed.js`) parte el atributo por comas, se queda con todo lo
que hay después del primer `=` y lo guarda **tal cual**; recién lo encodea una vez al armar la
URL de su iframe. Nuestro `encodeURIComponent` era entonces un encoding de más: Typeform
guardaba el literal `%5B…`, su redirect lo volvía a encodear (`%255B…`), y la página de
Calendly —que decodifica una vez con `URLSearchParams`— le entregaba `%5B…` a Calendly como si
fuera el nombre de la campaña.

Comprobado con datos de producción, no por deducción: en la ejecución `515330` de n8n el
`hidden` del Typeform trae `utm_campaign: "%5BTR4INER26%5D%20%5B09%5D%20…"`, y en la `515205`
el `tracking.utm_campaign` que manda Calendly trae exactamente el mismo texto.

**Alcance medido:** 70 de las 2.742 filas del sheet AGENDAS, todas desde el 8-jul-2026 —
**49 de las 114 agendas de agosto (43%)**. En el CRM, 20 leads `agenda-import` quedaron con la
campaña ilegible (5 de ellos con venta) y 49 filas de `AgendaEvent`. Una campaña que no cruza
por nombre contra el Ads Manager no suma su agenda ni su venta al ROAS de la campaña real.

El mismo bug rompía **cualquier valor con espacio o acento**: un `first_name` de "José María"
llegaba al CRM como `Jos%C3%A9%20Mar%C3%ADa` (17 leads así en julio).

### Cómo se verificó

- Simulación de la cadena entera (landing → `data-tf-hidden` → parser real de Typeform →
  redirect → página de Calendly) con el `attribution.js` de esta rama: en modo "antes"
  reproduce el texto exacto que se ve hoy en producción; en modo "después" devuelve
  `[TR4INER] [CE] [COLD] [LATAM-US-CA] [B3] [MEDICOS]`.
- Las 6 páginas servidas en local con la URL del anuncio real: `data-tf-hidden` sale limpio en
  las 6, y el parser de Typeform lee bien campaña, `utm_content` con corchetes, nombre con
  acento y correo con `@`.
- Página de Calendly cargada con una URL doble-encodeada a propósito (el caso de quien ya
  estaba navegando): el iframe recibe la campaña limpia.

### Publicado y reparado el mismo día

Merge `1e4bf2d` en `main`. Verificado en vivo sobre `metodo.tr4iner.com/testimonio-dashiel`
con la URL real del anuncio: el iframe del Typeform recibe
`utm_campaign=[TR4INER] [CE] [COLD] [LATAM-US-CA] [B3] [MEDICOS]`.

El histórico también quedó limpio, con OK del usuario: 92 celdas en 70 filas del sheet AGENDAS
(verificación posterior: 0 sucias sobre 2.742) y, del lado del CRM, 20 leads, 20 touchpoints y
49 `AgendaEvent`. Scripts y detalle en la bitácora de `crm-ventas`, entrada del 30-ago.

---

## 2026-08-27 — `/empezar` deja de ser un redirect y pasa a ser página propia: VSL + aplicación

### Qué cambió

**Página nueva `empezar/index.html`, servida en `/empezar`** (directorio + `cleanUrls`, sin
rewrite). Dos bloques y nada más: el VSL de Vidalytics `o1Hu8Smxc1TpaN4k` (embed
`IoH8SL8U`) y, debajo, el mismo bloque de aplicación de las páginas de caso de estudio —
Typeform `01KHA5RZHGV02HW971F4227939`, idéntico copy («Siguiente paso» / «Cuéntanos tu
situación, en tus propias palabras»), misma tarjeta y mismo pie.

**Se eliminó el redirect `/empezar → /biblioteca/inicio/`** de `vercel.json`. Era del rescate
de 404 del 26-ago y ahora tapaba la página. `/empezar-ads` sigue apuntando a la biblioteca:
si también tiene que caer en esta página, es un cambio de una línea.

La página **no lleva cabecera ni titular**: se probó con masthead, kicker y titular editorial,
y el usuario los sacó. El h1 del documento es el título del formulario.

### Por qué

`/empezar` es **la ruta muerta con más tráfico del proyecto**: 167 vistas y 117 usuarios en 60
días (GA4, ver entrada del 26-ago). El redirect a la biblioteca evitaba el error pero mandaba
a esa gente a un lead magnet, no a la oferta. Ahora aterrizan en video + aplicación, que es el
paso que convierte.

### Cómo se resolvió la velocidad

El pedido era máximo rendimiento de carga:

- **CSS recortado a lo que la página usa** y tipografías auto-hospedadas (0 peticiones a
  Google). Se precargan solo las dos que dibujan la primera pantalla.
- **`embed.js` de Typeform se pide recién cuando el formulario entra en pantalla**, no al
  abrir la página: mientras tanto no le compite ancho de banda al video.
- **Sin CLS**: `aspect-ratio: 16/9` reserva el alto del video y el placeholder «Cargando
  aplicación…» reserva 350px del formulario.

### La trampa del lazy-load (documentada en el código)

El `rootMargin` del IntersectionObserver **tiene que ser 0**. El auto-resize de Typeform mide
el alto del formulario cuando arranca, y si arranca con el contenedor fuera de pantalla **no
mide**: el iframe se queda clavado en el `min-height` del CSS y su layout apila el botón
«Aceptar» encima de la última opción. Medido en móvil 375px: precargando fuera de pantalla,
350px y opción C tapada; cargando en pantalla, **557px — exactamente el mismo alto que
`/testimonio-flor`**. Adelantar la carga rompe el formulario, no lo acelera.

### Atribución

Los hidden de Typeform son los mismos que en caso de estudio y se verificaron con UTMs
sintéticas: viajan todos los `utm_*`, `first_name`, `email` (con `@` literal, no `%40`),
`sexo`, `video`, `variant`, los ad ids, y el `fbc` que reconstruye TR4Track. La página además
normaliza UTMs duplicadas antes de GTM, igual que `index-fuerza.html`.

### SEO

`noindex, nofollow`: es un paso operativo del funnel, no contenido indexable.

### Resultado esperado

Los ~117 usuarios/60 días que hoy caen en la biblioteca pasan a ver el VSL y la aplicación.
Al ser una entrada sin UTMs propias, la mayoría llega sin atribución: el Typeform es el único
punto donde se los puede identificar.

### Resultado medido (completar después)

Pendiente: aplicaciones de Typeform con origen `/empezar` a 14 días.

---

## 2026-08-27 — La ruta no mostraba el video arriba a quien no hizo el test

### Qué pasaba

Un registro real entró desde el correo a `/biblioteca/videos/` y vio el índice pelado: sin la
tarjeta del video de hoy, sin el play, sin la baraja. Justo lo que se había construido el
26-ago.

**Es un descuido del cambio del 25-ago.** Ese día el test de macros dejó de ser paso obligado,
pero la recomendación siguió pidiendo plan: `renderNextCard()` cortaba con `if (!plan)` y
`setupMobileExperience()` exigía `!!plan` para encender el modo foco de móvil. Resultado: la
experiencia nueva solo existía para quien había hecho el test —que desde el 25-ago es la
minoría— y todos los demás caían en la lista.

### Qué cambió

Se quitó `plan` de las dos condiciones. Sin plan, el orden es el editorial por defecto, que
`bloquesOrdenados()` ya resolvía, y la señal cae en `prevencion` por el fallback que ya
existía. No hizo falta tocar nada más.

Verificado con sesión sin plan: en móvil aparece la miniatura con el play amarillo, «Ver
siguientes pasos» y el expediente; en escritorio, la tarjeta de recomendación con el video.

### Resultado esperado

Que el 100 % de quienes entran desde el correo vean el primer video arriba, no solo quienes
hicieron el test.

---

## 2026-08-26 — 47 rutas muertas de ClickFunnels dejan de ser 404, y el origen viaja con el lead

### El diagnóstico

GA4 (propiedad `Tr4iner`, 258197833) muestra **64 rutas distintas cayendo en el 404 en los
últimos 60 días**. Las que más pesan:

| URL rota | Vistas | Usuarios |
|---|---|---|
| `/empezar` | 167 | 117 |
| `/ofert2a-metodo` | 127 | 53 |
| `/recetas-100desayunos` | 82 | 61 |
| `/agendar-va` | 71 | 51 |
| `/gluteosfuertes-b` | 66 | 48 |
| `/macros-a` | 40 | 36 |
| `/agendar` · `/agendar-b` · `/agendar-va-b` | 100 | 69 |
| `/optin-blackfriday` | 36 | 26 |

**Las cuatro variantes de `/agendar*` suman 171 vistas y 120 usuarios**: gente que hizo clic
para agendar una llamada y encontró una página de error. Es la parte más cara del embudo.

Dos hallazgos que no eran «enlaces viejos» sino **enlaces mal publicados**:

1. `/biblioteca/inicio/utm_source=Instagram-AN-perfil&…` — **le falta el `?`**. Está así en el
   link de la bio de Instagram, en dos campañas (`GENESIS` y `Caso_Estudio`). Cada clic desde
   la bio cae en 404. El redirect lo rescata, pero **el arreglo de fondo es corregir el enlace
   publicado**: los UTMs de esos clics se pierden igual.
2. `/testimonio-rosita-va ` con un espacio al final. No se redirige —una fuente con espacio es
   frágil—; hay que corregir dónde esté publicado.

### Qué cambió

**47 redirects nuevos en `vercel.json`.** El destino es el equivalente vivo más cercano; sin
equivalente, el funnel que coincide con la intención del clic:

- Lead magnets muertos y entradas genéricas → `/biblioteca/inicio/`
- Recetas → `/10platospg`
- Ofertas y VSL → `/casos-de-estudio`
- `/agendar*` → `/calendly-an` · `/calendly-va`
- FIT4 → `/fit4` · `/fit4-va`

**Son temporales (307) a propósito.** Son slugs de campaña que se reciclan y un 308 queda
cacheado en el navegador para siempre; ninguna estaba indexada —el tráfico viene de bios,
correos y WhatsApp—, así que no hay SEO que perder. Las tres erratas de tipeo sí son
permanentes: `/medico` → `/medicos`, `/biblioteca/video/` → `/biblioteca/videos/`,
`/gracias-fit4` → `/gracias-fit4-challenge`.

`/macros-*` **no** va a `/biblioteca/plan/`: el test pide sesión de miembro y sin ella la
página carga vacía. Va a la entrada.

Se dejaron caer a propósito las rutas basura (`/adsd`, `/aosdoasod`, `/greeeasdasd`,
`/oadsad`): son bots y tipeos.

### El origen 404 ahora viaja con la persona

El `404.html` empujaba `legacy_route_recovery_view` con `missing_path` al dataLayer, pero
**nadie lo escuchaba**: se revisaron los 27 nombres de evento de la propiedad y ninguno de los
dos existe en GA4. GTM no tiene tag ni trigger. Se estaban escribiendo al vacío.

Y el enlace de recuperación reenviaba solo el query string, no la ruta que falló. Ahora:

- `404.html` agrega `ruta_404=<path>` a los dos enlaces de recuperación.
- `attribution.js` suma `ruta_404` a `UTM_KEYS`, así viaja como un identificador más.
- El CRM lo persiste en `BibliotecaLead.legacyPath` (migración
  `20260826120000_biblioteca_lead_origen_404`) y lo muestra bajo el origen del miembro.

Es **primer contacto**: volver después por un enlace sano no lo pisa.

### Resultado esperado

Recuperar los ~600 usuarios cada 60 días que hoy terminan en una página de error, y saber por
cuál enlace roto entró cada lead. El KPI es la caída de vistas del 404 y, en el panel, qué
proporción de miembros nuevos trae `legacyPath`.

### Resultado medido (completar después)

Pendiente.

---

## 2026-08-26 — La ruta abre en el paso 1: sin portada, acordeón de uno y recomendación de orden

### Qué cambió en `/biblioteca/videos/`

- **Fuera la portada.** El bloque de eyebrow + titular + bajada desapareció: la página abre
  directo en el paso 1. La cabecera queda solo con el chip de estado, alineado a la derecha.
  El foco al cerrar el reproductor pasa al índice de la ruta, que antes iba al titular.
- **Acordeón de uno a la vez.** Abrir un grupo cierra el resto. Con varios abiertos la ruta
  dejaba de leerse como secuencia y obligaba a hacer scroll para volver arriba.
- **Recomendación de orden, sin candado.** Al abrir una orientación que tiene pasos previos
  sin ver, el popup muestra un aviso —«Para entender mejor qué necesitas para tu objetivo, te
  recomendamos ver primero los pasos previos de tu ruta»— con un enlace directo al primer
  paso pendiente. **No bloquea nada:** se puede seguir con ese video.
- **Móvil, tarjeta de foco:** ahora abre con la miniatura del video y un botón de play falso
  con anillo que late. El clic lo maneja la tarjeta entera, como antes.
- **Móvil, acceso al resto:** el enlace subrayado «Ver todos los videos» pasa a ser una
  baraja en abanico con las miniaturas de las tres orientaciones siguientes, el rótulo «Ver
  siguientes pasos» y el conteo de lo que queda.

### Por qué se descartó el candado

La pedida original era bloquear cada paso hasta ver el anterior. Al revisarlo aparecieron dos
problemas: el check de «marcar como aplicada» que ya existe en cada tarjeta lo abría en dos
clics —el bloqueo no habría significado nada— y contar los pendientes daba números de dos
dígitos («hay 18 pasos anteriores»), que se lee como reproche y no como recomendación. Se
decidió recomendar en vez de obligar, y nombrar el paso concreto en vez de contar.

### La bisagra pasa a tener dos salidas

El bloque del caso de estudio deja de ser un solo CTA y pasa a ofrecer dos:

1. «¿Quieres ver cómo funciona nuestro método en la transformación completa de una persona, y
   aplicarlo en tu cambio físico?» → **Míralo aquí**, al caso de estudio de siempre
   (`/testimonio-flor` o `/testimonio-dashiel` según sexo), con toda la atribución.
2. «¿Quieres que te ayude a estar en forma?» → **Aplica a mi asesoría aquí**, a WhatsApp.

El bloque quedó **sin la placa amarilla** con el nombre del testigo y sin el eyebrow: es texto
y botón sobre negro, porque con la placa competía con el contenido de la ruta. El botón del
caso dejó de ser amarillo —sobre negro gritaba— y pasó a blanco; el de asesoría es de
contorno. Se borraron las 16 reglas de `.bridge-case`, que quedaban sin dueño.

El número es el mismo que ya usaba `404.html` para asesoría 1 a 1 (`17439014239`, el de AN).
El mensaje precargado dice «vengo de mi Ruta Tr4iner» porque es lo único que le va a decir al
equipo de dónde salió ese chat: **no se emite ningún evento nuevo** en ese clic, para no
repetir el incidente de eventos no declarados en n8n. El `bisagra_click` sigue existiendo,
sin cambios, solo en el CTA del caso.

Como el copy de las dos ofertas es fijo, `updateBridge()` dejó de reescribir eyebrow, título,
texto y etiqueta del botón. Solo sigue resolviendo el nombre de la placa y el destino.

En móvil, `mobile-profile-trigger` pasa a decir **EXPEDIENTE** en vez de «TU PUNTO DE
PARTIDA». Sigue abriendo el expediente al tocarlo.

### Móvil: aula virtual en vez de dos pantallas que se turnan

Antes, abrir la biblioteca escondía el video del día (`body.mobile-library-mode .mobile-focus
{ display: none }`) y las dos vistas se alternaban. Ahora **el paso de hoy se queda arriba**,
en versión compacta —sin eyebrow, sin titular, sin descripción ni meta—, y debajo aparece el
acordeón. El play de la miniatura pasa a amarillo.

### Vista «visto»

Sigue siendo la del sistema: 85 % del video, que es lo que marca `completedAt` en
`POST /api/genesis/progress`. El check manual no cuenta para el aviso.

### Resultado esperado

Menos fricción para llegar al primer video y un orden sugerido que no encierra la biblioteca.
El KPI es la proporción de sesiones que abren al menos un video.

### Resultado medido (completar después)

Pendiente.

---

## 2026-08-25 — El test de macros se rehace: 14 cambios y una sección oculta hasta nuevo aviso

### Qué cambió en `/biblioteca/plan/`

**Portada y cabecera**

1. El titular pasa de «Diseñemos tu punto de partida, {nombre}» a **«Vamos a personalizar tus
   macros y calorías, {nombre}»**.
2. Se retira la bajada («Reúne tu objetivo, tus números y la señal…»), y con ella sus reglas
   de CSS.
3. La cabecera **solo aparece en la primera pregunta y en el resultado**. En los pasos del
   medio empujaba la pregunta fuera de la pantalla. Se retira `renderSignalHero()`, que ya no
   tiene dónde escribir.

**Paso de objetivo**

4. Fuera el rótulo «TU OBJETIVO» y la ayuda «Esto ajusta la referencia de energía y
   macronutrientes».
5. Opciones nuevas, con símbolo a la izquierda y el tick al final: **Ganar músculo**,
   **Recomposición corporal**, **Perder grasa**. Los `data-value` (`MM`, `MA`, `PG`) **no se
   tocaron**: el cálculo de macros y el orden de la ruta dependen de ellos.

**Paso de señal**

6. La nota de privacidad pasa a **«Esto no es una evaluación médica.»**

**Números y porcentaje de grasa**

7. El paso de datos queda **solo con edad, altura y peso**, en tres columnas alineadas. Antes
   arrastraba abajo el selector de grasa y obligaba a hacer scroll.
8. El selector de grasa es ahora **un paso propio** (`data-step="grasa"`), con su propia
   validación (`#grasa-next`). El flujo pasa a `objetivo → senal → datos → grasa → actividad`.
9. El texto de ayuda dice «…permite estimar **tu porcentaje de grasa**» en vez de «tu masa
   libre de grasa».
10. Los topes (12% / 55%) van **arriba de la barra** y pegados a ella.

**Actividad**

11. «Activo» pasa a **«Entreno de 4 a 6 veces por semana»** (antes 3 a 6).

**Resultado**

12. El titular pasa a **«Estas son tus calorías y macronutrientes, {nombre}»**, y al llegar
    se lanza **confeti**. Se implementó en el propio archivo, no con una librería de CDN: son
    cuarenta líneas y la página se sirve entera inline. La física va **por tiempo
    transcurrido y no por cuadro**, para que no se congele si el navegador limita
    `requestAnimationFrame`. Respeta `prefers-reduced-motion`.
13. «Proteína» pasa a **«Proteínas»**.
14. **Se ocultan** los bloques «Lo que más te preocupa» (`.signal-result`) y «Tu ruta empieza
    así» (`.route-start`). En su lugar queda una sola línea —«Ahora te toca el paso 1 de tu
    ruta»— y el botón, que ahora dice **«Ver el paso 1 de mi ruta»**.

### Lo oculto está oculto, no borrado

Los dos bloques conservan su marcado y el JS los sigue llenando; solo llevan el atributo
`hidden`. **Reactivarlos es quitar ese atributo.** Es una decisión del 25-ago-2026 y está
**pendiente de nuevo aviso** — no es un cierre.

### Regla de trabajo que pidió el usuario

**Todo cambio que se haga en este test hay que recordárselo**, además de anotarlo acá.

### Resultado esperado

Menos abandono dentro del wizard: la portada deja de repetirse, cada pantalla tiene una sola
tarea y el paso de números entra sin scroll. El KPI es la proporción de tests iniciados que
llegan al resultado.

### Resultado medido (completar después)

Pendiente.

---

## 2026-08-25 — El popup del video muestra descripción y recursos editables desde el CMS

### Qué cambió

`/biblioteca/videos/`: el popup del reproductor deja de ser solo video + título. Debajo de la
barra aparece una ficha con la **descripción** del video y sus **recursos** —enlaces con texto,
al estilo de Skool—, ambos editables desde `/admin/genesis?tab=content` en el CRM.

- El catálogo (`/api/genesis/catalog`) ahora trae `description`, `resources` y `titleEdited`.
- **El título del CMS solo manda si alguien lo editó.** Las filas de la base guardan el título
  de YouTube, que es de captación; la página usa su mapa `EDITORIAL_TITLES`. Con `titleEdited`
  en false —el estado de todo el catálogo hoy— no cambia ni un título.
- Los enlaces se filtran otra vez en el navegador (`^https?://`), aunque el backend ya
  normaliza: la ficha llega por API y no se pinta como `href` sin revisar.
- El popup pasa a `max-height` con scroll propio (92vh en escritorio, 88vh en móvil): con
  ficha larga antes se habría salido de la pantalla.

### Por qué

Es lo que abre la puerta a mover el test de macros adentro de la ruta —como recurso de los
videos que lo ameriten— en vez de cobrarlo como peaje al confirmar el registro (ver la entrada
de hoy sobre `/verificar/`).

### Resultado esperado

Que un video pueda cerrar con un paso concreto en vez de terminar en el vacío. El KPI es el
clic en recurso sobre reproducciones, cuando se declare el evento.

### Resultado medido (completar después)

Pendiente. Hoy **no se emite ningún evento** al hacer clic en un recurso: agregar uno sin
declararlo en n8n repetiría el incidente de eventos no declarados del 25-ago.

---

## 2026-08-25 — El test de macros deja de ser paso obligado: del correo se entra directo a la ruta

### Qué cambió

Quien confirma su acceso desde el correo ya no pasa por `/biblioteca/plan/`. Entra directo a
`/biblioteca/videos/`.

- `/biblioteca/verificar/`: el destino dejó de depender de `hasPlan`. Antes,
  `hasPlan ? '/biblioteca/videos/' : '/biblioteca/plan/'`; ahora siempre la ruta.
- `/biblioteca/videos/`: el programa deja de estar detrás del plan. Antes, sin plan la página
  escondía `#program-content` entero y mostraba una tarjeta-muro («Antes de abrir tu ruta,
  necesitamos tu punto de partida») cuyo único camino era el wizard. Ahora la ruta se abre
  igual y el cálculo queda como **invitación** en el expediente: el chip pasa a decir
  «Calcular mi punto de partida →» en vez de esconderse.
- Sin plan, el expediente muestra «Sin calcular todavía · — · Elige por dónde empezar» en vez
  de quedar con los textos de un plan que no existe.
- **Bug que salió a la luz al desbloquear:** la regla `.next-card[hidden]` no aplicaba a nada
  —el botón tiene `class="priority-guide"`, no `next-card`— y el `display:grid` le ganaba al
  `hidden` del UA. Mientras el programa estuvo escondido no se notó; al abrirlo, la tarjeta
  «RECOMENDADO PARA TI» aparecía vacía. Pasa a `#next-card[hidden]`.

El orden de los bloques sin plan es el editorial por defecto (`comer → entrenar → grasa →
músculo → hormonas → sostener`); con plan sigue mandando `plan.ruta`.

### Por qué

Pedir un test de macros antes de dejar ver nada es cobrar un peaje sobre algo que se prometió
gratis, y encima en el momento de mayor intención: el clic recién hecho desde el correo. El
test no desaparece —se va a ofrecer desde adentro, como recurso de los videos que lo ameriten
(ver pendiente abajo).

### Consecuencia que hay que vigilar

Completar el test es lo que dispara, en `POST /api/genesis/plan` del CRM: `testDone`,
`objetivo`, `kcal`, `peso`, `edad`, `situacion`, **+20 de score y el salto a `stage: MQL`**.
Al dejar de ser obligatorio, **muchos menos leads van a llegar a MQL por esta vía y el
expediente va a quedar sin esos campos**. Hay que decidir qué otra señal promueve a MQL antes
de que el embudo del CRM quede leyéndose torcido.

### Pendiente que abre este cambio

Llevar el test de macros al editor de contenido del CRM (`/admin/genesis?tab=content`): poder
editar un video ya publicado para agregarle texto descriptivo debajo y recursos con URL —al
estilo Skool—, y colocar ahí el test solo en los videos elegidos.

### Resultado esperado

Más gente ve al menos una orientación en la primera sesión. El KPI es la proporción de accesos
verificados que abren un video, contra la de hoy, que primero tienen que atravesar el wizard.

### Resultado medido (completar después)

Pendiente.

---

## 2026-08-25 — `/biblioteca/confirma/` se despeja y el correo de acceso cambia de piel

### Qué cambió

La página que espera el clic en el correo (el DOI de Ruta Tr4iner) perdió todo lo que
competía con ese único clic:

- **Fuera las migas de pan** «Acceso solicitado → Correo enviado → Ruta activa», y con
  ellas sus cuatro bloques de CSS, para no dejar reglas huérfanas.
- **Fuera la etiqueta** «Expediente privado · RUTA TR4INER» de la pestaña del expediente.
- **Fuera los botones** «Abrir Gmail» y «Abrir Outlook».
- El estado **«Activación pendiente» queda centrado** y con un punto que late a 1,6 s.
  Respeta `prefers-reduced-motion`.
- El avatar del correo simulado deja de ser la inicial «A» y usa la **foto real**
  (`/assets/team/anthoni-montalvan-92.webp`, la misma de la landing).
- Dos textos: el asunto simulado pasa a «Tu Ruta Tr4iner ya está lista → empieza por
  aquí» y el kicker de ayuda, de «Si no aparece» a «¿Aún no te llegó?».

En el repo `crm-ventas`, el **correo real** que esa página simula (`src/lib/genesis-mail.ts`)
se reescribió entero: asunto nuevo idéntico al de la maqueta, cuerpo nuevo, CTA «Entrar a mi
Ruta Tr4iner», firma con la foto de Anthoni, y el remitente pasa de `equipo@tr4iner.com` a
**`asesoria@tr4iner.com`** con nombre «Anthoni Montalván». La piel deja el crema `#f6f1e7` y
Georgia serif por papel blanco, Instrument Sans y JetBrains Mono: la misma línea gráfica que
`/biblioteca/`. La plantilla la comparten los tres envíos (registro, reenvío de enlace y
campañas de contenido).

### Por qué

La página es un paso de espera, no una página de venta: cada elemento que no sea «abrí tu
correo» le resta al único acto que importa. Las migas de pan describían un recorrido que la
persona no eligió, y los botones a Gmail y Outlook mandaban a la bandeja genérica —no al
correo— y en móvil suelen caer en la versión web de un cliente que la persona no usa.

El asunto simulado y el real eran distintos, así que la maqueta perdía justamente el efecto
que la justifica: reconocer en la bandeja el correo que la página acaba de describir. Ahora
dicen lo mismo, letra por letra.

### Resultado esperado

Más clics en el enlace del correo por registro, y menos pedidos de reenvío. El KPI que
importa es la tasa de verificación (registros que llegan a `/biblioteca/verificar/` con
token válido sobre registros totales).

### Resultado medido (completar después)

Pendiente.

---

## 2026-08-22 — C gana el test de copy y pasa a servirse a todo el tráfico

Rama `work/c-ganadora`. **Cortado en D+5 de 7 por decisión del usuario**, con el test aún
sin significancia. Es el mismo patrón que el corte del 17-ago y queda asentado igual: la
evidencia favorece a C de punta a punta del embudo, pero **el tamaño real del efecto no se
conoce y ya no se va a conocer**.

### El embudo por variante (cohorte 18→22 ago)

Cohorte: los opt-ins de la ventana, seguidos hacia abajo **sin corte de fecha**. Contar cada
etapa "dentro del rango" da cero estructural en agendas y ventas, que maduran días después.

| Etapa | B (control) | C (fuerza) | C vs B |
|---|---|---|---|
| Exposiciones | 1.193 | 1.174 | −2% (SRM 50,4/49,6 ✅) |
| Registros (opt-in) | 206 | **215** | +4% |
| Typeform completos | **101** | 87 | −14% |
| Leads CRM | 29 | **33** | +14% |
| Agendas | 12 | **18** | **+50%** |
| · setter WhatsApp | 11 | 13 | +18% |
| · Calendly directo | 1 | 5 | +400% |
| Ventas | 0 | 0 | sin lectura a D+5 |

| Conversión | B | C | p |
|---|---|---|---|
| Opt-in rate | 17,3% | **18,3%** | 0,506 |
| Registro → Typeform | **49,0%** | 40,5% | 0,077 |
| Typeform → agenda | 11,9% | **20,7%** | 0,100 |
| **Agendas por 1.000 expo** | 10,06 | **15,33** | 0,251 |

**El patrón es el inverso exacto del test 1.** Allá B duplicaba registros y cada lead valía
43% menos. Acá C hace que *menos* gente complete el Typeform pero la que lo completa agenda
casi al doble: es un filtro, no una pérdida. Las dos señales más fuertes se cancelan entre sí
y ninguna cruza 0,05.

### 🔴 El 17-ago está contaminado y da vuelta el signo

Los dos tests consecutivos **reusaron la etiqueta «B»**: se estrenó cookie (`ab_ce` →
`ab_copy`) pero no el nombre del brazo. Los opt-ins del 17 previos al deploy son del test
**viejo**. La prueba: ese día hay **40 opt-ins con `variant=A`**, imposibles en el test nuevo,
y restándolos de los 117 «B» del 17 quedan ~77 contra 73 de C.

| Ventana | B | C | p |
|---|---|---|---|
| 17→22 (contaminada) | **23,1%** | 21,1% | 0,184 |
| **18→22 (limpia)** | 19,3% | **20,5%** | 0,447 |

Incluyendo el 17 gana B; excluyéndolo gana C. **Toda lectura arranca el 18.** Aprendizaje
para C vs D: **etiquetas nuevas, no sólo cookie nueva**.

### Cómo se lee un test ahora (más simple que antes)

`/api/optin` del CRM guarda `variant` como **columna de la tabla `OptIn`**, así que la
asignación al brazo sale de Neon y **no hace falta la API de Typeform para eso**. Lo que sí
hace falta de Typeform es **el teléfono**: la landing sólo pide nombre y correo, y el teléfono
es el único puente hacia las agendas de WhatsApp, que viajan sin UTMs y sin correo. Aportó 187
identidades y **las agendas atribuidas pasaron de 4/8 a 12/18** — sin ese cruce se subcontaba
más de la mitad.

⚠️ **El sheet `LEADS` no tiene columna `variant`** y nunca sirvió para leer un A/B: el
workflow n8n `9PH91FpMyNYZo3ct` no se tocó desde el 7-ago. Script repetible y de sólo lectura:
`crm-ventas/scripts/ab-copy-variant-embudo.ts`.

Control de integridad: Typeform por `hidden.variant` directo da B=100/C=86 contra B=101/C=87
del cruce por cohorte. El hidden no se pierde en los saltos.

### Qué se publicó

El rewrite de `/casos-de-estudio` pasa de `/index-salud` a `/index-fuerza` y **se elimina
`middleware.ts`**: ya no hay split y el orgánico ve lo mismo que el pago. Quien tenga cookie
`ab_copy` recibe C igual. `index-salud.html` e `index.html` quedan desplegados **sin ruta**,
así el rollback es una línea de `vercel.json`.

Se quitaron las dos lecturas de la cookie. **Dejar el evento fijo en C no alcanzaba**: leía
`ab_copy`, viva 180 días, así que un visitante con `ab_copy=B` habría emitido
`ce_copy_exposure_b` estando en la página C. Y `variant` del opt-in ahora viaja `null` como
el orgánico — marcar «B» a quien vio C es peor que no marcar nada.

### 🐞 Encontrado al publicar: la landing llevaba 5 días en `noindex`

`index-salud.html` e `index-fuerza.html` se escribieron como **variantes de test**: sin
metadatos sociales, sin JSON-LD y con `noindex`. Para una variante eso está **bien** — no debe
competir como duplicado de la ruta canónica.

El problema aparece al **promoverlas**: el `noindex` viaja con el contenido, así que
`/casos-de-estudio` quedó fuera del índice desde el 17-ago, **contradiciendo al `sitemap.xml`
que la declara**. Nadie lo notó porque el funnel vive de tráfico pago.

Arreglado en el mismo movimiento: `index, follow`, y se portaron de `index.html` los `og:`,
los `twitter:` y el JSON-LD (`Organization`, `Person`, `WebPage`, `BreadcrumbList`), adaptados
al ángulo de C. El duplicado lo resuelve el `canonical`, que ya apuntaba a la ruta pública: no
hacía falta `noindex`. `lastmod` del sitemap actualizado.

**Regla para el próximo test:** promover una variante a canónica **no es sólo cambiar el
rewrite** — hay que devolverle el paquete SEO que se le quitó por ser variante.

### 🔴 Confounder abierto: el tráfico se está desplomando otra vez

| Día | Exposiciones |
|---|---|
| 18-ago | 722 |
| 19-ago | 427 |
| 20-ago | 281 |
| 21-ago | 250 |

**−65% en tres días**, el mismo patrón que hundió la muestra del test anterior. Revisar
Business Manager antes de abrir el próximo test: sin tráfico no junta N.

### Pendiente

- **Próximo test C vs D**: cookie nueva **y** etiquetas nuevas. Esperar a que el tráfico se
  recupere.
- Las ventas de esta cohorte quedan sin leer (mediana lead→venta 3 días, 25% más de 17).
  Si se quiere saber si C sostuvo la calidad, correr el script en septiembre — pero ya sin
  brazo de control contra el cual comparar.

---

## 2026-08-19 — GENESIS pasa a llamarse Ruta Tr4iner

### Qué cambió

El producto se llama **Ruta Tr4iner**. Renombrado en todo lo que una persona lee:

- **Ocho páginas del funnel:** `/biblioteca/`, `/inicio/`, `/confirma/`,
  `/acceso/`, `/verificar/`, `/plan/`, `/videos/` y `404.html`. Títulos, meta
  descriptions, etiquetas, copy y los textos que arma el JavaScript.
- **Los dos correos de acceso** (repo `crm-ventas`): asunto, cabecera, CTA y pie.
- **Las etiquetas del panel** de administración y la entrada del menú lateral.

Caso tipográfico según contexto, como ya venía escrito en la landing:
«Ruta Tr4iner» en prosa, «RUTA TR4INER» en etiquetas mono en versalitas.

### Lo que NO se renombró, y por qué

Nada de esto lo ve un usuario, y romperlo sí se nota:

- Rutas `/api/genesis/*`, cookie `tr4_genesis_session`, variables `GENESIS_*` y
  `BREVO_GENESIS_*` configuradas en Vercel, nombres de archivo y símbolos.
- **`GENESIS_RELAY_MEDIUM = "GENESIS"`** se escribe en la base como `utmSource`,
  `funnel` y `utmCampaign`. Cambiarlo partiría la atribución en dos: las filas
  viejas seguirían diciendo GENESIS y ninguna consulta las juntaría con las
  nuevas.
- **`utm_campaign=GENESIS-Nuevo-Contenido`** viaja a GA4 y a Brevo. Renombrarlo
  corta la serie histórica de esa campaña, justo con un A/B en curso.
- **La ruta pública sigue siendo `/biblioteca/`.** Cambiarla es otra tarea:
  pide redirects, canonicals y una revisión de SEO, no un buscar y reemplazar.

### Dos ajustes que el reemplazo literal no resolvía

El kicker de `/verificar/` decía «TR4INER · GENESIS»; con el nombre nuevo
repetía la marca dos veces, así que quedó solo «RUTA TR4INER». Y los eyebrows
«GENESIS · RUTA PRIVADA» y «GENESIS · RUTA PERSONAL» decían «ruta» dos veces al
sustituir: pasan a «RUTA TR4INER · PRIVADA» y «RUTA TR4INER · PERSONAL».

### QA

Cero ocurrencias de GENESIS en el HTML servido de las ocho páginas, todas `200`
y con su título nuevo. Los scripts en línea se pasaron por el parser de Node
después del reemplazo, para descartar cadenas rotas. En el CRM, `tsc --noEmit`
limpio y 36 pruebas en verde.

### Publicación en producción

- **Funnel:** merge `4542077` → **`dpl_EKiu5ZibmDchqHQ6GCu1eSuoM2Co`**, `Ready`,
  con `https://metodo.tr4iner.com`. Verificado sin caché: cero ocurrencias de
  GENESIS en las ocho páginas y todos los títulos nuevos.
- **CRM:** merge `b94a8c6` → **`dpl_BEGQbJR1hoPE3sde6KvnZzhhGrrU`**, `Ready`,
  con `https://hub.tr4iner.com`.
- **n8n:** el sub-workflow pasa a llamarse «Ruta Tr4iner · Bienvenida
  (WhatsApp)» y el nodo llamador «Ruta Tr4iner: bienvenida por WhatsApp». Son
  etiquetas: el sub-workflow se invoca por id. Se renombró también el disparador
  `Registro de Ruta Tr4iner` y se verificó con una corrida simulada
  (`506835`) que la cadena sigue resolviendo entera.

## 2026-08-19 — Copy de la landing de GENESIS afinado desde Claude Design

### Qué cambió

Cuatro textos de `/biblioteca/inicio/`, ninguno estructural:

| Antes | Ahora |
|---|---|
| `Ya tengo acceso a GENESIS →` | `Ya tengo acceso a mi RUTA TR4INER →` |
| `¿qué opción corresponde a tu fisiología?` | `¿Eres Hombre o Mujer?` |
| `Orientación educativa… · Equipo con nutricionista y entrenadores certificados` | `Equipo con nutricionistas y entrenadores certificados` |
| `Te toma menos de 30 segundos. Sin tarjeta.` | (se retira) |

### Por qué

La entrada de miembros nombraba el producto —GENESIS— que la persona todavía no
conoce en ese punto del recorrido; ahora reconoce lo que le prometimos dos líneas
más arriba. La pregunta de sexo hablaba de *fisiología*, que es el porqué interno
de la segmentación y no la pregunta que la persona espera leer.

> **Corrección del 20-ago.** Retirar ese `<p>` dejó un bug de maquetado: era el
> único bloque entre el CTA y el enlace de miembros, y sin él los dos —ambos
> `inline-flex`— se acomodaban lado a lado en cuanto había ancho. Se arregló en
> `.text-link`, que pasó a `display: block` con `width: fit-content` centrado.
> Deployment `dpl_Eb9wdotiwvPrvDW8pFA7PwfeaQXo`.

**El microcopy es el único con riesgo real.** Bajaba la fricción justo antes del
CTA, diciendo lo que cuesta y lo que no. Si el opt-in cae en los próximos días,
es lo primero que hay que devolver.

### Cómo llegó

Editado en Claude Design, que trabaja sobre su propia copia y **no** está
conectado al repo: los cambios no aparecían en localhost ni había nada
modificado en disco. Se trajeron a mano sobre el archivo real. Importante para la
próxima: `biblioteca/inicio/index.html` son 1030 líneas —wizard de seis pasos,
captura de UTMs, payloads a n8n y al CRM—, así que **pegar encima el HTML que
exporta Design destruiría todo eso**. La copia de Design venía además de la
versión anterior de cinco pasos.

### QA local

Los cuatro textos verificados en el DOM, y el wizard intacto: seis pasos en el
orden correcto, «Paso 2 de 6», y `edad_rango` guardándose al elegir el tramo.

### Segunda pasada: el pie

También sale **«GENESIS · Orientación educativa en nutrición y entrenamiento»**
del pie, y no solo en la landing: era el mismo elemento del mismo pie en
`/biblioteca/`, `/inicio/`, `/confirma/` y `/videos/`, y quitarlo de una sola
habría dejado un pie distinto según la página. El pie es grid y fluye solo, así
que al pasar de tres hijos a dos la marca queda a la izquierda y los enlaces
legales a la derecha, sin hueco.

**Consecuencia a tener presente:** la landing se queda sin ningún encuadre de
«orientación educativa», ni visible ni en la `meta description`. Para un producto
de nutrición y entrenamiento esa línea era lo que separaba contenido educativo de
consejo médico. Si hay que declararlo, el lugar barato es la meta, que no ensucia
la página.

### Publicación en producción

Dos deployments, uno por pasada:

- Copy de la landing: merge `4c4cfad` → **`dpl_HZTRCefdDkdv2d1w55y89rWx6fZS`**.
- Pie sin bajada: merge `e6e09a0` → **`dpl_HdL6j7Kh8JThsn2UjX2HgVUDwLKL`**, el
  que hoy tiene `https://metodo.tr4iner.com`.

Verificado sobre el dominio canónico: los textos nuevos presentes, el microcopy y
la bajada del pie ausentes, las tres opciones de edad en pie, y el HTML publicado
idéntico byte por byte al local en las **cuatro** páginas.

Al verificar, las primeras respuestas del dominio todavía traían la bajada: era
caché del CDN, no un deploy incompleto. Con `?cb=<algo>` al final de la URL se
confirma el contenido real.

## 2026-08-19 — Rango de edad en el wizard, WhatsApp al final y confirmación de dos canales

### Qué cambió

`/biblioteca/inicio/` pasa de cinco preguntas a seis. Entre la situación y los
datos de contacto aparece **el rango de edad** (18 a 25 · 26 a 35 · Más de 35),
con las mismas tarjetas visuales de la pregunta de sexo y el mismo atajo por
número de teclado.

**Correo y WhatsApp cambian de orden.** Antes se pedía el WhatsApp y después el
correo; ahora primero *dónde se guarda* la ruta («¿a qué correo guardamos tu
Ruta Tr4iner?») y al final *a dónde se envía* («¿a qué WhatsApp te la
enviamos?»). El envío queda en el último paso, que es el que promete la entrega
inmediata.

`/biblioteca/confirma/` puede nombrar los dos canales con el correo y el número
reales: «Acabamos de enviarte los accesos al WhatsApp que nos diste … y de igual
forma en tu correo … te acabo de enviar un mensaje especial», más la promesa de
seguimiento del equipo.

### Por qué un rango y no la edad exacta

El número puntual ya lo pide el test de macros más adelante, donde hace falta
para calcular calorías. Pedirlo acá frena la respuesta sin cambiar la ruta. El
tramo alcanza para segmentar el catálogo.

### Decisiones que no son obvias

- **El número de WhatsApp no viaja en la URL.** La confirmación lo lee del
  registro local de la sesión (`tr4_lead`). En la query quedaría en el historial,
  en el `Referer` y en cualquier log intermedio; el correo y el nombre ya viajan
  así de antes y eso no se cambió en este turno.
- **`CANAL_WHATSAPP_ACTIVO` arranca apagado.** Mientras está en `false`, la
  confirmación dice exactamente lo que decía antes. Se enciende cuando la
  plantilla de ManyChat esté aprobada por Meta y el flow activo: prometer un
  mensaje que no llega quema el único momento en que la persona está mirando la
  pantalla.

### Contrato de datos

`edad_rango` viaja al webhook `biblioteca` de n8n y a `/api/genesis/register`
con los valores `18-25`, `26-35` y `36+`. El CRM lo guarda en
`BibliotecaLead.edadRango` y lo cruza con el sexo para segmentar el catálogo
(rama `work/genesis-rango-edad` en `crm-ventas`). Todo lo demás —`nombre`,
`email`, `sexo`, `situacion`, `situacion_text`, `video`, UTMs y `fbclid`— sigue
igual en los dos payloads.

### QA local

Recorrido completo a 375 y 1280 px con los dos `fetch` productivos interceptados:
no se creó ningún lead ni se disparó ningún correo. Los seis pasos avanzan en
orden con los contadores correctos («Paso 4 de 6» en la pregunta nueva), la
personalización por nombre se mantiene, los atajos numéricos funcionan en las dos
preguntas de opción múltiple, y `edad_rango: "26-35"` llegó a los dos payloads
junto con las UTMs y el `fbclid`. La URL de salto a `/biblioteca/confirma/`
conserva la atribución y **no** lleva el teléfono. Con el interruptor encendido,
la confirmación mostró el número y el correo reales sin desborde horizontal;
apagado, el texto es el de siempre. Cero errores de consola.

### Canal de WhatsApp: vivo

El mismo día quedó todo conectado y `CANAL_WHATSAPP_ACTIVO` pasó a `true`.

- Flow **«ENVIO de RUTA»** en la cuenta de ManyChat de Tr4iner
  (`content20260819201728_45308`). Ojo: la interfaz de ManyChat muestra el
  namespace con un prefijo de cuenta y dos guiones que **la API no acepta**.
- Sub-workflow n8n **`zIs9F846ykP5kIjt`**, que llama
  `Biblioteca → Brevo` (`abwkDFUOBL0qTTug`) desde `Normalizar payload`, sin
  esperar respuesta y tolerando el error: si ManyChat cae, el alta en Brevo y el
  correo del CRM salen igual.
- `Normalizar payload` pasó a arrastrar `edad_rango`, `situacion` y
  `situacion_text`, que antes se perdían en ese nodo.
- Verificado de punta a punta desde el webhook con las llamadas a Brevo
  simuladas (ejecución `506674`): el registro llegó completo, se escribieron los
  campos en ManyChat y el mensaje se entregó.

El detalle de los ocho defectos que aparecieron probando está en la bitácora del
CRM, entrada `2026-08-19 (3)`.

**Sólo tráfico de Anthoni.** El registro con `utm_source` que contenga `VA` no
recibe WhatsApp: se detiene a propósito en un NoOp. Escribirle desde el número de
Anthoni cruzaría las dos marcas. Cuando entre la cuenta de Veronika, ese nodo se
reemplaza por su propia cadena.

### Publicación en producción

Merge `d4c6fd2` en `main`. Vercel publicó el deployment productivo
**`dpl_7YStDBWP1DopbMH2aLmbggXt2JWJ`**, `Ready`, con `https://metodo.tr4iner.com`
entre sus aliases. Verificado sobre el dominio canónico: `/biblioteca/inicio/`
responde `200` con los seis pasos, las tres opciones de edad y el orden
correo → WhatsApp; `/biblioteca/confirma/` responde `200` con
`CANAL_WHATSAPP_ACTIVO = true`. El HTML publicado coincide byte por byte con el
local en las dos páginas.

### Pendientes

- **Migración del CRM sin aplicar.** Hasta que corra
  `pnpm db:migrate:prod --deploy`, `BibliotecaLead.edadRango` no existe y el
  `edad_rango` que manda el funnel se descarta en silencio en
  `/api/genesis/register`. **No se pierde el dato**: viaja igual al webhook de
  n8n y queda escrito en `ce_edad_rango` de ManyChat, así que es recuperable.
- Token de acceso de vida larga en el CRM: el botón del WhatsApp todavía manda a
  `/biblioteca/acceso/` porque el token del correo vive 15 minutos y un WhatsApp
  se lee horas después.
- Rotar la API key de ManyChat de Tr4iner: sigue en texto plano dentro de
  `Email CTA → ManyChat 100$`.

---

## 2026-08-17 — B gana, el funnel se uniforma y arranca el test de copy

Tres cosas en un mismo turno. Rama `work/b-ganadora-y-uniformidad`.

### 1. B declarada ganadora en D+5 — decisión de negocio, no estadística

⚠️ **Se cortó antes del horizonte previsto.** La evidencia es consistente pero **no
significativa**: agendas 15 contra 21, p≈0,30. Queda asentado que fue una decisión del
usuario por velocidad, no un resultado del test. **El tamaño real del efecto no se conoce
y ya no se va a conocer.**

Con tráfico idéntico en los dos brazos (2.542 contra 2.518 exposiciones):

| Etapa | A | B | Ventaja B |
|---|---|---|---|
| Registros | 278 | **525** | +89% |
| Typeform completos | 102 | **180** | +76% |
| Leads CRM | 31 | **57** | +84% |
| Agendas | 15 | **21** | +40% |
| Ventas (WIN) | 1 | 1 | sin lectura a D+5 |

**B nunca estuvo abajo en ninguna.** La ventaja aparece en cuatro sistemas de medición
independientes que no se hablan entre sí. Las ventas no eran legibles ni lo iban a ser:
la mediana lead→venta es 3 días y el 25% tarda más de 17.

**Cómo se publicó.** El rewrite de `/casos-de-estudio` pasa de `/index` a `/index-salud`.
Con eso, **quien tenía cookie `ab_ce` recibe lo mismo con A o con B**: nadie queda servido
una página que ya no existe. `index.html` **se queda desplegado pero sin ruta**, para poder
revertir cambiando una línea en vez de restaurar archivos — el test se cortó temprano y sin
significancia, así que el rollback tiene que ser barato.

### 2. El funnel AN uniformado al sistema de la ganadora

Fondo y tipografía de `index-salud.html` en Flor, Dashiel, Calendly AN y la confirmación.
**No es un rediseño**: estructura, copy y acentos quedan como estaban. El funnel VA queda
fuera a propósito — tiene tema propio de Veronika y uniformarlo borraría esa diferenciación.

- Crema `#F2EEE2` → blanco. Los derivados del crema pasan a neutros.
- Fraunces → Stack Sans Headline; Instrument Sans → Lexend. Se conservan los nombres
  `--serif`/`--sans` para no tocar las ~200 reglas que ya los usan.
- Las tres familias pasan a servirse desde el propio dominio: **cero peticiones a Google
  Fonts en todo el funnel**.

**Dos regresiones que causó el cambio de fondo y hubo que arreglar:**

1. **Ninguna de las dos familias trae itálica**, así que el navegador estaba inclinando las
   letras a la fuerza. Se quitaron las 10 reglas de `font-style: italic` —el color ya hacía
   el énfasis en casi todas— y se normalizó `em, i`, porque **`<em>` es itálica por defecto
   del navegador y borrar la regla CSS no alcanzaba**.
2. **El terracota `#B87355` daba 4,5:1 sobre crema y 3,74:1 sobre blanco.** Pasa a
   `#A85E40`. Y el gris de tarjeta elegido al principio (`#F4F6F8`) bajaba **todos** los
   textos de encima por debajo de AA: pasa a `#FAFBFC`.

Verificado a 375px: 0 itálicas sintéticas, 0 peticiones a Google, 0 fallos de contraste
salvo el separador decorativo `|` que ya fallaba antes. Intactos `attribution.js`, los
campos ocultos de Typeform con `variant`, `hasVaUtm` y los dos IDs de Vidalytics.

### 3. Arranca el test de COPY — B vs C, solo MetaAds

**Este sí aísla una variable.** `index-fuerza.html` es idéntico a `index-salud.html` salvo
el titular: **23.073 contra 23.088 bytes**. Si pesaran distinto se estaría midiendo
velocidad, no copy.

| | Titular |
|---|---|
| **B** (ganadora) | «Ya no es por cómo te ves. / Es la presión, el análisis que salió mal, el cansancio que no se va.» |
| **C** (retador) | «No se trata de los kilos. / Se trata de con cuánta fuerza vas a llegar a los sesenta.» |

C prueba el ángulo de **envejecer con fuerza**: tema #1 del estudio de 837 compradores
(**57%**), muy por encima de bajar grasa, y nunca probado en la landing.

⚠️ **Cookie nueva `ab_copy` con valores B/C.** No se reusa `ab_ce`: tiene valores A/B vivos
por 180 días y un visitante con `ab_ce=A` habría quedado asignado a una variante que ya no
existe. Verificado que esos visitantes entran frescos al test nuevo. Evento propio
`ce_copy_exposure_b|c` con `experiment_id: ce_copy_202608`, para no mezclar denominadores.

El orgánico ve B y no gasta lugar del experimento.

**Verificado con `vercel dev` sobre el edge real:** orgánico 8/8 a B sin cookie; MetaAds
B=10 / C=14 en 24 sin errores; cookie pegajosa 8/8 en ambas; 200 sin cabecera `Location`;
recursos de C en 200; `noindex` y canonical correctos; los dos eventos disparando con el
titular que corresponde.

### ▶ Criterio del test de copy — DECLARADO ANTES DE VER UN SOLO NÚMERO

Aprobado por el usuario el 17-ago, con el test recién publicado y cero datos a la vista.

| Rol | Métrica | Lectura |
|---|---|---|
| **Decide** | opt-in rate: registros / exposiciones | **~24-ago (D+7)** |
| **Guardarraíl** | agendas por 1.000 exposiciones | D+21 |

**Por qué el opt-in decide acá y no decidía en el test anterior.** Un titular actúa
*directamente* sobre el opt-in: es el único elemento que cambia entre los dos brazos, así
que la señal es limpia y llega rápido. Con ~1.100 exposiciones diarias, detectar un cambio
del 15% relativo toma unos 6 días. En el test anterior el opt-in no servía porque los dos
brazos diferían en estructura, formulario y peso a la vez.

**Por qué las agendas quedan como freno.** El test anterior enseñó que el opt-in puede
subir mientras la calidad cae: B duplicó registros y cada lead suyo valía 43% menos.
**Si C sube el opt-in pero hunde las agendas por 1.000, no se publica.**

Reglas que se mantienen del test anterior: no espiar y cortar al ver ventaja, empate deja
el control (que ahora es B), no decidir por CPL, no leer `form_start`, y no tocar las
campañas de Meta mientras corre.

### Pendiente

- El campo `variant` del opt-in ahora lee `ab_copy`. Los registros del orgánico van a
  llegar con `variant: null`, que es lo correcto: están fuera del experimento.

---

## 2026-08-15 — A/B en D+3: B duplica registros, los pierde abajo, y el criterio cambia

Primera lectura del A/B lanzado el 12-ago. **No es una decisión** — a D+3 el protocolo solo
habilita mirar SRM, guardarraíles y volumen. Se cambió el criterio de decisión y se documentó
por qué.

### El embudo por variante (12→15 ago)

| Etapa | A (control) | B (salud) | B/A |
|---|---|---|---|
| Exposiciones | 1.489 | 1.489 | **1,00 — SRM perfecto** |
| Registros (→VSL) | 146 | 296 | **2,03×** |
| Typeform completos | 75 | 135 | 1,80× |
| Declara $300-600 | 10 | 11 | 1,10× |
| **Agendas atribuibles** | **12** | **14** | **1,17×** |

Y las tasas, que cuentan la historia real:

| Conversión | A | B |
|---|---|---|
| Registro → Typeform | 51,4% | 45,6% |
| Typeform → agenda | **16,0%** | **10,4%** |
| Registro → agenda | **8,22%** | **4,73%** |

**Cada lead de B vale 43% menos, pero B trae el doble.** El neto queda casi empatado.

### ⚠️ Criterio de decisión NUEVO: agendas por 1.000 exposiciones

El anterior era "% de leads que declaran $300-600". **Se descarta**: A=13,3% vs B=8,1% da
p≈0,23 con n=75/135, y en absoluto es 10 contra 11. Con este volumen no decide nada.

El criterio nuevo lo propuso el usuario y es mejor porque está pegado a la caja:

- A: **8,06** agendas por 1.000 exposiciones
- B: **9,40** por 1.000 → **B ~17% más barata por agenda**

Como el split reparte tráfico idéntico, esto es directamente eficiencia por peso invertido.
Todavía es ruido (z=1,47, p≈0,14) — hacen falta ~130 agendas por brazo, o sea el mes completo.

### Cómo se cruzan las agendas con la variante (repetible)

Las agendas del setter y de ManyChat viajan **sin UTMs a propósito**, así que no se pueden
atribuir por campaña. El cruce que funciona:

1. Typeform API (`TYPEFORM_TOKEN`, form `CGxeptJu`) → índice identidad→`variant` desde el
   campo `hidden`. Clave: correo, o los últimos 9 dígitos del teléfono.
2. `AgendaEvent` del CRM (Neon) filtrado por `scheduledAt >= T0`.
3. Match por correo o teléfono.

Es el mismo mecanismo de `crm-ventas/scripts/resolver-agendas-typeform.ts`, que ya hacía
esto para `utm_term`. Fuente de las agendas: workflow n8n **`NzshDBl2sb13DrmQ`**
(*TR4INER Schedule → Meta CAPI*), que unifica Calendly + setter CRM + ManyChat y deduplica
**por cita, no por persona**.

**62 agendas desde el T0** (39 `setter_whatsapp` + 23 `calendly_direct`). Atribuibles: 26
(A=12, B=14). **36 sin atribuir (58%)** — leads previos al T0 o que nunca pasaron por la
landing. Ese punto ciego se achica solo con el tiempo, pero hay que declararlo siempre.

### El salto de línea gráfica NO es lo que frena a B

Duda del usuario: B es blanco clínico y la VSL siguiente es crema editorial. ¿Choca?
**Los datos dicen que no.**

| En la VSL | A | B |
|---|---|---|
| Rebote `/testimonio-flor` | 10,34% | **6,13%** |
| Rebote `/testimonio-dashiel` | 15,49% | **9,77%** |
| Sesiones con engagement | 87,7% | **92,5%** |
| Tiempo por sesión | **221 s** | 194 s |

Si el salto visual causara rechazo, B rebotaría **más** al aterrizar. Rebota ~40% **menos**.
La explicación que queda es **selección**: B saca fricción, entra gente que con el modal no
se hubiera registrado, y esa gente marginal es de menor intención. La pérdida no ocurre al
aterrizar, ocurre más abajo.

**Decisión: NO homogeneizar tipografías ni fondo del funnel mientras corre el test.** Dos
razones. La táctica: las VSL son compartidas por los dos brazos, tocarlas invalida el pooling
y devuelve el test a D+0. La de fondo: **homogeneizar no lo convertiría en un test de copy**
— B difiere de A en estructura, formulario inline vs modal, con/sin video, peso, redirect sin
pantalla intermedia **y** copy. Unificar fuentes no toca ninguna de esas. Un test de copy real
exige una B estructuralmente idéntica a A cambiando solo el titular, y eso es otro test.
La incoherencia visual es real y se arregla **después**, sobre la ganadora.

### Señales cualitativas a favor de B

- **«No tengo una estructura clara»**: A=18,7% → **B=30,4%**. Era el obstáculo #1 declarado
  por los compradores del estudio (44%).
- **Recomposición**: A=16,0% → **B=21,5%**. El segmento que convierte 4,60%.
- **Sobrepeso +15kg** (el que peor paga): A=76,0% → B=71,9%.
- Leads de $100: A=54, **B=104 (1,93×)**. No son basura: el estudio dice que ese segmento
  aporta 33 de 59 ventas.

### 🔴 Confounder abierto: el tráfico se desplomó

| Día | Sesiones MetaAds a `/casos-de-estudio` |
|---|---|
| 12-ago (T0) | 1.613 |
| 13-ago | 1.285 |
| **14-ago** | **426** |
| 15-ago (parcial) | 79 |

**−67% en un día.** No se pudo confirmar la inversión: el conector de Meta no devuelve las
campañas `[CE]` en ninguna cuenta consultable. **Hay que revisarlo en Business Manager.**
Sin tráfico el test no junta muestra.

### Dos bugs encontrados

1. **`variant` corrupto en 1 de 211 respuestas**: llegó como `B?fbclid=PAVERFW...`. La URL se
   concatenó mal en algún salto. No mueve el test, pero es un borde frágil.
2. **GA4 devuelve conteos de sesión distintos según qué métricas se pidan** en la misma
   consulta (296 vs 345 para B). Por eso **toda conclusión firme se ancla en Typeform y CRM**,
   que son exactos, y no en GA4.

### Correcciones a lecturas previas

- Se había estimado que el test necesitaba 180 días de muestra. **Estaba mal**: el cálculo
  salía de GA4, y **GA4 no ve el Typeform porque va embebido** (registraba 113 sesiones
  cuando hubo 506 respuestas completas). El volumen alcanza de sobra.
- **`form_start` sigue sin ser comparable** entre brazos, por construcción.

### El Typeform volvió a su primera pregunta original

El cambio del 6-ago dio peor feedback de closers y se revirtió el 15-ago. Se mantiene el campo
oculto `variant`, verificado.

**No rompe el A/B**: los dos brazos pasan por el mismo formulario al mismo tiempo, así que el
cambio los afecta igual. Es justamente lo que un split concurrente protege y un antes/después
no. **Pero no se pueden mezclar** los datos del 12-15 con los posteriores para nada que salga
de esa primera pregunta.

---

## 2026-08-11 — A/B real de `/casos-de-estudio`: variante B de salud, solo contra tráfico pago

**Rama:** `work/ce-rediseno-cro`. **PUBLICADO** el 12-ago (merge `4af1ae2`). Ver la
sección "T0 DEL EXPERIMENTO" más abajo y la entrada del 15-ago con la primera lectura.

### Qué se montó

1. **`middleware.ts` + `package.json`** — el split 50/50 en el edge que la auditoría
   pedía desde el 9-ago. Rewrite (nunca redirect), cookie pegajosa `ab_ce` de 180 días.
   `package.json` existe **solo** para poder importar `@vercel/edge`: no hay framework
   ni build step, y se agregó `"framework": null` a `vercel.json` para que Vercel no
   crea que ahora tiene que compilar algo.
2. **`index-salud.html`** — página nueva, no una variante del control. Blanco clínico +
   el amarillo TR4INER, solo titular + formulario (caso / nombre / correo) + botón.
   Sin video, sin bullets, sin barra fija, sin modal.
3. **Fuentes auto-hospedadas** — Stack Sans Headline 700 para el titular y Lexend 300
   para el resto, traídas de `design/ce-an-tipografia`. Cero peticiones a Google.

### Cierre técnico al retomar el trabajo

- El control no enviaba `variant`: los A de pago habrían quedado mezclados con histórico y
  orgánico. Ahora A y B leen la cookie; **sin cookie se guarda `null`**, porque ese usuario
  está fuera del experimento.
- No existía denominador por brazo. Ambas páginas emiten `ce_ab_exposure_a/b` en cada vista
  asignada; verificados ambos eventos en GA4 Realtime. El informe debe usar sesiones/usuarios
  que contienen el evento, no `eventCount`.
- El middleware leía sólo el primer `utm_source`; `?utm_source=&utm_source=MetaAds` quedaba
  fuera del split. Ahora replica la normalización del HTML y usa el primer valor no vacío.
- La cookie pasó de 90 a **180 días**: la muestra histórica se estima en ~138 días y una
  cookie más corta podría reasignar retornos antes del cierre.
- B ahora enfoca el primer campo inválido, anuncia errores a lectores de pantalla, corrige
  contraste de placeholders y usa enlaces legales reales. El control no se alteró fuera de
  la instrumentación necesaria del experimento.

### Por qué B solo corre contra tráfico de ads

Decisión del usuario, y los datos la respaldan: el orgánico rebota 44% y el pago 74%.
Mezclarlos diluiría justo el segmento que la prueba quiere leer. El middleware asigna
variante **únicamente** si `utm_source` contiene `ads`; el visitante orgánico ve el
control y **no gasta un lugar del experimento** (no se le pone cookie). Quien ya tiene
cookie la conserva aunque vuelva por orgánico, para que su registro no cambie de bando.

### Por qué el ángulo de salud

El corte no es estético: es para quien **ya tiene síntomas y quiere prevenir**. Lo
sostienen tres fuentes propias que coinciden:

- El prompt del bot de Vero §7.1: *"el mayor porcentaje de cierre no se da en quien
  quiere verse mejor: se da en quien ya tiene un problema de salud provocado por sus
  hábitos"*.
- El informe cualitativo de 230 llamadas: **110 señales** de salud/diabetes.
- §7.5, el patrón de "ya lo sabía" — conciencia de método sin acción.

El titular filtra a propósito («Ya no es por cómo te ves») y la bajada nombra síntomas
concretos para que quien viene solo por estética se autoexcluya antes de gastar un lead.
El registro es **absolutorio, no culpabilizador**: el informe es explícito en que el copy
que culpa repele y el que ofrece estructura convierte.

La bajada se eligió sobre cinco opciones presentadas al usuario, cada una anclada a un
dato del estudio de clientes (n=149 Typeform / 837 compradores). Ganó el ángulo de
**susto médico**: *"Primero te avisó el cansancio. Después, los números de un análisis.
Mira este caso de estudio y obtén todo lo que se aplicó para recuperar su mejor estado
físico."* Las cifras del estudio **no aparecen en la página**: mandan el registro, no
el texto — escribir "el 44% de quienes compraron…" expone las internas y suena a folleto.

⚠️ **Hallazgo que corrige una suposición previa:** el tema #1 entre compradores no es
bajar grasa ni prevenir enfermedad, es **"envejecer con fuerza e independencia" (208
compradores, 57%)**, seguido de "trabajo, estrés y vida sedentaria" (50%). El par más
frecuente combina ambos (111 casos). Queda como ángulo candidato para la próxima
iteración: hoy no se usó porque el usuario eligió el de susto médico.

⚠️ **Encuadre médico retirado a pedido del usuario.** La página llevaba *"TR4INER es un
equipo de entrenamiento y nutrición. Acompaña lo que te indique tu médico — nunca lo
reemplaza."*, derivada del límite §7.7 del prompt del bot (no diagnosticar, no prometer
revertir nada). Se quitó junto con la microcopy del CTA. Queda anotado porque el titular
sigue nombrando presión y análisis: **si el copy se acerca a prometer resultados de
salud, esa línea tiene que volver.**

### Medido

| | Control | B |
|---|---|---|
| HTML crudo | 53.407 B | **23.083 B** (−57%) |
| HTML gzip | 14.050 B | **7.867 B** (−44%) |
| Peticiones | HTML + poster WebP + 3 familias de Google | **HTML + 2 fuentes propias + avatar** |
| CTA termina en (viewport 812) | 773 px | **608 px** |
| Contraste mínimo | — | **4,66:1** (todo pasa AA) |

El CTA entra completo incluso en un viewport de 667, que es lo que le queda a un teléfono
después del navegador. Está justo: cualquier línea extra en la bajada lo empuja afuera.

### Auditoría de velocidad — el hallazgo que importa

Medido en local sobre la página terminada:

| Métrica | Antes de la auditoría | Después |
|---|---|---|
| FCP | **992 ms** | **40 ms** |
| LCP | — | **40 ms** (`p.subhead`) |
| CLS | — | **0** |
| DOM interactivo | 16 ms | 16 ms |

**La causa era la animación de entrada, y era mía.** Los elementos arrancaban en
`opacity: 0` con un fundido de 400 ms, así que no había primer pintado hasta que la
animación avanzaba — y esa animación compite por el hilo principal con los ~12 scripts
que inyecta GTM. Con el DOM interactivo a los 16 ms y el FCP a los 992, casi un segundo
entero era fundido esperando hilo. Se quitó entera. **Es la misma lección del 8-ago**
(«el titular se revelaba palabra por palabra hasta los 1,46 s»), reintroducida en versión
suave y vuelta a corregir.

**Lo que NO se puede arreglar desde esta página:** el peso real lo pone el stack de tags.
`fbevents.js` solo pesa **106.994 B** —cinco veces el HTML de B— y hay llamadas de 947 ms,
649 ms, 463 ms y 443 ms. Sigue vigente el pendiente de la auditoría de diferir los ~12
scripts de GTM; es transversal a las dos variantes, así que no sesga el test, pero es la
palanca de velocidad más grande que queda en el funnel.

**Costo de fuentes:** 71.460 B entre las dos familias, no bloqueantes (`font-display: swap`)
y cacheadas tras la primera visita. Stack Sans Headline son 31.768 B usados **solo** para
el `<h1>`. La palanca disponible es servir Lexend sola con el titular en 500; no se aplicó
porque el titular pesado es una decisión visual aprobada y el FCP ya está en 40 ms.

⚠️ **`form_start` NO es comparable entre A y B.** Ninguna de las dos lo dispara a mano: lo
emite la medición automática de GA4 al primer contacto con el formulario. En el control el
formulario vive dentro de un modal y exige un clic previo; en B está visible desde el primer
píxel. **B va a mostrar un `form_start` mucho más alto por construcción, no por persuasión.**
La lectura tiene que hacerse sobre registros reales que llegan al sheet y al CRM.

### Firma de Anthoni en el pie

Se agregó el bloque de confianza —avatar 46 px + "Producción · TR4INER" + "Anthoni
Montalván · Coach"— replicando el patrón de `/testimonio-flor` para que el recorrido no
cambie de idioma entre una página y la siguiente. Lo pide el dato: **desconfianza y
necesidad de prueba real es el 25% de los compradores**, y el informe cualitativo es
explícito en que lo que destraba esa objeción es autenticidad percibida — una cara, no
un adjetivo.

El PNG original pesaba **40.883 B para un círculo de 46 px**, más del doble que toda la
página. Se generó `anthoni-montalvan-92.webp` a 92×92 (2× para retina): **2.526 B, −94%**.
El PNG queda porque lo usa `/testimonio-flor`.

### Sin pantalla de confirmación

B **no muestra el aviso intermedio** del control (nombre + correo + contador de 3 s):
al registrarse va derecho a `/testimonio-flor` o `/testimonio-dashiel` según el caso
elegido. Es un paso menos entre el registro y el contenido.

⚠️ **Por qué esto debería conservar los leads — y qué falta probar.** El control navega
recién cuando el `fetch` a n8n resuelve; B navega de inmediato y usa `keepalive: true` en
el webhook. Se verificó que ambos POST se intentan con `keepalive` y que el destino conserva
las UTMs, pero eso **no demuestra recepción** en n8n, Sheet, Brevo y CRM. Antes de abrir
tráfico falta un smoke real desde el dominio canónico con correos únicos A/B.

Cadena de atribución verificada con UTMs sintéticas, con el webhook de producción
interceptado para no ensuciar el CRM: sobreviven los `utm_*`, `fbclid`, `h_ad_id` y
`video`; `utm_content` se rellena con el video si falta; el `@` viaja literal; Mujer va
a `/testimonio-flor` y Hombre a `/testimonio-dashiel`; `variant` llega como `"B"`.

### KPI, declarado ANTES de mirar resultados

**Decide:** leads nuevos que declaran $300-600 por exposición elegible. El porcentaje dentro
de leads es diagnóstico, no decide solo: podría mejorar mientras cae el negocio completo.
**Guardarraíles:** opt-ins/exposición (abortar si B cae más de 25% relativo) y Typeform
completados/exposición, para detectar el riesgo de *message-match*.
**Horizonte por muestra, sin espiar:** el supuesto previo de 67 leads/día no coincide con la
cohorte Meta verificada (667 en 92 días, ~7,25/día). Llegar a 1.000 tomaría cerca de 138 días
al ritmo histórico. Recalcular tras la primera semana completa; inconcluso o empate deja A.

**El CPL va a empeorar antes de que mejore la caja.** El corte de salud atrae menos
volumen a propósito. Quien decida por CPL apaga al ganador.

### Lo que esta prueba NO puede decir

B cambia copy, diseño **y peso** a la vez. Si gana, no se sabrá cuál de los tres fue.
Es el precio de probar un rediseño como paquete, y es distinto del A/B de titular, que
sí aísla una variable.

### Verificación en preview — y el bug que atajó

Preview funcional del cierre técnico: commit `eb8bf30`, deployment
`dpl_E4mnPYYWYaRDGkGur1ruKf1hDmpf`, target `preview`, estado `Ready` en 11 s:
`tr4iner-funnels-ntgo966zc-metodotr4iners-projects.vercel.app`. Está protegido por SSO;
se verificó con `vercel curl` autenticado, sin desactivar la protección: A y B forzadas en
200 sin `Location`, orgánico en control sin cookie y UTM vacía duplicada dentro del split.
**Producción no se tocó.**

**El `package.json` no dispara ningún build.** El log dice `added 1 package in 547ms`,
`Using built-in TypeScript 5.9.3`, `Build Completed in /vercel/output [2s]`. Solo instala
`@vercel/edge` y compila el middleware. Riesgo #1 descartado.

🐞 **Bug encontrado en preview: la variante nunca se subía.** `.vercelignore` excluye
`*-B.html` —el patrón de las páginas viejas archivadas— y el matcheo es insensible a
mayúsculas, así que **`index-b.html` jamás llegó al deployment**: el rewrite devolvía
**404**. De haber salido a producción, **la mitad del tráfico pago habría caído en una
página de error**. El archivo pasa a llamarse `index-salud.html`; cualquier nombre
terminado en `-b.html` tiene el mismo problema. Anotado también en
`docs/ab-casos-de-estudio.md`, que proponía justamente ese nombre.

Middleware verificado con `vercel dev`, que corre el edge y el enrutado real:

| Prueba | Resultado |
|---|---|
| Orgánico ×8 | control ×8, **cero cookies** |
| Pago ×40 | **A=15 / B=25**, 40 cookies, cero fallos |
| Cookie `B` ×10 / `A` ×10 | pegajosa, 10/10 en ambas |
| `utm_source=&utm_source=MetaAds` ×12 | 12/12 entraron al split y recibieron cookie |
| `utm_source=YouTube&utm_source=MetaAds` | gana el primer valor no vacío: control sin cookie |
| Rewrite y no redirect | **200 OK, sin cabecera `Location`** |
| Vuelve por orgánico con cookie | conserva su variante |
| Recursos de B vía rewrite | fuentes, avatar y `attribution.js` en 200 |
| `noindex` + canonical a `/casos-de-estudio` | correctos |
| GA4 Realtime | `ce_ab_exposure_a` y `ce_ab_exposure_b` recibidos; orgánico nuevo no emitió |
| Formulario B vacío | foco vuelve al primer radio y todos los inválidos quedan con `aria-invalid` |
| Typeform Flor / Dashiel | `data-tf-hidden` conserva `variant=B` / `variant=A` |

### PUBLICADO EN PRODUCCIÓN — 11-ago 2026

Merge `4af1ae2` en `main`. Deployment de producción **`tr4iner-funnels-plbmnfo1n`**,
`Ready` en 12 s. **El test está corriendo desde este momento.**

Verificado contra `https://metodo.tr4iner.com`, no contra preview:

| Prueba en producción | Resultado |
|---|---|
| Orgánico ×8 | control ×8, **cero cookies** |
| Pago ×30 | **A=14 / B=16**, cero errores |
| Cookie `B` ×8 / `A` ×8 | pegajosa, 8/8 en ambas |
| Rewrite y no redirect | **HTTP/2 200, sin cabecera `Location`** |
| Recursos de B | fuentes, avatar y `attribution.js` en 200 |
| `noindex` + canonical | correctos |
| Evento de exposición | `ce_ab_exposure_a` y `ce_ab_exposure_b` disparando en el dominio real |

La cookie se lee en el primer pintado: el `Set-Cookie` del middleware se aplica antes de
que corran los scripts, así que **la primera visita paga no pierde su exposición**.

### ▶ T0 DEL EXPERIMENTO — 12-ago 2026, 10:23 (Lima)

**El usuario confirmó el circuito completo y el test arranca a contar desde acá.** Typeform
tiene declarado el parámetro `variant` y el formulario está publicado. Verificado en vivo que
`/testimonio-flor` entrega al embed `first_name, email, sexo, variant=B, utm_source,
utm_campaign, video, fbp`.

**Calendario de lectura, fijado ANTES de ver un solo número:**

| Cuándo | Qué se mira | Para qué |
|---|---|---|
| ~19-ago (D+7) | opt-in rate | **Solo para abortar.** Si B lo hunde más de 25% relativo, se corta. No sirve para declarar ganador. |
| ~11-sep (D+30) | % de leads que declaran $300-600 (base 17,7%) | **Decide.** |
| D+30 en adelante | caja por lead | Confirma. |

**Reglas que no se negocian, escritas ahora para no discutirlas cuando haya números:**

1. **No se espía y se corta al ver una ventaja.** Con tres miradas, un test sin diferencia
   real da "ganador" ~1 de cada 5 veces. Cortar en semanas completas.
2. **Empate a los 30 días = se queda el control.**
3. **No se decide por CPL ni por volumen de registros.** El corte de salud atrae menos gente
   a propósito: el CPL empeora antes de que mejore la caja. Quien decida por CPL apaga al
   ganador.
4. **No se lee `form_start`.** B lo infla por construcción —su formulario está visible y el
   del control vive detrás de un botón—, así que la comparación no significa nada.
5. **No se tocan las campañas de Meta mientras corre.** Apagar un anuncio a mitad cambia el
   mix de tráfico y las dos mitades dejan de ser comparables. Es exactamente lo que arruinó
   la prueba del 8-ago.
6. **No se toca el titular del control** ni el peso de ninguna de las dos páginas.

### Pendiente
- El CRM no religa OptIns al reingresar un lead existente: el análisis inferencial se limita
  a **leads nuevos**. Suficiente para tráfico frío, que es el de este test.
- Sobre `6e09507` (`docs/bot-vero/*`): Codex proponía retirarlo del historial con
  `force-with-lease` por considerarlo un commit ajeno. **Se decidió no hacerlo.** No es
  ajeno: es la documentación del bot de Vero que estaba sin commitear al abrir el turno,
  es solo docs, no toca ninguna página, y su lugar natural es `main`. Reescribir historial
  publicado para sacar trabajo legítimo es más riesgoso que el desorden que corrige.
- **Riesgo de message-match:** B promete un corte de salud y la VSL de destino
  (Flor / Dashiel) está encuadrada como transformación estética. Vigilar el paso
  landing → Typeform, no solo el opt-in.
- El titular «Entrenas. Comes bien. Y el espejo sigue igual.» queda **libre** como
  retador del A/B de titular sobre el control: es un ángulo de espejo y no entra acá.
- `design/ce-an-tipografia` sigue sin publicar. Ya no está bloqueada por falta de
  instrumento —el split existe—, pero sería una tercera variante y hoy no hay tráfico
  para tres.

---

## 2026-08-11 — Bot de WhatsApp de Vero: sin países excluidos, detección de patologías y cierre en chat

**Dónde:** agente de `VERO-BOT` en n8n (`N2e6Ht6uWwER5qbD`). No se tocó ninguna página del
funnel. Prompt fuente versionado en `docs/bot-vero/prompt-v2.md`, cambios de flujo en
`docs/bot-vero/n8n-patch.md`.

**Publicado:** versión activa `eadb7ff9-6f73-4d50-bfe2-8fa7605f022a`. Rollback a
`e14a64d7-06bd-4751-9ae9-5d63ffe265c2`.

### Qué cambió

1. **Perú y Estados Unidos dejan de derivarse.** El bot atiende todos los países y cierra
   él mismo. De paso vuelve "vive en Estados Unidos" como señal de capacidad de pago —es la
   más fuerte que tenemos, 89% pagó ≥$300— que estaba desactivada justamente porque a ese
   mercado se lo derivaba.
2. **Detección de perfil de salud.** 15 señales metabólicas (insulina alta, hígado graso,
   prediabetes, tiroides, SOP, hipertensión…), profesionales de la salud, descontrol
   alimentario y el patrón "ya sabía que necesitaba entrenador y nutricionista y no lo hice".
   Más rango de edad, driver salud/estética y urgencia con disparador concreto.
3. **Score de oportunidad 0–10** con tabla explícita de puntos. No decide si vende: decide
   **con cuánta firmeza sostiene Método**. Con señal de salud se inclina al plazo largo con
   un argumento honesto —un marcador metabólico no se corrige en 90 días— en vez de bajar a
   Fit4.
4. **Sin agenda.** Se evaluó agendar en el calendario de Martín (Google Calendar + el
   webhook `crm-setter-agenda` que ya emite el `Schedule` a Meta CAPI) y se descartó: el
   enfoque es venta directa por WhatsApp. Queda documentado en el anexo en pausa del patch,
   con el cliente OAuth ya creado.
5. **`Settear variables` pasa a `continueRegularOutput`.** Bug latente que existía desde
   antes: si `setCustomFields` fallaba —por ejemplo por un campo inexistente en ManyChat—
   `Enviar WPP` no corría y **el lead se quedaba sin respuesta**.
6. **`Separar en partes` deja de usar el prefijo telefónico como país.** Un lead sin el
   campo `País` cargado le llegaba al agente como `pais: "51"`, y el bot lo tomaba por país
   confirmado y no volvía a preguntarlo.

### Por qué

El estudio interno y el feedback de closers coinciden: el mayor porcentaje de cierre no está
en quien quiere verse mejor, sino en quien ya tiene un problema de salud provocado por sus
hábitos y en quien vive descontrol con la comida. Gente que hacía tiempo sabía que necesitaba
método y no actuó hasta que la salud se movió. El prompt anterior trataba esos casos como
delicados y tendía a esquivarlos; ahora son el perfil que sostiene el ticket alto.

### Resultado esperado

Más leads atendidos (dos mercados que antes se derivaban), y mix de producto desplazado hacia
Método y plazos largos en el segmento de salud. El guardarraíl es el opt-in a venta: si sube
el volumen y cae la tasa de cierre, el problema es de calificación, no de alcance.

### Incidente el mismo día, 18:40–18:55 UTC — el bot dejó de responder

Dos ejecuciones en `success` y cero respuestas al lead. `setCustomFields` de ManyChat es
**todo o nada**: rechazó el array completo por `Field[3] not found` (`Requiere Humano`, sin
crear), y como el texto que lee el lead viaja dentro de `Parte 1`, ese campo nunca se
escribió y el flow disparó vacío.

El `onError: continueRegularOutput` del punto 5 no alcanzó, y vale anotar por qué: protege al
workflow de caerse, pero no sirve cuando lo que no se pudo escribir **es el mensaje**.

**Fix (versión activa `3f3fc990-f6db-4bed-a5ee-1727b4163fe4`):** `Respuesta` ahora emite dos
arrays y el flujo hace dos llamadas. `fields` —`Parte 1..3` más los 6 campos que ya existían—
va antes de `Enviar WPP`. `fields_nuevos` —los 12 del prompt v2— va en un nodo nuevo,
`Settear cualificacion`, **después** de enviar el mensaje y con `continueRegularOutput`. Un
campo de analítica ya no puede costar una conversación.

Regla que queda: todo `field_name` nuevo entra por `fields_nuevos`. Pasa a la llamada crítica
solo después de estar creado y verificado en ManyChat.

### Pendiente

- **Crear los 12 campos personalizados en ManyChat** (`Ciudad`, `Zona Horaria`, `Rango Edad`,
  `Driver`, `Senales Salud`, `Profesional Salud`, `Ansiedad Comida`, `Bandera Clinica`,
  `Score`, `Prioridad`, `Requiere Humano`, `Motivo Handoff`). Hasta que existan, la detección
  funciona pero no se persiste. Ya no bloquea la respuesta al lead tras el fix del incidente.
- **Usar `Prioridad=alta`** para que un closer humano filtre y entre a las conversaciones de
  perfil de salud mientras el bot las trabaja. Es lo que reemplaza a la agenda.
- Confirmar en producción los 8 casos de prueba listados en `docs/bot-vero/n8n-patch.md`.

---

## 2026-08-10 — Especificación del A/B de `/casos-de-estudio` (sin implementar todavía)

**Qué:** `docs/ab-casos-de-estudio.md` con los 4 cambios para montar el primer A/B real, y
un pointer en `AGENTS.md`. **No se tocó ninguna página.**

**Por qué:** la prueba del 8-ago comparó antes/después y no pudo decidir nada — el rebote se
movió 0,6 pp, dentro del ruido, y ya venía bajando solo desde el 27-jul. Un split 50/50
elimina el tiempo como variable.

**Decisiones:** middleware de Vercel con **rewrite** (no redirect: conserva las UTMs, evita
el salto y el parpadeo); cookie pegajosa; `index-b.html` cambia **sólo el titular**;
`variant` se agrega al `payload` del opt-in, que se arma en un solo lugar y va a los dos
destinos (CRM y n8n). El KPI de decisión es el **mix de calificación**, no el CPL — el
titular nuevo atrae al segmento de recomposición y el CPL empeora antes de que mejore la
caja.

**Pendiente:** implementar. Requiere `package.json` mínimo con `@vercel/edge` (sin
convertir el proyecto a un framework) y verificar que el middleware corra antes del rewrite
que ya existe en `vercel.json`.

---

## 2026-08-08 — El poster sale del HTML y el CTA sube al hero (PRUEBA EN CURSO: sáb 8 → dom 9)

### Qué cambió

Dos cosas en `/casos-de-estudio`, ambas de estructura. **No se tocó una sola
palabra del copy ni un color.**

1. **El thumbnail del video dejó de viajar dentro del HTML.** Estaba pegado como
   base64: 253.600 bytes de los 301.453 que pesaba el archivo, el **84%**. Ahora
   vive en `/assets/caso-estudio-an/` en WebP, con `srcset` 760w/1200w y
   `preload`, siguiendo el mismo patrón que ya usaba Rosita VA.
2. **CTA nuevo pegado al video** (`#heroCta`), visible sin scrollear. Abre el
   mismo modal de siempre. El CTA de abajo de los bullets queda intacto.

De yapa, tres arreglos que salieron de medir la página:

- La barra fija ahora se esconde con **cualquiera** de los dos CTA en pantalla.
  Se lleva la cuenta en un `Set`, porque con dos observers escribiendo la misma
  clase, el que salía de pantalla le borraba la barra al que había entrado.
- **Los tiempos de entrada.** El titular se revelaba palabra por palabra hasta
  los 1,46 s y el video aparecía a los 2,0 s. Bajan a 0,79 s y 0,84 s.
- **`prefers-reduced-motion`**, que la página no tenía.

### Por qué

El navegador lee el archivo de arriba abajo, así que **todo lo que venía después
de esa foto no existía hasta que la foto terminaba de bajar**. Medido sobre el
archivo de producción:

| Qué | Byte | % del archivo |
|---|---|---|
| El titular | 29.998 | 10,0% |
| Arranca el JPEG pegado | 30.465 | 10,1% |
| Los bullets | 284.448 | 94,4% |
| **El formulario de registro** | **287.259** | **95,3%** |

En un celular con señal irregular eso es: el titular, un hueco gris, y ningún
botón. El **97,5%** del tráfico de esta página es móvil.

Lo que decía la medición de may–jul 2026 (GA4 + CRM producción):

- **74,4%** de rebote y **5,9 s** de permanencia en el tráfico de MetaAds,
  contra 44,3% y 20,9 s en el de YouTube. Meta es el 66% de las sesiones.
- Sólo el **20,5%** de los visitantes llega a tocar el formulario
  (13.559 de 66.185).
- Perú es el 55% del tráfico, rebota 70,8% y pasa al caso de estudio al 14,9%,
  contra 31,6% de Colombia.
- Las páginas a las que esta landing manda gente pesan 23 KB (Dashiel), 23 KB
  (Flor), 31 KB (calendly-an). **La landing pesaba 13 veces más que el destino.**

### Resultado medido del cambio (peso, no conversión)

| | Antes | Después |
|---|---|---|
| `index.html` crudo | 302.868 B | **52.258 B** (−83%) |
| HTML comprimido (lo que viaja) | ~201 KB | **13 KB** (−93%) |
| Transferencia real medida en prod (brotli) | — | **14,4 KB** |
| Imagen | 248 KB base64, bloqueante | 45 KB WebP, en paralelo |
| El formulario existe en el byte | 287.259 de 301.453 | 35.748 de 50.823 |
| CTA termina en (viewport 812) | después de 4 bullets | **773 px** |

El base64 casi no comprimía (302 KB → 205 KB con gzip): base64 de un JPEG es
prácticamente incompresible. Ese es el motivo de que la mejora comprimida (−93%)
sea mayor que la cruda (−83%).

### Verificación

- Local a 375×812: los tres CTA abren el modal, el formulario conserva
  honeypot/nombre/email/sexo, 0 errores de consola, 0 errores de anidamiento.
- Producción tras el deploy: poster externo (`poster-760.webp`), CTA a 773 px y
  visible sin scroll, modal abre, titular sigue en Fraunces.

### Lo que NO se publicó, a propósito

La rama **`design/ce-an-tipografia`** (Stack Sans Headline + Lexend Light,
fuentes auto-hospedadas, masthead y kicker eliminados, capitular fuera, minutos
fuera de imagen y botones) queda sin publicar. Si entran las dos cosas juntas no
hay forma de saber cuál movió la conversión.

### Prueba en curso — sáb 8 al dom 9 de agosto 2026

**KPI primario, declarado ANTES de mirar resultados:** rebote de
`/casos-de-estudio` en tráfico `sessionSource = MetaAds`.

**Secundarios:** permanencia media, % que llega al caso de estudio, `form_start`.

**Base de comparación:** los **mismos días de semanas anteriores**, no el
promedio del período — el fin de semana rinde distinto. Sábados: 25-jul (1.165
sesiones, 55,0% rebote) y 1-ago (1.096, 55,0%). Domingo: 26-jul (1.691, 55,9%).
**El domingo 2-ago se descarta**: 206 sesiones y 19,4% de rebote, cinco veces
menos tráfico y una mezcla completamente distinta (casi seguro pauta apagada).

**Lo que esta prueba NO puede decir.** No es un A/B: todos ven la página nueva,
así que cualquier cambio de presupuesto, campaña o creativo la contamina —
verificar el gasto de Meta de ambas ventanas antes de concluir. Y en 2 días no
se miden ventas: la conversión lead→venta es 3,68% con una mediana de 3 días
entre el alta y la compra, así que las ventas de este fin de semana no se ven
hasta bien entrada la semana que viene.

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

## 2026-07-30 — Funnel VA de Rosita

### Qué cambió

- Se creó `/testimonio-rosita-va` como prerregistro exclusivo para mujeres. El
  formulario conserva nombre, email, atribución y `sexo=Mujer`, envía al webhook
  vigente de Caso de Estudio y continúa en el mismo origen hacia
  `/testimonio-rosita-va/video`.
- Se creó `/testimonio-rosita-va/video` con el Vidalytics
  `RymSJVDkKpFH17Z7` y, debajo, la misma evaluación de Typeform usada por el
  Caso de Estudio VA.
- El token live de Typeform `01KHA5RZHGV02HW971F4227939` resolvía al formulario
  real `CGxeptJu` y forzaba `shareGaInstance=true`. La nueva página usa el ID
  real mediante el widget oficial para mantener la evaluación sin depender de
  una instancia GA global; GA4 sigue centralizado en GTM.
- Ambas páginas usan la identidad de Rosita: fondo ciruela, contraste marfil y
  acento fucsia/naranja, con Anton, Outfit y JetBrains Mono. La portada real del
  VSL se extrajo del prototipo y se optimizó de PNG a JPEG de 155 KB.
- Las variantes descargadas de FIT4 y Tr4iner no se copiaron ni modificaron.
- SEO/GEO queda explícitamente en `noindex, nofollow` con canonical propio para
  cada paso: son páginas operativas de tráfico VA, no contenido para posicionar.

### Por qué

Rosita necesita una ruta medible y aislada que conserve su lenguaje visual sin
mezclar los leads ni las métricas del Caso de Estudio VA vigente. La separación
de rutas permite comparar el prerregistro, consumo del VSL y avance a evaluación
sin reemplazar ni rediseñar los funnels que ya funcionan.

### Resultado esperado

- Más registros de mujeres que se identifican con el problema de bajar grasa
  sin perder piernas ni glúteos.
- Continuidad visual entre anuncio, prerregistro, VSL y evaluación.
- Atribución completa hasta Typeform sin exponer `fbc`/`fbp` derivados en la URL.

### Resultado medido

- Los scripts inline compilaron y `git diff --check` pasó.
- Chrome real cargó las tres familias tipográficas y no presentó overflow
  documental en 375, 768 ni 1280 px.
- El prerregistro mostró un CTA de 56 px en móvil, validación inline con foco en
  el primer error y modal navegable por teclado.
- El VSL correcto cargó sus controles. Typeform cargó recién al llegar a la
  sección y mostró la pregunta inicial “¿Cómo describirías tu cuerpo hoy?”.
- Los hidden fields conservaron nombre, email con `@` literal, `sexo`, `video`,
  UTMs, `fbclid`, `funnel`, `funnel_variant`, `fbc` y `fbp`.
- Una prueba específica con `fbclid` sintético y cookie `_fbp` confirmó ambos
  valores tanto en `data-tf-hidden` como en la URL interna del iframe de
  Typeform. Se reutiliza exactamente `TR4Track.getMetaIds()`, el contrato
  incorporado previamente al Caso de Estudio con Claude.
- El embed final no emitió errores de consola. El Pixel sí mostró en localhost
  el aviso esperado de permisos de tráfico; no afecta la lógica de la página.
- Preview del commit `470a8f6`: Vercel
  `dpl_GkCYoixmguq6qWvgpKs5v7hKrcXR`, target `preview`, estado **READY**.
  El deployment quedó protegido por Vercel Authentication.
- Producción aprobada: merge `1611da5` y verificación `2da1125`; Vercel
  `dpl_8UJz2Gv1am1UdfyMxcogA6NDHrWL`, target `production`, estado **READY** y
  alias canónico `https://metodo.tr4iner.com`.

---

## 2026-07-30 — Centrado del play en el prerregistro de Rosita

### Qué cambió

- `.media-frame` ahora usa `display: block`, para que el play absoluto tome
  como referencia toda la portada 16:9 y no una caja inline fragmentada.
- El versionado del CSS compartido subió a `20260730-2` en prerregistro y VSL,
  evitando que el navegador conserve la geometría anterior en caché.
- No cambiaron el tamaño, color, animación ni comportamiento del botón.

### Por qué

El play usaba `top: 50%`, `left: 50%`, pero su contenedor era un `<span>`
inline. En escritorio eso desplazaba el centro visual 175 px hacia la derecha
aunque la regla pareciera correcta.

### Resultado esperado

- El círculo de play queda exactamente centrado sobre la portada en cualquier
  ancho.

### Resultado medido

- Antes del cambio: desfase horizontal de `+175 px` en 1280 px.
- Después del cambio: desfase `0 × 0 px` en viewports reales de 375, 768 y
  1280 px, sin overflow horizontal.
- Preview del commit `9511fac`: Vercel
  `dpl_HvnAWPunL3iaqRcvfCYw7w359dMf`, target `preview`, estado **READY**.
  Producción se publicó junto con la corrección del nombre en el merge
  `ce795e7`.

---

## 2026-07-30 — Nombre legible en el Typeform de Rosita

### Qué cambió

- `/testimonio-rosita-va/video` entrega los hidden fields al SDK de Typeform
  como valores legibles, sin aplicar `encodeURIComponent` previamente.
- Se mantiene el mismo formulario `CGxeptJu` y no cambian preguntas, salidas,
  atribución ni automatizaciones.

### Por qué

`URLSearchParams` ya había decodificado el nombre al entrar al VSL. La página
lo codificaba de nuevo antes de pasarlo a Typeform y el SDK hacía una segunda
codificación al construir el iframe. Por eso “Estrellita 🤍” se almacenaba
como `Estrellita%20%F0%9F%A4%8D`.

### Resultado esperado

- Typeform, n8n y CRM reciben el nombre original con espacios, tildes y emojis.

### Resultado medido

- Caso probado: `first_name=Estrellita 🤍` y
  `email=estrella+va@example.com`.
- `data-tf-hidden` conservó ambos valores legibles y el iframe los codificó una
  sola vez, sin secuencias `%25`.
- `fbc` y `fbp` continuaron presentes en la URL interna de Typeform.
- Preview del commit `07dda29`: Vercel
  `dpl_5s7bZRSHxGixFeh8oWP1shXH63Cr`, target `preview`, estado **READY**.
- Producción conjunta de ambos ajustes: merge `ce795e7`, Vercel
  `dpl_23t2UBoihjHiJ8fynSKr18jbKCkW`, target `production`, estado **READY** y
  alias canónico `https://metodo.tr4iner.com`.

---

## 2026-07-31 — Texto del CTA de agenda AN

### Qué cambió

- En `/calendly-an`, el CTA principal ahora dice `Elegir horario` en lugar de
  `Elegir horario en Calendly`.
- No cambió el enlace, la apertura del calendario, el diseño ni la atribución.

### Por qué

Se retiró la mención visible a Calendly del botón por pedido editorial.

### Resultado esperado

- El CTA conserva su función y muestra únicamente `Elegir horario`.

### Resultado medido

- Producción publicada en el merge `c375391`; Vercel
  `dpl_8ypmtzSj48yg7Z7Le49x6Lmf5VPR`, target `production`, estado **READY** y
  alias canónico `https://metodo.tr4iner.com`.
- El HTML servido en `/calendly-an` muestra `Elegir horario` tanto en el CTA
  principal como en el móvil, y ambos conservan la clase `open-calendly`.

---

## 2026-08-03 — GENESIS: unidades imperiales en el test de macros

### Qué cambió

- `/biblioteca/plan/` permite ingresar el peso en `kg` o `lb` y la altura en
  `cm` o `ft/in` mediante selectores independientes.
- En móvil, altura y peso ocupan filas completas cuando se activa `ft/in` para
  mantener legibles los campos de pies y pulgadas.
- Las unidades elegidas solo afectan la entrada visible: el expediente, la API,
  la analítica y el cálculo continúan recibiendo kilogramos y centímetros.

### Por qué

El equipo de entrenadores detectó fricción en personas acostumbradas al sistema
imperial. Pedir una conversión externa antes de calcular el plan introducía un
error evitable y una razón para abandonar el test.

### Resultado esperado

- Quien usa libras o pies completa el test sin convertir medidas por su cuenta.
- Los planes anteriores y las fórmulas de macros mantienen el mismo contrato en
  kg/cm.

### Resultado medido

- Conversión verificada: `72 kg → 158.7 lb → 71.985 kg` y
  `168 cm → 5 ft 6.1 in → 167.89 cm`.
- La fórmula original no fue modificada; el caso imperial probado produjo
  `1936 kcal · 155 g proteína · 183 g carbohidratos · 60 g grasas`.
- Sin overflow horizontal en viewports de 375, 768 y 1280 px; los campos
  imperiales permanecen visibles y legibles en móvil.

---

## 2026-08-03 — GENESIS: retirar salida externa a YouTube

### Qué cambió

- El reproductor de `/biblioteca/videos/` ya no muestra el enlace amarillo
  `Ver en YouTube ↗` debajo de los videos.
- Se retiraron también el estilo exclusivo del enlace y la asignación dinámica
  de su URL.

### Por qué

La salida externa interrumpía la experiencia privada de GENESIS y permitía
abandonar la ruta, el seguimiento de progreso y el contexto del contenido.

### Resultado esperado

- Los videos continúan reproduciéndose dentro de GENESIS sin ofrecer un CTA
  directo hacia YouTube.
- El cierre del reproductor, la telemetría y el autocompletado al 85% no cambian.

### Resultado medido

- No quedan referencias a `player-yt` ni al texto `Ver en YouTube` en la página.
- La sintaxis de los scripts inline continúa siendo válida.

---

## 2026-08-03 — GENESIS: corregir referencia masculina del 10% de grasa

### Qué cambió

- En el sprite masculino de `/biblioteca/plan/`, únicamente la primera referencia
  visual —asignada al 10%— muestra ahora abdomen, oblicuos, pecho y hombros más
  definidos.
- Las referencias del 15% al 40%, el orden, los porcentajes y la configuración
  del selector permanecen iguales.

### Por qué

El equipo de entrenadores detectó que el cuerpo anterior del 10% se parecía
demasiado al 15% y no representaba la definición esperable para ese rango.

### Resultado esperado

- La progresión visual entre 10% y 15% es clara sin presentar el 10% como una
  condición extrema de competencia.
- El cálculo continúa usando el porcentaje exacto elegido; la imagen solo sirve
  como referencia visual.

### Resultado medido

- El sprite conserva sus dimensiones de `1536 × 1024`, su cuadrícula `4 × 2` y
  sus siete posiciones.
- La configuración masculina sigue usando `10, 15, 20, 25, 30, 35 y 40%`.

### Publicación conjunta

- La rama `work/genesis-release-unidades-youtube-grasa` reunió los tres cambios
  sobre `main` y pasó el Preview `dpl_Gkszo5a1uphgR4NhEMWJj4Uwm7cM`, target
  `preview`, estado **READY**.
- El merge productivo `957f859` quedó sincronizado con GitHub y generó Vercel
  `dpl_FwZHV21RHAc9m4arXT8mkUjXtoUn`, target `production`, estado **READY** y
  alias canónico `https://metodo.tr4iner.com`.

---

## 2026-08-03 — La bisagra de GENESIS recupera la atribución desde el CRM

### Qué cambió

`biblioteca/videos/index.html`: el link de la bisagra hacia `/testimonio-flor` o
`/testimonio-dashiel` ahora completa la atribución con la que el CRM guardó en el registro
(`memberSession.attribution`, nuevo en `GET /api/genesis/me`). El navegador solo pisa lo que traiga
fresco, porque eso es un clic más nuevo que el del alta.

### Por qué

La única agenda generada por GENESIS llegó al CRM **sin UTMs y sin `fbc`/`fbp`**, así que no se
pudo atribuir ni mandar a Meta con identificadores de clic.

La causa no era el link —ese ya propagaba lo que tuviera, desde el fix de `buildRedirectUrl()` de
julio— sino que **no tenía nada que propagar**: `TR4Track.getUTMs()` lee solo la query del momento
(únicamente `video` y `fbc` se persisten en localStorage), y a GENESIS se entra por el enlace
mágico del correo, que es una URL sin UTMs y muchas veces en otro dispositivo. O sea que la
atribución se perdía en el paso que es **normal** del producto, no en un caso raro.

Es la misma familia del incidente de julio, un nivel más abajo: allá el link no reenviaba los UTMs;
acá el navegador ya no los tiene. Por eso ahora la copia viva vive en el servidor.

### Resultado esperado

Que un lead que cruza la bisagra llegue al Typeform con su origen real (campaña, source, medium,
term, content) y con `fbc`/`fbp`, para que Meta pueda emparejar la agenda con el anuncio que la
pagó y el CRM deje de recibirlo como "sin atribución".

Del lado del CRM esto ya está en producción (migración + `register` + `session`), incluida la regla
de que un toque retransmitido **no** se queda con el last touch de una campaña vieja: se detecta
por `utm_medium=GENESIS` y en un lead que ya existía queda como `GENESIS`/`Other`, que no compite.

### Resultado medido (completar después)

Verificar sobre las próximas agendas de GENESIS que lleguen con `utm_medium=GENESIS` y con
`fbc`/`fbp` presentes en el `Lead` del CRM.

---

## 2026-08-04 — `/fit4-va` pasa de VSL con muro a landing de venta completa

**Rama:** `work/fit4-va-rediseno` · **Estado:** preview, pendiente de aprobación del usuario.

### Qué cambió

`fit4-va/index.html` se rehízo sobre el prototipo aprobado (tema oscuro FIT4: Archivo Black,
Barlow Semi Condensed, Inter y Space Mono sobre `#0A0A0A` con acento `#FFE500`). La página deja
de ser una VSL con muro y pasa a ser una landing de venta larga: hero con el video, bloques de
dolor, presentación del programa, seis features, dos planes, FAQ y cierre.

Cambios de mecánica, no solo de estética:

- **Se elimina el muro de 3 minutos.** Antes el CTA aparecía recién al llegar el reproductor a
  `CTA_AT_SECONDS = 180`; ahora los planes están visibles desde el inicio y los CTA del hero y del
  cierre son anclas a `#planes`. Se cae con esto el evento `fit4_offer_unlocked`.
- **Dos ofertas en vez de una.** 3 meses $87 USD (`off=avsq480z`) y 6 meses $127 USD
  (`off=9lmw8r6b`). `fit4_checkout_click` viaja con `fit4_plan` (`3-meses` | `6-meses`) y
  `fit4_cta` (`card` | `buybar`) para separarlas en GA4.
- **Se quita `va-theme.css`** de esta página: fija fondo crema y redefine `--yellow` a `#e8a943`,
  incompatible con el tema oscuro. El resto de páginas VA lo siguen usando.
- Assets nuevos en `assets/fit4/`: `fit4-mockup-caja-app.png` y `fit4-va-poster.png` (este último
  como fondo del marco mientras carga Vidalytics).

Se conserva sin tocar lo que sostiene la medición: GTM `GTM-T88G63P`, el `noscript` de Meta,
`attribution.js`/TR4Track, el `noindex` (sigue siendo paso de funnel, no página indexable), el
canonical y el embed fijo de Veronika `Rl_cXuqDVuhtabtp`.

### Por qué

El muro asumía que la decisión se toma dentro del video. El prototipo apuesta por lo contrario:
dar la oferta completa por escrito y dejar que el video empuje, no que bloquee.

### Segunda pasada — diseño y CRO

Los precios del prototipo ($22/mes, $199/año) eran de relleno; los reales son bloques prepagos de
3 y 6 meses. Eso cambió la tesis de la página: **los planes no son tiers de features, son cuánto
dura tu proceso** — que es justo lo que la clienta no logra sostener ("siempre vuelves a empezar").

- **La tabla de precios pasa a ser un toggle con una sola tarjeta.** Un selector de duración
  (3 / 6 meses) sobre una tira de mesociclo de seis casillas: al cambiar de bloque la tira **se
  estira o se contrae**. El valor se ve en movimiento en vez de compararse en estático, y en móvil
  deja de haber dos tarjetas largas que scrollear. Por defecto arranca en 6 meses, con
  `autocomplete="off"` en los radios para que el navegador no restaure una selección previa.
  Los dos paneles comparten celda de grid, así cambiar de plan no salta el layout (verificado: 0px).
- **Se dejan de repetir las dos listas idénticas.** Las dos tarjetas listaban los mismos 6 items:
  eso obliga a buscar una diferencia que no existe y frena la decisión. Ahora las inclusiones van
  una sola vez, debajo, y las tarjetas solo cargan lo que difiere: duración, precio y la cuenta.
- **Anclaje de precio visible, no en letra chica.** El bloque de 6 muestra **$174 tachado encima
  del $127**, en tamaño display y con la línea de tachado en ámbar (antes iba en gris opaco dentro
  de un párrafo, donde no anclaba nada). La línea **se dibuja** cuando la tarjeta entra en vista y
  se vuelve a dibujar en cada retorno al bloque de 6, seguida del chip "ahorras $47".
  El $174 va etiquetado "en dos bloques de 3": no es un precio anterior y no se presenta como tal.
- **Anclaje cruzado:** el bloque de 3 muestra su tasa "$29 al mes" en el mismo lugar y recuerda que
  con 6 bajaría a $21. Los dos paneles quedan a la misma altura (verificado: 404px cada uno).
  La barra fija y su `off` siguen al toggle.
- **Garantía de 7 días junto a cada botón**, no enterrada en el FAQ.
- **Barra fija de compra en móvil** que entra al pasar los planes.
- Se quita la numeración 01–06 de las features: no son una secuencia, y el grid pasa a leerse como
  una sola tabla con divisores de 1px.
- **Tipografía unificada:** se cae Inter y entra Barlow como cuerpo, quedando una sola familia
  atlética (Archivo Black display / Barlow Semi Condensed títulos / Barlow cuerpo / Space Mono
  metadatos).
- **Movimiento orquestado** en vez de un solo fade: entradas escalonadas por `--i`, parallax de las
  capas de atmósfera y del mockup (rAF, solo `transform`), y la tira de meses que se llena casilla
  por casilla al entrar en vista. Todo bajo `prefers-reduced-motion` y con `<noscript>` que fuerza
  la página visible si el JS no corre.
- Se saca el wordmark FIT4 CHALLENGE del footer.

Contraste verificado: el par más bajo queda en 5.15:1 (AA). Foco de teclado visible en ámbar.

### Tercera pasada — peso de carga

Medido con `performance.getEntriesByType('resource')`: la página pesaba **1507 KB**, y **1284 KB
eran dos PNG**. El resto era ruido al lado de eso.

| | Antes | Después |
|---|---|---|
| Total | 1507 KB | **189 KB** |
| Assets propios | ~1350 KB | **62 KB** |
| `fit4-va-poster` | 880 KB | **14,5 KB** |
| `fit4-mockup-caja-app` | 404 KB | **41 KB** |
| Recursos que bloquean el render | 1 | **0** |

- **Los dos PNG pasan a WebP.** El póster es solo el fondo del marco mientras carga Vidalytics —
  880 KB por un telón que el reproductor tapa a los pocos cientos de ms. Va a 720px de ancho, sin
  canal alfa (era una foto, el alfa no servía de nada) y con calidad baja: se ve igual detrás del
  player. El mockup mantiene su alfa y su tamaño; a q82 el texto del teléfono sigue legible.
  Los PNG se borran del repo: quedaban sin referencia y se subían a Vercel en cada deploy.
- **La hoja de Google Fonts sale del camino crítico.** Era el único recurso que bloqueaba el
  render: obligaba a un handshake con otro origen antes del primer pintado. Ahora carga con
  `preload as=style` + `onload`, con `<noscript>` de respaldo. Como ya tenía `display=swap`, el
  texto salía igual en la fuente de respaldo — lo único que se gana es no esperarla para pintar.
- **Se caen los pesos 500** de Barlow y Barlow Semi Condensed: ninguna regla los usaba. Verificado
  contra `document.fonts`: cargan exactamente los 7 que quedan declarados.
- **`will-change` queda dentro de `min-width: 641px`**, que es donde corre el parallax. En móvil
  pedía capas de composición a cambio de nada.
- Se agrega `preload` del póster, que antes se descubría recién al parsear el CSS estando sobre el
  pliegue. Verificado que no duplica la descarga.

Lo que queda pesando es de terceros: **`fbevents.js` (104 KB)**, el píxel de Meta que entra por
GTM. Es la medición de las campañas, así que no se toca.

### Resultado esperado

Más clics a checkout por visita al desaparecer el muro, y una decisión más rápida entre planes al
volverla una sola variable (duración) en vez de dos listas iguales. A vigilar: que la conversión a
compra no caiga por mostrar precio antes del video.

### Resultado medido (completar después)

Comparar contra la versión con muro: `fit4_checkout_click` / `fit4_vsl_loaded`, el reparto
3 vs 6 meses, cuánto aporta la barra fija (`fit4_cta=buybar`) y cuántas cambian de bloque antes de
comprar (`fit4_plan_toggle`).

---

## 2026-08-05 — Prueba de agosto: tráfico VA a WhatsApp vs. `/fit4-va`

**Estado:** definida, sin ejecutar. Requiere que `work/fit4-va-rediseno` esté en producción.

### Cómo funciona hoy `/redirectionutmstr4iner`

Página puente que manda todo el tráfico a WhatsApp. Detecta VA por **`utm_campaign`** y solo por eso:

```js
const isVa = campaign === "TR4INER-VA" || campaign === "CASOS-VA";
const phone = isVa ? "15677024560" : "17439014239";
```

- **VA → `+1 567 702 4560`** (la cuenta de Veronika en ManyChat).
- Resto → `+1 743 901 4239`.
- El mensaje precargado cambia solo en el caso AN de Meta (`utm_source=MetaAds` + `utm_medium=Caso_Estudio`), que recibe "¡Hola! Quiero más información."; todos los demás reciben el texto largo de transformación física.

Su hermana `/redirectionutmstr4iner2` usa la **misma condición de VA** pero reparte entre `/calendly-va` y `/calendly-an`, y esa sí reenvía el querystring completo.

### Qué se va a probar en agosto de 2026

Mandar el tráfico VA de `/redirectionutmstr4iner` a **`/fit4-va`** en vez de al WhatsApp de Veronika, para decidir qué rinde más con el mismo tráfico.

### Estado de la atribución (aclarado el 05-ago-2026)

La atribución llega por Typeform, que sí reenvía los parámetros. Del lado de `/fit4-va` lo único
que hacía falta era que esos parámetros pasen a los botones y viajen al checkout de Hotmart, y eso
**ya está resuelto y verificado**: ver el contrato de parámetros más abajo.

Único recaudo operativo: **tomar la línea base del brazo WhatsApp antes de encender la prueba**.
Sin el número previo no hay contra qué comparar.

### Cómo decidir (importante: no comparar tasas de conversión)

Los dos brazos **venden cosas distintas a precios distintos**, así que la tasa de conversión no es comparable:

| | WhatsApp / ManyChat | `/fit4-va` |
|---|---|---|
| Qué vende | Programa high-ticket vía conversación y llamada | Bloque prepago de $87 / $127 |
| Quién cierra | Setter / llamada | Autoservicio en Hotmart |
| Dónde se mide | ManyChat + CRM (`crm-ventas`) | GA4: `fit4_vsl_loaded` → `fit4_checkout_click` → `fit4_thankyou_view` en `/gracias-fit4-challenge` |

La métrica que decide es **ingreso por cada 100 visitantes VA**, en la misma ventana de fechas para los dos brazos. Un brazo puede convertir 10× más y aun así facturar menos.

Dos cosas a tener en cuenta al leer los números:

- **La venta high-ticket tarda.** Una conversación de WhatsApp puede cerrar semanas después; `/fit4-va` cobra en el momento. Cerrar la ventana muy temprano favorece artificialmente a `/fit4-va`. Dejar correr el rezago del brazo WhatsApp antes de comparar.
- **La compra se confirma por backend, no por la página.** `/gracias-fit4-challenge` solo le muestra al comprador cómo seguir su plan; no emite `Purchase` a propósito. El conteo de ventas del brazo `/fit4-va` sale del backend/Hotmart, que es la fuente de verdad. `fit4_thankyou_view` sirve solo como señal de que la persona llegó a ver las indicaciones.

### Qué anotar cuando termine

- Visitantes VA a cada brazo y la ventana exacta de fechas.
- Brazo WhatsApp: conversaciones iniciadas, agendas, ventas cerradas e ingreso.
- Brazo `/fit4-va`: `fit4_vsl_loaded`, `fit4_checkout_click` (con el reparto 3 vs 6 meses y `fit4_cta`), `fit4_thankyou_view` e ingreso.
- Ingreso por 100 visitantes de cada brazo → la decisión.

### Resultado medido (completar después)

---

## 2026-08-05 — `/fit4-va` a producción · contrato de datos para CRM y n8n

Se integra `work/fit4-va-rediseno` en `main`. **Esta sección es la referencia para el resto de los
proyectos** (`crm-ventas`, workflows de n8n, GA4): define qué manda `/fit4-va` y con qué nombres.
Si cambia algo de acá, hay que avisar antes de tocarlo.

### 1. Ofertas de Hotmart ↔ producto y precio

El dato que hace falta para atribuir ingreso: el checkout es el mismo producto (`K104111098X`) y lo
que distingue el plan es el parámetro **`off`**.

| `off` | Plan | Precio | Equivale a |
|---|---|---|---|
| `avsq480z` | 3 meses (12 semanas) | **$87 USD** | $29 / mes |
| `9lmw8r6b` | 6 meses (24 semanas) | **$127 USD** | $21 / mes |

Los dos son **pago único, sin renovación automática**: no son suscripciones. Cualquier lógica de
renovación/reincorporación que exista para otros productos no aplica acá.

> Ojo con el histórico: `9lmw8r6b` es el código que venía en la URL original y durante el rediseño
> se asumió que era un plan mensual de $22. **No lo es** — es el bloque de 6 meses. Si algún
> workflow o dashboard quedó mapeando `9lmw8r6b` a $22 mensual, está mal.

### 2. Parámetros que llegan al checkout

`buildCheckoutUrl()` reenvía **todo lo que traiga la URL**, no una lista fija que se quede vieja con
la próxima campaña. Verificado el 05-ago-2026 con 11 parámetros sintéticos: **ninguno se pierde**.

- **Todo lo entrante:** cualquier `utm_*` (`utm_source`, `utm_campaign`, `utm_medium`,
  `utm_content`, `utm_term`, …), `video`, `fbclid`, `gclid`, `h_ad_id`, `first_name`, `email`.
- **Lo que agrega la página:** `off`, `checkoutMode=10`, `funnel=VA`, `funnel_variant=fit4-va`.
- **Lo que agrega TR4Track** (`attribution.js`): la atribución persistida de first-touch, incluido
  el `fbc` derivado de `fbclid`. Solo rellena claves que no vengan ya en la URL.
- **Respaldo:** si no llega ningún `utm_source`/`utm_campaign`, la página pone
  `utm_source=FIT4-VA-DIRECTO` y `utm_campaign=FIT4-VA`. **Ver ese par significa que el tráfico
  llegó sin atribución**, no que exista una campaña con ese nombre.

### 3. Eventos a `dataLayer`

| Evento | Cuándo | Parámetros propios |
|---|---|---|
| `fit4_vsl_loaded` | Carga de la página | `fit4_variant=VA`, `funnel_variant=fit4-va` |
| `fit4_plan_toggle` | Cambia de bloque en el selector | `fit4_plan` = `3-meses` \| `6-meses` |
| `fit4_checkout_click` | Clic a Hotmart | `fit4_plan`, `fit4_cta` = `card` \| `buybar` |

`fit4_offer_unlocked` **ya no existe**: se eliminó con el muro de 3 minutos. Cualquier informe o
workflow que lo espere se quedó sin datos desde este deploy.

### 4. Confirmación de compra

La compra se confirma **por backend**, no por la página. `/gracias-fit4-challenge` solo le muestra
al comprador las indicaciones para seguir su plan y no emite `Purchase` a propósito, para no
duplicar por recarga. La fuente de verdad del ingreso es Hotmart/backend.

### Deploy

**Publicado el 05-ago-2026.** `work/fit4-va-rediseno` integrado a `main` (merge `9c5a4ee`).

- **Deployment Vercel:** `tr4iner-funnels-glt4u3e6x-metodotr4iners-projects.vercel.app` · Production · **Ready** · build 8s.
- Verificado sobre `https://metodo.tr4iner.com/fit4-va` (HTTP 200):
  - Los dos checkouts reenvían todos los parámetros entrantes, con `off=avsq480z` y `off=9lmw8r6b`.
  - 0 recursos que bloqueen el render · 133 KB transferidos.
  - Assets WebP sirviendo con `content-type: image/webp`.
  - Sin residuos de la versión anterior: ni `fit4_offer_unlocked`, ni los PNG, ni `va-theme.css`.

Rama borrada tras confirmar el merge con `git branch --merged main`.

---

## 2026-08-05 — `/fit4` toma la estructura de `/fit4-va` sin perder su piel

**Rama:** `work/fit4-an-rediseno` · **Publicado el 05-ago-2026** (ver Deploy al final del bloque).

### Qué cambió

`/fit4` pasa de VSL con muro a la misma landing de venta larga que `/fit4-va`: mismo copy, mismos
seis bloques de contenido y **la misma estructura de precios** (selector de bloque, tira de
mesociclo, anclaje del $174 tachado, garantía junto al botón, barra fija en móvil).

Lo que **no** se tocó, a propósito:

- **La piel editorial.** `/fit4` conserva el crema `#F2EEE2`, Fraunces / Instrument Sans /
  JetBrains Mono, el acento `#F5C518`, el grano de papel y el masthead. La estructura se tradujo a
  ese idioma en vez de importar el tema oscuro de `/fit4-va`: la tira de meses se llena en tinta
  sólida, el tachado es una línea de tinta y el chip de ahorro usa el acento. Son dos páginas
  hermanas en estructura y distintas en identidad, como estaban.
- **El selector dual de video.** Sigue cargando `T7Hop2PBd6tWQl0W` para AN y `Rl_cXuqDVuhtabtp`
  cuando detecta marcadores VA en las UTMs. Verificado en los dos sentidos.
- GTM, `noscript` de Meta, `attribution.js`/TR4Track, `noindex` y canonical.

Igual que en `/fit4-va`, **se cae el muro de 3 minutos** y con él `fit4_offer_unlocked`. Los planes
quedan visibles desde el inicio.

### Precios y eventos

Mismo contrato que `/fit4-va` (ver la entrada del 05-ago-2026): `avsq480z` = 3 meses $87,
`9lmw8r6b` = 6 meses $127, los dos pago único. Se agregan `fit4_plan`, `fit4_cta` y
`fit4_plan_toggle`; **se conserva `fit4_variant`** (`AN` | `VA`), que es propio de esta ruta y lo
que permite separar su tráfico.

### Corrección que alcanza también a `/fit4-va` (ya en producción)

`autocomplete="off"` **no impide** que el navegador restaure la selección previa del toggle al
recargar: se reprodujo en `/fit4`, que abría en el bloque de 3 meses después de una recarga. Ahora
el plan inicial se fuerza por JS en vez de leerse del DOM, así la página siempre abre en 6 meses.
El mismo arreglo se aplicó a `/fit4-va`, que traía el defecto idéntico.

### Pendiente de decisión — copy en femenino

El copy se copió tal cual de `/fit4-va`, que está escrito para mujeres. En `/fit4`, que atiende
tráfico AN mixto, se ajustó solo la línea que quedaba gramaticalmente rota (*"No estás sola / las
mujeres que llegan"* → *"No estás solo / las personas que llegan"*). El resto del copy es neutro,
pero **la decisión editorial de fondo sigue abierta**: si `/fit4` debe hablarle a una audiencia
mixta con el mismo texto que la página de Veronika.

### Resultado esperado

Igualar la estructura de conversión entre las dos rutas para poder comparar su rendimiento sin que
el formato sea una variable más.

### Resultado medido (completar después)

---

## 2026-08-05 — `/redirectfit4`: puente de tráfico a FIT4 por UTMs

**Rama:** `work/fit4-an-rediseno` (fue junto al rediseño de `/fit4`) · **Publicado el 05-ago-2026**.

### Qué es

Página puente en `/redirectfit4` que reparte el tráfico entre las dos landings de FIT4, con el
mismo patrón que `/redirectionutmstr4iner2`: lee las UTMs, decide destino y **reenvía el
querystring completo** con `window.location.replace(origin + destino + queryString)`.

- **Tráfico VA → `/fit4-va`**
- **Todo lo demás → `/fit4`** (incluido el tráfico sin ningún parámetro)

`location.replace` en vez de `href` para que el puente no quede en el historial y el botón atrás
lleve al origen, no de vuelta al redirect. `window.location.origin` mantiene el recorrido dentro
del mismo deployment durante los previews.

### Cómo detecta VA

Usa **la misma definición que ya aplica `/fit4`** para elegir su video, que es un superconjunto de
la de `/redirectionutmstr4iner2` (que solo mira dos valores exactos de `utm_campaign`). Se eligió
así a propósito: si el puente y el destino no coincidieran en qué es "tráfico VA", un lead podría
aterrizar en la página de AN y aun así ver el video de Veronika.

Se considera VA si: `utm_campaign` es `TR4INER-VA` o `CASOS-VA`, o `funnel=VA`, o `funnel_variant`
contiene `VA` como token, o **cualquier** `utm_*` contiene `VA` delimitado por `-` o `_`.

El marcador está anclado (`/(^|[-_])VA($|[-_])/i`), así que no se dispara con `VA` dentro de una
palabra. Verificado sobre 12 casos, incluidos tres trampas que deben ir a `/fit4`:
`utm_campaign=NAVA-2026`, `utm_content=VARIANTE-A` y `utm_source=NAVIDAD`.

Probado punta a punta: VA llega a `/fit4-va` y AN a `/fit4`, los dos con el querystring intacto y
con el video correspondiente cargado.

### Decisiones

- **Sin GTM en el puente.** Sumaría un `page_view` que ensucia el embudo y retrasaría el redirect.
  El reparto ya es medible en el destino: las dos páginas emiten `fit4_vsl_loaded`, y `/fit4` lo
  hace con `fit4_variant` (`AN` | `VA`).
- **`<noscript>` con enlaces reales** a las dos rutas, en vez del "Activa JavaScript" sin salida
  que tienen las páginas puente anteriores. Sin JS se pierde el querystring, que es inevitable en
  una página estática, pero al menos el visitante llega.
- Ruta por directorio (`redirectfit4/index.html`) y `cleanUrls`, igual que sus hermanas: no hizo
  falta tocar `vercel.json`.

### Resultado esperado

Un solo enlace para las campañas de FIT4, que reparte solo y sin perder atribución.

### Deploy

**Publicado el 05-ago-2026.** `work/fit4-an-rediseno` integrado a `main` (merge `efdf2e3`).

- **Deployment Vercel:** `tr4iner-funnels-5z0rme78z-metodotr4iners-projects.vercel.app` · Production · **Ready** · build 8s.
- Verificado sobre el dominio canónico, los tres HTTP 200:
  - `/redirectfit4` con `utm_campaign=TR4INER-VA` → aterriza en `/fit4-va` con el querystring intacto.
  - `/redirectfit4` con `utm_campaign=TR4INER-AN` → aterriza en `/fit4`, carga `T7Hop2PBd6tWQl0W`
    y arma los dos checkouts con `avsq480z` y `9lmw8r6b`.
  - `/fit4` conserva Fraunces y los dos embeds de video; ambas landings abren en el bloque de
    6 meses con la corrección de `DEFAULT_PLAN`.

Rama borrada tras confirmar el merge con `git branch --merged main`.

### Resultado medido (completar después)

## 2026-08-07 — Velocidad de carga en las páginas de Veronika (Rosita y Flor)

### Qué cambió
Optimización de la ruta crítica de `/testimonio-rosita-va`, `/testimonio-rosita-va/video`
y `/testimonio-flor-va`.

**Fuentes self-hosted (`/assets/fonts/`).** Antes cada página encadenaba
`fonts.googleapis.com` (CSS) → `fonts.gstatic.com` (woff2): dos conexiones nuevas
bloqueando el render. Ahora los woff2 salen del mismo origen, con `preload` de las
dos familias del above-the-fold. Google servía el **mismo archivo variable** para
cada peso declarado (Outfit 400/500/600/700 = 4 descargas idénticas), así que se
dedupló a un archivo por familia con `font-weight` en rango. Sólo se guardan los
subsets `latin` y `latin-ext`.

**Montserrat eliminado de Flor.** Estaba declarado como fallback detrás de Poppins
(`--serif: "Poppins", "Montserrat", ...`), por lo que nunca llegaba a renderizar,
pero se descargaban sus 3 pesos igual.

**Imágenes.**
- `vero-perfil-footer.webp`: 700×700 / 193 KB para un avatar que se muestra a 46 px.
  Regenerado a 144 px (cubre el `scale(1.55)` del tema VA) → 4.8 KB. **−97%**
- `vsl-poster` (LCP de la landing de Rosita): JPG 159 KB → WebP q80 32 KB. **−80%**
  Se conserva el `.jpg` porque `og:image` lo sigue usando para compartir en redes.

### Por qué
Son páginas de tráfico pago: el LCP se paga en CPL. La ruta crítica traía dos
dominios extra antes de pintar texto y ~350 KB de imágenes evitables.

### Resultado medido (local, servidor estático)
- Peticiones a Google Fonts: **12 → 0**
- DOMContentLoaded: **86 ms** (Rosita), **23 ms** (Flor), **36 ms** (video)
- Verificado que Anton, Outfit, JetBrains Mono, Instrument Sans y Poppins renderizan
  igual que antes, y que Vidalytics y Typeform siguen cargando.

### Pendiente / observación
GTM inyecta 12 hosts de terceros (ManyChat, Hotmart, Clarity, Brevo, Meta) que siguen
pidiendo recursos hasta ~27 s después del load. No bloquean el primer render porque
GTM es async, pero conviene revisar en el contenedor de GTM si todos esos tags deben
dispararse en estas páginas — no se puede tocar desde el repo.

---

## 2026-08-07 — Typeform de `/testimonio-rosita-va/video` con el SDK

### Qué cambió
El embed pasó de atributos `data-tf-*` a `tf.createWidget()` (el SDK que ya expone
`embed.js` como `window.tf`, sin bundler — el repo no tiene build step).

**El botón de continuar ya no se corta.** La causa era `data-tf-auto-resize="350,700"`:
ese "min,max" topaba el iframe en 700 px, así que las preguntas con muchas opciones
quedaban recortadas y el botón inalcanzable. Ahora `autoResize: true` (booleano, sin
techo) deja que el alto siga a la pregunta. Verificado simulando 600/900/1300/1800 px:
el marco acompaña sin recortar.

**El `min-height` se queda como piso, nunca como techo.** Sin él Typeform apila el
botón encima de la última opción en las preguntas cortas.

**CSS del widget inline.** `createWidget()` no autoinyecta su CSS (el embed por
`data-tf-*` sí lo hacía) y sin `.tf-v1-widget{height:100%}` el iframe caía al alto
por defecto de 150 px. Va copiado en `rosita-theme.css` en vez de sumar una petición
a `embed.typeform.com/next/css/widget.css`.

**Hidden fields como objeto.** Antes se armaba un string `"k=v,k=v"`; el SDK los
codifica solo, así que `first_name=María José` llega entero.

**Carga anticipada.** El IntersectionObserver tenía `rootMargin: "0px"`, o sea que el
form recién empezaba a bajar cuando ya estaba en pantalla y el usuario se comía
script + iframe + contenido mirando el "Cargando evaluación…". Ahora precarga
1200 px antes, con un timeout de 6 s de respaldo para quien se quede viendo el VSL.

### Ojo
- `disableScroll` se mantiene: según la doc no es scroll interno del contenido sino
  que evita navegar entre preguntas con scroll/swipe. Quitarlo haría que un swipe al
  scrollear la página saltee preguntas en móvil.
- Sigue apareciendo en consola el warning de `shareGaInstance` (busca un objeto `ga`
  que no existe porque GA4 va por GTM). Viene de la configuración del form en
  Typeform, no del código; no rompe nada. Se dejó `shareGaInstance: false` explícito,
  pero no se pudo verificar que lo silencie: el SDK sólo hace ese chequeo en el primer
  montaje de la página.

---

## 2026-08-07 — El tope de alto del Typeform también estaba en Flor, Flor VA y Dashiel

### Qué cambió
El mismo `data-tf-auto-resize="350,700"` que cortaba el botón en Rosita estaba en las
tres páginas canónicas con Typeform incrustado:

- `registro-typeform-flor.html` (`/testimonio-flor`)
- `registro-typeform-flor-va.html` (`/testimonio-flor-va`)
- `registro-typeform-optimizado.html` (`/testimonio-dashiel`)

En las tres el "min,max" pasó a `data-tf-auto-resize` sin techo. Verificado forzando
700/1200/1500 px sobre el div que Typeform redimensiona: el iframe acompaña sin recortar.

**Precarga de `embed.js`.** Acá el form no se revela por scroll sino por temporizador
(`REVEAL_SECONDS = 3`), así que la descarga arrancaba recién a los 3 s y el usuario se
comía el "Cargando aplicación…". Con `<link rel="preload" as="script">` el archivo baja
a los ~20 ms y cuando el reveal lo pide a los ~3 s resuelve en 49 ms desde caché.

### Por qué no se migraron al SDK como Rosita
Estas usan `data-tf-live="01KHA5…"` (embed live), no `data-tf-widget`. Pasarlas a
`tf.createWidget()` implicaría cambiarles el tipo de embed en el funnel principal, y
el bug se arregla sin eso. Además, con `data-tf-*` el CSS del widget sí se autoinyecta,
así que no hacía falta copiarlo como en Rosita.

### Sin tocar
- `registro-typeform-flor-B.html` y `registro-typeform-optimizado-B.html`: archivadas,
  no son rutas públicas, y ni siquiera declaran `auto-resize`.
- El `min-height` de 590/640 px en `[data-tf-live]` de Flor VA deja ~264 px de hueco
  bajo el form cuando la pregunta es corta. Es preexistente y reserva espacio contra
  el salto de layout mientras carga; no se tocó.

---

## 2026-08-07 — Fecha del masthead a agosto 2026 y el piso de alto que no llegaba al iframe

### Fecha
La fecha del masthead estaba vieja en cuatro páginas:

- `index.html` — julio → **agosto 2026**
- `registro-typeform-flor-va.html` — julio → **agosto 2026**
- `registro-typeform-flor.html` — junio → **agosto 2026**
- `registro-typeform-optimizado.html` — junio → **agosto 2026**

`renueva/index.html` ya decía agosto. Los `dateModified` del JSON-LD son otra cosa y
no se tocaron.

### Lo que faltaba del arreglo del Typeform
Quitar el techo de `auto-resize` no alcanzaba. Typeform inserta un div propio entre el
contenedor y su widget, y ese div corta la cadena de `min-height: inherit` con la que
el widget baja el piso hasta el iframe. Resultado: el iframe se quedaba en el alto que
calcula Typeform (288 px en la pregunta de SI/NO) y su layout apilaba el botón
"Aceptar" encima de la última opción, con scroll interno.

Se reconecta la cadena en las tres páginas:

```css
.cta-typeform-frame [data-tf-live] > div,
.cta-typeform-frame [data-tf-live] .tf-v1-widget,
.cta-typeform-frame [data-tf-live] iframe { min-height: inherit; }
```

El piso que ya existía (350 px en Flor y Dashiel, 590/640 px en Flor VA) ahora sí llega
al iframe. Verificado: alto mínimo respetado, y sigue creciendo hasta 1400 px sin recortar.

De paso desapareció el hueco de ~264 px bajo el form en Flor VA que había quedado
anotado como pendiente: ahora el formulario ocupa los 640 px del contenedor en vez de
dejar la franja beige.

### Nota
En Rosita esto no hacía falta porque usa `data-tf-widget` (sin el div intermedio) y ahí
`.tf-v1-widget` es hijo directo del contenedor, así que la cadena nunca se cortó.

---

## 2026-08-13 — Nueva oferta de Ruta Tr4iner en `/biblioteca/inicio/` (rama de Preview)

### Qué cambió
La entrada de GENESIS ahora presenta primero la oferta **“Recibe GRATIS tu Ruta Tr4iner personalizada”**, explica el resultado y el tiempo requerido, y usa un CTA único que abre un cuestionario dentro de la misma `/biblioteca/inicio/`.

El flujo muestra una respuesta a la vez: nombre → sexo → situación actual (5 opciones) → WhatsApp → correo. Desde la segunda pregunta usa el primer nombre ingresado para que la experiencia se sienta construida para la persona y no como un formulario de leads ordinario. El último botón dice **“VER MI RUTA PERSONALIZADA”** y mantiene la verificación por correo de GENESIS; ya no envía a `/biblioteca/` para completar el registro.

La superficie pasó a fondo blanco y el titular usa Instrument Sans en peso fuerte. Fraunces queda únicamente como acento editorial en la frase final; no se añadieron fuentes ni dependencias.

Se eliminó la franja superior repetida de todas las páginas canónicas de GENESIS porque duplicaba marca y estado sin ayudar a completar la tarea: `/biblioteca/`, `/biblioteca/inicio/`, `/biblioteca/acceso/`, `/biblioteca/confirma/`, `/biblioteca/plan/` y `/biblioteca/videos/`. `/biblioteca/verificar/` ya no tenía esa cabecera. En `/plan/` se conservó “← Tu ruta” como navegación funcional, integrado en el contenido y sin masthead.

Las pantallas posteriores a la oferta adoptaron la misma línea funcional de `/biblioteca/inicio/`: fondo blanco, Instrument Sans como tipografía dominante, negro/gris para jerarquía y amarillo solo para progreso o acción. `/acceso/`, `/confirma/` y `/verificar/` dejaron la tarjeta crema flotante; `/plan/` incorporó una barra móvil persistente con avance y controles de mayor área táctil; `/videos/` pasó a una experiencia de ruta tipo app con onboarding compacto, recomendación prioritaria, acordeones y fichas de video horizontales en móvil. El reproductor se presenta como hoja inferior en pantallas pequeñas. No se añadieron dependencias ni navegación decorativa.

### Sin tocar
Se conservaron el webhook productivo de Biblioteca, `/api/genesis/register`, la llegada a `/biblioteca/confirma/`, el acceso para miembros, `noindex`, canonical y enlaces legales. Los parámetros de atribución siguen viajando al webhook, al CRM y a la confirmación.

La respuesta se envía con una categoría compatible con el contrato existente (`estancado`, `dietas-fallidas`, `subida`, `confianza` o `sin-camino`) y también con el texto literal elegido en `situacion_text`. Los eventos `biblioteca_situacion_select` y `registro` guardan ambos valores.

### Resultado esperado
Que una persona entienda en el primer pantallazo qué recibe, para qué sirve, cuánto tarda y que es gratis antes de tomar una decisión funcional sobre su ruta.

### Estado
Se entrega mediante la rama `work/genesis-inicio-oferta` para generar un Preview de Vercel; queda pendiente la aprobación visual antes de integrar `main`. Producción no se toca. QA local interceptó los envíos para no crear leads ni correos reales: 375, 768 y 1280 px completaron nombre → sexo → situación → WhatsApp → correo, conservaron respuestas al volver, personalizaron con el primer nombre, mantuvieron nombre completo/UTMs/`fbclid` en ambos payloads y llegaron a `/biblioteca/confirma/` sin errores. Las siete rutas canónicas también se recorrieron sin cabeceras residuales. El rediseño tipo app se validó en `/acceso/`, `/confirma/`, `/verificar/`, `/plan/` y `/videos/` a 375, 768 y 1280 px: fondo y `theme-color` blancos, Instrument Sans visible, cero errores de JavaScript, cero desbordes y targets táctiles de al menos 44 px. El wizard avanzó a la siguiente pregunta, los enlaces conservaron UTMs y el acordeón/reproductor de la videoteca abrieron y cerraron correctamente.

El Preview comparte el webhook y el CRM productivos: una prueba funcional crea datos y correos reales. Para QA interactivo debe usarse una identidad controlada y fresca; el enlace de verificación mantiene como destino el dominio canónico de producción.

### Publicación en producción

La rama aprobada se integró en `main` mediante el merge `d75502a`. Vercel publicó el deployment productivo `dpl_71rpkqFez5zXTuDNSqBB69bffta8`, confirmado `Ready` el 13-ago-2026 a las 16:57 (Lima), con `https://metodo.tr4iner.com` entre sus aliases. El deployment corresponde al mismo cambio funcional validado en el Preview `dpl_5tFCm4WjHSSYc3nUBu1q1cmbz2DF`.

---

## 2026-08-13 — GENESIS móvil centrado en una sola orientación (producción)

### Qué cambió

En `/biblioteca/videos/`, una persona con sesión y punto de partida guardado ahora entra en móvil a una vista de enfoque: nombre, una recomendación personalizada y un único CTA para reproducirla. El resto del catálogo, la bisagra comercial, el aviso de novedades y el tour quedan fuera de la primera decisión. **“Ver todos los videos”** mantiene una salida explícita hacia el índice completo.

La entrada usa un fade con desplazamiento corto y escalonado de hasta 440 ms; no simula escritura letra por letra ni añade librerías. Respeta `prefers-reduced-motion`. Al tocar el CTA, el bloque pierde protagonismo y abre el reproductor centrado que ya registra reproducción y progreso.

**“Tu punto de partida”** dejó de ocupar una ficha estática en móvil. Ahora es un control compacto que abre un `<dialog>` nativo centrado con señal, calorías, foco, progreso y enlace para actualizar el plan. El cierre funciona con botón, `Escape` o fondo y devuelve el foco al control que lo abrió.

### Velocidad y compatibilidad

La biblioteca se renderiza bajo demanda: antes del primer clic móvil hay 0 tarjetas, 0 miniaturas, 0 iframes y 0 scripts de YouTube. La API de YouTube sigue cargando únicamente cuando se abre un video. Los accesos directos con `?video=`, el gate sin sesión, el onboarding sin plan y las vistas desde 641 px conservan el flujo anterior.

### Resultado esperado

Reducir la sensación de “biblioteca para explorar” y convertir la primera pantalla en una acción concreta: abrir la orientación que corresponde hoy.

### QA local

Validado a 320 × 568, 375 × 667, 375 × 812, 768 × 1024 y 1280 × 800 px: sin overflow horizontal; CTA principal visible; expediente y reproductor con centro geométrico exacto; cierre de 44 × 44 px; restauración de foco; biblioteca diferida; acceso al índice completo; y enlace directo `?video=` sin pasar por la vista de enfoque. Los scripts inline compilan y `git diff --check` pasa.

### Publicación en producción

El commit funcional `f712c4f` generó el Preview `dpl_6yfaT7i5Aj4tMdSnEyMTP95R87F2`, confirmado `Ready`. El smoke autenticado devolvió `200` en `/biblioteca/videos/`, encontró la nueva vista de enfoque y el expediente modal, y confirmó `401` en `/api/genesis/me` sin sesión; no se enviaron formularios ni se crearon leads.

La rama se integró en `main` mediante el merge `7196936`. Vercel publicó el deployment productivo `dpl_H8iMEAPg51MGBf4Rt5VER4hJj5wK`, confirmado `Ready` el 13-ago-2026, con `https://metodo.tr4iner.com` entre sus aliases. En el dominio canónico, `/biblioteca/videos/` respondió `200`, `/api/genesis/me` respondió el `401` esperado sin sesión y el HTML publicado coincidió byte por byte con `biblioteca/videos/index.html` (`SHA-256 bf46d5972a718b446ffefc8a77dcb5370075c1bdbee7ee546a7fe8f6c7e75ccb`).

---

## 2026-08-13 — Reproductor de GENESIS centrado en móvil (producción)

### Qué cambió

En `/biblioteca/videos/`, el breakpoint móvil dejó de presentar el reproductor como una hoja anclada al borde inferior. El diálogo ahora conserva 12 px de margen lateral, las cuatro esquinas redondeadas y un centro explícito con `position: fixed`, coordenadas al 50% y `translate(-50%, -50%)`. Así no depende de cómo cada navegador móvil resuelva los márgenes automáticos de un `<dialog>`.

El ancho usa `100%` en vez de `100vw` para no contar la barra de desplazamiento como parte del contenido y evitar márgenes laterales desiguales. Al dejar de tocar el borde inferior, la barra del reproductor ya no añade el `safe-area-inset-bottom` reservado para una hoja inferior.

### Sin tocar

No cambió la apertura/cierre del diálogo, el iframe de YouTube, el progreso, la finalización automática, la analítica, el catálogo ni la navegación de la videoteca.

### QA local

Validado a 375 × 812 px con la geometría real del diálogo: quedó centrado con desviación `0 × 0`, ancho de 351 px, 12 px de margen lateral, sin overflow horizontal y cierre de 44 × 44 px. A 768 × 1024 y 1280 × 800 px también conservó centro exacto, sin overflow. Publicado con el mismo merge y deployment productivo documentados en la entrada anterior.

---

## 2026-08-22 — Landing Médicos / Guardias completa en local

### Qué cambió

Se creó `/medicos/` como un funnel independiente para médicos con turnos reales. La página desarrolla la dirección visual aprobada de **Guardias**: hero cinematográfico, una línea de 24 horas que avanza con el scroll y cuatro escenas —consulta, familia, guardia y ajuste— que explican cómo el plan cambia sin abandonar el objetivo.

El recorrido se completó con diagnóstico del problema, método de cuatro pasos, entregables, testimonios literales de Nohemí Aguilar, Flor de María y Víctor Dimas, criterios de encaje, preguntas frecuentes y un cierre único hacia una llamada de evaluación. El copy evita promesas clínicas y aclara que el acompañamiento no sustituye atención médica ni rehabilitación.

El hero usa posters WebP propios para escritorio y móvil. La estructura de video ya está preparada con fuentes WebM/MP4 comentadas: mientras no exista el archivo final, no descarga video y conserva el poster como elemento principal. Cuando se configure, solo intentará cargarlo al acercarse al viewport y respetará `prefers-reduced-motion`.

### Calendly, velocidad y atribución

El widget oficial de Calendly no se carga al abrir la página. El CSS y el SDK se solicitan únicamente ante intención real —foco, puntero o toque sobre un CTA— y el calendario se abre como popup. Si el SDK falla o un bloqueador lo impide, el enlace directo sigue funcionando.

Todos los `utm_*`, identificadores publicitarios disponibles y datos funcionales compatibles viajan a Calendly. Los eventos de vista, selección de hora y reserva confirmada se exponen a `dataLayer`; el webhook servidor existente sigue siendo la fuente de verdad de una agenda. No se ocultó el banner GDPR de Calendly porque esta landing todavía no tiene un gestor de consentimiento propio.

### SEO, accesibilidad y QA local

La ruta queda explícitamente en `noindex, nofollow` mientras sea una página de adquisición sin decisión orgánica. Incluye metadatos sociales, JSON-LD, estructura semántica, foco visible, navegación por teclado, áreas táctiles adecuadas, restauración del foco al cerrar Calendly y movimiento reducido.

Validado en 375 × 844, 768 × 1024, 1280 × 720 y 1280 × 900 px: cero overflow horizontal, CTA y línea temporal dentro del viewport, las cuatro escenas activan su estado correcto, FAQ y CTA móvil funcionan y el popup real de Calendly abre con los parámetros de atribución. No hubo errores propios de JavaScript; solo avisos esperables de Meta Pixel al ejecutarse sobre localhost.

### Resultado esperado

Mejorar la identificación del médico antes de pedir la agenda y medir la caída entre clic en CTA, vista del calendario, selección de horario y reserva confirmada.

### Estado

El commit funcional `859ec2b` quedó aislado en `work/medicos-guardias` y generó el Preview `dpl_549edhwHfaV16WGgKZJg5jrKvkDu`, confirmado `Ready`. `/medicos` y ambos posters respondieron `200`; el HTML servido coincidió byte por byte con `medicos/index.html` (`SHA-256 a1d6fd58d4853f1785f91d474cf6c94cfb7666c3e7caebc2d5e8357426919164`). El usuario aprobó la publicación; producción aún no se había tocado al cerrar esta validación.

### Publicación en producción

La rama se integró en `main` mediante el merge `239dd68`. Vercel publicó el deployment productivo `dpl_EfKBfpgqKV4fFJD2WMtJbMNTyiY4`, confirmado `Ready` el 22-ago-2026 a las 07:50 (Lima), con `https://metodo.tr4iner.com` entre sus aliases. En el dominio canónico, `/medicos` y ambos posters respondieron `200`; el HTML conservó el mismo SHA-256 validado en Preview y local.

---

## 2026-08-22 — Médicos pasa de agenda a registro para el caso de Flor (local)

### Qué cambió

`/medicos/` dejó de ser una landing larga centrada en guardias y Calendly. Ahora es una
página corta de registro: explica de forma explícita la asesoría online de entrenamiento,
nutrición y seguimiento de TR4INER, pide nombre, correo y sexo, y presenta el caso real de
Flor de María como siguiente paso. El mensaje central pasó de un único contexto laboral a
un deseo más amplio: recuperar el físico sin convertir el fitness en otro trabajo.

El diseño conserva el lenguaje aprobado —poster médico, paleta nocturna, amarillo, tipografía
Instrument Sans/JetBrains Mono y reloj—, pero la línea horaria quedó como firma visual en vez
de conducir todo el argumento. En escritorio, copy y formulario conviven completos en el
primer viewport. En móvil, el formulario sube antes del reloj. Se mantuvo preparado el
reemplazo futuro del poster por video WebM/MP4. Se retiró por completo la barra superior con
marca, descriptor y CTA, además del guion ornamental previo al descriptor del hero; el
contenido ahora comienza sin una franja ni un espacio reservado invisibles.

### Registro, atribución y redirección

El formulario reutiliza el contrato canónico de Caso de Estudio: `nombre`, `email`, `sexo`,
`video`, `utm`, `page_url`, `timestamp` y `variant`, y añade `funnel=medicos`. Envía al webhook
existente de n8n y, en paralelo, conserva el backup `TR4Track.saveOptIn`. Bloquea dobles
envíos, valida correo y dominios temporales, enfoca el primer error y expone estados de carga
sin enviar datos personales a `dataLayer`.

Tanto `Mujer` como `Hombre` redirigen a `/testimonio-flor` sobre el mismo origen. El salto
conserva la query completa, `first_name`, correo con `@` literal, sexo, video, cualquier
`utm_*`, identificadores publicitarios conocidos y parámetros desconocidos futuros. Se
retiraron el SDK, enlaces y eventos de Calendly para no mezclar la medición anterior con el
nuevo objetivo de registro. Médicos no hereda la cookie global `ab_ce`; solo conserva una
`variant` enviada de forma explícita en la URL, evitando contaminar el experimento de Caso
de Estudio.

### Movimiento, SEO y accesibilidad

GSAP 3.15.0 y ScrollTrigger cargan después del contenido y mueven únicamente el poster y el
reloj en planos opuestos. La landing sigue operativa si el CDN falla; con
`prefers-reduced-motion` no descarga GSAP y deja ambas capas inmóviles. La ruta conserva
`noindex, nofollow`, canonical, metadatos sociales y JSON-LD de servicio. Incluye labels,
fieldset semántico, foco visible, skip link, estados `aria-live`, targets táctiles de 52 px y
anclas con margen de lectura convencional.

### QA local

Validado en 375 × 812, 768 × 1024 y 1280 × 900 px: cero overflow horizontal, controles de
52 px, formulario completo en el primer viewport de escritorio, layout móvil correcto y
parallax activo en los tres breakpoints. La validación vacía marcó y enfocó nombre, correo y
sexo; el dominio temporal quedó bloqueado. Con el envío externo aislado durante la prueba,
ambos sexos terminaron en `/testimonio-flor` y conservaron UTMs, `fbclid`/`gclid`, un
`custom_id` sintético, nombre, correo, sexo y `funnel=medicos`; no se crearon leads reales.
Los scripts inline compilan, JSON-LD parsea y `git diff --check` pasa.

Después de retirar la barra superior y el guion ornamental se repitió el control visual en
375 × 812, 768 × 1024 y 1280 × 900 px: el DOM ya no contiene el header ni su listener de
scroll, el pseudoelemento del guion no genera contenido y se mantiene cero overflow.

### Resultado esperado

Reducir la fricción del primer paso, explicar qué se está ofreciendo antes de pedir datos y
medir el avance desde registro médico hasta consumo del caso de Flor.

### Estado

El commit funcional `5ef520f` quedó aislado en `work/medicos-gsap-motion`. Generó el Preview
`dpl_82ubgMDYzTWXcg116LLugnSEZfKL`, confirmado `Ready` el 22-ago-2026. La ruta protegida
`/medicos/`, `attribution.js` y `/testimonio-flor` respondieron `200` mediante el acceso
autenticado de Vercel. El usuario aprobó la publicación; producción seguía intacta al cerrar
esta validación.

### Publicación en producción

La rama se integró en `main` mediante el merge `7c6227a`. Vercel publicó el deployment
productivo `dpl_F6NX7LGy8YgdwbxzL7ErfW9SqGRN`, confirmado `Ready` el 22-ago-2026 a las
11:28 (Lima), con `https://metodo.tr4iner.com` entre sus aliases. En el dominio canónico,
`/medicos` mostró el formulario y el copy nuevos, sin barra superior ni guion ornamental,
con la redirección a `/testimonio-flor` presente y cero overflow en la vista comprobada.

---

## 2026-08-25 — Médicos convierte la landing en la historia concreta de Flor (producción)

### Qué cambió

El hero de `/medicos/` dejó el mensaje general de asesoría y pasó a presentar desde la
primera pantalla el caso de Flor de María. La etiqueta ahora la identifica como médica
general; el titular muestra el recorrido declarado de 78 kg y 34% de grasa corporal a
56 kg y 20% en 12 meses; y el texto explica el cardio, la dificultad para sostener el
esfuerzo y los ajustes de alimentación, entrenamiento y planificación.

El panel de registro pasó de «Conoce el caso» a «Accede al caso completo de Flor» y anticipa
que el lector verá qué comía, cómo entrenaba, qué frenaba sus resultados y qué cambios se
hicieron durante el proceso.

La segunda pasada concreta la oferta en la sección de método, destaca las dos conclusiones
clave del relato y añade el antes/después de Flor dentro del testimonio. La fotografía se
publica en WebP responsive de 21 KB para móvil y 55 KB para escritorio, con dimensiones
explícitas y carga diferida para no competir con el LCP del hero.

La tercera pasada elimina el reloj de horarios completo y el rótulo repetido del testimonio.
En pantallas de hasta 640 px, el antes/después pasa debajo del titular con un control de play;
la explicación queda debajo de la imagen y termina en un CTA único. Tanto el play como el CTA
abren el mismo formulario en un modal; el CTA fijo anterior se retiró.

El formulario móvil conserva `autocomplete=name` y `autocomplete=email`, añade pistas nativas
de teclado y deja que iOS/Android propongan los datos guardados sin cargar un SDK externo. En
tablet y escritorio sigue visible dentro del hero.

### Alcance protegido

No se tocaron campos, validación, webhook, backup de `TR4Track`, atribución ni redirección a
`/testimonio-flor`. El parallax del poster y el espacio para el futuro video se conservan;
solo se retiró de GSAP la referencia al reloj eliminado. El modal mide su apertura mediante
`medicos_registration_modal_open`. La decisión SEO se mantiene en `noindex, nofollow`.

### QA local

En la segunda pasada se validó en 375 × 812, 768 × 1024 y 1280 × 900 px: no hubo overflow
horizontal, las fuentes
locales cargan y los targets reales miden 52 px. En móvil, al tocar el CTA fijo, el panel de
registro completo queda entre 18 y 705 px de un viewport de 812 px; el CTA fijo se oculta y
no tapa el envío. La variante móvil de la fotografía se seleccionó correctamente. Los
scripts inline compilan, JSON-LD parsea y `git diff --check` pasa.

Tras convertir el registro en modal se repitió el control responsive: en móvil la imagen,
descripción y CTA aparecen en ese orden, el formulario permanece fuera del árbol accesible
hasta abrirse, cabe en el viewport, bloquea el fondo, cierra con botón, fondo o Escape y
devuelve el foco al disparador. A 768 y 1280 px el formulario permanece inline, sin atributos
de diálogo. No hay overflow ni referencias residuales al reloj, rótulo o CTA fijo.

### Cuarta pasada: el modal salía recortado contra el borde del hero

El panel de registro vivía dentro del hero, y el `overflow` que recorta el fondo
cinematográfico recortaba también el modal: al abrirlo en móvil se cortaba contra el borde de
la sección en vez de flotar sobre la página. Ahora, en móvil, el modal y su fondo se mueven al
`<body>`, fuera de todo ancestro que recorte; al volver a escritorio regresan a su lugar
original, marcado por el span vacío `#registration-home` para no alterar el orden del
documento.

El inset inferior pasó a `auto`: el panel se ancla arriba y toma solo el alto que necesita, en
lugar de estirarse hasta el piso arrastrando una franja vacía. El `max-height` sigue en pie,
así que en pantallas chicas conserva el scroll interno.

### Dos etiquetas de copy

El arranque del popup decía «Caso real · Médica general» dos renglones arriba de «Accede al
caso completo de Flor», repitiendo el dato; quedó solo «Médica general». Y la sección de
método dejó de anunciarse como «Qué es TR4INER» —que promete una definición de marca— para
llamarse «Cómo trabajamos», que es lo que el lector encuentra debajo.

### QA de la cuarta pasada

Medido en el navegador contra el servidor local, con el modal abierto:

- **430 × 932:** entra completo entre 12 y 679 px, con alto propio de 667 px y sin scroll
  interno. Ningún ancestro lo recorta.
- **375 × 812:** respeta el notch (arranca en 35 px vía `env(safe-area-inset-top)`), termina en
  692 px y el CTA de envío queda a la vista.
- **320 × 568:** el `max-height` lo limita a 544 px, se mantiene dentro del viewport y activa el
  scroll interno (698 px de contenido en 539 px visibles); el CTA se alcanza scrolleando.
- **Escritorio:** el panel vuelve a `.hero-inner` en el orden correcto (`#registration-home` →
  fondo → panel), sin `role`, `aria-modal` ni `aria-hidden`, y el fondo queda en `display:none`.
- **Cierre:** botón, fondo y Escape cierran; el foco vuelve al disparador que abrió el modal y
  se libera el scroll del body. Los dos disparadores (play y CTA) abren.
- El fondo cubre el viewport en z-80 bajo el panel en z-90. El HTML queda balanceado, los tres
  scripts inline compilan, el JSON-LD parsea y la consola no reporta errores.

**Pendiente menor:** a 320 × 568, con el panel scrolleado hasta abajo, el botón de cerrar —que
es `absolute` dentro del panel— se va de la vista. Se recupera scrolleando hacia arriba, y
Escape y el fondo siguen cerrando, así que no atrapa a nadie. Si molesta, la corrección es
hacerlo `sticky`.

### Quinta pasada: el play falso late

El botón de play sobre el antes/después era estático y no pedía el click. Ahora tiene el
mismo anillo que late hacia afuera que usa el reproductor: nace en el borde del botón, crece
25 px y se desvanece en ciclos de 2 s.

Va como `box-shadow` animado sobre `::after` —`::before` ya dibuja el triángulo— y al ser
sombra exterior nunca pisa la cara amarilla ni tapa el triángulo. El tamaño queda
parametrizado en `--play-pulse-size: 25px`, espejando el `--vid-pulse-size: 24.96px` de la
referencia. El amarillo va literal en los keyframes porque `currentColor` en el botón es la
tinta del triángulo, no el amarillo; se usó `--yellow` (#F5C518), el del botón, y no el
`rgb(255, 184, 0)` del snippet original, que al lado se leía como un amarillo distinto.

Con `prefers-reduced-motion: reduce` el latido se apaga.

**Alcance:** el play falso solo existe en móvil (`.hero-case-visual` es `display:none` en el
CSS base y solo aparece bajo 640 px), así que el latido se ve únicamente ahí.

Medido: la curva va de 0 a 25 px de spread con la opacidad de 0.55 a 0; el layout no se mueve
y la figura no gana scroll propio; el botón conserva sus 68 px de área clickeable y sigue
abriendo y cerrando el modal. HTML balanceado, CSS con las llaves parejas, JS y JSON-LD sin
errores.

### Estado

El commit funcional `4063f97` quedó aislado en `work/medicos-copy-flor`. Generó el Preview
`dpl_J8hrG2a7ijDxooJD1UocHR8vuU4Y`, confirmado `Ready` el 25-ago-2026; `/medicos/`
respondió `200` mediante el acceso autenticado de Vercel. Producción no se tocó y espera
aprobación visual del usuario. La iteración de prueba visual y CRO móvil quedó en el commit
`f32ade1`. El deployment `dpl_FNrCwtU6MoZ2m9o3TswszMHFaCHj` quedó `Ready` el 25-ago-2026
y actualizó el alias de la rama. La tercera pasada de registro modal quedó en `63e302b`; el
deployment `dpl_AAaECBDK5w5o1PgW7N5x5htSH4da` quedó `Ready` el 25-ago-2026 y actualizó el
alias de la rama.

La cuarta pasada quedó en `d5b5e0a` (el modal sale del hero), `83b1a64` y `3265e7d` (las dos
etiquetas de copy). Con la aprobación del usuario, `work/medicos-copy-flor` se integró en
`main` mediante el merge `af35fb4`, y el push publicó **producción**: deployment
`dpl_qtMmmhcv1WcDp9tbjm3xjc7oeC12`, `Ready` el 25-ago-2026 en 17 s, con alias
`metodo.tr4iner.com`. Verificado en vivo sobre `https://metodo.tr4iner.com/medicos/`: responde
`200`, el modal abre a 430 × 932 sin ningún ancestro que lo recorte, y los dos rótulos nuevos
(«Médica general» y «Cómo trabajamos») salen servidos desde producción.

El latido del play quedó en `2be3ac6`, se integró a `main` con el merge `f738fa9` y publicó el
deployment `dpl_EA3Lj4uT4A63w6kpbBjuXC8XzMfE`, `Ready` el 25-ago-2026 en 7 s. Verificado en
vivo sobre `https://metodo.tr4iner.com/medicos/` a 430 px: la animación `hero-play-pulse` corre
en bucle de 2 s sobre `.hero-case-play::after` y el anillo se ve alrededor del botón.

Las dos ramas (`work/medicos-copy-flor` y `work/medicos-play-pulse`) siguen vivas por si hace
falta revertir.

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
