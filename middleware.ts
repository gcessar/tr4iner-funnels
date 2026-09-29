import { next, rewrite } from "@vercel/edge";

// Hoy corre un solo test: el de formulario en /medicos. El de hero de
// /casos-de-estudio (`ce_hero_202609`) cerró el 29-sep en empate y su ruta salió
// del matcher: `vercel.json` sirve `index-fuerza.html` (RES) a todo el tráfico, y
// la cookie `ab_hero` que quedó en los navegadores ya no decide nada. Resultado en
// la entrada del 29-sep de BITACORA.md.
export const config = { matcher: ["/medicos", "/medicos/"] };

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

export default function middleware(req: Request) {
  const url = new URL(req.url);
  const cookie = req.headers.get("cookie") ?? "";

  if (url.pathname === "/medicos" || url.pathname === "/medicos/") {
    return testMedicos(url, cookie);
  }

  // El matcher sólo deja pasar /medicos. Si alguien agrega una ruta sin su lógica,
  // sigue de largo sin marcar a nadie.
  return next();
}
