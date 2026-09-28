/* Rutina dentro de la Ruta, con la estética de la página de producción (maqueta
   aprobada el 26-sep-2026). La asignación, el progreso y los reemplazos los decide
   el CRM: acá solo se pintan y se piden cambios. El descanso y sus avisos los
   maneja /biblioteca/ruta/push.js, el mismo que ya estaba probado. */
(function () {
  'use strict';
  var PUSH_VERSION = '20260926-rutina1';
  var $ = function (id) { return document.getElementById(id); };
  var esc = function (value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };
  var ICON = {
    arrow: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M2 8h11M9.5 4.5L13 8l-3.5 3.5"/></svg>',
    down: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M8 2v11M4.5 9.5L8 13l3.5-3.5"/></svg>',
    check: '<svg viewBox="0 0 14 14" fill="none" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2.5 7.5l3 3 6-6.5"/></svg>',
    play: '<svg viewBox="0 0 12 14" aria-hidden="true"><path d="M0 0l12 7-12 7z"/></svg>',
    lock: '<svg viewBox="0 0 12 14" aria-hidden="true"><path d="M3 6V4.2a3 3 0 0 1 6 0V6" fill="none" stroke="currentColor" stroke-width="1.5"/><rect x="1.5" y="6" width="9" height="7" rx="1.5" fill="currentColor"/></svg>'
  };
  var st = { weeks: {}, version: 0, member: null, program: null, week: 0, day: 0, openSlot: null,
    replaceSlot: null, pending: Promise.resolve(), loaded: false, lastFocus: null, replaceFocus: null,
    // La página decide cuándo se activa (videos de pesas vistos) y si va en el inicio.
    // Hasta que lo diga, la rutina no se muestra ni se abre.
    gate: { activa: false, enInicio: false, faltan: 0, total: 0, modulo: 'Entrenamiento de pesas' },
    box: null, cerrarReproductor: null };

  async function api(path, options) {
    var response, data = null;
    try { response = await fetch('/api/genesis/' + path, Object.assign({ credentials: 'same-origin', cache: 'no-store' }, options)); }
    catch (_) {
      // En el gimnasio falla la red: el mensaje tiene que entenderse, no decir «Failed to fetch».
      var offline = new Error('Sin conexión. Revisa tu internet e inténtalo de nuevo.'); offline.network = true; throw offline;
    }
    try { data = await response.json(); } catch (_) { /* un timeout de Vercel responde HTML */ }
    if (!response.ok || !data) {
      var error = new Error(response.status === 401 ? 'Tu sesión venció. Recarga la página para volver a entrar.' : (data && data.error) || 'No se pudo completar. Inténtalo de nuevo.');
      error.status = response.status; throw error;
    }
    return data;
  }

  function accept(data) {
    st.weeks[data.week] = data.routine;
    st.version = data.version;
    st.member = data.member;
    st.program = data.program;
  }
  function rotating() { return !!(st.program && st.program.rotating); }
  function weekCount() { return rotating() ? 3 : 1; }
  function days() { return st.weeks[st.week] || []; }
  function cap(name) { var n = String(name || '').toLowerCase(); return n.charAt(0).toUpperCase() + n.slice(1); }
  function doseText(ex) { return ex.sets + ' series × ' + ex.reps + ' · ' + ex.rest + ' s'; }
  function exerciseBySlot(slot) {
    var list = days().reduce(function (all, day) { return all.concat(day.exercises); }, []);
    return list.find(function (ex) { return ex.slot === slot; });
  }
  function nextSession() {
    for (var w = 0; w < weekCount(); w++) {
      var list = st.weeks[w] || [];
      for (var d = 0; d < list.length; d++) {
        if (list[d].exercises.some(function (ex) { return !ex.completed; })) return { week: w, day: d };
      }
    }
    return null;
  }
  function firstPendingSlot() {
    var day = days()[st.day];
    var pending = day && day.exercises.find(function (ex) { return !ex.completed; });
    return pending ? pending.slot : null;
  }

  function toast(message) {
    var el = $('toast'); if (!el) return;
    el.textContent = message; el.hidden = false;
    clearTimeout(toast.t); toast.t = setTimeout(function () { el.hidden = true; }, 4500);
  }

  // ── Tarjeta fija «Tu rutina», con el formato de «Conoce tus macros» ──
  function placeTrigger() {
    var trigger = $('routine-trigger');
    if (!trigger) return;
    if (window.matchMedia('(max-width: 640px)').matches) {
      var macros = $('mobile-profile-trigger');
      if (macros && trigger.nextElementSibling !== macros) macros.parentNode.insertBefore(trigger, macros);
    } else {
      var content = document.querySelector('.route-content');
      if (content && content.firstElementChild !== trigger) content.insertBefore(trigger, content.firstElementChild);
    }
  }
  function paintTrigger() {
    var trigger = $('routine-trigger'); if (!trigger) return;
    var next = nextSession();
    var list = st.weeks[next ? next.week : 0] || [];
    $('routine-trigger-title').textContent = 'Tu rutina · ' + st.member.frequency + ' días';
    $('routine-trigger-next').textContent = next
      ? 'Te toca: Día ' + (next.day + 1) + ' · ' + cap(list[next.day].name)
      : 'Semana completa · empieza de nuevo';
    trigger.hidden = !st.gate.enInicio;
  }

  // Debajo del video de introducción: el botón si ya está activa; si no, cuánto falta.
  function paintPlayerBox() {
    var box = st.box;
    if (!box || !box.isConnected || box.hidden) return;
    if (st.gate.activa) {
      box.innerHTML = '<button type="button" class="player-routine-cta">Ver mi rutina de ' + st.member.frequency + ' días <span aria-hidden="true">→</span></button>' +
        '<p class="player-routine-note">Tus ejercicios, series, repeticiones y descansos, sesión por sesión. También la tienes en el inicio.</p>';
      box.querySelector('button').onclick = function () {
        if (st.cerrarReproductor) st.cerrarReproductor();
        setTimeout(function () { open(); }, 0);
      };
      return;
    }
    var faltan = st.gate.faltan;
    box.innerHTML = '<p class="player-routine-locked">' + ICON.lock + '<span>Tu rutina de ' + st.member.frequency + ' días se activa cuando termines los ' + st.gate.total +
      ' videos de ' + esc(st.gate.modulo) + '. ' + (faltan === 1 ? 'Te falta 1.' : 'Te faltan ' + faltan + '.') + '</span></p>';
  }

  // ── Hoja de la rutina ──
  function media(ex) {
    var src = bunnySrc(ex);
    if (!src) {
      // Mientras se graba la demostración se ve el lugar y el formato del video.
      return '<button type="button" class="rt-video is-v rt-soon" data-soon aria-label="Demostración de ' + esc(ex.name) + ': se publica pronto">' +
        '<span class="rt-soon-flag">Video en producción</span><span class="rt-soon-play">' + ICON.play + '</span>' +
        '<strong>' + esc(ex.name) + '</strong><small>Se publica pronto.</small></button>';
    }
    return '<button type="button" class="rt-video ' + (ex.orientation === 'horizontal' ? 'is-h' : 'is-v') + '" data-play="' + esc(ex.slot) + '" aria-label="Ver demostración de ' + esc(ex.name) + '">' +
      (ex.thumbnail ? '<img src="' + esc(ex.thumbnail) + '" alt="" loading="lazy" decoding="async" />' : '') +
      '<span class="rt-play">' + ICON.play + '</span></button>';
  }
  function bunnySrc(ex) {
    if (!/^\d+$/.test(ex.libraryId || '') || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(ex.videoId || '')) return null;
    return 'https://player.mediadelivery.net/embed/' + ex.libraryId + '/' + ex.videoId + '?autoplay=true&loop=true&muted=false&preload=true&playsinline=true';
  }
  function dose(ex, stacked) {
    return '<dl class="rt-dose' + (stacked ? ' is-stack' : '') + '">' +
      '<div><dt>Series</dt><dd>' + ex.sets + '</dd></div>' +
      '<div><dt>Repeticiones</dt><dd>' + esc(String(ex.reps).replace(/ a /, '–')) + '</dd></div>' +
      '<div><dt>Descanso</dt><dd>' + ex.rest + '<small> s</small></dd></div></dl>';
  }
  function body(ex) {
    var horizontal = ex.orientation === 'horizontal' && bunnySrc(ex);
    var swap = ex.replacementIndex !== null && ex.replacementIndex !== undefined
      ? '<span class="rt-swap">Reemplaza a: ' + esc(ex.originalName) + '</span>' : '';
    var top = horizontal
      ? media(ex) + dose(ex, false)
      : '<div class="rt-portrait">' + media(ex) + dose(ex, true) + '</div>';
    return '<div class="rt-body" id="rt-body-' + esc(ex.slot) + '">' + swap + top +
      '<button type="button" class="rt-rest" data-rest="' + ex.rest + '">Iniciar descanso · ' + ex.rest + ' s <i aria-hidden="true">→</i></button>' +
      '<div class="rt-actions">' +
        (ex.alternatives && ex.alternatives.length ? '<button type="button" class="rt-link" data-replace="' + esc(ex.slot) + '">Buscar un reemplazo</button>' : '<span></span>') +
        '<button type="button" class="rt-done" data-done="' + esc(ex.slot) + '" aria-pressed="' + !!ex.completed + '">' + (ex.completed ? 'Hecho' : 'Marcar hecho') + ' <span class="rt-check">' + ICON.check + '</span></button>' +
      '</div></div>';
  }
  function render() {
    var list = days(); if (!list.length) return;
    st.day = Math.max(0, Math.min(st.day, list.length - 1));
    var day = list[st.day];
    var total = day.exercises.length;
    var hechos = day.exercises.filter(function (ex) { return ex.completed; }).length;
    var html = '<h2 id="routine-title" tabindex="-1">Día ' + (st.day + 1) + ' · ' + esc(cap(day.name)) + '.</h2>';
    if (rotating()) {
      var ciclo = String(st.program.title || '').split('·')[0].trim().replace(/\s*\/\s*/g, ' → ');
      html += '<div class="rt-week"><span>Semana <b>' + (st.week + 1) + '</b> de 3 · ' + esc(ciclo) + '</span>' +
        '<label>Cambiar<select id="rt-week-select" aria-label="Semana del ciclo">' + [0, 1, 2].map(function (w) {
          return '<option value="' + w + '"' + (w === st.week ? ' selected' : '') + '>Semana ' + (w + 1) + '</option>';
        }).join('') + '</select></label></div>';
    }
    html += '<div class="rt-days" role="tablist" aria-label="Días de entrenamiento">' + list.map(function (d, i) {
      return '<button type="button" role="tab" class="rt-day' + (i === st.day ? ' is-today' : '') + '" aria-selected="' + (i === st.day) + '" data-day="' + i + '"><span>Día ' + (i + 1) + '</span><b>' + esc(cap(d.name)) + '</b></button>';
    }).join('') + '</div>';
    html += '<div class="rt-progress"><div><i style="width:' + (hechos / total * 100) + '%"></i></div><p>' + hechos + ' de ' + total + ' ejercicios hechos</p></div>';
    html += '<div class="rt-list">' + day.exercises.map(function (ex, i) {
      var open = ex.slot === st.openSlot;
      return '<div class="rt-ex' + (ex.completed ? ' is-done' : '') + (open ? ' is-open' : '') + '">' +
        '<button type="button" class="rt-row" data-toggle="' + esc(ex.slot) + '" aria-expanded="' + open + '" aria-controls="rt-body-' + esc(ex.slot) + '">' +
          '<span class="rt-num">' + String(i + 1).padStart(2, '0') + '</span>' +
          '<span class="rt-name"><strong>' + esc(ex.name) + '</strong><small>' + esc(doseText(ex)) + '</small></span>' +
          '<span class="rt-state">' + (ex.completed ? '<span class="rt-check">' + ICON.check + '</span>' : (open ? ICON.down : ICON.arrow)) + '</span>' +
        '</button>' + (open ? body(ex) : '') + '</div>';
    }).join('') + '</div>';
    if (hechos === total) {
      html += '<div class="rt-finish"><strong>Sesión completada.</strong><p>Tu avance queda guardado. Cuando vuelvas a entrenar este día, empieza de nuevo.</p>' +
        '<button type="button" class="rt-link" data-reset>Empezar de nuevo este día</button></div>';
    }
    $('routine-body').innerHTML = html;
    $('routine-head-label').textContent = 'Tu rutina · ' + st.member.frequency + ' días por semana';
  }

  function open(options) {
    if (!st.loaded) return;
    var sheet = $('routine-sheet');
    st.lastFocus = document.activeElement;
    var next = nextSession();
    if (next && !(options && options.keepDay)) { st.week = next.week; st.day = next.day; }
    st.openSlot = firstPendingSlot();
    render();
    if (!sheet.open) sheet.showModal();
    document.body.classList.add('modal-open');
    setUrl(true);
    var title = $('routine-title'); if (title) title.focus({ preventScroll: true });
    $('routine-scroll').scrollTop = 0;
  }
  // La notificación del descanso vuelve a esta URL: con rutina=1 se reabre la hoja.
  function setUrl(abierta) {
    var url = new URL(window.location.href);
    if (abierta) url.searchParams.set('rutina', '1'); else url.searchParams.delete('rutina');
    history.replaceState(history.state, '', url.pathname + url.search + url.hash);
  }

  function mutate(bodyData) {
    var task = st.pending.then(async function () {
      try {
        var data = await api('workout', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(Object.assign({}, bodyData, { version: st.version })) });
        accept(data); return data;
      } catch (error) {
        if (error.status === 409) {
          accept(await api('workout?week=' + bodyData.week));
          error.message = 'Tu rutina cambió en otro dispositivo. Revisa y repite la acción.';
        }
        throw error;
      }
    });
    st.pending = task.catch(function () {});
    return task;
  }
  async function change(bodyData, after) {
    try { await mutate(Object.assign({ week: st.week }, bodyData)); if (after) after(); render(); paintTrigger(); }
    catch (error) { toast(error.message); render(); }
  }

  // ── Reemplazos: solo las alternativas del entrenador ──
  function openReplace(slot, trigger) {
    var ex = exerciseBySlot(slot); if (!ex) return;
    st.replaceSlot = slot; st.replaceFocus = trigger;
    var replaced = ex.replacementIndex !== null && ex.replacementIndex !== undefined;
    $('rt-replace-text').textContent = 'Cambia por la alternativa del entrenador. Se mantienen ' + ex.sets + ' series × ' + ex.reps +
      ' y ' + ex.rest + ' s de descanso; elige de nuevo el peso. Si es a una mano o pierna, haz las repeticiones por lado.';
    var options = '<div class="rt-alt is-current"><strong>' + esc(ex.name) + '<small>La actual</small></strong></div>';
    if (replaced) options += '<button type="button" class="rt-alt" data-restore><strong>' + esc(ex.originalName) + '<small>El original del entrenador</small></strong><i aria-hidden="true">→</i></button>';
    ex.alternatives.forEach(function (name, i) {
      if (replaced && i === ex.replacementIndex) return;
      options += '<button type="button" class="rt-alt" data-alternative="' + i + '"><strong>' + esc(name) + '<small>Alternativa del entrenador</small></strong><i aria-hidden="true">→</i></button>';
    });
    $('rt-replace-options').innerHTML = options;
    $('rt-replace').hidden = false;
    var first = $('rt-replace-options').querySelector('button'); if (first) first.focus();
  }
  function closeReplace() {
    $('rt-replace').hidden = true;
    if (st.replaceFocus && st.replaceFocus.isConnected) st.replaceFocus.focus({ preventScroll: true });
  }

  function bindSheet() {
    var sheet = $('routine-sheet');
    sheet.addEventListener('click', function (event) {
      var target = event.target.closest('button, [data-close-replace]');
      if (!target) return;
      if (target.id === 'routine-close') { sheet.close(); return; }
      if (target.hasAttribute('data-close-replace')) { closeReplace(); return; }
      if (target.dataset.toggle) {
        st.openSlot = st.openSlot === target.dataset.toggle ? null : target.dataset.toggle;
        render();
        var row = document.querySelector('[data-toggle="' + target.dataset.toggle + '"]');
        if (row) { row.focus({ preventScroll: true }); row.scrollIntoView({ block: 'nearest' }); }
      } else if (target.dataset.day) {
        st.day = Number(target.dataset.day); st.openSlot = firstPendingSlot(); render();
      } else if (target.dataset.rest) {
        if (window.RutaPush) window.RutaPush.start(Number(target.dataset.rest), target);
        else toast('El temporizador todavía está cargando. Inténtalo en un momento.');
      } else if (target.dataset.done) {
        var slot = target.dataset.done, ex = exerciseBySlot(slot);
        target.disabled = true;
        change({ action: 'complete', slot: slot, completed: !ex.completed }, function () {
          // Al terminar un ejercicio se abre el siguiente pendiente: una mano libre en el gimnasio.
          if (!ex.completed) st.openSlot = firstPendingSlot();
        });
      } else if (target.dataset.replace) {
        openReplace(target.dataset.replace, target);
      } else if (target.hasAttribute('data-alternative') || target.hasAttribute('data-restore')) {
        var restore = target.hasAttribute('data-restore');
        var payload = restore ? { action: 'restore', slot: st.replaceSlot } : { action: 'replace', slot: st.replaceSlot, alternativeIndex: Number(target.dataset.alternative) };
        st.openSlot = st.replaceSlot;
        change(payload, function () { $('rt-replace').hidden = true; toast('Ejercicio actualizado en tu rutina.'); });
      } else if (target.dataset.play) {
        var video = exerciseBySlot(target.dataset.play), src = video && bunnySrc(video);
        if (!src) return;
        var frame = document.createElement('iframe');
        frame.src = src; frame.title = 'Demostración de ' + video.name;
        frame.allow = 'autoplay; fullscreen; picture-in-picture; encrypted-media'; frame.allowFullscreen = true;
        var wrapper = document.createElement('div');
        wrapper.className = target.className + ' is-playing';
        wrapper.appendChild(frame);
        target.replaceWith(wrapper);
      } else if (target.hasAttribute('data-soon')) {
        toast('La demostración de este ejercicio se publica pronto. Mientras tanto, sigue las series, repeticiones y descansos indicados.');
      } else if (target.hasAttribute('data-reset')) {
        if (!window.confirm('¿Empezar de nuevo este día? Se desmarcan sus ejercicios.')) return;
        (async function () {
          for (var ex2 of days()[st.day].exercises) {
            if (ex2.completed) await mutate({ week: st.week, action: 'complete', slot: ex2.slot, completed: false });
          }
          st.openSlot = firstPendingSlot(); render(); paintTrigger();
        })().catch(function (error) { toast(error.message); render(); });
      }
    });
    sheet.addEventListener('change', function (event) {
      if (event.target.id === 'rt-week-select') { st.week = Number(event.target.value); st.day = 0; st.openSlot = firstPendingSlot(); render(); }
    });
    // Escape cierra primero la lista de reemplazos, después la rutina.
    sheet.addEventListener('cancel', function (event) {
      if (!$('rt-replace').hidden) { event.preventDefault(); closeReplace(); }
    });
    sheet.addEventListener('close', function () {
      $('rt-replace').hidden = true;
      var player = $('player'), profile = $('profile-dialog');
      if (!(player && player.open) && !(profile && profile.open)) document.body.classList.remove('modal-open');
      setUrl(false);
      paintTrigger();
      if (st.lastFocus && st.lastFocus.isConnected && typeof st.lastFocus.focus === 'function') {
        setTimeout(function () { st.lastFocus.focus({ preventScroll: true }); }, 0);
      }
    });
  }

  function loadPush() {
    // push.js lee la identidad y la API desde RutaMember, igual que en su página original.
    window.RutaMember = { id: st.member.id, api: api, store: {} };
    var script = document.createElement('script');
    script.src = '/biblioteca/ruta/push.js?v=' + PUSH_VERSION;
    document.head.appendChild(script);
  }

  window.RutinaUI = {
    disponible: function () { return st.loaded; },
    frecuencia: function () { return st.member ? st.member.frequency : null; },
    abrir: function () { if (st.gate.activa) open(); },
    activar: function (gate) {
      st.gate = Object.assign({}, st.gate, gate);
      if (!st.loaded) return;
      paintTrigger();
      paintPlayerBox();
    },
    // Botón «Ver mi rutina» debajo del video de introducción del módulo de pesas.
    botonReproductor: function (container, cerrarReproductor) {
      st.box = container;
      st.cerrarReproductor = cerrarReproductor;
      paintPlayerBox();
    },
    init: async function (ctx) {
      try {
        accept(await api('workout?week=0'));
        if (rotating()) (await Promise.all([1, 2].map(function (w) { return api('workout?week=' + w); }))).forEach(accept);
      } catch (_) {
        // Sin frecuencia elegida o sin rutina asignada no se muestra nada: el resto de la ruta sigue igual.
        return;
      }
      st.loaded = true;
      bindSheet();
      placeTrigger();
      var mq = window.matchMedia('(max-width: 640px)');
      if (mq.addEventListener) mq.addEventListener('change', placeTrigger); else mq.addListener(placeTrigger);
      $('routine-trigger').addEventListener('click', function () { open(); });
      paintTrigger();
      loadPush();
      if (ctx && ctx.alCargar) ctx.alCargar();
      if (ctx && ctx.abrir && st.gate.activa) open();
    }
  };
})();
