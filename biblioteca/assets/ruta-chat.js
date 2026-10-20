/*
 * Chat del equipo dentro de la Ruta Tr4iner.
 *
 * Botón fijo que abre un panel (lateral en escritorio, hoja inferior en el
 * celular) con la conversación. Vive en su propio archivo, y no inline como el
 * resto de la página, para poder llevarlo tal cual a la Ruta nueva.
 *
 * Toma los colores y las tipografías de la página (variables de :root), así
 * que se ve como parte de la Ruta y no como un widget pegado encima. Sólo
 * conversación: los datos del miembro los usa el agente, no se muestran.
 *
 * El navegador no decide precios: manda el mensaje a /api/genesis/chat y
 * dibuja lo que vuelve. Las tarjetas (pago, video, sesión agendada) las arma el
 * servidor; la sesión la registra el servidor en Calendly (20-oct), así que acá
 * no hay formulario de agenda: los horarios llegan como respuestas rápidas.
 */
(function () {
  'use strict';

  var ENDPOINT = '/api/genesis/chat';
  // Reproductor compartido de R2 (sin descarga ni clic derecho). Se carga recién
  // cuando alguien toca play en un video del chat.
  var REPRODUCTOR = '/assets/tr4-video/tr4-video.js?v=20261013';
  var STORAGE_PREFIX = 'tr4_ruta_chat_v1:';
  var MAX_ITEMS = 80;


  var CSS = [
    '.rc-launch{position:fixed;z-index:150;right:max(18px,env(safe-area-inset-right));bottom:calc(18px + env(safe-area-inset-bottom));display:grid;place-items:center;width:56px;height:56px;padding:0;border:0;border-radius:50%;background:var(--ink,#111);color:#fff;font:700 15px/1 var(--sans,system-ui,sans-serif);letter-spacing:-.01em;cursor:pointer;box-shadow:0 14px 34px -14px rgba(0,0,0,.55);transform:translateY(0);opacity:1;transition:transform .28s cubic-bezier(.2,.8,.2,1),opacity .2s ease,background .16s ease}',
    '.rc-launch:hover{background:#2B2B2B}',
    '.rc-launch:focus-visible{outline:3px solid var(--mark,#FFD43B);outline-offset:3px}',
    '.rc-launch[hidden]{display:none}',
    '.rc-launch.is-waiting{transform:translateY(14px);opacity:0;pointer-events:none}',
    // Sólo ícono (7-oct): el cuadrito amarillo de la marca queda como insignia en la esquina.
    '.rc-launch svg{width:24px;height:24px}',
    '.rc-launch-mark{position:absolute;top:9px;right:9px;width:10px;height:10px;border-radius:3px;background:var(--mark,#FFD43B);box-shadow:0 0 0 2px var(--ink,#111)}',
    'body.modal-open .rc-launch,body.mobile-video-playing .rc-launch,#tour:not([hidden]) ~ .rc-launch{display:none}',

    '.rc{position:fixed;inset:0 0 0 auto;width:min(440px,100vw);height:100dvh;max-width:none;max-height:none;margin:0;padding:0;border:0;border-left:1px solid var(--rule-strong,rgba(17,17,17,.24));background:var(--card,#fff);color:var(--ink,#111);font-family:var(--sans,system-ui,sans-serif);overscroll-behavior:contain}',
    '.rc[open]{display:flex;flex-direction:column;animation:rc-in-side .28s cubic-bezier(.2,.8,.2,1)}',
    '.rc::backdrop{background:rgba(17,17,17,.32)}',
    '@keyframes rc-in-side{from{transform:translateX(28px);opacity:0}to{transform:none;opacity:1}}',
    '@keyframes rc-in-up{from{transform:translateY(32px);opacity:0}to{transform:none;opacity:1}}',

    '.rc-head{display:flex;align-items:center;gap:4px;padding:calc(10px + env(safe-area-inset-top)) 10px 10px 20px;border-bottom:1px solid var(--rule,rgba(17,17,17,.12))}',
    '.rc-head-id{flex:1;min-width:0}',
    '.rc-title{margin:0;font:750 17px/1.2 var(--sans,system-ui,sans-serif);letter-spacing:-.02em;white-space:nowrap}',
    '.rc-close,.rc-reset{display:inline-flex;align-items:center;justify-content:center;width:44px;height:44px;border:0;border-radius:8px;background:transparent;color:var(--muted,#6B6B6B);cursor:pointer}',
    '.rc-close:hover,.rc-reset:hover{background:var(--paper-deep,#F5F5F5);color:var(--ink,#111)}',
    '.rc-close svg,.rc-reset svg{width:18px;height:18px}',
    '.rc-reset:focus-visible,.rc-close:focus-visible,.rc-chip:focus-visible,.rc-send:focus-visible,.rc-card-cta:focus-visible{outline:3px solid var(--mark,#FFD43B);outline-offset:2px}',

    '.rc-log{position:relative;flex:1;min-height:0;overflow-y:auto;padding:24px 20px 8px;display:flex;flex-direction:column;gap:16px;scroll-behavior:smooth}',


    '.rc-turn{display:flex;flex-direction:column;gap:6px;max-width:100%}',
    '.rc-text{margin:0;font-size:15.5px;line-height:1.5;white-space:pre-line;overflow-wrap:anywhere}',
    '.rc-turn--yo{align-self:flex-end;max-width:84%}',
    '.rc-turn--yo .rc-text{padding:10px 14px;border-radius:16px 16px 4px 16px;background:var(--ink,#111);color:#fff;font-size:15px}',
    '.rc-turn.is-new{animation:rc-msg .22s ease-out}',
    '@keyframes rc-msg{from{transform:translateY(6px);opacity:0}to{transform:none;opacity:1}}',

    '.rc-typing{display:flex;align-items:center;min-height:22px}',
    '.rc-dots{display:inline-flex;gap:4px}',
    '.rc-dots i{width:5px;height:5px;border-radius:50%;background:var(--ink,#111);opacity:.25;animation:rc-dot 1s infinite ease-in-out}',
    '.rc-dots i:nth-child(2){animation-delay:.15s}.rc-dots i:nth-child(3){animation-delay:.3s}',
    '@keyframes rc-dot{0%,100%{opacity:.2}50%{opacity:.85}}',

    '.rc-card{margin-top:4px;padding:16px 16px 14px;border:1px solid var(--rule-strong,rgba(17,17,17,.24));border-left:4px solid var(--mark,#FFD43B);border-radius:8px;background:var(--card,#fff)}',
    '.rc-card-code{margin:0 0 8px;color:var(--muted,#6B6B6B);font:500 9.5px/1.3 var(--mono,ui-monospace,monospace);letter-spacing:.14em;text-transform:uppercase}',
    '.rc-card-price{display:flex;align-items:baseline;flex-wrap:wrap;gap:4px 10px;margin:0 0 4px}',
    '.rc-card-price b{font-size:32px;font-weight:750;letter-spacing:-.045em;line-height:1}',
    '.rc-card-price s{color:var(--muted,#6B6B6B);font-size:15px;font-weight:600}',
    '.rc-card-price small{color:var(--muted,#6B6B6B);font:500 10px/1 var(--mono,ui-monospace,monospace);letter-spacing:.1em;text-transform:uppercase}',
    '.rc-card-bonos{margin:10px 0 0;padding:0;list-style:none}',
    '.rc-card-bonos li{display:flex;gap:8px;padding:7px 10px;margin-top:6px;border-radius:6px;background:var(--mark-soft,rgba(255,212,59,.36));font-size:14px;font-weight:650}',
    '.rc-card-bonos li::before{content:"+";font-weight:750}',
    '.rc-card-note{margin:10px 0 0;color:var(--muted,#6B6B6B);font-size:13px;line-height:1.4}',
    '.rc-card-cta{display:flex;align-items:center;justify-content:center;gap:8px;min-height:50px;margin-top:14px;padding:0 18px;border-radius:6px;background:var(--ink,#111);color:#fff;font-size:15.5px;font-weight:750;text-decoration:none;transition:background .16s ease}',
    '.rc-card-cta:hover{background:#2B2B2B}',
    '.rc-card-cta i{color:var(--mark,#FFD43B);font-style:normal}',
    '.rc-help-list{margin:4px 0 0;padding:0;list-style:none}',
    '.rc-help-list a{display:flex;justify-content:space-between;align-items:center;gap:12px;min-height:48px;padding:8px 0;border-bottom:1px solid var(--rule,rgba(17,17,17,.12));color:var(--ink,#111);text-decoration:none;font-size:14.5px}',
    '.rc-help-list b{font-size:17px;font-weight:750;letter-spacing:-.02em;white-space:nowrap}',
    '.rc-help-list a:focus-visible{outline:3px solid var(--mark,#FFD43B);outline-offset:2px}',
    '.rc-card--whatsapp .rc-card-cta{background:var(--card,#fff);color:var(--ink,#111);border:1px solid var(--ink,#111)}',
    '.rc-card--whatsapp .rc-card-cta:hover{background:var(--paper-deep,#F5F5F5)}',
    '.rc-card--whatsapp .rc-card-cta i{color:var(--ink,#111)}',
    '.rc-card-foot{margin:8px 0 0;color:var(--muted,#6B6B6B);font:500 9.5px/1.3 var(--mono,ui-monospace,monospace);letter-spacing:.08em;text-align:center;text-transform:uppercase}',
    '.rc-card-alt{display:block;margin:10px 0 0;color:var(--ink-soft,#3F3F3F);font-size:13.5px;text-align:center;text-decoration:underline;text-underline-offset:3px}',
    '.rc-card-alt:hover{color:var(--ink,#111)}',
    // Videos del método y testimonios: portada liviana; el video se monta al tocar play.
    // Como un video en un chat: sin marco, esquinas redondeadas y, el vertical, angosto.
    '.rc-vid{position:relative;width:100%;aspect-ratio:16/9;overflow:hidden;border-radius:14px;background:#000;-webkit-user-select:none;user-select:none;-webkit-touch-callout:none}',
    '.rc-vid--vertical{width:min(220px,62vw);aspect-ratio:9/16}',
    '.rc-vid img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;pointer-events:none}',
    '.rc-vid-play{position:absolute;left:50%;top:50%;z-index:2;width:56px;height:56px;margin:-28px 0 0 -28px;display:grid;place-items:center;padding:0;border:0;border-radius:50%;background:var(--ink,#111);box-shadow:0 4px 14px rgba(22,19,14,.4);cursor:pointer;transition:transform .18s ease}',
    '.rc-vid-play svg{width:18px;height:18px;margin-left:3px;fill:var(--mark,#FFD43B)}',
    '.rc-vid-play:active{transform:scale(.94)}',
    '.rc-vid-play:focus-visible{outline:3px solid var(--mark,#FFD43B);outline-offset:3px}',
    '.rc-media{margin:4px 0 0}',
    '.rc-media-cap{max-width:min(320px,100%);margin:6px 0 0}',
    '.rc-media-cap b{display:block;font-size:13.5px;font-weight:700;letter-spacing:-.01em}',
    '.rc-media-cap span{display:block;margin-top:1px;color:var(--muted,#6B6B6B);font-size:13px;line-height:1.4}',
    // Sesión agendada por el agente.
    '.rc-card-links{display:flex;flex-wrap:wrap;gap:6px 18px;margin-top:12px}',
    '.rc-card-links a{color:var(--ink-soft,#3F3F3F);font-size:13.5px;text-decoration:underline;text-underline-offset:3px}',
    '.rc-card-links a:hover{color:var(--ink,#111)}',
    '.rc-card-links a:focus-visible{outline:3px solid var(--mark,#FFD43B);outline-offset:2px}',
    '.rc-ok{display:flex;gap:12px;align-items:flex-start;margin-top:4px}',
    '.rc-ok i{flex:none;display:grid;place-items:center;width:28px;height:28px;border-radius:50%;background:var(--mark,#FFD43B);color:var(--ink,#111);font-style:normal;font-weight:800}',
    '.rc-ok b{display:block;font-size:16px;letter-spacing:-.01em}',
    '.rc-ok span{display:block;margin-top:3px;color:var(--ink-soft,#3F3F3F);font-size:14px;line-height:1.4}',

    '.rc-chips{display:flex;flex-wrap:wrap;gap:8px;padding:4px 20px 12px}',
    '.rc-chips:empty{display:none}',
    '.rc-chip{min-height:40px;padding:0 14px;border:1px solid var(--rule-strong,rgba(17,17,17,.24));border-radius:999px;background:var(--card,#fff);color:var(--ink,#111);font:600 14px/1.2 var(--sans,system-ui,sans-serif);cursor:pointer;transition:border-color .16s ease,background .16s ease}',
    '.rc-chip:hover{border-color:var(--ink,#111);background:var(--mark-soft,rgba(255,212,59,.36))}',

    '.rc-compose{display:flex;align-items:flex-end;gap:10px;padding:12px 16px calc(12px + env(safe-area-inset-bottom)) 20px;border-top:1px solid var(--rule,rgba(17,17,17,.12))}',
    '.rc-input{flex:1;min-height:44px;max-height:132px;padding:11px 0;border:0;background:transparent;color:var(--ink,#111);font:400 16px/1.4 var(--sans,system-ui,sans-serif);resize:none;outline:none}',
    '.rc-input::placeholder{color:var(--muted,#6B6B6B)}',
    '.rc-send{display:inline-flex;align-items:center;justify-content:center;flex:none;width:44px;height:44px;border:0;border-radius:10px;background:var(--ink,#111);color:#fff;cursor:pointer;transition:background .16s ease,opacity .16s ease}',
    '.rc-send:hover{background:#2B2B2B}',
    '.rc-send:disabled{opacity:.28;cursor:default}',
    '.rc-send svg{width:18px;height:18px}',
    '.rc-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}',

    '@media (max-width:719px){',
    '.rc-launch{right:16px;bottom:calc(16px + env(safe-area-inset-bottom));width:52px;height:52px}',
    '.rc{inset:auto 0 0 0;width:100vw;height:min(92dvh,780px);border-left:0;border-top:1px solid var(--rule-strong,rgba(17,17,17,.24));border-radius:14px 14px 0 0}',
    '.rc[open]{animation-name:rc-in-up}',
    '.rc-head{padding-top:10px}',
    '.rc-log{padding:16px 16px 8px}',
    '.rc-chips{padding:4px 16px 10px}',
    '.rc-compose{padding:10px 12px calc(10px + env(safe-area-inset-bottom)) 16px}',
    '}',
    '@media (prefers-reduced-motion:reduce){.rc[open],.rc-turn.is-new,.rc-dots i{animation:none}.rc-launch{transition:none}.rc-log{scroll-behavior:auto}}'
  ].join('\n');

  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (key) {
      if (key === 'text') node.textContent = attrs[key];
      else if (key === 'className') node.className = attrs[key];
      else node.setAttribute(key, attrs[key]);
    });
    (children || []).forEach(function (child) { if (child) node.appendChild(child); });
    return node;
  }

  function precio(valor) { return 'US$' + valor; }

  function store(key, value) {
    try {
      if (value === undefined) return JSON.parse(window.localStorage.getItem(key) || 'null');
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (e) { /* incógnito: la charla dura lo que dure la pestaña */ }
    return null;
  }

  function nuevaConversacion() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  }

  var opts = null;
  var state = null;
  var ui = {};
  var enviando = false;
  var abiertoUnaVez = false;

  function storageKey() { return STORAGE_PREFIX + (opts.email || 'anon'); }
  function guardar() {
    state.items = state.items.slice(-MAX_ITEMS);
    store(storageKey(), state);
  }

  function track(evento, props) {
    if (opts && typeof opts.track === 'function') opts.track(evento, props || {});
  }

  function apertura() {
    return {
      rol: 'equipo',
      // El saludo ya es la primera pregunta, con el tono de los asesores de
      // WhatsApp (20-oct). El prompt cita este texto: cambiarlo en los dos lados.
      texto: (opts.nombre ? 'Hola, ' + opts.nombre + ' 🙌' : 'Hola 🙌') + ' ¿Qué te gustaría lograr? Cuéntanos y te mostramos cómo te podemos ayudar.',
      opciones: ['Bajar grasa', 'Ganar músculo', 'Tengo una duda']
    };
  }

  function estadoInicial() {
    return { conversacion: nuevaConversacion(), items: [apertura()], mostrados: [], eco: {}, ajuste: null };
  }

  // ── Tarjetas ─────────────────────────────────────────────
  // Líneas de ayuda en crisis: sin botón de venta ni medición, sólo los números.
  function tarjetaAyuda(t) {
    var lista = el('ul', { className: 'rc-help-list' }, (t.lineas || []).map(function (l) {
      return el('li', {}, [el('a', { href: 'tel:' + l.tel }, [
        el('span', { text: l.nombre }), el('b', { text: l.numero })
      ])]);
    }));
    return el('article', { className: 'rc-card rc-card--ayuda' }, [
      el('p', { className: 'rc-card-code', text: t.titulo }),
      lista,
      t.nota ? el('p', { className: 'rc-card-note', text: t.nota }) : null
    ]);
  }

  function zonaLocal() {
    try { return Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch (e) { return ''; }
  }

  // ── Videos ───────────────────────────────────────────────
  // Uno solo suena a la vez: al tocar play en otro, el anterior se suelta.
  var activo = null;
  function soltarVideo() {
    if (!activo) return;
    try { activo.reproductor.destruir(); } catch (e) { /* ya no estaba */ }
    activo.restaurar();
    activo = null;
  }

  function conReproductor(listo, fallo) {
    if (window.TR4Video) { listo(); return; }
    var previo = document.querySelector('script[data-rc-reproductor]');
    var tag = previo || el('script', { src: REPRODUCTOR, 'data-rc-reproductor': '1' });
    tag.addEventListener('load', listo, { once: true });
    tag.addEventListener('error', fallo, { once: true });
    if (!previo) document.head.appendChild(tag);
  }

  function portada(cuadro, t, alTocar) {
    cuadro.textContent = '';
    if (t.portada) cuadro.appendChild(el('img', { src: t.portada, alt: '', loading: 'lazy', decoding: 'async', draggable: 'false' }));
    var play = el('button', { type: 'button', className: 'rc-vid-play', 'aria-label': 'Ver el video: ' + t.titulo });
    play.innerHTML = '<svg viewBox="0 0 12 14" aria-hidden="true"><path d="M0 0l12 7-12 7z"/></svg>';
    play.addEventListener('click', alTocar);
    cuadro.appendChild(play);
  }

  function tarjetaVideo(t) {
    var cuadro = el('div', { className: 'rc-vid' + (t.orientacion === 'vertical' ? ' rc-vid--vertical' : '') });
    // Ni sobre la portada se ofrece «Guardar imagen» o «Guardar video».
    cuadro.addEventListener('contextmenu', function (e) { e.preventDefault(); });
    function restaurar() { portada(cuadro, t, reproducir); }
    // La regla WAF de R2 exige el origen de la Ruta en los testimonios. Si un
    // teléfono pide el video sin él, R2 responde 403: el mismo testimonio sigue en
    // Vimeo (su id es el final de la carpeta) y se abre ahí, desde donde iba.
    function respaldoVimeo() {
      var id = (/\/testimonios\/.+-(\d+)\/$/.exec(t.base || '') || [])[1];
      if (!id || !activo || !cuadro.isConnected) return false;
      var desde = Math.floor(activo.reproductor.getCurrentTime() || 0);
      activo.reproductor.destruir();
      activo.reproductor = { destruir: function () { cuadro.textContent = ''; } };
      cuadro.appendChild(el('iframe', {
        src: 'https://player.vimeo.com/video/' + id + '?autoplay=1' + (desde ? '#t=' + desde + 's' : ''),
        title: t.titulo, allow: 'autoplay; fullscreen', style: 'position:absolute;inset:0;width:100%;height:100%;border:0'
      }));
      track('chat_video_respaldo_vimeo', { video: t.id || t.escalon });
      return true;
    }
    function reproducir() {
      track('chat_video_play', { video: t.id || t.escalon });
      conReproductor(function () {
        soltarVideo();
        activo = { restaurar: restaurar, reproductor: null };
        activo.reproductor = window.TR4Video.montar(cuadro, { base: t.base, poster: t.portada, titulo: t.titulo, alError: respaldoVimeo });
      }, function () {
        cuadro.appendChild(el('p', { className: 'rc-sr', role: 'status', text: 'No se pudo cargar el video.' }));
      });
    }
    restaurar();
    return el('figure', { className: 'rc-media' }, [
      cuadro,
      el('figcaption', { className: 'rc-media-cap' }, [
        el('b', { text: t.titulo }),
        t.subtitulo ? el('span', { text: t.subtitulo }) : null
      ])
    ]);
  }

  // La sesión ya quedó registrada en Calendly por el servidor: sólo se confirma.
  function tarjetaAgenda(t) {
    var links = [];
    if (t.reprogramar) links.push(el('a', { href: t.reprogramar, target: '_blank', rel: 'noopener', text: 'Cambiar día u hora' }));
    if (t.cancelar) links.push(el('a', { href: t.cancelar, target: '_blank', rel: 'noopener', text: 'Cancelar la sesión' }));
    return el('article', { className: 'rc-card rc-card--agenda' }, [
      el('p', { className: 'rc-card-code', text: 'Sesión con un asesor · 30 min · Gratis' }),
      el('div', { className: 'rc-ok', role: 'status' }, [
        el('i', { 'aria-hidden': 'true', text: '✓' }),
        el('div', {}, [
          el('b', { text: 'Sesión agendada' }),
          el('span', { text: t.etiqueta + (t.zona_nombre ? ' (hora de ' + t.zona_nombre + ')' : '') })
        ])
      ]),
      // En el Preview la reserva no se envía a Calendly: que quien prueba lo sepa.
      t.prueba ? el('p', { className: 'rc-card-note', text: 'Modo prueba: la cita no se creó en Calendly.' }) : null,
      links.length ? el('div', { className: 'rc-card-links' }, links) : null
    ]);
  }

  function tarjeta(t) {
    if (t && t.tipo === 'ayuda') return tarjetaAyuda(t);
    if (t && t.tipo === 'video' && t.base) return tarjetaVideo(t);
    if (t && t.tipo === 'agenda') return tarjetaAgenda(t);
    if (!t || !t.url) return null;
    var esWhatsApp = t.tipo === 'whatsapp';
    var hijos = [];
    if (!esWhatsApp) {
      hijos.push(el('p', { className: 'rc-card-code', text: t.titulo + ' · ' + t.duracion }));
      var linea = el('p', { className: 'rc-card-price' });
      if (t.precio_antes) linea.appendChild(el('s', { text: precio(t.precio_antes), 'aria-label': 'Antes ' + precio(t.precio_antes) }));
      linea.appendChild(el('b', { text: precio(t.precio) }));
      linea.appendChild(el('small', { text: t.periodo ? 'al ' + t.periodo : 'Pago único' }));
      hijos.push(linea);
      if (t.bonos && t.bonos.length) {
        hijos.push(el('ul', { className: 'rc-card-bonos' }, t.bonos.map(function (b) { return el('li', { text: b }); })));
      }
      if (t.resumen) hijos.push(el('p', { className: 'rc-card-note', text: t.resumen }));
      if (t.cuotas) hijos.push(el('p', { className: 'rc-card-note', text: t.cuotas }));
    }
    var cta = el('a', { className: 'rc-card-cta', href: t.url, target: '_blank', rel: 'noopener' }, [
      el('span', { text: t.boton }), el('i', { 'aria-hidden': 'true', text: '→' })
    ]);
    cta.addEventListener('click', function () {
      if (t.destino === 'calendly') track('chat_calendario_click', {});
      else if (esWhatsApp) track('chat_whatsapp_click', {});
      else track('chat_pago_click', { escalon: t.escalon, destino: t.destino, precio: t.precio });
    });
    hijos.push(cta);
    if (!esWhatsApp) {
      var pie = { hotmart: 'Pago seguro con Hotmart', stripe: 'Pago seguro con Stripe' }[t.destino] || 'Te confirmamos el pago por WhatsApp';
      hijos.push(el('p', { className: 'rc-card-foot', text: pie }));
    }
    if (t.alterna && t.alterna.url) {
      var otra = el('a', { className: 'rc-card-alt', href: t.alterna.url, target: '_blank', rel: 'noopener', text: t.alterna.texto });
      otra.addEventListener('click', function () { track('chat_pago_click', { escalon: t.escalon, destino: t.alterna.destino, precio: t.precio }); });
      hijos.push(otra);
    }
    return el('article', { className: 'rc-card' + (esWhatsApp ? ' rc-card--whatsapp' : '') }, hijos);
  }

  // ── Render ───────────────────────────────────────────────
  function turno(item, nuevo) {
    var esEquipo = item.rol === 'equipo';
    var hijos = [];
    hijos.push(el('p', { className: 'rc-text', text: item.texto }));
    if (esEquipo && item.tarjeta) hijos.push(tarjeta(item.tarjeta));
    return el('div', { className: 'rc-turn rc-turn--' + (esEquipo ? 'equipo' : 'yo') + (nuevo ? ' is-new' : '') }, hijos);
  }

  function pintarChips() {
    ui.chips.textContent = '';
    var ultimo = state.items[state.items.length - 1];
    if (enviando || !ultimo || ultimo.rol !== 'equipo' || !ultimo.opciones) return;
    ultimo.opciones.forEach(function (opcion) {
      var chip = el('button', { type: 'button', className: 'rc-chip', text: opcion });
      chip.addEventListener('click', function () { enviar(opcion); });
      ui.chips.appendChild(chip);
    });
    // Las respuestas rápidas achican la conversación: hay que volver a acomodarla.
    bajar();
  }

  // Al final de la charla, salvo que la última respuesta del equipo (texto +
  // tarjeta) no entre entera: ahí se muestra su comienzo, que es lo que se lee.
  function bajar() {
    var turnoEquipo = ui.ultimoEquipo;
    if (turnoEquipo && turnoEquipo.isConnected && turnoEquipo.offsetHeight > ui.log.clientHeight - 24) {
      ui.log.scrollTop = turnoEquipo.offsetTop - 16;
    } else {
      ui.log.scrollTop = ui.log.scrollHeight;
    }
  }

  function pintarTodo() {
    soltarVideo();
    ui.log.textContent = '';
    ui.ultimoEquipo = null;
    state.items.forEach(function (item) { ui.log.appendChild(turno(item, false)); });
    pintarChips();
    bajar();
  }

  function agregar(item) {
    state.items.push(item);
    guardar();
    var nodo = turno(item, true);
    ui.log.appendChild(nodo);
    ui.ultimoEquipo = item.rol === 'equipo' ? nodo : null;
    pintarChips();
    bajar();
  }

  function escribiendo(activo) {
    if (ui.typing) { ui.typing.remove(); ui.typing = null; }
    if (!activo) return;
    var dots = el('span', { className: 'rc-dots', 'aria-hidden': 'true' }, [el('i'), el('i'), el('i')]);
    ui.typing = el('div', { className: 'rc-typing rc-turn is-new' }, [
      el('span', { className: 'rc-sr', text: 'El equipo está escribiendo' }), dots
    ]);
    ui.log.appendChild(ui.typing);
    bajar();
  }

  function bloquear(activo) {
    enviando = activo;
    ui.send.disabled = activo || !ui.input.value.trim();
    ui.input.setAttribute('aria-busy', activo ? 'true' : 'false');
    pintarChips();
  }

  // La tarjeta del último mensaje del equipo, si tenía: el servidor no repite
  // la misma seguida, pero sí la vuelve a mostrar si quedó más arriba.
  function ultimaTarjeta() {
    for (var i = state.items.length - 1; i >= 0; i--) {
      var it = state.items[i];
      if (it.rol === 'equipo') return it.tarjeta ? (it.tarjeta.escalon || it.tarjeta.tipo || null) : null;
    }
    return null;
  }

  // ── Envío ────────────────────────────────────────────────
  function enviar(textoLibre) {
    var texto = String(textoLibre == null ? ui.input.value : textoLibre).trim();
    if (!texto || enviando) return;
    ui.input.value = '';
    ajustarAlto();
    agregar({ rol: 'yo', texto: texto });
    bloquear(true);
    escribiendo(true);

    fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({
        mensaje: texto,
        conversacion: state.conversacion,
        mostrados: state.mostrados,
        eco: state.eco,
        ajuste: state.ajuste,
        zona: zonaLocal(),
        ultima: ultimaTarjeta()
      })
    }).then(function (res) {
      return res.json().catch(function () { return {}; }).then(function (data) { return { status: res.status, data: data }; });
    }).then(function (r) {
      escribiendo(false);
      if (r.status === 401) {
        agregar({ rol: 'equipo', texto: r.data.error || 'Tu sesión venció. Vuelve a entrar desde el enlace de tu correo.' });
        return;
      }
      if (r.status !== 200 || !r.data.mensaje) throw new Error('respuesta ' + r.status);
      var d = r.data;
      if (d.eco) state.eco = d.eco;
      state.ajuste = d.ajuste || null;
      if (d.tarjeta && d.tarjeta.escalon && state.mostrados.indexOf(d.tarjeta.escalon) === -1) {
        state.mostrados.push(d.tarjeta.escalon);
      }
      if (d.tarjeta && d.tarjeta.tipo === 'plan') track('chat_oferta', { escalon: d.tarjeta.escalon, precio: d.tarjeta.precio });
      else if (d.tarjeta && d.tarjeta.tipo === 'video') track('chat_video', { video: d.tarjeta.id });
      else if (d.tarjeta && d.tarjeta.tipo === 'agenda') track('chat_agendo', { prueba: Boolean(d.tarjeta.prueba) });
      if (d.opciones && d.opciones.length && d.eco && d.eco.horarios && d.eco.horarios.length) track('chat_horarios', { cantidad: d.eco.horarios.length });
      agregar({ rol: 'equipo', texto: d.mensaje, opciones: d.opciones || [], tarjeta: d.tarjeta || null });
    }).catch(function () {
      escribiendo(false);
      agregar({
        rol: 'equipo',
        texto: 'Se nos cortó la respuesta. Si quieres, sigue la conversación con el equipo por WhatsApp.',
        tarjeta: opts.whatsapp ? { tipo: 'whatsapp', titulo: 'Sigue por WhatsApp con el equipo', boton: 'Abrir WhatsApp', url: opts.whatsapp } : null
      });
    }).then(function () {
      bloquear(false);
      if (window.matchMedia('(pointer: fine)').matches) ui.input.focus();
    });
  }

  function ajustarAlto() {
    ui.input.style.height = 'auto';
    ui.input.style.height = Math.min(ui.input.scrollHeight, 132) + 'px';
    ui.send.disabled = enviando || !ui.input.value.trim();
  }

  // ── Armado ───────────────────────────────────────────────
  function construir() {
    var estilo = el('style', { id: 'rc-style' });
    estilo.textContent = CSS;
    document.head.appendChild(estilo);

    // Sin texto: el nombre accesible y el tooltip dicen qué abre.
    ui.launch = el('button', { type: 'button', className: 'rc-launch is-waiting', 'aria-haspopup': 'dialog', 'aria-controls': 'rc-dialog', 'aria-label': 'Habla con el equipo', title: 'Habla con el equipo' }, [
      el('span', { className: 'rc-launch-mark', 'aria-hidden': 'true' })
    ]);
    ui.launch.insertAdjacentHTML('afterbegin', '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" aria-hidden="true"><path d="M6.5 4h11A2.5 2.5 0 0 1 20 6.5v7a2.5 2.5 0 0 1-2.5 2.5H11l-4.5 3.5V16A2.5 2.5 0 0 1 4 13.5v-7A2.5 2.5 0 0 1 6.5 4z"/></svg>');

    var cerrar = el('button', { type: 'button', className: 'rc-close', 'aria-label': 'Cerrar el chat' });
    cerrar.innerHTML = '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M5 5l10 10M15 5L5 15"/></svg>';
    var reiniciar = el('button', { type: 'button', className: 'rc-reset', 'aria-label': 'Empezar la conversación de nuevo', title: 'Empezar de nuevo' });
    reiniciar.innerHTML = '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 10a6 6 0 1 0 1.8-4.3M4 3.5v3h3"/></svg>';

    ui.log = el('div', { className: 'rc-log', role: 'log', 'aria-live': 'polite', 'aria-label': 'Conversación con el equipo' });
    ui.chips = el('div', { className: 'rc-chips', 'aria-label': 'Respuestas sugeridas' });
    ui.input = el('textarea', { id: 'rc-input', className: 'rc-input', rows: '1', maxlength: '800', placeholder: 'Escribe tu mensaje…', autocomplete: 'off' });
    ui.send = el('button', { type: 'submit', className: 'rc-send', 'aria-label': 'Enviar mensaje', disabled: 'disabled' });
    ui.send.innerHTML = '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 16V4M5 9l5-5 5 5"/></svg>';
    var form = el('form', { className: 'rc-compose' }, [
      el('label', { className: 'rc-sr', for: 'rc-input', text: 'Escribe tu mensaje' }), ui.input, ui.send
    ]);

    ui.dialog = el('dialog', { id: 'rc-dialog', className: 'rc', 'aria-labelledby': 'rc-title' }, [
      el('header', { className: 'rc-head' }, [
        el('div', { className: 'rc-head-id' }, [
          el('h2', { id: 'rc-title', className: 'rc-title', text: 'Equipo TR4INER' })
        ]),
        reiniciar,
        cerrar
      ]),
      ui.log,
      ui.chips,
      form
    ]);

    document.body.appendChild(ui.launch);
    document.body.appendChild(ui.dialog);

    ui.launch.addEventListener('click', abrir);
    cerrar.addEventListener('click', function () { ui.dialog.close(); });
    reiniciar.addEventListener('click', function () {
      state = estadoInicial();
      guardar();
      pintarTodo();
    });
    // Clic en el fondo oscuro: el diálogo ocupa su panel, así que un clic cuyo
    // destino es el propio <dialog> sólo puede venir del ::backdrop.
    ui.dialog.addEventListener('click', function (event) {
      if (event.target === ui.dialog) ui.dialog.close();
    });
    ui.dialog.addEventListener('close', function () {
      soltarVideo();
      ui.launch.hidden = false;
      document.documentElement.style.overflow = '';
      ui.launch.focus();
    });
    form.addEventListener('submit', function (event) { event.preventDefault(); enviar(); });
    ui.input.addEventListener('input', ajustarAlto);
    ui.input.addEventListener('keydown', function (event) {
      if (event.key === 'Enter' && !event.shiftKey && !event.isComposing) { event.preventDefault(); enviar(); }
    });

    // Entra un instante después de la página, para que no compita con la
    // primera lectura de la Ruta.
    setTimeout(function () { ui.launch.classList.remove('is-waiting'); }, 900);
  }

  function abrir() {
    if (!ui.dialog || ui.dialog.open) return;
    ui.launch.hidden = true;
    document.documentElement.style.overflow = 'hidden';
    ui.dialog.showModal();
    pintarTodo();
    if (window.matchMedia('(pointer: fine)').matches) ui.input.focus();
    if (!abiertoUnaVez) {
      abiertoUnaVez = true;
      track('chat_abierto', { estado: opts.estado || null, mensajes_previos: state.items.length - 1 });
    }
  }

  window.TR4RutaChat = {
    init: function (options) {
      if (opts || !options || typeof HTMLDialogElement === 'undefined') return false;
      opts = options;
      var guardado = store(storageKey());
      state = guardado && Array.isArray(guardado.items) && guardado.items.length ? guardado : estadoInicial();
      state.mostrados = Array.isArray(state.mostrados) ? state.mostrados : [];
      state.eco = state.eco || {};
      construir();
      return true;
    },
    open: abrir,
    disponible: function () { return Boolean(ui.dialog); }
  };
})();
