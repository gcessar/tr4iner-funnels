import { next, rewrite } from "@vercel/edge";

export const config = { matcher: "/casos-de-estudio" };

/*
  Test de COPY: B (ganadora, "Ya no es por cómo te ves") contra C
  ("No se trata de los kilos", ángulo de envejecer con fuerza).

  A diferencia del test anterior, este sí aísla una variable. Los dos
  archivos son idénticos salvo el titular —23.088 contra 23.073 bytes—,
  así que lo que se mide es el copy y no el paquete. Si pesaran distinto
  se estaría midiendo velocidad.

  El ángulo de C sale del estudio de 837 compradores: el tema #1 es
  "envejecer con fuerza e independencia" (57%), muy por encima de bajar
  grasa. Nunca se probó en la landing.
*/

// Igual que en el test anterior: solo tráfico pago. El orgánico rebota 44%
// contra 74% del pago y mezclarlos diluiría el segmento que se quiere leer.
// El orgánico ve B, que es la página que ganó.
function esTraficoDeAds(url: URL): boolean {
  // Instagram puede duplicar UTMs y dejar el primer valor vacío. Gana el
  // primer valor no vacío, no `.get()` a ciegas.
  const source = (
    url.searchParams.getAll("utm_source").find((value) => value.trim()) || ""
  ).toLowerCase();
  return source.includes("ads");
}

export default function middleware(req: Request) {
  const url = new URL(req.url);
  const cookie = req.headers.get("cookie") ?? "";

  // Cookie NUEVA a propósito. La del test anterior (`ab_ce`) tiene valores
  // A/B vivos por 180 días: reusarla haría que un visitante con `ab_ce=A`
  // quedara asignado a una variante que ya no existe.
  const previa = /(?:^|;\s*)ab_copy=([BC])/.exec(cookie)?.[1];

  let variante = previa;
  let reciénAsignada = false;

  if (!variante) {
    // Sin cookie y sin ser tráfico pago: ve B y no se marca, así el
    // visitante orgánico no gasta un lugar del experimento.
    if (!esTraficoDeAds(url)) return next();
    variante = Math.random() < 0.5 ? "B" : "C";
    reciénAsignada = true;
  }

  // rewrite, nunca redirect: la URL sigue siendo /casos-de-estudio, las UTMs
  // quedan intactas y Meta no ve una redirección que le ensucie el tracking.
  //
  // B no necesita rewrite propio: `next()` continúa al rewrite que ya está en
  // vercel.json (/casos-de-estudio → /index-salud), que es la ganadora.
  //
  // El archivo de C se llama index-fuerza y no index-c por la misma razón que
  // en su momento index-salud no pudo llamarse index-b: `.vercelignore`
  // excluye `*-B.html` y un nombre que caiga en ese patrón nunca se sube.
  const res = variante === "C" ? rewrite(new URL("/index-fuerza", url)) : next();

  if (reciénAsignada) {
    res.headers.append(
      "set-cookie",
      `ab_copy=${variante}; Path=/; Max-Age=15552000; SameSite=Lax`,
    );
  }
  return res;
}
