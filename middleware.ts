import { next, rewrite } from "@vercel/edge";

export const config = { matcher: "/casos-de-estudio" };

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
