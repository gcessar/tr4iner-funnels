/**
 * TR4Track — captura de atribución reusable para los funnels de TR4INER.
 * Nombre neutro para evitar bloqueos de navegadores contra archivos "track.js".
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

  function getCanonicalParams(search) {
    // Los embeds ClickFunnels inyectan la query del documento padre porque un
    // iframe srcdoc no conserva por sí solo esos parámetros.
    var raw = new URLSearchParams(
      typeof search === 'string'
        ? search
        : (window.__TR4_SEARCH__ || window.location.search)
    );
    var canonical = new URLSearchParams();

    // Si una plataforma agrega UTMs duplicados, conserva la nomenclatura del
    // enlace original. Un valor posterior solo completa uno anterior vacío.
    raw.forEach(function (value, key) {
      if (!isAttributionKey(key)) {
        canonical.append(key, value);
        return;
      }
      if (!canonical.has(key) || (!canonical.get(key) && value)) {
        canonical.set(key, value);
      }
    });

    return canonical;
  }

  function params() {
    return getCanonicalParams();
  }

  function safeGetStored(key) {
    try { return window.localStorage.getItem(key); } catch (e) { return null; }
  }

  function safeSetStored(key, value) {
    try { window.localStorage.setItem(key, value); } catch (e) { /* modo incógnito / bloqueado */ }
  }

  function getVideo() {
    var fromUrl = params().get('video');
    if (fromUrl) {
      if (!safeGetStored(VIDEO_STORAGE_KEY)) safeSetStored(VIDEO_STORAGE_KEY, fromUrl);
      return fromUrl;
    }
    return safeGetStored(VIDEO_STORAGE_KEY) || null;
  }

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

  function getAttribution() {
    var attribution = getUTMs();
    var video = getVideo();
    if (video) attribution.video = video;
    return attribution;
  }

  var EVENTS_WEBHOOK = 'https://primary-production-0efa.up.railway.app/webhook/biblioteca-eventos';
  var LEAD_STORAGE_KEY = 'tr4_lead';

  function getLead() {
    try { return JSON.parse(window.localStorage.getItem(LEAD_STORAGE_KEY) || '{}') || {}; }
    catch (e) { return {}; }
  }

  /**
   * Emite un evento de actividad al pipeline de lead scoring (n8n → Data Tables → Brevo/CRM).
   * Se manda como text/plain para evitar el preflight CORS: sendBeacon lo entrega
   * incluso si la página está navegando (p.ej. el submit del registro).
   */
  function track(event, props) {
    var lead = getLead();
    var body;
    try {
      body = JSON.stringify({
        funnel: 'biblioteca',
        event: event,
        props: props || {},
        email: lead.email || '',
        nombre: lead.nombre || '',
        sexo: lead.sexo || '',
        ts: new Date().toISOString(),
        page: window.location.pathname,
        attribution: getAttribution()
      });
    } catch (e) { return; }
    try {
      if (navigator.sendBeacon && navigator.sendBeacon(EVENTS_WEBHOOK, body)) return;
    } catch (e) { /* sigue al fallback */ }
    try {
      fetch(EVENTS_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: body,
        keepalive: true
      }).catch(function () { /* el tracking nunca rompe la UI */ });
    } catch (e) { /* idem */ }
  }

  window.TR4Track = {
    UTM_KEYS: UTM_KEYS,
    isAttributionKey: isAttributionKey,
    getCanonicalParams: getCanonicalParams,
    getVideo: getVideo,
    getUTMs: getUTMs,
    getAttribution: getAttribution,
    getLead: getLead,
    track: track
  };
})();
