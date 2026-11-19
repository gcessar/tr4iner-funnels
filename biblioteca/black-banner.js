/* Banner «Black Friday» para las páginas de la Ruta (test A/B por rondas, 19 al 30-nov-2026).
   Se incluye con <script src="/biblioteca/black-banner.js" defer></script>.
   - TODO lo que se ve lo manda el CRM en la sesión (`member.black`): texto, color (negro ·
     amarillo · rojo), diseño (barra arriba · barra con cuenta regresiva · tarjeta flotante abajo)
     y botón, más la ronda y la versión del miembro. Rondas, versiones y ganadores viven en el CRM
     (`src/lib/black-banner.ts`); este archivo sólo dibuja.
   - Registra una vista y un clic por persona, ronda y día (`/api/genesis/black`) para el panel
     GENESIS → Banners.
   - El botón abre WhatsApp 17439014239 con «BLACK» (Argentina) o «BLACK TR4INER» (Perú): ese
     reparto 50/50 sigue aparte y por navegador (decisión del usuario del 15-nov).
   - `member.black = null`: ya compró o terminó la promoción → no se muestra. */
(function () {
  var NUMERO = '17439014239';
  var VARIANTES = { AR: 'BLACK', PE: 'BLACK TR4INER' };
  var FRASE = 'Hola, quiero el descuento ';
  var CLAVE = 'tr4_black_variante';
  // Si el CRM todavía no manda el estilo (o no responde), se muestra éste SIN registrar nada.
  var RESPALDO = {
    ronda: null, variante: null,
    gancho: 'Precio especial Black Friday', detalle: ' en tu asesoría 1 a 1',
    segunda: { gancho: 'Asesoría profesional 1 a 1', detalle: ' con entrenador y nutricionista' },
    color: 'negro', diseno: 'barra', boton: 'Quiero saber más', fin: '2026-12-01T05:00:00.000Z'
  };
  var TEMAS = {
    negro: { fondo: '#0d0b07', texto: '#FFFDF6', acento: '#F5C518', btn: '#F5C518', btnTexto: '#16130E', brillo: 'rgba(245,197,24,.22)' },
    amarillo: { fondo: '#F5C518', texto: '#16130E', acento: '#16130E', btn: '#16130E', btnTexto: '#F5C518', brillo: 'rgba(255,255,255,.35)' },
    rojo: { fondo: '#B3121B', texto: '#FFFFFF', acento: '#FFFFFF', btn: '#FFFFFF', btnTexto: '#B3121B', brillo: 'rgba(255,255,255,.18)' }
  };

  function equipo() {
    var v = null;
    try { v = localStorage.getItem(CLAVE); } catch (e) {}
    if (v !== 'AR' && v !== 'PE') {
      v = Math.random() < 0.5 ? 'AR' : 'PE';
      try { localStorage.setItem(CLAVE, v); } catch (e) {}
    }
    return v;
  }

  function esc(t) {
    return String(t == null ? '' : t).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; });
  }

  // Día de Lima (UTC-5 fijo): una vista por ronda y día alcanza, el CRM igual descarta repetidas.
  function diaLima() { return new Date(Date.now() - 5 * 3600000).toISOString().slice(0, 10); }

  function registrar(accion, copy, eq) {
    try {
      fetch('/api/genesis/black', {
        method: 'POST', credentials: 'same-origin', keepalive: true,
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ accion: accion, ronda: copy.ronda, equipo: eq, page: location.pathname })
      }).catch(function () {});
    } catch (e) {}
  }

  function falta(fin) {
    var ms = Math.max(0, new Date(fin).getTime() - Date.now());
    var d = Math.floor(ms / 86400000), h = Math.floor(ms % 86400000 / 3600000), m = Math.floor(ms % 3600000 / 60000), s = Math.floor(ms % 60000 / 1000);
    return d > 0 ? d + 'd ' + h + 'h ' + m + 'm' : h + 'h ' + m + 'm ' + (s < 10 ? '0' : '') + s + 's';
  }

  function css(t) {
    return '\
.bk{position:sticky;top:0;z-index:120;background:' + t.fondo + ';color:' + t.texto + ';overflow:hidden;font-family:"Instrument Sans",-apple-system,sans-serif}\
.bk::before{content:"";position:absolute;inset:0;background:linear-gradient(100deg,transparent 30%,' + t.brillo + ' 50%,transparent 70%);transform:translateX(-100%);animation:bk-brillo 4.5s ease-in-out infinite;pointer-events:none}\
.bk::after{content:"";position:absolute;left:0;right:0;bottom:0;height:2px;background:' + t.acento + ';opacity:.85}\
.bk-in{position:relative;display:flex;align-items:center;justify-content:center;gap:14px;max-width:1120px;margin:0 auto;padding:7px 18px;min-height:42px}\
.bk-tag{flex:none;display:flex;align-items:center;gap:7px;font:700 11px/1 "JetBrains Mono",ui-monospace,monospace;letter-spacing:.14em;text-transform:uppercase;color:' + t.acento + '}\
.bk-dot{width:7px;height:7px;border-radius:50%;background:' + t.acento + ';animation:bk-pulso 1.6s ease-out infinite}\
.bk-msgs{position:relative;flex:1 1 auto;min-width:0;height:20px;max-width:560px}\
.bk-msg{position:absolute;inset:0;display:flex;align-items:center;font-size:14px;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;opacity:0;transform:translateY(8px);animation:bk-rota 9s infinite}\
.bk-msg b{color:' + t.acento + ';font-weight:700;margin-right:.35em}\
.bk-msg:nth-child(2){animation-delay:4.5s}\
.bk-cuenta{font:700 13px/1 "JetBrains Mono",ui-monospace,monospace;color:' + t.acento + ';font-variant-numeric:tabular-nums;margin-left:.2em}\
.bk-btn{flex:none;display:inline-flex;align-items:center;gap:6px;background:' + t.btn + ';color:' + t.btnTexto + ';font:700 13px/1 "Instrument Sans",sans-serif;padding:9px 15px;border-radius:999px;text-decoration:none;animation:bk-latido 2.4s ease-in-out infinite;transition:filter .2s}\
.bk-btn:hover{filter:brightness(1.08)}\
.bk-btn svg{width:14px;height:14px;fill:currentColor}\
.bk.bk-flot{position:fixed;top:auto;left:max(16px,env(safe-area-inset-left));right:auto;bottom:calc(20px + env(safe-area-inset-bottom));z-index:140;width:min(400px,calc(100vw - 112px));border-radius:14px;box-shadow:0 14px 34px rgba(0,0,0,.32);transform:translateY(130%);transition:transform .45s cubic-bezier(.2,.8,.2,1)}\
.bk.bk-flot.bk-on{transform:none}\
.bk.bk-flot::after{display:none}\
.bk-flot .bk-in{flex-direction:column;align-items:stretch;gap:9px;padding:13px 14px 14px;min-height:0}\
.bk-flot .bk-tag span{display:inline}\
.bk-flot .bk-titulo{font-size:15.5px;font-weight:700;line-height:1.25;color:' + t.acento + ';padding-right:22px}\
.bk-flot .bk-sub{font-size:13px;line-height:1.35;opacity:.88}\
.bk-flot .bk-btn{justify-content:center;padding:11px 15px;font-size:14px}\
.bk-cerrar{position:absolute;top:6px;right:6px;width:30px;height:30px;border:0;border-radius:50%;background:transparent;color:inherit;font-size:20px;line-height:1;cursor:pointer;opacity:.7}\
.bk-cerrar:hover{opacity:1}\
@keyframes bk-brillo{0%,55%{transform:translateX(-100%)}100%{transform:translateX(100%)}}\
@keyframes bk-pulso{0%{box-shadow:0 0 0 0 ' + t.acento + '}100%{box-shadow:0 0 0 9px transparent}}\
@keyframes bk-latido{0%,100%{transform:scale(1)}50%{transform:scale(1.045)}}\
@keyframes bk-rota{0%{opacity:0;transform:translateY(8px)}6%,44%{opacity:1;transform:none}50%,100%{opacity:0;transform:translateY(-8px)}}\
@media(max-width:640px){.bk-in{gap:10px;padding:6px 12px;min-height:40px}.bk-tag span{display:none}.bk-msgs{height:32px}.bk-msg{font-size:12.5px;line-height:1.25;white-space:normal}.bk-msg b{margin-right:0}.bk-x{display:none}.bk-btn{padding:8px 12px;font-size:12.5px}.bk-cuenta{font-size:12px}}\
@media(prefers-reduced-motion:reduce){.bk::before,.bk-dot,.bk-btn{animation:none}.bk-msg{animation:none;opacity:0}.bk-msg:first-child{opacity:1;transform:none}.bk.bk-flot{transition:none}}';
  }

  var WA = '<svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm5.3 14c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.2-4.6-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.8s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.3 0 .5l-.4.6c-.1.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.3 2.4 1.5.3.1.5.1.6-.1l.9-1.1c.2-.3.4-.2.6-.1l2 .9c.3.1.5.2.5.4.1.2.1.8-.1 1.4Z"/></svg>';

  function montar(copy, medir) {
    if (document.getElementById('bk-black')) return;
    var tema = TEMAS[copy.color] || TEMAS.negro;
    var diseno = copy.diseno === 'cuenta' || copy.diseno === 'flotante' ? copy.diseno : 'barra';
    var segunda = copy.segunda || RESPALDO.segunda;
    var eq = equipo();
    var url = 'https://wa.me/' + NUMERO + '?text=' + encodeURIComponent(FRASE + VARIANTES[eq]);
    var boton = '<a class="bk-btn" href="' + url + '" target="_blank" rel="noopener">' + esc(copy.boton || RESPALDO.boton) + ' ' + WA + '</a>';

    var st = document.createElement('style'); st.textContent = css(tema); document.head.appendChild(st);
    var el = document.createElement('div');
    el.id = 'bk-black'; el.className = 'bk'; el.setAttribute('role', 'region'); el.setAttribute('aria-label', 'Promoción Black Friday');
    if (copy.ronda) { el.setAttribute('data-ronda', copy.ronda); el.setAttribute('data-variante', copy.variante); }

    if (diseno === 'flotante') {
      // Tarjeta abajo a la IZQUIERDA: abajo a la derecha está el botón del chat de la Ruta.
      el.className = 'bk bk-flot';
      el.innerHTML =
        '<div class="bk-in">' +
          '<button class="bk-cerrar" type="button" aria-label="Cerrar">×</button>' +
          '<div class="bk-tag"><i class="bk-dot"></i><span>Black Tr4iner</span></div>' +
          '<div class="bk-titulo">' + esc(copy.gancho) + '</div>' +
          '<div class="bk-sub">' + esc(segunda.gancho) + esc(segunda.detalle) + '</div>' +
          boton +
        '</div>';
      document.body.appendChild(el);
      setTimeout(function () { el.classList.add('bk-on'); }, 600);
      // La × la oculta sólo en esta visita: al volver a entrar aparece de nuevo.
      el.querySelector('.bk-cerrar').addEventListener('click', function () { el.remove(); });
    } else {
      // Cuenta regresiva: la segunda línea que alterna pasa a ser «Termina en …» (en celular no
      // entra al lado del texto); en computadora también va pegada al texto.
      var reloj = '<span class="bk-cuenta">' + falta(copy.fin) + '</span>';
      var primera = diseno === 'cuenta'
        ? '<div class="bk-msg"><b>' + esc(copy.gancho) + '</b><span class="bk-x">· termina en ' + reloj + '</span></div>'
        : '<div class="bk-msg"><b>' + esc(copy.gancho) + '</b><span class="bk-x">' + esc(copy.detalle) + '</span></div>';
      var linea2 = diseno === 'cuenta'
        ? '<div class="bk-msg"><b>Termina en</b>' + reloj + '</div>'
        : '<div class="bk-msg"><b>' + esc(segunda.gancho) + '</b><span class="bk-x">' + esc(segunda.detalle) + '</span></div>';
      el.innerHTML =
        '<div class="bk-in">' +
          '<div class="bk-tag"><i class="bk-dot"></i><span>Black Tr4iner</span></div>' +
          '<div class="bk-msgs">' + primera + linea2 + '</div>' + boton +
        '</div>';
      document.body.insertBefore(el, document.body.firstChild);
      if (diseno === 'cuenta') {
        var relojes = el.querySelectorAll('.bk-cuenta');
        setInterval(function () { var f = falta(copy.fin); for (var i = 0; i < relojes.length; i++) relojes[i].textContent = f; }, 1000);
      }
    }

    if (medir) {
      var llave = 'tr4_black_vista_' + copy.ronda + '_' + diaLima();
      var yaContada = false;
      try { yaContada = sessionStorage.getItem(llave) === '1'; sessionStorage.setItem(llave, '1'); } catch (e) {}
      if (!yaContada) registrar('vista', copy, eq);
    }

    el.querySelector('.bk-btn').addEventListener('click', function () {
      if (medir) registrar('clic', copy, eq);
      try { (window.dataLayer = window.dataLayer || []).push({ event: 'black_tr4iner_click', ronda: copy.ronda || 'respaldo', version: copy.variante || 'respaldo', variante: eq, palabra: VARIANTES[eq], mensaje: FRASE + VARIANTES[eq] }); } catch (e) {}
    });
  }

  // Espera la sesión antes de dibujar: el estilo depende de la versión del miembro y así el
  // cliente no ve el banner un instante antes de que se quite.
  function iniciar() {
    var prueba = window.BK_PRUEBA; // maqueta: un objeto con el estilo, o false para no mostrar
    if (prueba !== undefined) { if (prueba) montar(prueba, false); return; }
    fetch('/api/genesis/me', { credentials: 'same-origin' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (d) {
        var m = d && d.member;
        if (!m) return montar(RESPALDO, false);
        if (m.yaCompro) return;
        if (!('black' in m)) return montar(RESPALDO, false); // CRM anterior al test
        if (m.black) montar(m.black, Boolean(m.black.ronda));
      })
      .catch(function () { montar(RESPALDO, false); });
  }
  if (document.body) iniciar(); else document.addEventListener('DOMContentLoaded', iniciar);
})();
