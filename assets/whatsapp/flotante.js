/*
  Botón flotante de WhatsApp de las páginas con planes (22-oct-2026): abajo a la derecha,
  con el ícono que late y el aviso «¿Tienes alguna duda? Escríbenos». Es la única salida a
  WhatsApp de esas páginas; se agregó después de lanzar los planes sin ella.

    <script src="/assets/whatsapp/flotante.js?v=20261026"
      data-numero="17439014239"   número en formato internacional, sólo dígitos
      data-pagina="flor"          código corto de la página (el mismo de los planes)
      defer></script>

  AN usa el WhatsApp 17439014239 y Veronika el 15677024560. Trae su propio CSS, en el
  verde de WhatsApp, para verse igual en los tres temas. El clic se mide en el dataLayer
  (`planes_whatsapp_click`); el mensaje no lleva códigos (decisión del 6-oct para VA).

  Con la página en modo WhatsApp (`#planes[data-modo="whatsapp"]`, 26-oct-2026) el botón no
  se muestra (pedido del usuario): el número es obligatorio antes de abrir el chat, y este
  botón sería la puerta que se salta la medición.
*/
(function () {
  var script = document.currentScript;
  if (!script) return;
  var NUMERO = (script.getAttribute("data-numero") || "").replace(/\D/g, "");
  var PAGINA = script.getAttribute("data-pagina") || "";
  if (!NUMERO || document.getElementById("wa-flotante")) return;
  if (document.querySelector('#planes[data-modo="whatsapp"]')) return;

  var MENSAJE = "Hola, tengo una duda sobre los planes de TR4INER.";
  var ICONO =
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>';

  var estilo = document.createElement("style");
  estilo.textContent =
    ".wa-flotante{position:fixed;right:max(16px,env(safe-area-inset-right));bottom:max(16px,env(safe-area-inset-bottom));z-index:45;display:flex;align-items:center;gap:10px;text-decoration:none;opacity:0;transform:translateY(18px);pointer-events:none;transition:opacity .45s ease,transform .45s cubic-bezier(.2,.8,.2,1);-webkit-tap-highlight-color:transparent}" +
    ".wa-flotante.wa-visible{opacity:1;transform:none;pointer-events:auto}" +
    // Mientras está abierta la hoja de agenda, el visor de testimonios o la de países, el botón se aparta.
    "html.tr4p-bloqueo .wa-flotante,html.agenda-abierta .wa-flotante,html.pais-abierta .wa-flotante{opacity:0;pointer-events:none}" +
    ".wa-aviso{position:relative;max-width:150px;padding:7px 11px;border-radius:12px;background:#fff;color:#16181A;box-shadow:0 8px 24px rgba(17,17,17,.18);font:500 11.5px/1.3 -apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;text-align:right;opacity:0;transform:translateX(8px);transition:opacity .4s ease .35s,transform .4s ease .35s}" +
    ".wa-aviso::after{content:'';position:absolute;top:50%;right:-5px;width:10px;height:10px;margin-top:-5px;background:#fff;transform:rotate(45deg);border-radius:2px}" +
    ".wa-visible .wa-aviso{opacity:1;transform:none}" +
    ".wa-boton{position:relative;display:grid;width:56px;height:56px;flex:0 0 auto;place-items:center;border-radius:50%;background:#25D366;color:#fff;box-shadow:0 10px 26px rgba(37,211,102,.45),0 4px 10px rgba(0,0,0,.18)}" +
    ".wa-boton svg{position:relative;z-index:1;width:30px;height:30px;animation:wa-latido 1.6s ease-in-out infinite}" +
    // Dos ondas que salen del botón, desfasadas: es lo que se ve «palpitar».
    ".wa-boton::before,.wa-boton::after{content:'';position:absolute;inset:0;border-radius:50%;background:#25D366;animation:wa-onda 2.2s ease-out infinite}" +
    ".wa-boton::after{animation-delay:1.1s}" +
    "@keyframes wa-onda{from{transform:scale(1);opacity:.55}to{transform:scale(1.9);opacity:0}}" +
    "@keyframes wa-latido{0%,100%{transform:scale(1)}14%{transform:scale(1.14)}28%{transform:scale(1)}42%{transform:scale(1.1)}70%{transform:scale(1)}}" +
    "@media (hover:hover){.wa-flotante:hover .wa-boton{transform:translateY(-2px)}.wa-boton{transition:transform .2s ease}}" +
    "@media (max-width:380px){.wa-aviso{max-width:122px;font-size:11px}}" +
    "@media (prefers-reduced-motion:reduce){.wa-boton svg,.wa-boton::before,.wa-boton::after{animation:none}.wa-flotante,.wa-aviso{transition:none}}";
  document.head.appendChild(estilo);

  var enlace = document.createElement("a");
  enlace.id = "wa-flotante";
  enlace.className = "wa-flotante";
  enlace.href = "https://wa.me/" + NUMERO + "?text=" + encodeURIComponent(MENSAJE);
  enlace.target = "_blank";
  enlace.rel = "noopener";
  enlace.setAttribute("aria-label", "¿Tienes alguna duda? Escríbenos por WhatsApp");
  enlace.innerHTML = '<span class="wa-aviso" aria-hidden="true">¿Tienes alguna duda? Escríbenos</span><span class="wa-boton">' + ICONO + "</span>";
  enlace.addEventListener("click", function () {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: "planes_whatsapp_click", planes_pagina: PAGINA });
  });
  document.body.appendChild(enlace);

  // Entra a los 2,5 s: el primer vistazo es para el video, no para el botón.
  setTimeout(function () { enlace.classList.add("wa-visible"); }, 2500);
})();
