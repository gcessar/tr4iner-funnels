# A/B de `/casos-de-estudio` — especificación de implementación

Spec para construir el primer A/B real de la landing. Escrito el 2026-08-10 tras auditar el
funnel completo. **Leer entero antes de tocar código**: hay dos decisiones que parecen
detalles y no lo son (rewrite en vez de redirect, y cuál es el KPI).

El protocolo de lectura y las reglas de decisión viven en el repo del CRM:
`crm-ventas/docs/analisis-ads/protocolo-ab-landing.md`. Acá va sólo qué construir.

---

## Por qué

La prueba del 8-ago publicó una versión nueva y la comparó contra los días previos. **No
pudo decidir nada:** el rebote se movió 0,6 pp —dentro del ruido diario— y la tendencia ya
venía bajando sola desde el 27-jul. El cambio y la mejora ocurrieron en momentos distintos
y no hay forma de separarlos.

Un split 50/50 elimina el tiempo como variable: las dos versiones viven el mismo día, el
mismo tráfico y las mismas campañas.

Estado del negocio al momento de escribir esto: ROAS Real **0,64x**. No es un experimento
académico.

---

## Los 4 cambios

### 1. `middleware.ts` en la raíz del repo

```ts
import { next, rewrite } from "@vercel/edge";

export const config = { matcher: "/casos-de-estudio" };

export default function middleware(req: Request) {
  const url = new URL(req.url);
  const cookie = req.headers.get("cookie") ?? "";
  const previa = /(?:^|;\s*)ab_ce=([AB])/.exec(cookie)?.[1];

  // Asignación pegajosa: quien ya vio una versión sigue viendo la misma.
  // Sin esto alguien que recarga ve A y después B, y su registro queda
  // atribuido a la variante equivocada.
  const variante = previa ?? (Math.random() < 0.5 ? "A" : "B");

  const res = variante === "B" ? rewrite(new URL("/index-salud", url)) : next();
  if (!previa) {
    res.headers.append(
      "set-cookie",
      `ab_ce=${variante}; Path=/; Max-Age=7776000; SameSite=Lax`,
    );
  }
  return res;
}
```

Requiere `@vercel/edge` como dependencia. El repo no tiene `package.json`; hay que crear uno
mínimo sólo con esa dependencia — **no** convertir el proyecto a un framework ni agregar
build step.

> **`rewrite`, nunca `redirect`.** Con rewrite la URL sigue siendo `/casos-de-estudio`: las
> UTMs quedan intactas, no hay salto extra, no hay parpadeo y Meta no ve una redirección
> que le ensucie el tracking. El visitante no sabe que existe una versión B.

⚠️ Convive con el rewrite que ya está en `vercel.json` (`/casos-de-estudio` → `/index`).
Verificar en preview que el middleware corre **antes** y que la variante A sigue sirviendo
`index.html` igual que hoy.

> ⚠️ **El archivo de la variante NO puede llamarse `index-b.html`.** `.vercelignore`
> excluye `*-B.html` —el patrón de las páginas viejas archivadas del repo— y el matcheo
> es insensible a mayúsculas, así que el archivo nunca se sube al deployment y la mitad
> del tráfico pago cae en un 404. Verificado el 11-ago con `vercel dev`. Cualquier nombre
> terminado en `-b.html` tiene el mismo problema; hoy la variante es `index-salud.html`.

### 2. `index-b.html` — copia de `index.html` con UNA sola diferencia

Cambia el `<h1 id="headline">` (línea ~1120) y su bajada. **Nada más.** Ni imagen, ni CTA,
ni orden de secciones: si cambian dos cosas, no se sabe cuál movió el número.

| | Titular |
|---|---|
| **A** (`index.html`, control) | «Perdió grasa. No rebotó. Con trabajo, vida normal y sin dieta extrema. Anthoni analiza qué se cambió, mes por mes.» |
| **B** (`index-b.html`) | «Entrenas. Comes bien. Y el espejo sigue igual.» |
| | bajada: «No te falta disciplina — te falta orden. Anthoni analiza, mes por mes, qué se cambió en un caso real para perder grasa y ganar músculo al mismo tiempo.» |

Fundamento en `crm-ventas/docs/analisis-ads/2026-08-08-cro-caso-estudio-an.md`: el segmento
de recomposición convierte **4,60%** y vale $15,11 por lead; el de «tengo sobrepeso»,
**2,62%**. El titular actual le habla al segundo y el thumbnail ya le habla al primero.

### 3. El formulario manda la variante

En `index.html` **y** en `index-b.html`, agregar una línea al objeto `payload`
(`index.html` ~línea 1574):

```js
var payload = {
  nombre:    nombre,
  email:     email,
  sexo:      sexoVal,
  video:     videoId,
  utm:       utmData,
  page_url:  window.location.href,
  timestamp: new Date().toISOString(),
  variant:   (/(?:^|;\s*)ab_ce=([AB])/.exec(document.cookie) || [])[1] || 'A'
};
```

Con eso viaja a los **dos** destinos sin tocar nada más: `TR4Track.saveOptIn(payload)` (copia
al CRM) y el webhook de n8n. Del lado del CRM ya se persiste solo — `src/lib/optin.ts` lee
`body.variant` y lo guarda en `OptIn.variant`, campo que hoy está libre para este funnel
(sólo se usa con `"VA"`).

### 4. Nada en el CRM

No hace falta migración ni deploy del otro repo. El campo ya existe y el parser ya lo lee.

---

## Qué NO tocar mientras corre

- El titular de A.
- Las campañas de Meta (apagar un anuncio a mitad del test cambia el mix de tráfico y las
  dos mitades dejan de ser comparables).
- El Typeform ni su bifurcación por presupuesto.
- El peso de la página: `index-b.html` tiene que pesar lo mismo que `index.html` (~52 KB).
  Si B pesa más, se está midiendo velocidad, no titular.

---

## Verificación antes de dar por hecho el deploy

1. En preview, entrar a `/casos-de-estudio` varias veces en ventanas de incógnito: deberían
   verse los dos titulares, ~50/50.
2. Con la cookie ya puesta, recargar 5 veces: **siempre la misma versión**.
3. Confirmar que la URL nunca cambia a `/index-b`.
4. Entrar con UTMs (`?utm_source=MetaAds&utm_term=A7-HOO1`) y confirmar que llegan intactas
   al formulario y al payload.
5. Registrarse una vez en cada variante y confirmar en el CRM que `OptIn.variant` quedó en
   `A` y en `B` respectivamente.
6. Confirmar que el sheet de n8n y Brevo siguen recibiendo igual que antes.

El punto 5 es el que hace que el test tenga sentido. Si `variant` llega null, el test corre
pero no se puede leer.

---

## Cómo se lee (resumen — el detalle está en el CRM)

**El KPI de decisión NO es el CPL ni el volumen de registros.** La auditoría CRO advierte
que el titular nuevo atrae menos gente de +15 kg (31% de los leads), así que **el CPL va a
empeorar antes de que mejore la caja**. Quien decida por CPL apaga al ganador.

| Rol | Métrica | Base | Se lee en |
|---|---|---|---|
| **Decide** | % de leads que declaran $300-600 | 17,7% | ~30 días |
| Guardarraíl | opt-in rate (sesión → registro) | 11,1% | ~7 días |
| Confirma | caja por lead | — | D+30 |

El guardarraíl sólo sirve para **abortar**: si B hunde el opt-in rate más de 25% relativo,
se corta. No sirve para declarar ganador.

**Horizonte fijo, sin espiar.** Se define antes de arrancar y no se corta en el medio
porque uno va ganando: con tres miradas, un test sin diferencia real da «ganador» ~1 de
cada 5 veces. Cortar en semanas completas. Empate a los 30 días = se queda el control.

**No se decide por ventas:** son ~10 en el período; detectar una diferencia entre variantes
por venta necesitaría miles.
