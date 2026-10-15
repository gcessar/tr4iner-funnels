// La clave y las cookies del equipo nunca comparten la sesión de miembros de producción.
const TEAM_COOKIE = 'tr4_genesis_team_preview';
const PREVIEW_SESSION_COOKIE = 'tr4_genesis_preview_session';
const TEAM_TTL_SECONDS = 30 * 24 * 60 * 60;

function isPreview(env) {
  return (env || process.env).VERCEL_ENV === 'preview';
}

function teamPreviewEnabled(env) {
  var config = env || process.env;
  return isPreview(config) && config.GENESIS_TEAM_PREVIEW === '1';
}

function teamKey(env) {
  var key = (env || process.env).GENESIS_PREVIEW_ACCESS_KEY || '';
  return typeof key === 'string' && key.length >= 32 && key.length <= 512 ? key : null;
}

function readCookies(raw) {
  return String(raw || '').split(';').reduce(function (out, pair) {
    var index = pair.indexOf('=');
    if (index > 0) {
      try { out[pair.slice(0, index).trim()] = decodeURIComponent(pair.slice(index + 1).trim()); }
      catch (_) { /* Una cookie malformada no rompe el acceso de otras personas. */ }
    }
    return out;
  }, {});
}

function encodeBytes(bytes) {
  return btoa(String.fromCharCode.apply(null, Array.from(bytes))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function decodeBytes(value) {
  if (!/^[A-Za-z0-9_-]+$/.test(value)) throw new Error('Firma inválida');
  var base64 = value.replace(/-/g, '+').replace(/_/g, '/');
  return Uint8Array.from(atob(base64 + '='.repeat((4 - base64.length % 4) % 4)), function (char) { return char.charCodeAt(0); });
}

async function cryptoKey(key) {
  return crypto.subtle.importKey('raw', new TextEncoder().encode(key), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']);
}

async function issueTeamCookie(env, now) {
  var secret = teamKey(env);
  if (!teamPreviewEnabled(env) || !secret) throw new Error('Preview privado sin configurar');
  var expires = Math.floor((now === undefined ? Date.now() : now) / 1000) + TEAM_TTL_SECONDS;
  var nonce = encodeBytes(crypto.getRandomValues(new Uint8Array(16)));
  var body = 'v1.' + expires + '.' + nonce;
  var signature = await crypto.subtle.sign('HMAC', await cryptoKey(secret), new TextEncoder().encode(body));
  return body + '.' + encodeBytes(new Uint8Array(signature));
}

async function verifyTeamCookie(rawCookie, env, now) {
  var secret = teamKey(env);
  if (!teamPreviewEnabled(env) || !secret) return false;
  var value = readCookies(rawCookie)[TEAM_COOKIE] || '';
  var parts = value.split('.');
  if (parts.length !== 4 || parts[0] !== 'v1' || !/^\d{10}$/.test(parts[1]) || !/^[A-Za-z0-9_-]{22}$/.test(parts[2])) return false;
  var current = Math.floor((now === undefined ? Date.now() : now) / 1000);
  var expires = Number(parts[1]);
  if (expires <= current || expires > current + TEAM_TTL_SECONDS + 60) return false;
  try {
    var signature = decodeBytes(parts[3]);
    if (signature.length !== 32) return false;
    return await crypto.subtle.verify('HMAC', await cryptoKey(secret), signature, new TextEncoder().encode(parts.slice(0, 3).join('.')));
  } catch (_) { return false; }
}

function previewCrmOrigin(env) {
  var config = env || process.env;
  try {
    var url = new URL(config.GENESIS_CRM_API_URL || '');
    if (url.protocol !== 'https:' || url.username || url.password || url.search || url.hash || url.pathname !== '/') return null;
    // Una Preview sin destino explícito nunca usa el CRM vivo como respaldo.
    if (!url.hostname.endsWith('.vercel.app') || url.hostname === 'crm-ventas-eosin.vercel.app' || url.hostname === 'crm-ventas.vercel.app') return null;
    return url.origin;
  } catch (_) { return null; }
}

function previewConfigured(env) {
  var config = env || process.env;
  return Boolean(teamPreviewEnabled(config) && teamKey(config) && previewCrmOrigin(config) && config.GENESIS_INTERNAL_SECRET && config.GENESIS_TEAM_SECRET);
}

function privateHeaders(response) {
  response.setHeader('Cache-Control', 'private, no-store, max-age=0');
  response.setHeader('Vercel-CDN-Cache-Control', 'no-store');
  response.setHeader('CDN-Cache-Control', 'no-store');
  response.setHeader('X-Robots-Tag', 'noindex, nofollow, noarchive');
  response.setHeader('Referrer-Policy', 'same-origin');
}

module.exports = { TEAM_COOKIE, PREVIEW_SESSION_COOKIE, TEAM_TTL_SECONDS, isPreview, teamPreviewEnabled, teamKey, readCookies, issueTeamCookie, verifyTeamCookie, previewCrmOrigin, previewConfigured, privateHeaders };
