# A/B de `/casos-de-estudio` — especificación de implementación

Spec para construir el primer A/B real de la landing. Escrito el 2026-08-10 tras auditar el
funnel completo. **Leer entero antes de tocar código**: hay dos decisiones que parecen
detalles y no lo son (rewrite en vez de redirect, y cuál es el KPI).

El protocolo del CRM todavía describe el retador anterior, que cambiaba sólo el titular.
**No usar sin adaptar sus supuestos de 30 días y una sola variable.** Este documento describe
la implementación vigente; el protocolo deberá sincronizarse antes de abrir tráfico.

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

## Implementación vigente

### 1. `middleware.ts` en la raíz del repo

El código fuente completo está en `middleware.ts`. Su contrato es:

- sólo asigna 50/50 a quien no tiene cookie y cuyo primer `utm_source` no vacío contiene
  `ads`; orgánico ve A y no recibe cookie;
- quien ya tiene `ab_ce=A|B` conserva el brazo aunque vuelva sin UTMs;
- B se sirve por rewrite interno a `/index-salud`; A continúa al rewrite existente de
  `vercel.json` hacia `index.html`;
- la cookie dura 180 días y usa `SameSite=Lax`, suficiente para la muestra histórica
  estimada en ~138 días.

Requiere `@vercel/edge`, instalado con un `package.json` mínimo. No hay framework ni build
step de la página estática.

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

### 2. `index-salud.html` — retador de paquete completo

B **no aísla un titular**. Cambia copy, jerarquía, tipografía, peso, formulario visible,
ausencia de video/thumbnail y navegación posterior al registro. El resultado sólo podrá
decir si el **paquete B** gana o pierde; no cuál de sus piezas causó el movimiento.

| | Control A | Retador B |
|---|---|---|
| Enfoque | Transformación física sin rebote | Salud preventiva y síntomas cotidianos |
| Estructura | Hero + video + modal | Titular + formulario en una columna clínica |
| Después del opt-in | Confirmación y contador | Salto directo al caso elegido |
| HTML crudo | ~52 KB | ~21 KB |

El titular de B es «Ya no es por cómo te ves» y su segunda línea nombra presión, análisis y
cansancio. Hay un riesgo declarado de *message-match*: Flor y Dashiel siguen presentándose
principalmente como transformaciones físicas. Debe vigilarse el paso landing → Typeform.

### 3. El formulario manda la variante

`index.html` e `index-salud.html` leen la cookie al construir el payload:

```js
var payload = {
  nombre:    nombre,
  email:     email,
  sexo:      sexoVal,
  video:     videoId,
  utm:       utmData,
  page_url:  window.location.href,
  timestamp: new Date().toISOString(),
  variant:   (/(?:^|;\s*)ab_ce=([AB])/.exec(document.cookie) || [])[1] || null
};
```

`null` no significa A: significa **fuera del experimento**. Así el orgánico, que ve el
control sin cookie, no contamina el brazo A. La variante viaja a `TR4Track.saveOptIn` y al
webhook de n8n; el CRM ya guarda `body.variant` en `OptIn.variant`.

### 4. La exposición tiene denominador

Ambas páginas emiten en cada vista asignada `ce_ab_exposure_a` o `ce_ab_exposure_b` hacia la
propiedad GA4 `G-CGWMFER9V4`. El brazo está en el nombre del evento para no depender de una
dimensión personalizada. El informe usa **sesiones o usuarios que contienen el evento**, no
`eventCount`, para que una recarga no infle el denominador. Sin cookie no se emite nada.

### 5. Alcance del join con el CRM

No hace falta migración para guardar el opt-in. Para cruzar luego presupuesto y ventas, el
CRM enlaza `OptIn` con un **lead nuevo** por correo al crearlo. Flor y Dashiel ya permiten
`variant` en `data-tf-hidden`, pero Typeform también exige declarar ese URL parameter en el
editor y volver a publicar el formulario; ese cambio externo sigue pendiente. Además, la
rama de reingresos sobre un lead existente no vuelve a ejecutar el enlace de OptIns. Hasta
cerrar ambos puntos, el análisis inferencial debe limitarse a leads nuevos y los reingresos
se reportan aparte.

---

## Qué NO tocar mientras corre

- El copy, estructura o mecánica de cualquiera de los dos brazos.
- Las campañas de Meta (apagar un anuncio a mitad del test cambia el mix de tráfico y las
  dos mitades dejan de ser comparables).
- El Typeform ni su bifurcación por presupuesto.
- La cookie, los nombres de evento o la definición de población.

`form_start` no es comparable: A abre el formulario en un modal y B lo muestra desde el
primer píxel. Usar opt-ins reales y exposiciones, no ese evento automático.

---

## Verificación antes de dar por hecho el deploy

1. Orgánico sin cookie: A siempre, sin `Set-Cookie` y payload `variant: null`.
2. Pago nuevo (`utm_source=MetaAds`): A/B aproximadamente 50/50 y siempre con cookie.
3. Cookie A o B: diez recargas y diez retornos al mismo brazo.
4. Rewrite: 200, sin `Location`, con URL visible `/casos-de-estudio`.
5. UTMs duplicadas (`utm_source=&utm_source=MetaAds`): se usa el primer valor no vacío.
6. Recursos de B: HTML, fuentes, avatar y `attribution.js` en 200.
7. Navegación: identidad, `video`, todos los `utm_*` e IDs publicitarios sobreviven y el
   correo conserva `@` literal.
8. Analítica: una exposición por vista asignada y, antes de abrir tráfico, eventos
   `ce_ab_exposure_a/b` visibles en GA4; el reporte usa sesiones/usuarios, no eventCount.
9. Payload: A y B de pago mandan su letra; orgánico manda `null`.
10. Typeform: `variant=A|B` aparece en `data-tf-hidden` y, tras publicar el parámetro en el
    editor, en una respuesta sandbox o controlada.

El endpoint directo del CRM rechaza orígenes Preview de Vercel. En Preview se intercepta el
payload sin enviarlo; la comprobación real A/B en CRM requiere un smoke test desde
`metodo.tr4iner.com` después de aprobación y antes de abrir campañas.

---

## Cómo se lee (resumen — el detalle está en el CRM)

**No decidir por CPL ni por volumen bruto.** B filtra más y puede producir menos opt-ins, por
lo que hay que leer calidad sin permitir que el ratio esconda una caída del negocio.

| Rol | Métrica | Base | Se lee en |
|---|---|---|---|
| **Decide** | leads nuevos que declaran $300-600 / exposición elegible | — | al alcanzar muestra |
| Diagnóstico | % de leads nuevos que declaran $300-600 | 17,7% | al alcanzar muestra |
| Guardarraíl 1 | opt-ins / exposición | 11,1% | ~4.400 exposiciones totales |
| Guardarraíl 2 | Typeform completados / exposición | — | semanal |
| Confirma | caja por exposición y por lead | — | D+30 |

El primer guardarraíl sólo sirve para abortar: si B hunde opt-ins/exposición más de 25%
relativo, se corta. El segundo impide declarar ganador a una variante que mejora el mix
porque hizo desaparecer la mitad de los Typeform.

**La parada es por muestra, no por “30 días”.** La estimación anterior usó 67 leads diarios,
pero la cohorte verificada may–jul tuvo 667 leads MetaAds en 92 días (~7,25/día): 1.000
leads Meta tomarían cerca de 138 días a ese ritmo. Recalcular con la primera semana completa
del tráfico elegible. Si no se alcanza la muestra, el resultado es inconcluso; no ganador.

**Sin espiar.** Leer en semanas completas y no cortar porque un brazo va ganando. Empate o
inconcluso conserva el control.

**No se decide por ventas:** son ~10 en el período; detectar una diferencia entre variantes
por venta necesitaría miles.
