const SESSION_COOKIE = 'tr4_genesis_session';
const { PREVIEW_SESSION_COOKIE, isPreview, previewConfigured, previewCrmOrigin, verifyTeamCookie, readCookies, privateHeaders } = require('./genesis-team');

function crmBase() {
  if (isPreview()) return previewConfigured() ? previewCrmOrigin() : '';
  return String(process.env.GENESIS_CRM_API_URL || '').replace(/\/$/, '');
}

function parseCookies(request) {
  return readCookies(request.headers.cookie);
}

function bodyOf(request) {
  if (!request.body) return {};
  if (typeof request.body === 'object') return request.body;
  try { return JSON.parse(request.body); } catch (error) { return {}; }
}

async function forward(request, response, path, options) {
  privateHeaders(response);
  if (isPreview() && !previewConfigured()) {
    response.status(503).json({ error: 'Preview privado sin configurar' });
    return null;
  }
  if (isPreview() && !await verifyTeamCookie(request.headers.cookie)) {
    response.status(401).json({ error: 'Introduce la clave de equipo para continuar', teamAccessRequired: true });
    return null;
  }
  var base = crmBase();
  var secret = process.env.GENESIS_INTERNAL_SECRET;
  if (!base || !secret) {
    response.status(503).json({ error: 'GENESIS no está configurado' });
    return null;
  }

  var method = (options && options.method) || request.method || 'GET';
  var headers = {
    'content-type': 'application/json',
    'x-genesis-internal-secret': secret,
    'user-agent': request.headers['user-agent'] || ''
  };
  if (isPreview()) {
    headers['x-genesis-team-preview-secret'] = process.env.GENESIS_TEAM_SECRET;
    if (process.env.GENESIS_CRM_BYPASS_SECRET) headers['x-vercel-protection-bypass'] = process.env.GENESIS_CRM_BYPASS_SECRET;
  }
  if (process.env.VERCEL === '1') {
    headers['x-genesis-client-ip'] = String(request.headers['x-vercel-forwarded-for'] || '').split(',')[0].trim();
    headers['x-genesis-client-country'] = String(request.headers['x-vercel-ip-country'] || '');
    headers['x-genesis-client-city'] = String(request.headers['x-vercel-ip-city'] || '');
  }
  var session = parseCookies(request)[isPreview() ? PREVIEW_SESSION_COOKIE : SESSION_COOKIE];
  if (session) headers.authorization = 'Bearer ' + session;
  var upstream = await fetch(base + '/api/genesis/' + path, {
    method: method,
    headers: headers,
    // DELETE puede revocar una suscripción concreta; omitir su JSON borraba la identidad del dispositivo.
    body: method === 'GET' || method === 'HEAD' || (method === 'DELETE' && !request.body) ? undefined : JSON.stringify(bodyOf(request)),
    redirect: 'error'
  });
  var text = await upstream.text();
  var payload;
  try { payload = JSON.parse(text); } catch (error) { payload = { error: 'Respuesta inválida del CRM' }; }
  response.setHeader('Cache-Control', 'private, no-store');
  if (!(options && options.deferResponse)) response.status(upstream.status).json(payload);
  return { status: upstream.status, payload: payload };
}

function setSessionCookie(response, token) {
  var secure = Boolean(process.env.VERCEL) ? '; Secure' : '';
  response.setHeader('Set-Cookie', (isPreview() ? PREVIEW_SESSION_COOKIE : SESSION_COOKIE) + '=' + encodeURIComponent(token) +
    '; Path=/; HttpOnly; SameSite=Lax; Max-Age=2592000' + secure);
}

function clearSessionCookie(response) {
  var secure = Boolean(process.env.VERCEL) ? '; Secure' : '';
  response.setHeader('Set-Cookie', (isPreview() ? PREVIEW_SESSION_COOKIE : SESSION_COOKIE) + '=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0' + secure);
}

module.exports = { forward, setSessionCookie, clearSessionCookie };
