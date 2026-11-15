/* Banner «Black Tr4iner» para todas las páginas de la Ruta.
   Se incluye con <script src="/biblioteca/black-banner.js" defer></script>.
   - Fijo arriba al hacer scroll (sticky), ~44 px de alto en escritorio y ~40 en celular.
   - El botón abre WhatsApp 17439014239 con «BLACK» (Argentina) o «BLACK TR4INER» (Perú).
   - Reparto 50/50 al azar, pero la MISMA persona siempre recibe la misma palabra
     (queda guardada en el navegador), para que el equipo no vea mensajes mezclados. */
(function () {
  var NUMERO = '17439014239';
  var VARIANTES = { AR: 'BLACK', PE: 'BLACK TR4INER' };
  var FRASE = 'Hola, quiero el descuento ';
  var CLAVE = 'tr4_black_variante';

  function variante() {
    var v = null;
    try { v = localStorage.getItem(CLAVE); } catch (e) {}
    if (v !== 'AR' && v !== 'PE') {
      v = Math.random() < 0.5 ? 'AR' : 'PE';
      try { localStorage.setItem(CLAVE, v); } catch (e) {}
    }
    return v;
  }

  var css = '\
.bk{position:sticky;top:0;z-index:120;background:#0d0b07;color:#FFFDF6;overflow:hidden;font-family:"Instrument Sans",-apple-system,sans-serif}\
.bk::before{content:"";position:absolute;inset:0;background:linear-gradient(100deg,transparent 30%,rgba(245,197,24,.22) 50%,transparent 70%);transform:translateX(-100%);animation:bk-brillo 4.5s ease-in-out infinite}\
.bk::after{content:"";position:absolute;left:0;right:0;bottom:0;height:2px;background:linear-gradient(90deg,#F5C518,#ffe27a,#F5C518);background-size:200% 100%;animation:bk-linea 3s linear infinite}\
.bk-in{position:relative;display:flex;align-items:center;justify-content:center;gap:14px;max-width:1120px;margin:0 auto;padding:7px 18px;min-height:42px}\
.bk-tag{flex:none;display:flex;align-items:center;gap:7px;font:700 11px/1 "JetBrains Mono",ui-monospace,monospace;letter-spacing:.14em;text-transform:uppercase;color:#F5C518}\
.bk-dot{width:7px;height:7px;border-radius:50%;background:#F5C518;animation:bk-pulso 1.6s ease-out infinite}\
.bk-msgs{position:relative;flex:1 1 auto;min-width:0;height:20px;max-width:560px}\
.bk-msg{position:absolute;inset:0;display:flex;align-items:center;font-size:14px;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;opacity:0;transform:translateY(8px);animation:bk-rota 9s infinite}\
.bk-msg b{color:#F5C518;font-weight:700;margin-right:.35em}\
.bk-msg:nth-child(2){animation-delay:4.5s}\
.bk-btn{flex:none;display:inline-flex;align-items:center;gap:6px;background:#F5C518;color:#16130E;font:700 13px/1 "Instrument Sans",sans-serif;padding:9px 15px;border-radius:999px;text-decoration:none;animation:bk-latido 2.4s ease-in-out infinite;transition:background .2s}\
.bk-btn:hover{background:#ffd84a}\
.bk-btn svg{width:14px;height:14px;fill:currentColor}\
@keyframes bk-brillo{0%,55%{transform:translateX(-100%)}100%{transform:translateX(100%)}}\
@keyframes bk-linea{to{background-position:-200% 0}}\
@keyframes bk-pulso{0%{box-shadow:0 0 0 0 rgba(245,197,24,.7)}100%{box-shadow:0 0 0 9px rgba(245,197,24,0)}}\
@keyframes bk-latido{0%,100%{transform:scale(1)}50%{transform:scale(1.045)}}\
@keyframes bk-rota{0%{opacity:0;transform:translateY(8px)}6%,44%{opacity:1;transform:none}50%,100%{opacity:0;transform:translateY(-8px)}}\
@media(max-width:640px){.bk-in{gap:10px;padding:6px 12px;min-height:40px}.bk-tag span{display:none}.bk-msg{font-size:12.5px}.bk-x{display:none}.bk-btn{padding:8px 12px;font-size:12.5px}}\
@media(prefers-reduced-motion:reduce){.bk::before,.bk::after,.bk-dot,.bk-btn{animation:none}.bk-msg{animation:none;opacity:0}.bk-msg:first-child{opacity:1;transform:none}}';

  function montar() {
    if (document.getElementById('bk-black')) return;
    var v = variante();
    var url = 'https://wa.me/' + NUMERO + '?text=' + encodeURIComponent(FRASE + VARIANTES[v]);

    var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

    var el = document.createElement('div');
    el.id = 'bk-black'; el.className = 'bk'; el.setAttribute('role', 'region'); el.setAttribute('aria-label', 'Promoción Black Tr4iner');
    el.innerHTML =
      '<div class="bk-in">' +
        '<div class="bk-tag"><i class="bk-dot"></i><span>Black Tr4iner</span></div>' +
        '<div class="bk-msgs">' +
          '<div class="bk-msg"><b>Súper descuento</b><span class="bk-x"> en nuestros planes por tiempo limitado</span></div>' +
          '<div class="bk-msg"><b>Sesiones en vivo 1 a 1</b><span class="bk-x"> con entrenador y nutricionista</span></div>' +
        '</div>' +
        '<a class="bk-btn" href="' + url + '" target="_blank" rel="noopener">Quiero saber más ' +
          '<svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm5.3 14c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.2-4.6-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.8s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.3 0 .5l-.4.6c-.1.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.3 2.4 1.5.3.1.5.1.6-.1l.9-1.1c.2-.3.4-.2.6-.1l2 .9c.3.1.5.2.5.4.1.2.1.8-.1 1.4Z"/></svg></a>' +
      '</div>';
    document.body.insertBefore(el, document.body.firstChild);

    el.querySelector('.bk-btn').addEventListener('click', function () {
      try { (window.dataLayer = window.dataLayer || []).push({ event: 'black_tr4iner_click', variante: v, palabra: VARIANTES[v], mensaje: FRASE + VARIANTES[v] }); } catch (e) {}
    });
  }
  // Se oculta a quien ya compró. `/api/genesis/me` (sesión de la Ruta) trae `member.yaCompro`.
  // Si no hay sesión o falla la consulta, se muestra: es mejor un banner de más que perder la promo.
  function iniciar() {
    var quitar = function () { var e = document.getElementById('bk-black'); if (e) e.remove(); };
    var f = window.BK_YA_COMPRO; // permite probar sin servidor
    if (typeof f === 'boolean') { if (!f) montar(); return; }
    montar();
    fetch('/api/genesis/me', { credentials: 'same-origin' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (d) { if (d && d.member && d.member.yaCompro) quitar(); })
      .catch(function () {});
  }
  if (document.body) iniciar(); else document.addEventListener('DOMContentLoaded', iniciar);
})();
