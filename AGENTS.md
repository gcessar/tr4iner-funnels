# AGENTS.md — Contexto del repo (funnels TR4INER)

> Contexto compartido para agentes de IA (Codex **y** Claude Code — `CLAUDE.md` es un symlink a este archivo). Mantener conciso. El registro cronológico de cambios va en `BITACORA.md`.

## Qué es esto

Páginas **HTML estáticas** de los funnels de TR4INER (coaching fitness de Anthoni Montalván). Sin framework ni build step (salvo un par de generadores `.mjs` sueltos). Cada archivo es una página autónoma con su CSS/JS inline.

- **Deploy:** `.vercel/project.json` apunta al único proyecto canónico `tr4iner-funnels` (`prj_9Px…`). El duplicado `tr4iner-funnel-casos-estudio` (`prj_87…`) fue eliminado el 14-jul-2026. Dominio canónico futuro: `metodo.tr4iner.com`.
- **Repo git:** `github.com/gcessar/tr4iner-funnels`.
- **Dev local:** `.claude/launch.json` → `python3 -m http.server 4599`. Abrir `http://localhost:4599/index.html`.
- **CRM separado:** el análisis/dashboards viven en otro repo (`crm-ventas`, Next.js). Este repo es solo las páginas del funnel.

## Arquitectura acordada de funnels y dominio

Este repo contiene **tres funnels distintos**, aunque compartan estilos, `attribution.js` y el mismo proyecto de Vercel:

1. **Caso de Estudio:** adquisición y calificación. La landing principal registra nombre/email/sexo, muestra el VSL Flor o Dashiel, continúa a Typeform y luego al tramo de Calendly.
2. **Biblioteca / Programa Cero:** lead magnet independiente para nutrir MQL. Vive completo bajo `/biblioteca/` (`registro → confirma → videos`). No confundir sus leads, webhook ni métricas con Caso de Estudio.
3. **Médicos / Guardias:** landing de adquisición independiente bajo `/medicos/`. Presenta el método adaptable a consulta, familia y guardias; su conversión principal abre Calendly bajo demanda. No mezcla opt-ins ni métricas con los otros funnels.

Decisión del 14-jul-2026: mantener ambos funnels en **un solo proyecto Vercel y un solo dominio**, con rutas claramente separadas. El dominio canónico futuro será `metodo.tr4iner.com` cuando termine la migración desde ClickFunnels. Mientras se prueba, todas las páginas deben funcionar igual bajo cualquier deployment de preview de Vercel.

Rutas objetivo del proyecto:

- `/` → redirección permanente a `/casos-de-estudio`.
- `/casos-de-estudio` → landing canónica de Caso de Estudio.
- `/casos-de-estudio-va` → registro exclusivo de Veronika; captura nombre/email, fuerza `sexo=Mujer` y continúa a Flor VA.
- `/testimonio-flor` → página Flor (`registro-typeform-flor.html`).
- `/testimonio-flor-va` → variante Flor para tráfico VA (`registro-typeform-flor-va.html`).
- `/testimonio-dashiel` → página Dashiel (`registro-typeform-optimizado.html`).
- `/calendly-*` → agendamiento y confirmación del funnel Caso de Estudio.
- `/fit4` → VSL privada de FIT4CHALLENGE AN y compatibilidad temporal con la selección VA por UTMs.
- `/fit4-va` → VSL FIT4 fija de Veronika, con canonical y marca de variante propios para el mapeo posterior.
- `/biblioteca/`, `/biblioteca/confirma/`, `/biblioteca/videos/` → funnel Programa Cero.
- `/medicos/` → landing de Guardias para médicos; CTA principal abre la asesoría de Calendly.

Las versiones `clickfunnels.html`, generadores `build-clickfunnels.mjs` y archivos `*-clickfunnels*` son compatibilidad temporal. **No son las versiones canónicas ni deben incluirse al decidir rutas o validar el funnel Vercel**, salvo pedido explícito.

## Mapa de archivos

| Archivo | Función |
|---|---|
| `index.html` | Landing + registro de **Caso de Estudio** (`/casos-de-estudio`). Captura nombre/email/sexo + UTMs y redirige al VSL. |
| `casos-de-estudio-va/index.html` | Registro de Veronika. No pregunta sexo: envía `Mujer`, UTMs VA de respaldo y redirige a `/testimonio-flor-va`. |
| `registro-typeform-optimizado.html`, `registro-typeform-flor.html` | Versiones canónicas editoriales (antes variante A) de Dashiel y Flor. |
| `registro-typeform-flor-va.html` | Página Flor específica para tráfico VA; ruta pública `/testimonio-flor-va`. Debe mantener el mismo copy que Flor normal y diferenciarse por el video VA. |
| `registro-typeform-optimizado-B.html`, `registro-typeform-flor-B.html` | Versiones anteriores archivadas como B; no son las rutas públicas actuales. |
| `calendly-an-optimizado.html`, `calendly-va/index.html`, `calendly-confirma/index.html` | Páginas canónicas editoriales de agendamiento y confirmación. |
| `calendly-an-optimizado-B.html`, `calendly-va/index-B.html`, `calendly-confirma/index-B.html` | Versiones visuales anteriores archivadas como B. |
| `biblioteca/` | Videoteca / recursos. |
| `medicos/index.html` | Landing completa de **Médicos / Guardias** (`/medicos/`), con relato de 24 horas y Calendly diferido. |
| `fit4challenge-video-clickfunnels.html` | Página del challenge Fit4. |
| `fit4/index.html`, `fit4-va/index.html` | VSL FIT4 públicas de Anthoni/compatibilidad y Veronika. La ruta VA siempre carga su video y eventos propios. |
| `assets/va/` | Imagen del caso y tema compartido de Veronika. Usa Montserrat 900/300; no publicar los archivos Mont DEMO. |
| `assets/medicos/` | Posters responsive del hero de Guardias; el futuro video debe conservarlos como fallback y LCP. |
| `attribution.js` | **TR4Track** canónico: captura reusable de atribución (UTMs + `?video=<id>` de YouTube), persiste el video en `localStorage` como first-touch. Nombre neutro para evitar bloqueadores. |
| `track.js` | Copia de compatibilidad antigua; no enlazar desde páginas nuevas porque algunos bloqueadores la interceptan. |
| `BITACORA.md` | Changelog del funnel (registrar cada cambio con impacto en KPIs). |

Las antiguas variantes `-A` fueron promovidas a los nombres canónicos el 14-jul-2026. El sufijo `-B` identifica las páginas anteriores archivadas. Cuando se implemente el A/B test real, documentar nuevamente la asignación y no cambiar las rutas públicas.

En agendamiento, AN usa Vidalytics `w0UY0FRGIQo11cXX` y VA usa `2s1vpHRi_hOARyIm`. En `/calendly-confirma/`, `hasVaUtm()` reconoce `funnel=VA`, `funnel_variant` VA o cualquier valor `utm_*` con `-VA-`; en esos casos carga `Mb4FA69mwzRO27Er`, y en cualquier otro carga `eSFGvAyB_NIHVP9e`. No romper esta selección al cambiar diseño o rutas.

## Sistema tipográfico canónico

La Biblioteca es la referencia visual del proyecto. Todas las páginas canónicas usan la misma carga de Google Fonts y estos roles: **Fraunces** para títulos editoriales, **Instrument Sans** para lectura e interfaz y **JetBrains Mono** para etiquetas, metadatos y estados. Base recomendada: cuerpo `17px/1.55`, display Fraunces `560` con `opsz 100`, cursiva `500`, y metadata Mono `10.5px/500` con tracking amplio. No introducir otra familia o variante de URL sin una decisión visual explícita.

## SEO y GEO obligatorios

- Toda página nueva o rediseñada debe salir con una decisión explícita de indexación y una revisión SEO/GEO; no se deja para después del deploy.
- Las páginas indexables necesitan como mínimo título y descripción únicos, canonical, metadatos sociales, jerarquía semántica, contenido rastreable que responda la intención, entidades claras y JSON-LD pertinente.
- GEO exige respuestas directas y citables, autoría/marca identificable, datos verificables y estructura fácil de interpretar por buscadores y asistentes de IA.
- Los pasos operativos o delgados del funnel (confirmaciones, descargas y agendamiento) deben usar `noindex`; optimizar no significa indexar basura.
- Al migrar el dominio, revisar canonicals, `robots.txt`, `sitemap.xml`, redirects y ausencia de URLs de preview antes de publicar.

## Modelo de atribución (crítico)

1. El tráfico entra a `index.html` (`/casos-de-estudio`) con UTMs en la URL (orgánico `-AN-`: YouTube/TikTok/Face/IG; o `utm_source=MetaAds`).
2. `index.html` captura los UTMs (`utmData`, ~línea 1246) y el `?video=`.
3. Al registrarse, `buildRedirectUrl()` (~línea 1285) redirige al VSL por **sexo**:
   - `Mujer` → `/testimonio-flor` en el mismo origen de la página actual.
   - `Hombre` → `/testimonio-dashiel` en el mismo origen de la página actual.
   - **y adjunta `first_name`, `email`, `sexo`, `video` + TODOS los UTMs** (loop en ~línea 1294).
4. El registro se guarda en el **Google Sheet `LEADS`** (id `1Tdf7SP70_05h1K7ZtqdH8uWVatob3KSzAXRstyqGfz0`, tab gid 783595842). Columnas: `FECHA · NOMBRE · CORREO · SEXO · UTM_CAMPAIGN · UTM_MEDIO · UTM_SOURCE`.

> **Este opt-in NO va al CRM.** El CRM (`crm-ventas`) se nutre de Typeform, un paso posterior.

### Regla de navegación y atribución

- Durante previews, redirects y CTAs deben construirse con `window.location.origin` o rutas relativas; nunca hardcodear el dominio de producción. Así el recorrido permanece dentro del mismo deployment de Vercel.
- En producción, el mismo código resolverá automáticamente sobre `https://metodo.tr4iner.com`.
- **Cada salto entre páginas debe reenviar todos los parámetros de atribución presentes**, no una lista parcial: cualquier `utm_*`, `video`, `fbclid`, `gclid`, `fbc_id`, `h_ad_id` y futuros identificadores equivalentes.
- También se preservan los datos funcionales necesarios (`first_name`, `name`, `email`, `sexo` y parámetros de Calendly). El email debe llegar con `@` literal cuando el siguiente sistema lo necesite.
- Antes de publicar, probar la cadena completa con UTMs sintéticas y verificar la URL en cada salto.

### Incidente resuelto — bug de UTMs (13-jul-2026)
`buildRedirectUrl()` **no reenviaba los UTMs** a las páginas flor/dashiel (solo nombre/email/sexo). Del 11 al 13-jul los leads del sheet `LEADS` quedaron sin UTMs. **Ya corregido** (el loop de `utmData` en `buildRedirectUrl`). Regularización de los datos históricos (Clarity + GA4): ver detalle en `BITACORA.md`. Al tocar la lógica de redirect, **verificar siempre que los UTMs sigan viajando a testimonio-flor/dashiel**.

## A/B testing de la landing

El primer A/B de `/casos-de-estudio` está especificado en
[`docs/ab-casos-de-estudio.md`](docs/ab-casos-de-estudio.md): middleware de Vercel con
**rewrite** (nunca redirect), cookie pegajosa, control `index.html` contra el paquete de salud
`index-salud.html`, sólo para tráfico pago. `variant` viaja en el opt-in; sin cookie queda
`null` para no mezclar orgánico con A. GA4 recibe `ce_ab_exposure_a/b`; el denominador se
lee con sesiones/usuarios que contienen el evento, no con eventCount.

Dos cosas que parecen detalle y no lo son:

- **Rewrite, no redirect.** Con redirect se pierden las UTMs, aparece un salto extra y Meta
  ve una redirección que le ensucia el tracking.
- **Es una prueba de paquete, no de titular.** Si B gana, no se puede adjudicar el resultado
  al copy, al diseño o al peso por separado.
- **El KPI que decide NO es el CPL ni el volumen de registros.** Leer leads de $300-600 por
  exposición elegible; el mix solo es diagnóstico y opt-in/Typeform por exposición son
  guardarraíles. La parada es por muestra, no por un calendario fijo de 30 días.

El protocolo del CRM aún describe el test anterior de titular; sincronizarlo antes de abrir
tráfico. Mientras tanto, la implementación vigente está en `docs/ab-casos-de-estudio.md`.

## Convenciones

- **Comentarios:** el **porqué**, en español rioplatense.
- **Commits:** convencional (`feat(scope):`, `fix(scope):`, `docs`, `chore`).
- **No crear archivos `.md`/README** salvo que el usuario lo pida (excepción: entradas en `BITACORA.md`).
- **Al cambiar algo con impacto en conversión/atribución:** dejar entrada en `BITACORA.md` (hay TEMPLATE al final del archivo).

## Método de trabajo Codex + Claude Code

### Reglas duras (23-jul-2026)

- **`main` es la Production Branch de Vercel: cada push a `main` publica.** Ningún agente trabaja directamente sobre `main`.
- **Rama por tarea, no por agente:** `work/<tarea>` (ej. `work/biblioteca-home`). Codex y Claude se turnan sobre la *misma* rama. Una rama por agente es lo que produjo las 9 ramas huérfanas de julio, donde ya no se sabía cuál era producción.
- **Turnos estrictos.** Ambos agentes pueden apuntar al mismo working tree; dos escrituras simultáneas corrompen el estado. Para paralelismo real, uno de los dos usa su propio `git worktree`.
- **Nunca cerrar sesión con commits importantes solo en local.** GitHub sincroniza el código, `BITACORA.md` sincroniza el contexto, los chats no sincronizan nada. Push al terminar cada turno, siempre.
- **Prohibido promover un Preview a Producción sin integrar `main` en el mismo movimiento.** Deja Vercel por delante de GitHub y el repo deja de describir lo publicado.
- **Borrado de ramas/worktrees:** solo tras verificar con Git que están absorbidas (`git branch --merged main`). Nunca por inferencia.

### Ciclo de una tarea

1. Abrir turno: `git fetch --prune`, revisar `git status`, últimos commits y la entrada más reciente de `BITACORA.md`.
2. Trabajar en `work/<tarea>` con commits pequeños y reversibles.
3. Cerrar turno: entrada en `BITACORA.md` + `git push`.
4. GitHub genera el Preview de la rama. **El usuario aprueba.**
5. Integrar en `main` → el push publica Producción.
6. Confirmar Vercel `Ready` + ID del deployment. Recién entonces borrar la rama.

### Fuentes oficiales

| Elemento | Fuente |
|---|---|
| Código publicado | `main` en GitHub |
| Trabajo en curso | rama `work/*` subida a GitHub |
| Instrucciones compartidas | `AGENTS.md` (`CLAUDE.md` es symlink) |
| Historial funcional | `BITACORA.md` |
| Estado de publicación | Vercel + ID del deployment |
| Chats de agentes | **no son fuente oficial** |

### Higiene general

- No desplegar desde un working tree sucio. Primero rama descriptiva, verificación y commits lógicos; después Preview y recién entonces producción.
- Un commit debe representar una responsabilidad reversible. No mezclar páginas del funnel, scripts offline, backups n8n y cambios del CRM en el mismo commit.
- Antes de continuar trabajo de otro agente: leer `git status`, los últimos commits, `AGENTS.md` y la entrada más reciente de `BITACORA.md`. No rehacer lo ya validado.
- El handoff se registra con rama + commit + pendientes en `BITACORA.md`. `CLAUDE.md` es symlink de este archivo para evitar dos contextos divergentes.
- Integración CRM activa al 15-jul-2026: repo hermano `crm-ventas`, rama `codex/biblioteca-pipeline-hardening`, commit `d28172e`. Falta staging Vercel/Neon y deploy; no tocar el workflow nuevo de n8n porque lo revisa el usuario.
