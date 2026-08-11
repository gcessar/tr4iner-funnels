import { next, rewrite } from "@vercel/edge";

export const config = { matcher: "/casos-de-estudio" };

/*
  Split 50/50 de /casos-de-estudio.

  Existe porque en esta cuenta el antes/después no sirve: la revisión
  campeón-retador rota el set de campañas cada 3 días, más rápido que la
  ventana de medición de cualquier prueba de página. El 7-ago se dio vuelta
  el set entero un día antes de publicar un cambio, y la prueba del 8-ago
  no pudo atribuir nada. Un split elimina el tiempo como variable: las dos
  versiones viven el mismo día, el mismo tráfico y las mismas campañas.
*/

// B solo se prueba contra tráfico pago. El orgánico (YouTube, TikTok, perfil
// de IG) se comporta distinto —rebota 44% contra 74%— y mezclarlo diluiría
// justo el segmento que la prueba quiere leer.
function esTraficoDeAds(url: URL): boolean {
  // Replica la normalización del HTML: Instagram puede duplicar UTMs y dejar
  // el primer valor vacío. Gana el primer valor no vacío, no `.get()` a ciegas.
  const source = (
    url.searchParams.getAll("utm_source").find((value) => value.trim()) || ""
  ).toLowerCase();
  return source.includes("ads");
}

export default function middleware(req: Request) {
  const url = new URL(req.url);
  const cookie = req.headers.get("cookie") ?? "";
  const previa = /(?:^|;\s*)ab_ce=([AB])/.exec(cookie)?.[1];

  // Quien ya tiene variante asignada la conserva, venga de donde venga.
  // Sin esto, alguien que entra por un anuncio y vuelve por orgánico
  // cambiaría de página y su registro quedaría atribuido a la equivocada.
  let variante = previa;
  let reciénAsignada = false;

  if (!variante) {
    // Sin cookie y sin ser tráfico pago: control, y no se marca. Así el
    // visitante orgánico no gasta un lugar del experimento.
    if (!esTraficoDeAds(url)) return next();
    variante = Math.random() < 0.5 ? "A" : "B";
    reciénAsignada = true;
  }

  // rewrite, nunca redirect: la URL sigue siendo /casos-de-estudio, las UTMs
  // quedan intactas, no hay salto extra ni parpadeo, y Meta no ve una
  // redirección que le ensucie el tracking.
  //
  // El archivo se llama index-salud y NO index-b por una razón concreta:
  // `.vercelignore` excluye `*-B.html`, el patrón de las páginas viejas
  // archivadas del repo. Con el nombre index-b.html el archivo nunca se
  // subía al deployment y la mitad del tráfico pago caía en un 404.
  const res = variante === "B" ? rewrite(new URL("/index-salud", url)) : next();

  if (reciénAsignada) {
    res.headers.append(
      "set-cookie",
      `ab_ce=${variante}; Path=/; Max-Age=15552000; SameSite=Lax`,
    );
  }
  return res;
}
