# VERO-BOT (`N2e6Ht6uWwER5qbD`) — cambios para el prompt v2

**Alcance decidido el 11-ago-2026: el bot vende directo por WhatsApp y no agenda.** No hay
calendario, no hay herramientas nuevas para el agente, no hay sub-flujos. Cuando un caso no
es suyo, deriva y el equipo escribe por el mismo chat.

Eso deja el trabajo en tres cambios, todos dentro del flujo actual.

## Estado actual (leído del flujo, 11-ago-2026)

```
Webhook (ManyChat) → Separar en partes → [audios] → [imágenes] → Ordenar variables
  → AI Agent1 (OpenAI + Postgres Chat Memory)
  → Respuesta (parsea el JSON) → Settear variables (ManyChat setCustomFields)
  → Enviar WPP (ManyChat sendFlow content20260119233756_933426)
```

---

## Cambio 1 — el prompt

`AI Agent1 → options.systemMessage` = contenido completo de
[`docs/bot-vero/prompt-v2.md`](prompt-v2.md).

Pégalo como **texto plano**, no como expresión. No contiene `{{ }}`, así que no hay riesgo
de que n8n intente evaluar nada.

---

## Cambio 2 — `Separar en partes`: sacar el prefijo telefónico del país

Una línea, y no es cosmética. Hoy el nodo hace:

```js
pais: firstNonEmpty(cf['País'], cf.Pais, body.phone_country_code),
```

Con eso, un lead sin el campo `País` cargado llega al agente con `pais: "51"`. El prompt v2
prohíbe explícitamente deducir el país del prefijo (§5.1), así que el bot recibiría un dato
que sus propias reglas le impiden usar — y en el mejor caso lo ignora, en el peor lo trata
como país confirmado y ya no vuelve a preguntar.

```js
// El prefijo dice de donde es el numero, no donde vive la persona: un peruano en
// Madrid conserva su +51. El pais lo confirma el lead en el chat.
pais: firstNonEmpty(cf['País'], cf.Pais),
ciudad: firstNonEmpty(cf.Ciudad),
```

Aprovechá el mismo paso para pasar teléfono y correo, que le sirven al equipo cuando
retoma un caso derivado:

```js
const telefono = firstNonEmpty(body.whatsapp_phone, body.phone, cf.PhoneCompra);
const email = firstNonEmpty(body.email, cf.CorreoCompra, cf['Email Lead']);
```

…y agregalos al `return` junto a `contextoLead`.

---

## Cambio 3 — dos llamadas a ManyChat, no una

**Esto se aprendió rompiéndolo en producción.** Ver el incidente al final.

`setCustomFields` de ManyChat es **todo o nada**: si un solo `field_name` del array no
existe en la cuenta, rechaza la llamada completa con `400 Validation error / Field[n] not
found`. Y el texto que lee el lead viaja dentro de `Parte 1..3`, en ese mismo array. O sea:
un campo de analítica sin crear deja al lead **sin respuesta**, con la ejecución en verde.

Por eso el flujo quedó así:

```
Respuesta → Settear variables (Parte 1..3 + campos viejos) → Enviar WPP → Settear cualificacion
             ^^^ crítica, antes del mensaje                              ^^^ best-effort, después
```

`Respuesta` emite dos arrays:

- **`fields`** — `Parte 1..3` más los 6 campos que ya existían en ManyChat desde hace meses
  (`País`, `Estado Actual`, `Presupuesto`, `Nivel de Importancia`, `Estas Listo`,
  `Situación`). Va en la llamada crítica, antes de enviar el mensaje.
- **`fields_nuevos`** — los 12 del prompt v2. Va en `Settear cualificacion`, un nodo aparte
  **después** de `Enviar WPP`, con `onError: continueRegularOutput`. Si fallan, el lead ya
  recibió su respuesta y lo único que se pierde es la analítica de ese turno.

Los 12 campos nuevos, con estos nombres exactos:

`Ciudad` · `Zona Horaria` · `Rango Edad` · `Driver` · `Senales Salud` · `Profesional Salud` ·
`Ansiedad Comida` · `Bandera Clinica` · `Score` · `Prioridad` · `Requiere Humano` ·
`Motivo Handoff`

**`Prioridad` es el que rinde plata.** Con `alta` en un campo de ManyChat, un closer humano
filtra y entra a las conversaciones de perfil de salud y profesionales de la salud mientras
el bot las trabaja. Es lo que reemplaza a la agenda.

`Settear cualificacion` usa la credencial `ManyChat Vero API` (`bGitYGWvdMxo0t3b`). Ojo: el
MCP de n8n **redacta las credenciales al leer** —todos los nodos HTTP devuelven
`credentials: null`, incluso los que funcionan—, así que no se puede verificar por lectura;
hay que asignarla explícitamente con `setNodeCredential`.

---

## Incidente 11-ago-2026, 18:40–18:55 UTC — el bot dejó de responder

**Síntoma:** dos ejecuciones en `success`, cero respuestas al lead.

**Causa:** `Respuesta` mandaba los 12 campos nuevos en la misma llamada que `Parte 1`.
Ninguno existía en ManyChat, así que la API devolvió `Field[3] not found` —era
`Requiere Humano`— y rechazó el array entero. `Parte 1` nunca se escribió y el flow de
ManyChat disparó con el campo vacío.

**Lo que no alcanzó:** el `onError: continueRegularOutput` que se había puesto en
`Settear variables` como protección. Evita que el workflow se caiga, pero no sirve de nada
cuando el contenido del mensaje es justamente lo que no se pudo escribir. Protegía el flujo,
no la conversación.

**Fix:** separar el mensaje de la analítica en dos llamadas (arriba). Ahora ningún campo de
analítica puede costar una conversación, exista o no en ManyChat.

**Lección para el próximo campo nuevo:** cualquier `field_name` que se agregue va a
`fields_nuevos`, nunca a `fields`. Un campo entra a la llamada crítica solo después de estar
creado y verificado en ManyChat.

---

## Pruebas antes de activar

- Lead que dice "estoy en Lima" → **no** deriva, sigue vendiendo (regresión del cambio de
  alcance).
- Lead que dice "tengo la insulina alta" → `driver=salud`, `senales_salud` con
  `insulina_alta`, `prioridad_equipo=alta`, y **recomienda plazo largo** en vez de bajar el
  producto.
- Lead que dice "soy médico" → `profesional_salud=true`, score ≥3.
- Lead que pide el enlace de una → recibe el enlace, sin interrogatorio previo.
- Lead que dice "prefiero que me llamen" → deriva **sin** dar hora ni prometer llamada.
- Lead que dice "tengo atracones y después me da culpa" → `bandera_clinica`, handoff.
- Lead sin el campo `País` cargado → el bot pregunta el país, no asume por el prefijo.
- Lead que dice "no me alcanza" una sola vez → **todavía no** se le ofrece Fit4.

---

# Anexo EN PAUSA — credencial de Google Calendar (OAuth2)

> **No hace falta para el alcance actual.** Queda documentado porque el cliente OAuth ya
> está creado y con la URI de redireccionamiento puesta: si algún día se retoma la agenda
> automática, se arranca desde el Paso 1 y no desde cero.

Workspace `tr4iner.com`, admin `analisis@tr4iner.com`, calendario destino
`martinmichelucci@tr4iner.com`, proyecto de Cloud `Agendas Tr4iner`.

## Por qué OAuth2 y no service account

El nodo de Google Calendar de n8n **no acepta credenciales de service account**: la tabla
de nodos compatibles marca OAuth ✅ / Service Account ❌. Con service account habría que
tirar el nodo y hablarle a la API REST con HTTP Request + delegación de dominio, que además
necesita súper admin y Google la marca como no recomendada. No vale la pena acá.

## Lo que hay que decidir antes de tocar nada: quién autoriza

**Recomendado: autoriza `analisis@tr4iner.com` y Martín le comparte su calendario.**

- No depende de que Martín esté disponible para el clic de OAuth, ni se cae si cambia su
  contraseña o deja el equipo.
- Sumar un segundo closer después es compartir su calendario y cambiar el `calendarId`:
  misma credencial.
- Contra: los eventos quedan *creados por* `analisis@`. El **organizador** sigue siendo el
  calendario de Martín, así que la invitación le llega al lead a nombre de él, con un "en
  nombre de" en el detalle. Si eso molesta, la alternativa es que autorice Martín y n8n
  escriba en su calendario `primary`.

Si va por la vía recomendada, Martín tiene que compartir su calendario con `analisis@` con
permiso **"Hacer cambios en los eventos"**. Con "solo ver libre/ocupado" alcanza para
`buscar_horarios`, pero no para crear la cita.

## Paso 1 · Confirmar que el proyecto es de la organización

En Google Cloud, con el proyecto `Agendas Tr4iner` seleccionado: **IAM y administración →
Configuración**. Tiene que mostrar la organización `tr4iner.com`.

Esto no es un detalle burocrático: si el proyecto es personal y no de la organización, más
adelante no vas a poder elegir audiencia **Interna**, y sin Interna el scope de Calendar
—que Google clasifica como sensible— arrastra verificación de la app y los tokens de
prueba se vencen cada 7 días. Si el proyecto quedó fuera de la organización, crea uno
nuevo logueado como `analisis@` eligiendo `tr4iner.com` como recurso padre.

## Paso 2 · Habilitar la API

**APIs y servicios → Biblioteca de APIs** → **Google Calendar API** → Habilitar.

Es la primera tarjeta de la búsqueda. Ni `Calendar MCP API` (es para MCP remoto) ni
`CalDAV API` (protocolo viejo): el nodo de n8n habla con la Google Calendar API.

## Paso 3 · Google Auth Platform (ex pantalla de consentimiento)

1. **Descripción general → Comenzar**: nombre de la app (ej. `n8n TR4INER`) y correo de
   soporte `analisis@tr4iner.com`.
2. **Audiencia → Interna.** Este es el paso que importa. Interna significa: sin
   verificación de Google, sin lista de usuarios de prueba, sin vencimiento de refresh
   token a los 7 días. Google lo documenta como caso exento de verificación: *"la app la
   usan solo personas de tu organización de Google Workspace... el proyecto debe ser
   propiedad de la organización"*.
3. **Branding**: agregá `up.railway.app` como dominio autorizado (el dominio donde corre
   la instancia de n8n).
4. **Acceso a datos → Agregar o quitar permisos**: `https://www.googleapis.com/auth/calendar`.

## Paso 4 · Crear el cliente OAuth

> **Ya existe**: cliente `Agendas Tr4iner` (`200263278471-koepkd583c5a908a5mquv29s894eauoh`),
> creado el 7-jun-2025 y en uso desde entonces por otras credenciales de Google en n8n. Se
> reusa tal cual para Calendar — un cliente OAuth sirve para todas las APIs habilitadas en
> el proyecto. Lo único que no se puede recuperar es el **secreto**: Google ya no lo muestra.
> Si no lo tenés guardado, **Add secret** genera uno nuevo sin invalidar el anterior, así que
> no rompe las credenciales que ya funcionan.

**Google Auth Platform → Clientes → Crear cliente → Aplicación web.**

En **URIs de redireccionamiento autorizados** va la URL que muestra n8n en el panel de la
credencial, copiada tal cual. Para esta instancia es:

```
https://primary-production-0efa.up.railway.app/rest/oauth2-credential/callback
```

Cópiala de n8n igual, no de acá: si la instancia tiene otro `N8N_EDITOR_BASE_URL`, la que
manda es la de n8n, y una letra de diferencia da `redirect_uri_mismatch`.

Guardá **ID de cliente** y **secreto de cliente**.

## Paso 5 · La credencial en n8n

n8n → **Credentials → New → Google Calendar OAuth2 API** → pegar Client ID y Client
Secret → **Sign in with Google** → iniciar sesión con `analisis@tr4iner.com` (o con Martín,
según lo decidido en el punto de arriba) → aceptar → Guardar.

Nombrala `Google Calendar · Agendas Tr4iner` para que se distinga de futuras.

## Paso 6 · Probar antes de construir los sub-flujos

1. Nodo Google Calendar → resource `calendar`, operation `availability`, calendar
   `martinmichelucci@tr4iner.com`, rango de mañana. Debe devolver los bloques ocupados.
   Si devuelve vacío con el calendario lleno, falta el permiso de compartición.
2. Nodo Google Calendar → `event:create` en ese mismo `calendarId`, con `sendUpdates: all`
   para que la invitación le llegue de verdad al lead. Creá una cita de prueba, verificá
   que aparece en el calendario de Martín, y borrala.

`sendUpdates: all` es fácil de olvidar y su ausencia no da error: la cita queda creada y el
lead nunca se entera.

## Si el clic de OAuth falla con "Acceso bloqueado"

No es el proyecto, es la política del Workspace: **Consola de administración → Seguridad →
Controles de acceso y de datos → Controles de API**. Ahí se define si se confía en las apps
internas de la organización o si están bloqueadas las apps de terceros no configuradas.
Requiere `analisis@` con rol de admin.
