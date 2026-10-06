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
 * dibuja lo que vuelve. La tarjeta de pago la arma el servidor.
 */
(function () {
  'use strict';

  var ENDPOINT = '/api/genesis/chat';
  var STORAGE_PREFIX = 'tr4_ruta_chat_v1:';
  var MAX_ITEMS = 80;


  var CSS = [
    '.rc-launch{position:fixed;z-index:150;right:max(18px,env(safe-area-inset-right));bottom:calc(18px + env(safe-area-inset-bottom));display:inline-flex;align-items:center;gap:10px;min-height:52px;padding:0 20px 0 16px;border:0;border-radius:999px;background:var(--ink,#111);color:#fff;font:700 15px/1 var(--sans,system-ui,sans-serif);letter-spacing:-.01em;cursor:pointer;box-shadow:0 14px 34px -14px rgba(0,0,0,.55);transform:translateY(0);opacity:1;transition:transform .28s cubic-bezier(.2,.8,.2,1),opacity .2s ease,background .16s ease}',
    '.rc-launch:hover{background:#2B2B2B}',
    '.rc-launch:focus-visible{outline:3px solid var(--mark,#FFD43B);outline-offset:3px}',
    '.rc-launch[hidden]{display:none}',
    '.rc-launch.is-waiting{transform:translateY(14px);opacity:0;pointer-events:none}',
    '.rc-launch-mark{width:9px;height:9px;border-radius:2px;background:var(--mark,#FFD43B);flex:none}',
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
    '.rc-launch{right:16px;bottom:calc(16px + env(safe-area-inset-bottom));min-height:48px;padding:0 18px 0 14px;font-size:14.5px}',
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
      texto: (opts.nombre ? 'Hola, ' + opts.nombre + '.' : 'Hola.') + ' ¿En qué te ayudamos?',
      opciones: ['Quiero que me guíen 1 a 1', '¿Cuánto cuesta?', 'Tengo una duda']
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

  function tarjeta(t) {
    if (t && t.tipo === 'ayuda') return tarjetaAyuda(t);
    if (!t || !t.url) return null;
    var esWhatsApp = t.tipo === 'whatsapp';
    var hijos = [];
    if (!esWhatsApp) {
      hijos.push(el('p', { className: 'rc-card-code', text: t.titulo + ' · ' + t.duracion }));
      var linea = el('p', { className: 'rc-card-price' });
      if (t.precio_antes) linea.appendChild(el('s', { text: precio(t.precio_antes), 'aria-label': 'Antes ' + precio(t.precio_antes) }));
      linea.appendChild(el('b', { text: precio(t.precio) }));
      linea.appendChild(el('small', { text: 'Pago único' }));
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
      if (esWhatsApp) track('chat_whatsapp_click', {});
      else track('chat_pago_click', { escalon: t.escalon, destino: t.destino, precio: t.precio });
    });
    hijos.push(cta);
    if (!esWhatsApp) {
      hijos.push(el('p', { className: 'rc-card-foot', text: t.destino === 'hotmart' ? 'Pago seguro con Hotmart' : 'Te confirmamos el pago por WhatsApp' }));
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
        ajuste: state.ajuste
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
      if (d.tarjeta && d.tarjeta.escalon) track('chat_oferta', { escalon: d.tarjeta.escalon, precio: d.tarjeta.precio });
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

    ui.launch = el('button', { type: 'button', className: 'rc-launch is-waiting', 'aria-haspopup': 'dialog', 'aria-controls': 'rc-dialog' }, [
      el('span', { className: 'rc-launch-mark', 'aria-hidden': 'true' }),
      el('span', { text: 'Habla con el equipo' })
    ]);

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
