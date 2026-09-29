import { next, rewrite } from "@vercel/edge";

// Dos tests independientes comparten este archivo porque Vercel admite un solo
// middleware por proyecto. Cada ruta tiene su cookie, sus etiquetas y su lógica:
// ninguno lee ni escribe nada del otro.
export const config = { matcher: ["/casos-de-estudio", "/medicos", "/medicos/"] };

/*
  Test de FORMULARIO en /medicos — 24-sep-2026. `med_form_202609`.

  Qué se compara: **cómo aparece el formulario en el celular**. Nada más.

    MOD (control)  medicos/index.html                 el formulario vive en un modal
                   que se abre al tocar el play falso o «Ver el caso completo».
    INL (retador)  medicos/formulario-visible.html    el formulario está a la vista,
                   debajo de la foto de Flor, sin tocar nada.

  Por qué: el 98,9% del tráfico de /medicos es móvil y ahí la primera pantalla no
  tiene formulario. Registra 13,0% de las visitas contra ~21,6% de
  /casos-de-estudio, que lo muestra de entrada — pero esa comparación mezcla
  páginas, anuncios y audiencias distintas, así que no prueba nada. Este test sí.

  En escritorio los dos brazos son idénticos (el formulario ya está a la vista),
  y es el 1% del tráfico. KPI y reglas de decisión: entrada del 24-sep en
  BITACORA.md.
*/
function testMedicos(url: URL, cookie: string) {
  // Cookie y etiquetas ESTRENADAS, por la misma razón que el test de hero: `MOD` e
  // `INL` no aparecen nunca en `OptIn.variant` (hay VA, RES, MET, A, B y C) y los
  // 242 opt-ins históricos de médicos tienen la columna vacía.
  const previa = /(?:^|;\s*)ab_med=(MOD|INL)/.exec(cookie)?.[1];

  let variante = previa;
  let reciénAsignada = false;

  if (!variante) {
    if (!esTraficoDeAds(url)) return next();
    variante = Math.random() < 0.5 ? "MOD" : "INL";
    reciénAsignada = true;
  }

  // MOD es la página tal cual: `next()` sirve medicos/index.html.
  const res =
    variante === "INL" ? rewrite(new URL("/medicos/formulario-visible", url)) : next();

  if (reciénAsignada) {
    res.headers.append(
      "set-cookie",
      `ab_med=${variante}; Path=/; Max-Age=15552000; SameSite=Lax`,
    );
  }
  return res;
}

/*
  Test de HERO — 10-sep-2026. `ce_hero_202609`.

  Qué se compara: **la promesa del hero**, título y descripción como una sola
  unidad. Está declarado así ANTES de ver datos, y el resultado se adjudica al
  conjunto: no se va a poder saber si pesó el título o la bajada.

    RES (control)  index-fuerza.html   promete el RESULTADO
                   «Mira cómo alguien como tú transformó su cuerpo.»
    MET (retador)  index-metodo.html   promete el MÉTODO
                   «Mira qué hizo, mes a mes, alguien que empezó como tú.»

  Por qué MET: el activo real del funnel son cuatro análisis paso a paso, no
  cuatro antes/después. El obstáculo #1 que declararon los 837 compradores del
  estudio fue «no tengo una estructura clara» (44%), y la bajada del control hoy
  es una instrucción de interfaz («selecciona tu sexo y rango de edad»), no una
  propuesta de valor — la bitácora del 8-sep lo dejó anotado como pendiente.

  Los dos archivos son idénticos salvo ese bloque: 38.598 contra 38.616 bytes.
  Si pesaran distinto se estaría midiendo velocidad, no copy.
*/

// Igual que en los dos tests anteriores: sólo tráfico pago. El orgánico rebota
// muy por debajo del pago y mezclarlos diluye el segmento que se quiere leer.
// El orgánico ve el control y no gasta un lugar del experimento.
function esTraficoDeAds(url: URL): boolean {
  // Instagram puede duplicar UTMs y dejar el primer valor vacío. Gana el primer
  // valor no vacío, no `.get()` a ciegas.
  const source = (
    url.searchParams.getAll("utm_source").find((value) => value.trim()) || ""
  ).toLowerCase();
  return source.includes("ads");
}

export default function middleware(req: Request) {
  const url = new URL(req.url);
  const cookie = req.headers.get("cookie") ?? "";

  if (url.pathname === "/medicos" || url.pathname === "/medicos/") {
    return testMedicos(url, cookie);
  }

  // Cookie ESTRENADA. `ab_ce` (A/B) y `ab_copy` (B/C) siguen vivas 180 días en
  // navegadores de visitantes viejos: reusar cualquiera de las dos arrastraría
  // asignaciones de experimentos que ya no existen.
  //
  // Y las etiquetas también son nuevas. Los tests 1 y 2 compartieron el nombre
  // «B» —se estrenó cookie pero no el nombre del brazo— y el día del cruce quedó
  // ilegible: incluyéndolo ganaba uno, excluyéndolo el otro. `RES`/`MET` no se
  // usaron nunca, no se confunden entre sí ni con A/B/C, y se leen de un vistazo
  // en la columna `variant` de la tabla `OptIn`.
  const previa = /(?:^|;\s*)ab_hero=(RES|MET)/.exec(cookie)?.[1];

  let variante = previa;
  let reciénAsignada = false;

  if (!variante) {
    // Sin cookie y sin ser tráfico pago: ve el control y no se marca.
    if (!esTraficoDeAds(url)) return next();
    variante = Math.random() < 0.5 ? "RES" : "MET";
    reciénAsignada = true;
  }

  // rewrite, nunca redirect: la URL sigue siendo /casos-de-estudio, las UTMs
  // quedan intactas y Meta no ve una redirección que le ensucie el tracking.
  //
  // RES no necesita rewrite propio: `next()` continúa al rewrite que ya está en
  // vercel.json (/casos-de-estudio → /index-fuerza), que es el control.
  const res = variante === "MET" ? rewrite(new URL("/index-metodo", url)) : next();

  if (reciénAsignada) {
    res.headers.append(
      "set-cookie",
      `ab_hero=${variante}; Path=/; Max-Age=15552000; SameSite=Lax`,
    );
  }
  return res;
}
