import { readFile, writeFile } from 'node:fs/promises';

const sourcePath = new URL('./index.html', import.meta.url);
const attributionPath = new URL('../../attribution.js', import.meta.url);
const outputPath = new URL('./clickfunnels.html', import.meta.url);

const [sourceFile, attributionFile] = await Promise.all([
  readFile(sourcePath, 'utf8'),
  readFile(attributionPath, 'utf8')
]);

// ClickFunnels puede romper scripts externos y CSS globales al pegarlos en un bloque.
// El iframe aislado evita esos choques y mantiene una sola fuente de verdad: index.html.
const source = sourceFile.replace(
  '<script src="/attribution.js"></script>',
  '<script>\n' + attributionFile + '\n</script>'
);
const encoded = Buffer.from(source, 'utf8').toString('base64');

const output = `<!doctype html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Programa Cero · TR4INER</title>
  <style>
    html, body { margin: 0; padding: 0; width: 100%; background: #F4EFE6; }
    #tr4iner-library { display: block; width: 100%; min-height: 100vh; border: 0; }
  </style>
</head>
<body>
  <iframe id="tr4iner-library" title="Programa Cero TR4INER" scrolling="no"></iframe>
  <script>
    (function () {
      var iframe = document.getElementById('tr4iner-library');
      function decodeBase64(value) {
        var binary = atob(value);
        var bytes = Uint8Array.from(binary, function (char) { return char.charCodeAt(0); });
        return new TextDecoder().decode(bytes);
      }
      var source = decodeBase64('${encoded}');
      var search = window.location.search || '';
      var bootstrap = '<script>window.__TR4_SEARCH__=' + JSON.stringify(search) + '<\\/script>';
      var resize = '<script>(function(){function send(){window.parent.postMessage({type:"tr4iner-height",height:document.documentElement.scrollHeight},"*")}window.addEventListener("load",send);window.addEventListener("resize",send);new ResizeObserver(send).observe(document.documentElement);setTimeout(send,500)})()<\\/script>';
      iframe.srcdoc = bootstrap + source.replace('</body>', resize + '</body>');
      window.addEventListener('message', function (event) {
        if (event.data && event.data.type === 'tr4iner-height') {
          iframe.style.height = Math.max(event.data.height, 600) + 'px';
        }
      });
    })();
  </script>
</body>
</html>
`;

await writeFile(outputPath, output);
console.log('Generado biblioteca/videos/clickfunnels.html');
