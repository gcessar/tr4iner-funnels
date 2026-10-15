import { next, rewrite } from "@vercel/edge";
import { isPreview, teamPreviewEnabled, previewConfigured, verifyTeamCookie } from "./lib/genesis-team";

// Hoy corre un solo test: el de formulario en /medicos. El de hero de
// /casos-de-estudio (`ce_hero_202609`) cerró el 29-sep en empate y su ruta salió
// del matcher: `vercel.json` sirve `index-fuerza.html` (RES) a todo el tráfico, y
// la cookie `ab_hero` que quedó en los navegadores ya no decide nada. Resultado en
// la entrada del 29-sep de BITACORA.md.
//
// La Ruta suma /biblioteca, /api/genesis y /r: en los Preview los cierra con la
// clave del equipo (`bibliotecaPreview`); en producción `isPreview()` es falso y
// siguen de largo sin tocar nada.
export const config = { matcher: ["/medicos", "/medicos/", "/biblioteca/:path*", "/api/genesis/:path*", "/r/:path*"] };

function privatePreview(response: Response) {
  response.headers.set("Cache-Control", "private, no-store, max-age=0");
  response.headers.set("Vercel-CDN-Cache-Control", "no-store");
  response.headers.set("CDN-Cache-Control", "no-store");
  response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  // Hacia otros dominios sólo viaja el origen, nunca la ruta ni el enlace compartido. Bunny y
  // la regla de Cloudflare de video.mediatr4iner.com (R2) exigen ese origen para servir los
  // videos de ejercicios, que la página reproduce directo.
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  // También bloquea los píxeles noscript: ni el navegador sin JavaScript cuenta como un lead real.
  response.headers.set("Content-Security-Policy", [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' https://www.youtube.com https://s.ytimg.com https://iframe.mediadelivery.net https://player.mediadelivery.net",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: blob: https://i.ytimg.com https://*.b-cdn.net https://*.mediadelivery.net https://video.mediatr4iner.com",
    "connect-src 'self' https://www.youtube.com https://www.youtube-nocookie.com https://*.b-cdn.net https://*.mediadelivery.net https://video.mediatr4iner.com",
    "frame-src https://www.youtube.com https://www.youtube-nocookie.com https://iframe.mediadelivery.net https://player.mediadelivery.net",
    "media-src 'self' blob: https://*.b-cdn.net https://*.mediadelivery.net https://video.mediatr4iner.com",
    "worker-src 'self'", "manifest-src 'self'", "object-src 'none'", "base-uri 'self'", "form-action 'self'", "frame-ancestors 'self'"
  ].join("; "));
  return response;
}

async function bibliotecaPreview(req: Request, url: URL) {
  if (!isPreview()) return next();
  const path = url.pathname.replace(/\/$/, "");
  const api = path.startsWith("/api/genesis/");
  if (path === "/api/genesis/config") return privatePreview(next());
  if (!teamPreviewEnabled() || !previewConfigured()) {
    return privatePreview(new Response(api ? JSON.stringify({ error: "Preview privado sin configurar" }) : "Este entorno de prueba todavía no está disponible.", {
      status: 503, headers: { "Content-Type": api ? "application/json; charset=utf-8" : "text/plain; charset=utf-8" }
    }));
  }
  if (path === "/api/genesis/team-access" || /^\/biblioteca\/equipo(?:\/index(?:\.html)?)?$/.test(path)) return privatePreview(next());
  const authorized = await verifyTeamCookie(req.headers.get("cookie"));
  if (!authorized) {
    if (api) return privatePreview(new Response(JSON.stringify({ error: "Introduce la clave de equipo para continuar", teamAccessRequired: true }), { status: 401, headers: { "Content-Type": "application/json; charset=utf-8" } }));
    const login = new URL("/biblioteca/equipo/", url);
    login.searchParams.set("next", url.pathname + url.search);
    return privatePreview(new Response(null, { status: 303, headers: { Location: login.toString() } }));
  }
  // Sin desvío a /biblioteca/ruta/: el equipo ve la misma página de producción,
  // extendida con los módulos por fecha (decisión del 26-sep-2026).
  return privatePreview(next());
}

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

// Sólo tráfico pago, como en todos los tests de este repo: el orgánico rebota muy
// por debajo del pago y mezclarlos diluye el segmento que se quiere leer. El
// orgánico ve el control y no gasta un lugar del experimento.
function esTraficoDeAds(url: URL): boolean {
  // Instagram puede duplicar UTMs y dejar el primer valor vacío. Gana el primer
  // valor no vacío, no `.get()` a ciegas.
  const source = (
    url.searchParams.getAll("utm_source").find((value) => value.trim()) || ""
  ).toLowerCase();
  return source.includes("ads");
}

export default async function middleware(req: Request) {
  const url = new URL(req.url);
  const cookie = req.headers.get("cookie") ?? "";

  if (url.pathname === "/medicos" || url.pathname === "/medicos/") {
    return testMedicos(url, cookie);
  }

  // Todo lo demás que deja pasar el matcher es de la Ruta.
  return bibliotecaPreview(req, url);
}
