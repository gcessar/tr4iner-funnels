/**
 * TR4Track — captura de atribución reusable para los funnels de TR4INER.
 *
 * Captura parámetros de la URL (video de YouTube + UTMs) y persiste el video
 * en localStorage como first-touch, para que sobreviva navegación/recargas.
 *
 * Uso en cualquier página migrada:
 *   <script src="/track.js"></script>
 *   ...
 *   var attribution = window.TR4Track.getAttribution();
 *   // { video: "heGCkZf4L60", utm_source: "youtube", ... }
 *
 * Mecanismo (igual que getrevtrack): el ID del video viaja en el link de la
 * descripción de YouTube como ?video=VIDEO_ID. YouTube NO pasa el video de
 * origen automáticamente, por eso cada video necesita su propio link.
 */
(function () {
  'use strict';

  var VIDEO_STORAGE_KEY = 'tr4_video';
  var UTM_KEYS = [
    'utm_source', 'utm_medium', 'utm_campaign',
    'utm_term', 'utm_content', 'utm_id',
    'fbclid', 'gclid', 'fbc_id', 'h_ad_id'
  ];

  function isAttributionKey(key) {
    return key.indexOf('utm_') === 0 || UTM_KEYS.indexOf(key) !== -1;
  }

  function params() {
    return new URLSearchParams(window.location.search);
  }

  function safeGetStored(key) {
    try { return window.localStorage.getItem(key); } catch (e) { return null; }
  }

  function safeSetStored(key, value) {
    try { window.localStorage.setItem(key, value); } catch (e) { /* modo incógnito / bloqueado */ }
  }

  /**
   * Devuelve el ID del video atribuible. Prioridad:
   *   1. ?video= en la URL actual (y lo persiste como first-touch)
   *   2. tr4_video guardado en una visita previa
   * No sobrescribe el first-touch si ya existe uno guardado.
   */
  function getVideo() {
    var fromUrl = params().get('video');
    if (fromUrl) {
      if (!safeGetStored(VIDEO_STORAGE_KEY)) {
        safeSetStored(VIDEO_STORAGE_KEY, fromUrl);
      }
      return fromUrl;
    }
    return safeGetStored(VIDEO_STORAGE_KEY) || null;
  }

  /** Devuelve toda la atribución presente, incluso futuros parámetros utm_*. */
  function getUTMs(keys) {
    var p = params();
    var out = {};
    if (keys) {
      keys.forEach(function (key) {
        var val = p.get(key);
        if (val) out[key] = val;
      });
    } else {
      p.forEach(function (value, key) {
        if (value && isAttributionKey(key)) out[key] = value;
      });
    }
    return out;
  }

  /** Atribución combinada lista para enviar al backend. */
  function getAttribution() {
    var attribution = getUTMs();
    var video = getVideo();
    if (video) attribution.video = video;
    return attribution;
  }

  window.TR4Track = {
    UTM_KEYS: UTM_KEYS,
    isAttributionKey: isAttributionKey,
    getVideo: getVideo,
    getUTMs: getUTMs,
    getAttribution: getAttribution
  };
})();
