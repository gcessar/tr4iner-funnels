/*
  TR4VSL — reproductor propio de los VSL, en reemplazo de Vidalytics (nov-2026).

  Copia lo que hacían los reproductores de Vidalytics de cada página:
  - Arranca solo y en silencio, con el cartel «CLIC AQUÍ PARA ESCUCHAR» (texto y colores de
    cada video). Al tocarlo se activa el sonido y el video vuelve al principio.
  - A la vista sólo el botón de play y el menú de opciones, cuya única opción es la velocidad.
    Sin tiempo, sin barra para adelantar, sin teclas para saltar.
  - «Rapid engagement»: la línea de progreso del borde avanza rápido al principio y después se
    estabiliza hasta completar el video. La línea muestra f(p) = ln(1 + K·p) / ln(1 + K), con
    p = segundo actual / duración: con K = 9, al 10% del video la línea marca 28%, a la mitad
    74% y llega al 100% con el video.
  - Nada para descargar (regla de los videos de R2): sin controles nativos, `controlslist`
    sin descarga, sin picture-in-picture y sin clic derecho ni arrastre.

  Uso: <div data-tr4vsl="flor"></div> se monta solo al cargar. Para montarlo más tarde (las
  páginas que difieren el video al primer toque) se pone data-tr4vsl-diferido y se llama
  TR4VSL.montar(elemento, 'flor'). Con TR4VSL.montar(elemento, 'flor', { autoplay: false }) no
  arranca solo: la página muestra su propia portada («Paso 1») y al tocarla llama a
  reproducirConSonido() (pedido del usuario del 14-nov: en el iPhone el play aparecía encima
  del «Paso 1» un segundo después; mejor que el video empiece recién con el clic).

  Mientras no hay sonido se ve el cartel, nunca el botón de play (también cuando el navegador
  no deja arrancar solo, como el iPhone con ahorro de energía): un solo llamado a tocar.

  Mide en el dataLayer: vsl_sonido (activó el sonido), vsl_progreso con vsl_porcentaje 25, 50,
  75 y 95 (sobre el tiempo REAL, no el de la línea) y vsl_completo.
*/
(function () {
  'use strict';

  var R2 = 'https://video.mediatr4iner.com/';
  var K = 9;
  var VELOCIDADES = [0.75, 1, 1.25, 1.5, 2];

  // Amarillo de Anthoni y crema de Veronika, como estaban en Vidalytics.
  var AN = { color: '#ffc138', fondo: '#f9b301', texto: '#000000' };
  var VA = { color: '#ffda7e', fondo: '#ffda7e', texto: '#000000' };
  var ESCUCHAR = ['CLIC AQUÍ', 'PARA ESCUCHAR'];

  // carpeta: la de R2 (vsl/{nombre}--{8 primeros del ID}); alFinal: 'portada' vuelve a la
  // portada con el play, 'pausa' se queda en el último cuadro (como en Vidalytics).
  var VIDEOS = {
    'flor': { carpeta: 'vsl/flor--d2e0d6ee', tema: AN, aviso: ESCUCHAR },
    'dashiel': { carpeta: 'vsl/dashiel--d858beca', tema: AN, aviso: ESCUCHAR },
    'andrea': { carpeta: 'vsl/andrea--72a989ec', tema: AN, aviso: ESCUCHAR },
    'christian': { carpeta: 'vsl/christian--8b18623e', tema: AN, aviso: ESCUCHAR },
    'flor-va': { carpeta: 'vsl/flor-va--ba854f3d', tema: VA, aviso: ESCUCHAR },
    'rosita-va': { carpeta: 'vsl/rosita-va--b8684193', tema: VA, aviso: ['ACTIVA EL SONIDO', ''] },
    'andrea-va': { carpeta: 'vsl/andrea-va--217a5ba3', tema: VA, aviso: ESCUCHAR },
    'empezar': { carpeta: 'vsl/empezar--ae735cf0', tema: AN, aviso: ['PASO 1', 'Mira el video'] },
    'empezar-va': { carpeta: 'vsl/empezar-va--bcb9d860', tema: VA, aviso: ['CLIC AQUÍ', 'PARA MIRAR EL VIDEO'], alFinal: 'pausa' },
    // /empezar-va con el diseño crema y Calendly (17-nov-2026): «PAGINA VERO» de Vidalytics
    // (R89mJZkJBpBr3LK6), con los colores crema de su reproductor. El de arriba queda para revertir.
    'empezar-va-2': { carpeta: 'vsl/empezar-va-2--77e516ac', tema: { color: '#f8f8df', fondo: '#f5f5c1', texto: '#1a1614' }, aviso: ['CLIC PARA ESCUCHAR', ''], alFinal: 'pausa' },
    'fit4-an': { carpeta: 'vsl/fit4-an--3370d078', tema: AN, aviso: ESCUCHAR },
    'fit4-va': { carpeta: 'vsl/fit4-va--de95f818', tema: AN, aviso: ESCUCHAR },
    'calendly-an': { carpeta: 'vsl/calendly-an--6739ace2', tema: AN, aviso: ESCUCHAR, boton: true },
    'calendly-va': { carpeta: 'vsl/calendly-va--7a1a794e', tema: AN, aviso: ESCUCHAR, boton: true },
    'calendly-confirma-an': { carpeta: 'vsl/calendly-confirma-an--c697eacb', tema: { color: '#ffbf00', fondo: '#ffbf00', texto: '#000000' }, aviso: ['ESCUCHAR', ''], boton: true, alFinal: 'pausa' },
    'calendly-confirma-va': { carpeta: 'vsl/calendly-confirma-va--19241045', tema: AN, aviso: ESCUCHAR },
    // Páginas de tr4iner.com (WordPress), 16-nov-2026. El de inicio no arrancaba solo en
    // Vidalytics: se monta con data-tr4vsl-autoplay="no".
    'wp-inicio': { carpeta: 'vsl/wp-inicio--398f00e0', tema: { color: '#ffcf00', fondo: '#ffc700', texto: '#000000' }, aviso: ['CLIC PARA ESCUCHAR', ''], boton: true },
    'wp-dashiel': { carpeta: 'vsl/wp-dashiel--f8151f47', tema: AN, aviso: ESCUCHAR },
    'wp-flor': { carpeta: 'vsl/wp-flor--b3a666c5', tema: AN, aviso: ESCUCHAR }
  };

  var ICONO_SILENCIO = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 9v6h4l5 5V4L7 9H3zm13.6 3 2.7-2.7-1.3-1.3-2.7 2.7-2.7-2.7-1.3 1.3 2.7 2.7-2.7 2.7 1.3 1.3 2.7-2.7 2.7 2.7 1.3-1.3-2.7-2.7z"/></svg>';
  var ICONO_PLAY = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3.5v17l14-8.5z"/></svg>';
  var ICONO_OPCIONES = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19.4 13a7.7 7.7 0 0 0 0-2l2.1-1.6-2-3.5-2.5 1a7.4 7.4 0 0 0-1.7-1L15 3h-4l-.4 2.7c-.6.3-1.2.6-1.7 1l-2.5-1-2 3.5L6.6 11a7.7 7.7 0 0 0 0 2l-2.1 1.6 2 3.5 2.5-1c.5.4 1.1.7 1.7 1L11 21h4l.4-2.7c.6-.3 1.2-.6 1.7-1l2.5 1 2-3.5-2.2-1.6zM13 15.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7z"/></svg>';

  function calidad() {
    // 720p (el tope de R2); en conexiones lentas o con ahorro de datos, la de 480 o 360.
    var c = navigator.connection;
    if (c && (c.saveData || /(^|-)2g$/.test(c.effectiveType || ''))) return '360p';
    if (c && c.effectiveType === '3g') return '480p';
    return '720p';
  }

  function medir(evento, datos) {
    try {
      window.dataLayer = window.dataLayer || [];
      datos.event = evento;
      window.dataLayer.push(datos);
    } catch (e) { /* medir nunca rompe el video */ }
  }

  function crear(tag, clase, html) {
    var el = document.createElement(tag);
    if (clase) el.className = clase;
    if (html) el.innerHTML = html;
    return el;
  }

  function montar(destino, slug, ajustes) {
    ajustes = ajustes || {};
    var caja = typeof destino === 'string' ? document.getElementById(destino) : destino;
    var cfg = VIDEOS[slug];
    if (!caja || !cfg) return null;
    if (caja.tr4vsl) return caja.tr4vsl;

    // TR4VSL_ORIGEN sólo sirve para probar en local con copias de los videos (localhost no
    // pasa la regla de origen de R2).
    var base = (window.TR4VSL_ORIGEN || R2) + cfg.carpeta + '/';
    var calidades = ['720p', '480p', '360p'];
    var indiceCalidad = calidades.indexOf(calidad());
    var tema = cfg.tema;
    var raiz = crear('div', 'tr4vsl is-cargando');
    raiz.style.setProperty('--vsl-color', tema.color);
    raiz.style.setProperty('--vsl-aviso-fondo', tema.fondo);
    raiz.style.setProperty('--vsl-aviso-texto', tema.texto);

    var portadaUrl = base + 'thumbnail.jpg';
    var video = document.createElement('video');
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');
    video.setAttribute('preload', ajustes.autoplay === false ? 'metadata' : 'auto');
    video.setAttribute('poster', portadaUrl);
    video.setAttribute('controlslist', 'nodownload noremoteplayback noplaybackrate');
    video.setAttribute('disablepictureinpicture', '');
    video.setAttribute('disableremoteplayback', '');
    video.setAttribute('tabindex', '-1');
    video.muted = true;
    video.defaultMuted = true;
    video.setAttribute('muted', '');

    var portada = crear('img', 'tr4vsl-portada');
    portada.alt = '';
    portada.src = portadaUrl;
    portada.decoding = 'async';

    var aviso = crear('button', 'tr4vsl-aviso' + (cfg.boton ? ' is-boton' : ''));
    aviso.type = 'button';
    aviso.innerHTML = ICONO_SILENCIO + '<b></b><span></span>';
    aviso.querySelector('b').textContent = cfg.aviso[0];
    aviso.querySelector('span').textContent = cfg.aviso[1];
    aviso.setAttribute('aria-label', 'Activar el sonido');

    var play = crear('button', 'tr4vsl-play', ICONO_PLAY);
    play.type = 'button';
    play.setAttribute('aria-label', 'Reproducir');

    var opciones = crear('button', 'tr4vsl-opciones', ICONO_OPCIONES);
    opciones.type = 'button';
    opciones.setAttribute('aria-label', 'Opciones');
    opciones.setAttribute('aria-haspopup', 'true');

    var menu = crear('div', 'tr4vsl-menu', '<p>Velocidad</p><div role="radiogroup" aria-label="Velocidad"></div>');
    menu.hidden = true;
    var grupo = menu.querySelector('div');
    VELOCIDADES.forEach(function (v) {
      var b = crear('button');
      b.type = 'button';
      b.setAttribute('role', 'radio');
      b.setAttribute('aria-checked', v === 1 ? 'true' : 'false');
      b.textContent = String(v).replace('.', ',') + '×';
      b.addEventListener('click', function (e) {
        e.stopPropagation();
        video.playbackRate = v;
        grupo.querySelectorAll('button').forEach(function (o) { o.setAttribute('aria-checked', o === b ? 'true' : 'false'); });
        cerrarMenu();
      });
      grupo.appendChild(b);
    });

    var linea = crear('div', 'tr4vsl-linea', '<i></i>');
    var relleno = linea.firstChild;
    var error = crear('div', 'tr4vsl-error', '<p>No se pudo cargar el video.</p><button type="button">Reintentar</button>');
    error.hidden = true;

    raiz.appendChild(video);
    raiz.appendChild(portada);
    raiz.appendChild(linea);
    raiz.appendChild(aviso);
    raiz.appendChild(play);
    raiz.appendChild(opciones);
    raiz.appendChild(menu);
    raiz.appendChild(error);
    caja.innerHTML = '';
    caja.appendChild(raiz);

    var estado = '';
    var conSonido = false;
    var hitos = { 25: false, 50: false, 75: false, 95: false };
    var completo = false;
    var temporizador = 0;

    function poner(nuevo) {
      estado = nuevo;
      raiz.classList.remove('is-cargando', 'is-silencio', 'is-reproduciendo', 'is-pausado', 'is-esperando', 'is-terminado');
      raiz.classList.add('is-' + nuevo);
      raiz.classList.toggle('is-consonido', conSonido);
      play.setAttribute('aria-label', nuevo === 'terminado' ? 'Volver a ver' : 'Reproducir');
    }

    function mostrarControles() {
      raiz.classList.add('is-controles');
      clearTimeout(temporizador);
      temporizador = setTimeout(function () { raiz.classList.remove('is-controles'); }, 2800);
    }

    function cerrarMenu() {
      menu.hidden = true;
      raiz.classList.remove('is-menu');
    }

    function cargar() {
      video.src = base + 'play_' + calidades[indiceCalidad] + '.mp4';
    }

    function reproducir() {
      var p = video.play();
      if (p && p.catch) {
        p.catch(function () {
          // El navegador no dejó arrancar (ahorro de energía del iPhone, sonido sin gesto):
          // queda la portada con el play, como Vidalytics.
          if (estado !== 'reproduciendo' && estado !== 'silencio') poner('esperando');
          else if (!video.muted) { video.muted = true; reproducir(); }
          else poner('esperando');
        });
      }
    }

    function activarSonido() {
      conSonido = true;
      video.muted = false;
      video.currentTime = 0;
      poner('reproduciendo');
      reproducir();
      mostrarControles();
      medir('vsl_sonido', { vsl: slug });
    }

    function alTocar(e) {
      if (menu.contains(e.target) || error.contains(e.target)) return;
      if (e.target === opciones || opciones.contains(e.target)) return;
      if (!menu.hidden) { cerrarMenu(); return; }
      if (estado === 'silencio' || (estado === 'esperando' && !conSonido) || estado === 'cargando') {
        activarSonido();
        return;
      }
      if (estado === 'reproduciendo') {
        video.pause();
        return;
      }
      if (estado === 'terminado') video.currentTime = 0;
      video.muted = false;
      poner('reproduciendo');
      reproducir();
      mostrarControles();
    }

    raiz.addEventListener('click', alTocar);
    opciones.addEventListener('click', function (e) {
      e.stopPropagation();
      if (menu.hidden) { menu.hidden = false; raiz.classList.add('is-menu'); }
      else cerrarMenu();
    });
    raiz.addEventListener('contextmenu', function (e) { e.preventDefault(); });
    raiz.addEventListener('dragstart', function (e) { e.preventDefault(); });
    raiz.addEventListener('mousemove', function () { if (estado === 'reproduciendo') mostrarControles(); });
    error.querySelector('button').addEventListener('click', function (e) {
      e.stopPropagation();
      error.hidden = true;
      raiz.classList.remove('is-error');
      indiceCalidad = calidades.indexOf(calidad());
      poner('cargando');
      cargar();
      reproducir();
    });

    video.addEventListener('playing', function () {
      if (estado === 'cargando' || estado === 'esperando') poner(video.muted && !conSonido ? 'silencio' : 'reproduciendo');
      else if (estado === 'pausado') poner('reproduciendo');
    });
    video.addEventListener('pause', function () {
      if (video.ended || estado === 'cargando') return;
      if (estado === 'reproduciendo') poner('pausado');
    });
    video.addEventListener('ended', function () {
      if (video.muted && !conSonido) { video.currentTime = 0; reproducir(); return; }
      if (cfg.alFinal === 'pausa') poner('pausado');
      else poner('terminado');
      pintar();
      if (!completo) { completo = true; medir('vsl_completo', { vsl: slug }); }
    });
    video.addEventListener('error', function () {
      // Si una calidad falla se prueba la siguiente más liviana antes de mostrar el aviso.
      if (indiceCalidad < calidades.length - 1) {
        indiceCalidad += 1;
        var seguir = !video.paused || estado === 'cargando' || estado === 'silencio';
        cargar();
        if (seguir) reproducir();
        return;
      }
      error.hidden = false;
      raiz.classList.add('is-error');
      medir('vsl_error', { vsl: slug });
    });
    // Ninguna tecla mueve el video: sólo espacio o Enter sobre los botones.
    raiz.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'Home' || e.key === 'End') e.preventDefault();
      if (e.key === 'Escape') cerrarMenu();
    });

    function pintar() {
      var d = video.duration;
      var p = d && isFinite(d) ? Math.min(1, video.currentTime / d) : 0;
      if (video.ended && cfg.alFinal !== 'pausa') p = 1;
      relleno.style.transform = 'scaleX(' + (Math.log(1 + K * p) / Math.log(1 + K)).toFixed(4) + ')';
      if (conSonido && d) {
        [25, 50, 75, 95].forEach(function (h) {
          if (!hitos[h] && p * 100 >= h) {
            hitos[h] = true;
            medir('vsl_progreso', { vsl: slug, vsl_porcentaje: h });
          }
        });
      }
    }
    (function cuadro() {
      if (!video.paused) pintar();
      requestAnimationFrame(cuadro);
    })();
    video.addEventListener('timeupdate', pintar);

    cargar();
    if (ajustes.autoplay === false) poner('esperando');
    else { poner('cargando'); reproducir(); }

    var api = { video: video, raiz: raiz, slug: slug, reproducirConSonido: activarSonido };
    caja.tr4vsl = api;
    return api;
  }

  function autoMontar() {
    document.querySelectorAll('[data-tr4vsl]:not([data-tr4vsl-diferido])').forEach(function (el) {
      montar(el, el.getAttribute('data-tr4vsl'), { autoplay: el.getAttribute('data-tr4vsl-autoplay') !== 'no' });
    });
  }

  window.TR4VSL = { montar: montar, videos: VIDEOS };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', autoMontar);
  else autoMontar();
})();
