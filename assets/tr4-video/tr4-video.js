/* Reproductor único para los videos de Cloudflare R2 (video.mediatr4iner.com).
   Regla del usuario (13-oct-2026, ver AGENTS.md): ningún video de R2 se puede descargar ni
   hacer clic derecho. Por eso no usa los controles del navegador (traen «Descargar» y
   «Guardar video como»): los dibuja él, con el diseño de los videos de la rutina de la Ruta
   (play negro con triángulo y anillo amarillos, barra amarilla) y un solo menú, la velocidad.

   Uso:
     var r = TR4Video.montar(contenedor, {
       base: 'https://video.mediatr4iner.com/testimonios/nombre--id/', // carpeta de R2
       archivo: 'play_720p.mp4',   // opcional: si falta, elige por tamaño y red
       poster: '...',              // opcional: si falta, thumbnail.jpg de la carpeta
       titulo: 'Video testimonio', // nombre accesible
       alError: function () {}     // devuelve true si se hizo cargo (p. ej. el respaldo de Vimeo)
     });
     r.destruir();
   El contenedor tiene que tener tamaño propio (position relative/absolute y alto). */
(function () {
  'use strict';
  if (window.TR4Video) return;

  var MONO = 'ui-monospace,"JetBrains Mono",monospace';
  var CSS =
    '.tr4v{--tr4v-ink:#111111;--tr4v-mark:#FFD43B;position:absolute;inset:0;overflow:hidden;background:#000;-webkit-user-select:none;user-select:none;-webkit-touch-callout:none}' +
    '.tr4v video{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;background:#000}' +
    '.tr4v-play{position:absolute;left:50%;top:50%;z-index:2;width:56px;height:56px;margin:-28px 0 0 -28px;display:grid;place-items:center;padding:0;border:0;border-radius:50%;background:var(--tr4v-ink);box-shadow:0 4px 14px rgba(22,19,14,.4);cursor:pointer;transition:opacity .18s ease,transform .18s ease}' +
    '.tr4v-play svg{width:18px;height:18px;margin-left:3px;fill:var(--tr4v-mark)}' +
    '.tr4v-play:active{transform:scale(.94)}' +
    '.tr4v.is-playing .tr4v-play{opacity:0;pointer-events:none}' +
    '.tr4v-spin{position:absolute;inset:-4px;border:2px solid transparent;border-top-color:var(--tr4v-mark);border-right-color:var(--tr4v-mark);border-radius:50%;opacity:0}' +
    '.tr4v.is-loading .tr4v-play{opacity:1}' +
    '.tr4v.is-loading .tr4v-spin{opacity:1;animation:tr4v-spin .7s linear infinite}' +
    '@keyframes tr4v-spin{to{transform:rotate(360deg)}}' +
    '.tr4v-bar{position:absolute;left:0;right:0;bottom:0;z-index:2;padding:22px 10px 8px;background:linear-gradient(to top,rgba(0,0,0,.62),rgba(0,0,0,0));transition:opacity .2s ease}' +
    '.tr4v.is-playing.is-idle .tr4v-bar{opacity:0;pointer-events:none}' +
    '.tr4v.is-playing.is-idle{cursor:none}' +
    '.tr4v-seek{position:relative;height:18px;display:flex;align-items:center}' +
    '.tr4v-track{position:relative;width:100%;height:3px;overflow:hidden;border-radius:2px;background:rgba(255,255,255,.28);transition:height .15s ease}' +
    '.tr4v-fill{display:block;height:100%;background:var(--tr4v-mark);transform:scaleX(0);transform-origin:left center}' +
    '.tr4v-seek:hover .tr4v-track,.tr4v-seek:focus-within .tr4v-track{height:5px}' +
    '.tr4v-seek input{position:absolute;inset:0;width:100%;height:100%;margin:0;opacity:0;cursor:pointer}' +
    '.tr4v-row{position:relative;display:flex;align-items:center;gap:6px;margin-top:2px}' +
    '.tr4v-btn{flex:none;width:34px;height:34px;display:grid;place-items:center;padding:0;border:0;border-radius:50%;background:rgba(17,17,17,.62);color:#FFFFFF;cursor:pointer;-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px)}' +
    '.tr4v-btn svg{width:16px;height:16px}' +
    '.tr4v-btn[aria-pressed="true"]{background:var(--tr4v-mark);color:var(--tr4v-ink)}' +
    '.tr4v-toggle{background:var(--tr4v-ink)}' +
    '.tr4v-toggle svg{width:12px;height:12px;fill:var(--tr4v-mark)}' +
    '.tr4v-time{color:#FFFFFF;font:500 11px/1 ' + MONO + ';letter-spacing:.04em;font-variant-numeric:tabular-nums;white-space:nowrap}' +
    '.tr4v-gap{flex:1}' +
    '.tr4v-speed{width:auto;min-width:46px;padding:0 10px;border-radius:17px;font:600 12px/1 ' + MONO + '}' +
    // Fila horizontal y no lista: en un teléfono el cuadro puede medir ~200 px de alto.
    '.tr4v-menu{position:absolute;right:0;bottom:42px;z-index:3;padding:6px;border-radius:10px;background:rgba(17,17,17,.94);box-shadow:0 10px 28px rgba(0,0,0,.45)}' +
    '.tr4v-menu[hidden]{display:none}' +
    '.tr4v-menu p{margin:2px 6px 6px;color:rgba(255,255,255,.6);font:500 10px/1.2 ' + MONO + ';letter-spacing:.14em;text-transform:uppercase}' +
    '.tr4v-opciones{display:flex;gap:4px}' +
    '.tr4v-menu button{min-width:44px;min-height:32px;padding:0 8px;border:0;border-radius:6px;background:rgba(255,255,255,.08);color:#FFFFFF;font:600 12px/1 ' + MONO + ';white-space:nowrap;cursor:pointer}' +
    '.tr4v-menu button:hover{background:rgba(255,255,255,.16)}' +
    '.tr4v-menu button:focus-visible{outline:2px solid var(--tr4v-mark);outline-offset:1px}' +
    '.tr4v-menu button[aria-checked="true"]{background:var(--tr4v-mark);color:var(--tr4v-ink)}' +
    '.tr4v-error{position:absolute;inset:0;z-index:4;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;padding:14px;background:rgba(17,17,17,.82);color:#FFFFFF;text-align:center;font-size:13px;line-height:1.4}' +
    '.tr4v-error[hidden]{display:none}' +
    '.tr4v-error p{margin:0}' +
    '.tr4v-error button{min-height:36px;padding:0 14px;border:0;border-radius:6px;background:var(--tr4v-mark);color:var(--tr4v-ink);cursor:pointer;font-weight:700;font-size:13px}' +
    '.tr4v:fullscreen,.tr4v:-webkit-full-screen{width:100%;height:100%}' +
    '@media (prefers-reduced-motion:reduce){.tr4v.is-loading .tr4v-spin{animation:none;border-color:var(--tr4v-mark)}}';

  var ICON = {
    play: '<svg viewBox="0 0 12 14" aria-hidden="true"><path d="M0 0l12 7-12 7z"/></svg>',
    pause: '<svg viewBox="0 0 12 14" aria-hidden="true"><rect x="1" y="0" width="3.6" height="14" rx="1"/><rect x="7.4" y="0" width="3.6" height="14" rx="1"/></svg>',
    sound: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 6h2.5L8 3v10L4.5 10H2z" fill="currentColor" stroke="none"/><path d="M10.5 5.5a3.5 3.5 0 0 1 0 5M12.5 3.5a6.3 6.3 0 0 1 0 9"/></svg>',
    muted: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><path d="M2 6h2.5L8 3v10L4.5 10H2z" fill="currentColor" stroke="none"/><path d="M10.5 6l4 4M14.5 6l-4 4"/></svg>',
    expand: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2.5 6V2.5H6M10 2.5h3.5V6M13.5 10v3.5H10M6 13.5H2.5V10"/></svg>'
  };
  var VELOCIDADES = [1, 1.25, 1.5, 1.75, 2];

  function estilos() {
    if (document.getElementById('tr4v-css')) return;
    var tag = document.createElement('style');
    tag.id = 'tr4v-css';
    tag.textContent = CSS;
    document.head.appendChild(tag);
  }
  function tiempo(s) {
    s = Math.max(0, Math.floor(s || 0));
    return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
  }
  function velocidad(r) { return String(r).replace('.', ',') + '×'; }

  // Calidad según el lado corto del cuadro contra los píxeles reales de la pantalla, y la red.
  function archivoPara(contenedor) {
    var red = navigator.connection || {};
    if (red.saveData || /(^|-)2g$/.test(red.effectiveType || '')) return 'play_360p.mp4';
    if (red.effectiveType === '3g') return 'play_480p.mp4';
    var caja = contenedor.getBoundingClientRect();
    var corto = Math.min(caja.width, caja.height) || 360;
    return corto * Math.min(window.devicePixelRatio || 1, 3) > 500 ? 'play_720p.mp4' : 'play_480p.mp4';
  }

  function montar(contenedor, op) {
    estilos();
    op = op || {};
    contenedor.innerHTML =
      '<div class="tr4v is-loading" tabindex="-1">' +
        // Sin `controls`: los del navegador traen «Descargar» y «Guardar video como».
        '<video playsinline webkit-playsinline preload="auto" disablepictureinpicture disableremoteplayback controlslist="nodownload noremoteplayback noplaybackrate"></video>' +
        '<button type="button" class="tr4v-play" aria-label="Reproducir">' + ICON.play + '<i class="tr4v-spin" aria-hidden="true"></i></button>' +
        '<div class="tr4v-bar">' +
          '<div class="tr4v-seek"><div class="tr4v-track" aria-hidden="true"><i class="tr4v-fill"></i></div>' +
            '<input type="range" min="0" max="1000" step="1" value="0" aria-label="Posición del video"></div>' +
          '<div class="tr4v-row">' +
            '<button type="button" class="tr4v-btn tr4v-toggle" aria-label="Reproducir">' + ICON.play + '</button>' +
            '<span class="tr4v-time">0:00 / 0:00</span><span class="tr4v-gap"></span>' +
            '<button type="button" class="tr4v-btn tr4v-speed" aria-haspopup="menu" aria-expanded="false" aria-label="Velocidad de reproducción: 1×">1×</button>' +
            '<div class="tr4v-menu" role="menu" aria-label="Velocidad de reproducción" hidden><p>Velocidad</p><div class="tr4v-opciones">' +
              VELOCIDADES.map(function (r) { return '<button type="button" role="menuitemradio" aria-checked="' + (r === 1) + '" data-rate="' + r + '">' + velocidad(r) + '</button>'; }).join('') +
            '</div></div>' +
            '<button type="button" class="tr4v-btn" data-tr4v-sound aria-label="Silenciar" aria-pressed="false">' + ICON.sound + '</button>' +
            '<button type="button" class="tr4v-btn" data-tr4v-full aria-label="Ver en pantalla completa">' + ICON.expand + '</button>' +
          '</div>' +
        '</div>' +
        '<div class="tr4v-error" hidden><p>No se pudo cargar el video. Revisa tu conexión.</p><button type="button">Reintentar</button></div>' +
      '</div>';
    var box = contenedor.firstChild;
    var el = box.querySelector('video');
    var seek = box.querySelector('.tr4v-seek input');
    var fill = box.querySelector('.tr4v-fill');
    var reloj = box.querySelector('.tr4v-time');
    var toggle = box.querySelector('.tr4v-toggle');
    var grande = box.querySelector('.tr4v-play');
    var speed = box.querySelector('.tr4v-speed');
    var menu = box.querySelector('.tr4v-menu');
    var sonido = box.querySelector('[data-tr4v-sound]');
    var errorBox = box.querySelector('.tr4v-error');
    var arrastrando = false, quieto = null, vivo = true;

    if (op.titulo) el.setAttribute('aria-label', op.titulo);
    el.poster = op.poster || (op.base + 'thumbnail.jpg');
    el.src = op.base + (op.archivo || archivoPara(contenedor));
    // Clic derecho, arrastrar o mantener apretado no ofrecen guardar el video.
    box.addEventListener('contextmenu', function (e) { e.preventDefault(); });
    el.addEventListener('dragstart', function (e) { e.preventDefault(); });

    function pintar() {
      var d = el.duration || 0, t = el.currentTime || 0;
      if (!arrastrando) {
        fill.style.transform = 'scaleX(' + (d ? t / d : 0) + ')';
        seek.value = d ? Math.round(t / d * 1000) : 0;
      }
      seek.setAttribute('aria-valuetext', tiempo(t) + ' de ' + tiempo(d));
      reloj.textContent = tiempo(t) + ' / ' + tiempo(d);
    }
    // Los controles se esconden a los 2,5 s sin tocar nada mientras el video corre.
    function despertar() {
      box.classList.remove('is-idle');
      clearTimeout(quieto);
      quieto = setTimeout(function () { if (!el.paused && menu.hidden) box.classList.add('is-idle'); }, 2500);
    }
    function estado() {
      var corriendo = !el.paused && !el.ended;
      box.classList.toggle('is-playing', corriendo);
      toggle.innerHTML = corriendo ? ICON.pause : ICON.play;
      toggle.setAttribute('aria-label', corriendo ? 'Pausar' : 'Reproducir');
      grande.setAttribute('aria-label', el.ended ? 'Ver de nuevo' : 'Reproducir');
      if (!corriendo) despertar();
    }
    function alternar() {
      if (el.paused || el.ended) {
        errorBox.hidden = true;
        var intento = el.play();
        if (intento && intento.catch) intento.catch(function () { box.classList.remove('is-loading'); estado(); });
      } else el.pause();
    }
    function cerrarMenu() { menu.hidden = true; speed.setAttribute('aria-expanded', 'false'); }

    el.addEventListener('loadedmetadata', function () {
      if (op.inicio > 0) { try { el.currentTime = op.inicio; } catch (e) { /* todavía sin rangos */ } }
      pintar();
    }, { once: true });
    el.addEventListener('timeupdate', pintar);
    el.addEventListener('waiting', function () { box.classList.add('is-loading'); });
    el.addEventListener('playing', function () { box.classList.remove('is-loading'); estado(); if (op.alReproducir) op.alReproducir(); });
    el.addEventListener('pause', function () { estado(); if (op.alPausar) op.alPausar(); });
    el.addEventListener('ended', function () { estado(); if (op.alTerminar) op.alTerminar(); });
    el.addEventListener('error', function () {
      if (!vivo || !el.getAttribute('src')) return;
      box.classList.remove('is-loading');
      // Quien monta decide: un respaldo (Vimeo en los testimonios) o el aviso con «Reintentar».
      if (op.alError && op.alError() === true) return;
      errorBox.hidden = false;
    });
    el.addEventListener('click', function () {
      // En el teléfono el primer toque con los controles escondidos sólo los muestra.
      if (box.classList.contains('is-idle')) { despertar(); return; }
      alternar();
    });
    grande.addEventListener('click', alternar);
    toggle.addEventListener('click', alternar);
    seek.addEventListener('input', function () {
      arrastrando = true;
      fill.style.transform = 'scaleX(' + (seek.value / 1000) + ')';
      if (el.duration) reloj.textContent = tiempo(seek.value / 1000 * el.duration) + ' / ' + tiempo(el.duration);
    });
    seek.addEventListener('change', function () {
      if (el.duration) el.currentTime = seek.value / 1000 * el.duration;
      arrastrando = false;
      despertar();
    });
    speed.addEventListener('click', function () {
      var abrir = menu.hidden;
      menu.hidden = !abrir;
      speed.setAttribute('aria-expanded', String(abrir));
      if (abrir) (menu.querySelector('[aria-checked="true"]') || menu.querySelector('button')).focus();
      despertar();
    });
    menu.addEventListener('click', function (e) {
      var opcion = e.target.closest('[data-rate]');
      if (!opcion) return;
      el.playbackRate = Number(opcion.dataset.rate);
      menu.querySelectorAll('[data-rate]').forEach(function (b) { b.setAttribute('aria-checked', String(b === opcion)); });
      speed.textContent = velocidad(el.playbackRate);
      speed.setAttribute('aria-label', 'Velocidad de reproducción: ' + velocidad(el.playbackRate));
      cerrarMenu();
      speed.focus();
    });
    box.addEventListener('click', function (e) { if (!menu.hidden && !e.target.closest('.tr4v-speed, .tr4v-menu')) cerrarMenu(); });
    sonido.addEventListener('click', function () {
      el.muted = !el.muted;
      sonido.innerHTML = el.muted ? ICON.muted : ICON.sound;
      sonido.setAttribute('aria-label', el.muted ? 'Activar el sonido' : 'Silenciar');
      sonido.setAttribute('aria-pressed', String(el.muted));
    });
    box.querySelector('[data-tr4v-full]').addEventListener('click', function () {
      // iPhone sólo deja pantalla completa sobre el propio <video> (su reproductor no ofrece descargar).
      if (el.webkitEnterFullscreen && !document.fullscreenEnabled) { el.webkitEnterFullscreen(); return; }
      var pedir = box.requestFullscreen || box.webkitRequestFullscreen;
      if (document.fullscreenElement) document.exitFullscreen();
      else if (pedir) pedir.call(box);
    });
    errorBox.querySelector('button').addEventListener('click', function () {
      var donde = el.currentTime;
      errorBox.hidden = true;
      box.classList.add('is-loading');
      el.load();
      el.addEventListener('loadedmetadata', function () { el.currentTime = donde; }, { once: true });
      alternar();
    });
    box.addEventListener('pointermove', despertar);
    box.addEventListener('keydown', function (e) {
      if (e.target.closest('.tr4v-menu')) {
        if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); cerrarMenu(); speed.focus(); }
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
          var opciones = Array.prototype.slice.call(menu.querySelectorAll('[data-rate]'));
          var i = opciones.indexOf(e.target) + (e.key === 'ArrowRight' ? 1 : -1);
          e.preventDefault();
          opciones[(i + opciones.length) % opciones.length].focus();
        }
        return;
      }
      if (e.target === seek && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) return;
      var tecla = e.key.toLowerCase();
      if (tecla === ' ' || tecla === 'k') { if (e.target.tagName !== 'BUTTON' || tecla === 'k') { e.preventDefault(); alternar(); } }
      else if (tecla === 'arrowright') { el.currentTime = Math.min(el.duration || 0, el.currentTime + 5); }
      else if (tecla === 'arrowleft') { el.currentTime = Math.max(0, el.currentTime - 5); }
      else if (tecla === 'm') sonido.click();
      else return;
      despertar();
    });

    // El toque que abrió el video habilita el sonido; si el navegador igual lo frena, queda el play.
    if (op.reproducir !== false) alternar();
    return {
      video: el,
      getDuration: function () { return el.duration || 0; },
      getCurrentTime: function () { return el.currentTime || 0; },
      reproduciendo: function () { return !el.paused && !el.ended; },
      destruir: function () {
        vivo = false;
        clearTimeout(quieto);
        el.pause();
        el.removeAttribute('src');
        el.load();
        contenedor.innerHTML = '';
      }
    };
  }

  window.TR4Video = { montar: montar };
})();
