// Genera la versión de biblioteca/index.html para ClickFunnels 2.0.
// La fuente de verdad para Vercel sigue siendo biblioteca/index.html.
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

var dir = dirname(fileURLToPath(import.meta.url));
var inner = readFileSync(join(dir, 'index.html'), 'utf8');
var attribution = readFileSync(join(dir, '..', 'attribution.js'), 'utf8');

// El iframe srcdoc de ClickFunnels no puede resolver el script raíz de Vercel;
// se incrusta la misma fuente para no mantener dos implementaciones.
inner = inner.replace(
  '<script src="/attribution.js"></script>',
  '<script>\n' + attribution + '\n</script>'
);

inner = inner.replace(
  'page_url:  window.location.href,',
  'page_url:  window.__TR4_PAGE_URL__ || window.location.href,'
);

var oldNext = `function next() {
          var p = new URLSearchParams();
          p.set('nombre', nombre);
          p.set('email', email);
          p.set('sexo', sexo);
          if (videoId) p.set('video', videoId);
          Object.keys(utmData).forEach(function (key) { p.set(key, utmData[key]); });
          window.location.href = '/biblioteca/confirma/?' + p.toString();
        }`;

var newNext = `function next() {
          var destino = new URL('https://metodo.tr4iner.com/prog-confirm');
          // Mantiene todos los parámetros que entraron a ClickFunnels.
          var p = new URLSearchParams(window.__TR4_SEARCH__ || window.location.search);
          p.set('nombre', nombre);
          p.set('first_name', nombre);
          p.set('email', email);
          p.set('whatsapp', prefijo + telefono);
          p.set('sexo', sexo);
          if (videoId) p.set('video', videoId);
          Object.keys(utmData).forEach(function (key) { p.set(key, utmData[key]); });
          destino.search = p.toString();
          window.location.href = destino.toString();
        }`;

if (!inner.includes(oldNext)) {
  throw new Error('No encontré la redirección esperada en biblioteca/index.html.');
}

inner = inner.replace(oldNext, newNext);

var heightReporter = `<script>
(function () {
  function reportHeight() {
    var root = document.documentElement;
    var body = document.body;
    var height = Math.max(root.scrollHeight, root.offsetHeight, body.scrollHeight, body.offsetHeight);
    parent.postMessage({ type: 'tr4-biblioteca-height', height: height }, '*');
  }
  window.addEventListener('load', reportHeight);
  window.addEventListener('resize', reportHeight);
  new ResizeObserver(reportHeight).observe(document.body);
  setTimeout(reportHeight, 300);
})();
</script>`;

inner = inner.replace('</body>', heightReporter + '\n</body>');

var b64 = Buffer.from(inner, 'utf8').toString('base64');
var output = `<!-- TR4INER · Biblioteca · versión para ClickFunnels 2.0 -->
<!-- Pega TODO esto en un elemento "Código personalizado" (HTML), no en Tracking Code. -->
<div id="tr4-biblioteca-embed" style="width:100%;min-height:100vh;margin:0;padding:0;line-height:0;">
  <iframe id="tr4-biblioteca-frame"
    title="Biblioteca TR4INER"
    allow="autoplay; fullscreen"
    style="width:100%;min-height:100vh;height:100vh;border:0;display:block;background:#F4EFE6;"></iframe>
</div>
<script>
(function () {
  var B64 = '${b64}';
  var html = decodeURIComponent(escape(window.atob(B64)));
  var search = window.location.search || '';
  var pageUrl = window.location.href;
  var inject = '<scr' + 'ipt>window.__TR4_SEARCH__=' + JSON.stringify(search) + ';window.__TR4_PAGE_URL__=' + JSON.stringify(pageUrl) + ';<\\/scr' + 'ipt>';
  html = html.replace(/<head([^>]*)>/i, '<head$1>' + inject);

  var frame = document.getElementById('tr4-biblioteca-frame');
  if (!frame) return;

  window.addEventListener('message', function (event) {
    if (event.source !== frame.contentWindow || !event.data || event.data.type !== 'tr4-biblioteca-height') return;
    frame.style.height = Math.max(600, event.data.height) + 'px';
  });

  frame.srcdoc = html;
})();
</script>`;

writeFileSync(join(dir, 'clickfunnels.html'), output, 'utf8');
console.log('OK -> biblioteca/clickfunnels.html (' + Math.round(output.length / 1024) + ' KB)');
