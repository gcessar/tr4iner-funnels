// Genera clickfunnels.html a partir de index.html.
// index.html es la fuente de verdad (funciona standalone en Vercel).
// clickfunnels.html envuelve ese documento en un <iframe srcdoc> aislado
// para pegar en un bloque de Codigo Personalizado de ClickFunnels 2.0,
// evitando que el CSS/tema de CF pise los estilos (ej. el boton flotante).
//
// Uso:  node calendly-confirma/build-clickfunnels.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const dir = dirname(fileURLToPath(import.meta.url));
const inner = readFileSync(join(dir, "index.html"), "utf8");

// El documento interno se embebe en base64: no contiene tags <script>/<style>
// literales que CF pueda sanitizar. Se decodifica en runtime y se inyecta
// como srcdoc. Las UTMs reales de la pagina de CF se pasan al iframe via
// window.__TR4_SEARCH__ (index.html ya lee esa variable).
const b64 = Buffer.from(inner, "utf8").toString("base64");

const out = `<!-- ================================================================= -->
<!-- TR4INER · Confirmacion de agenda · versión para ClickFunnels 2.0     -->
<!-- Pega TODO este bloque en un elemento "Codigo Personalizado" (HTML).  -->
<!-- Generado por build-clickfunnels.mjs — NO editar a mano.              -->
<!-- La fuente real es calendly-confirma/index.html.                      -->
<!-- ================================================================= -->
<div id="tr4-confirma-embed" style="width:100%;min-height:100vh;margin:0;padding:0;line-height:0;">
  <iframe id="tr4-confirma-frame"
          title="Confirmacion de agenda TR4INER"
          allow="autoplay; fullscreen"
          style="width:100%;height:100vh;min-height:600px;border:0;display:block;overflow:hidden;background:#FAF7F2;"></iframe>
</div>
<script>
(function () {
  var B64 = "${b64}";
  // atob -> bytes latin1 -> UTF-8 (soporta acentos y simbolos)
  var html = decodeURIComponent(escape(window.atob(B64)));
  // UTMs + parametros de Calendly del top de ClickFunnels -> iframe aislado
  var search = window.location.search || "";
  var inject = "<scr" + "ipt>window.__TR4_SEARCH__=" + JSON.stringify(search) + ";<\\/scr" + "ipt>";
  html = html.replace(/<head([^>]*)>/i, "<head$1>" + inject);
  var frame = document.getElementById("tr4-confirma-frame");
  if (frame) { frame.srcdoc = html; }
})();
</script>
`;

writeFileSync(join(dir, "clickfunnels.html"), out, "utf8");
console.log("OK -> calendly-confirma/clickfunnels.html (" + Math.round(out.length / 1024) + " KB)");
