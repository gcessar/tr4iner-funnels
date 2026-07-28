/**
 * TR4Track — captura de atribución reusable para los funnels de TR4INER.
 * Nombre neutro para evitar bloqueos de navegadores contra archivos "track.js".
 */
(function () {
  'use strict';

  var VIDEO_STORAGE_KEY = 'tr4_video';
  var FBC_STORAGE_KEY = 'tr4_fbc';
  var UTM_KEYS = [
    'utm_source', 'utm_medium', 'utm_campaign',
    'utm_term', 'utm_content', 'utm_id',
    'fbclid', 'gclid', 'fbc_id', 'h_ad_id'
  ];

  // Índice de subdominio del formato fbc de Meta: 0=.com, 1=tr4iner.com,
  // 2=metodo.tr4iner.com. El Pixel escribe la cookie sobre el dominio
  // registrable, así que el fbc que construimos a mano debe usar el mismo
  // índice o Meta no lo empareja con el del navegador.
  var FBC_SUBDOMAIN_INDEX = 1;

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

  function readCookie(name) {
    try {
      var match = document.cookie.match(new RegExp('(^|;\\s*)' + name + '=([^;]*)'));
      return match ? decodeURIComponent(match[2]) : '';
    } catch (e) { return ''; }
  }

  /**
   * _fbp — cookie de navegador que escribe el Pixel. No se hashea ni se
   * inventa: si el Pixel no cargó (bloqueador, consentimiento), va vacío.
   */
  function getFbp() {
    return readCookie('_fbp');
  }

  /**
   * _fbc — identificador de clic. Meta documenta construirlo desde ?fbclid
   * cuando la cookie no existe; esperar solo la cookie pierde todos los casos
   * donde el Pixel no cargó a tiempo. El timestamp debe ser el del primer
   * aterrizaje, por eso se persiste: si se regenerara en cada página, cada
   * salto del funnel mandaría un fbc distinto para el mismo clic.
   */
  function getFbc() {
    var fromCookie = readCookie('_fbc');
    if (fromCookie) return fromCookie;

    var stored = safeGetStored(FBC_STORAGE_KEY);
    var fbclid = params().get('fbclid');
    if (fbclid) {
      // Un fbclid nuevo (otro clic) reemplaza al guardado; el mismo lo conserva
      // con su timestamp original.
      if (!stored || stored.indexOf('.' + fbclid) === -1) {
        stored = 'fb.' + FBC_SUBDOMAIN_INDEX + '.' + Date.now() + '.' + fbclid;
        safeSetStored(FBC_STORAGE_KEY, stored);
      }
      return stored;
    }
    return stored || '';
  }

  /** Identificadores de Meta listos para viajar como hidden fields. */
  function getMetaIds() {
    var out = {};
    var fbc = getFbc();
    var fbp = getFbp();
    if (fbc) out.fbc = fbc;
    if (fbp) out.fbp = fbp;
    return out;
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
    var metaIds = getMetaIds();
    Object.keys(metaIds).forEach(function (key) { attribution[key] = metaIds[key]; });
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
    getFbp: getFbp,
    getFbc: getFbc,
    getMetaIds: getMetaIds,
    getAttribution: getAttribution,
    getLead: getLead,
    track: track
  };
})();
