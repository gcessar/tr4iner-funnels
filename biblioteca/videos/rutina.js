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
    lock: '<svg viewBox="0 0 12 14" aria-hidden="true"><path d="M3 6V4.2a3 3 0 0 1 6 0V6" fill="none" stroke="currentColor" stroke-width="1.5"/><rect x="1.5" y="6" width="9" height="7" rx="1.5" fill="currentColor"/></svg>',
    pause: '<svg viewBox="0 0 12 14" aria-hidden="true"><rect x="1" y="0" width="3.6" height="14" rx="1"/><rect x="7.4" y="0" width="3.6" height="14" rx="1"/></svg>',
    sound: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 6h2.5L8 3v10L4.5 10H2z" fill="currentColor" stroke="none"/><path d="M10.5 5.5a3.5 3.5 0 0 1 0 5M12.5 3.5a6.3 6.3 0 0 1 0 9"/></svg>',
    muted: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><path d="M2 6h2.5L8 3v10L4.5 10H2z" fill="currentColor" stroke="none"/><path d="M10.5 6l4 4M14.5 6l-4 4"/></svg>',
    expand: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2.5 6V2.5H6M10 2.5h3.5V6M13.5 10v3.5H10M6 13.5H2.5V10"/></svg>'
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
  // Lo que dicen la tarjeta del inicio y el acceso dentro de «Entrenamiento de pesas».
  function resumen() {
    var next = nextSession();
    var list = st.weeks[next ? next.week : 0] || [];
    return {
      titulo: 'Tu rutina de ' + st.member.frequency + ' días',
      siguiente: next ? 'Te toca: Día ' + (next.day + 1) + ' · ' + cap(list[next.day].name) : 'Semana completa · empieza de nuevo'
    };
  }
  function paintTrigger() {
    var trigger = $('routine-trigger'); if (!trigger) return;
    $('routine-trigger-title').textContent = 'Tu rutina · ' + st.member.frequency + ' días';
    $('routine-trigger-next').textContent = resumen().siguiente;
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
    var forma = ex.orientation === 'horizontal' ? 'is-h' : 'is-v';
    if (!cdnBase(ex)) {
      return '<button type="button" class="rt-video ' + forma + '" data-play="' + esc(ex.slot) + '" aria-label="Ver demostración de ' + esc(ex.name) + '">' +
        '<span class="rt-play">' + ICON.play + '</span></button>';
    }
    // La portada se pinta con el HTML; el archivo de video se elige después, al medir la tarjeta.
    return '<div class="rt-video ' + forma + '" data-player="' + esc(ex.slot) + '" role="group" aria-label="Demostración de ' + esc(ex.name) + '">' +
      '<video playsinline webkit-playsinline loop preload="none" disablepictureinpicture poster="' + esc(cdnBase(ex) + 'thumbnail.jpg') + '"></video>' +
      '<button type="button" class="rt-play" data-vplay aria-label="Reproducir la demostración">' + ICON.play + '<i class="rt-spin" aria-hidden="true"></i></button>' +
      '<div class="rt-vtools">' +
        '<button type="button" class="rt-vtool" data-vsound aria-label="Silenciar" aria-pressed="false">' + ICON.sound + '</button>' +
        '<button type="button" class="rt-vtool" data-vfull aria-label="Ver en pantalla completa">' + ICON.expand + '</button>' +
      '</div>' +
      '<div class="rt-vbar" aria-hidden="true"><i></i></div>' +
      '<div class="rt-verror" hidden><p>No se pudo cargar el video. Revisa tu conexión.</p><button type="button" data-vretry>Reintentar</button></div>' +
    '</div>';
  }
  function cdnBase(ex) {
    if (!/^[a-z0-9-]+\.b-cdn\.net$/i.test(ex.videoHost || '') || !/^[0-9a-f-]{36}$/i.test(ex.videoId || '')) return null;
    return 'https://' + ex.videoHost + '/' + ex.videoId + '/';
  }

  // ── Reproductor de ejercicios ──
  // El embebido de Bunny cargaba su propio reproductor dentro de un iframe (pantalla negra,
  // luego su interfaz) y pedía un segundo toque: el navegador no deja sonar un video dentro
  // de un iframe con el toque dado afuera. Un <video> de la página arranca con sonido en el
  // mismo toque, sobre los MP4 de Bunny (índice al inicio, rangos y caché de 30 días).
  function calidad(box) {
    var red = navigator.connection || {};
    if (red.saveData || /(^|-)2g|3g/.test(red.effectiveType || '')) return '360p';
    var lado = box.getBoundingClientRect()[box.classList.contains('is-h') ? 'height' : 'width'] || 240;
    // El lado corto del video contra los píxeles reales de la pantalla: nítido sin bajar de más.
    return lado * Math.min(window.devicePixelRatio || 1, 3) > 500 ? '720p' : '480p';
  }
  function wirePlayers() {
    document.querySelectorAll('#routine-body [data-player]').forEach(function (box) {
      var video = box.querySelector('video');
      if (video.dataset.src) return;
      var ex = exerciseBySlot(box.dataset.player);
      video.dataset.src = cdnBase(ex) + 'play_' + calidad(box) + '.mp4';
      // Sólo se precarga el ejercicio abierto: al tocar play ya hay segundos en memoria. Con
      // ahorro de datos o red lenta se baja apenas el índice del archivo.
      var red = navigator.connection || {};
      video.preload = red.saveData || /(^|-)2g|3g/.test(red.effectiveType || '') ? 'metadata' : 'auto';
      video.src = video.dataset.src;
      var bar = box.querySelector('.rt-vbar i');
      var tick = function () {
        if (video.duration) bar.style.transform = 'scaleX(' + (video.currentTime / video.duration) + ')';
        if (!video.paused) box.raf = requestAnimationFrame(tick);
      };
      video.addEventListener('playing', function () {
        box.classList.add('is-playing'); box.classList.remove('is-loading', 'is-paused');
        box.querySelector('[data-vplay]').setAttribute('aria-label', 'Pausar la demostración');
        cancelAnimationFrame(box.raf); tick();
      });
      video.addEventListener('waiting', function () { box.classList.add('is-loading'); });
      video.addEventListener('pause', function () {
        box.classList.remove('is-playing', 'is-loading'); box.classList.add('is-paused');
        box.querySelector('[data-vplay]').setAttribute('aria-label', 'Reproducir la demostración');
        cancelAnimationFrame(box.raf);
      });
      video.addEventListener('volumechange', function () { paintSound(box); });
      video.addEventListener('error', function () {
        box.classList.remove('is-loading', 'is-playing');
        box.querySelector('.rt-verror').hidden = false;
      });
      // Tocar el video pausa o sigue, como en cualquier app de video.
      video.addEventListener('click', function () { togglePlay(box); });
    });
  }
  function paintSound(box) {
    var video = box.querySelector('video'), boton = box.querySelector('[data-vsound]');
    boton.innerHTML = video.muted ? ICON.muted : ICON.sound;
    boton.setAttribute('aria-label', video.muted ? 'Activar el sonido' : 'Silenciar');
    boton.setAttribute('aria-pressed', String(video.muted));
  }
  function pauseAll(except) {
    document.querySelectorAll('#routine-body [data-player] video').forEach(function (video) {
      if (video !== except && !video.paused) video.pause();
    });
  }
  function togglePlay(box) {
    var video = box.querySelector('video');
    if (!video.paused) { video.pause(); return; }
    pauseAll(video);
    box.classList.add('is-loading');
    box.querySelector('.rt-verror').hidden = true;
    var intento = video.play();
    if (intento && intento.catch) intento.catch(function (error) {
      // Si el navegador no deja sonar (ahorro de datos, modo bajo consumo), arranca en
      // silencio y el botón de sonido queda a la vista para activarlo.
      if (error && error.name === 'NotAllowedError' && !video.muted) {
        video.muted = true;
        video.play().catch(function () { box.classList.remove('is-loading'); });
        paintSound(box);
        return;
      }
      box.classList.remove('is-loading');
    });
  }
  function fullscreen(box) {
    var video = box.querySelector('video');
    if (video.webkitEnterFullscreen && !document.fullscreenEnabled) { video.webkitEnterFullscreen(); return; }
    var pedir = box.requestFullscreen || box.webkitRequestFullscreen;
    if (document.fullscreenElement) document.exitFullscreen();
    else if (pedir) pedir.call(box);
    else if (video.webkitEnterFullscreen) video.webkitEnterFullscreen();
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
    wirePlayers();
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
    // Texto general: sirve para cualquier reemplazo, sea a dos manos o a una.
    $('rt-replace-text').textContent = 'Se mantienen ' + ex.sets + ' series × ' + ex.reps +
      ' y ' + ex.rest + ' s de descanso; elige de nuevo el peso.';
    var options = '<div class="rt-alt is-current"><strong>' + esc(ex.name) + '<small>La actual</small></strong></div>';
    if (replaced) options += '<button type="button" class="rt-alt" data-restore><strong>' + esc(ex.originalName) + '<small>El original del entrenador</small></strong><i aria-hidden="true">→</i></button>';
    ex.alternatives.forEach(function (name, i) {
      if (replaced && i === ex.replacementIndex) return;
      options += '<button type="button" class="rt-alt" data-alternative="' + i + '"><strong>' + esc(name) + '<small>Alternativa a reemplazar</small></strong><i aria-hidden="true">→</i></button>';
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
      } else if (target.hasAttribute('data-vplay')) {
        togglePlay(target.closest('[data-player]'));
      } else if (target.hasAttribute('data-vsound')) {
        var sonido = target.closest('[data-player]').querySelector('video');
        sonido.muted = !sonido.muted;
      } else if (target.hasAttribute('data-vfull')) {
        fullscreen(target.closest('[data-player]'));
      } else if (target.hasAttribute('data-vretry')) {
        var caja = target.closest('[data-player]'), fallido = caja.querySelector('video');
        caja.querySelector('.rt-verror').hidden = true;
        fallido.load();
        togglePlay(caja);
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
      pauseAll(null);
      document.dispatchEvent(new CustomEvent('ruta:rutina'));
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

  function warmCdn() {
    var hosts = {};
    Object.keys(st.weeks).forEach(function (w) {
      (st.weeks[w] || []).forEach(function (day) {
        day.exercises.forEach(function (ex) { if (cdnBase(ex)) hosts[ex.videoHost] = true; });
      });
    });
    Object.keys(hosts).forEach(function (host) {
      if (document.querySelector('link[rel="preconnect"][href="https://' + host + '"]')) return;
      var link = document.createElement('link');
      link.rel = 'preconnect'; link.href = 'https://' + host;
      document.head.appendChild(link);
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
    resumen: resumen,
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
      warmCdn();
      document.addEventListener('visibilitychange', function () { if (document.hidden) pauseAll(null); });
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
