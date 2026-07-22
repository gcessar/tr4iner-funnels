const SESSION_COOKIE = 'tr4_genesis_session';

function crmBase() {
  return String(process.env.GENESIS_CRM_API_URL || '').replace(/\/$/, '');
}

function parseCookies(request) {
  return String(request.headers.cookie || '').split(';').reduce(function (out, pair) {
    var index = pair.indexOf('=');
    if (index > 0) out[pair.slice(0, index).trim()] = decodeURIComponent(pair.slice(index + 1).trim());
    return out;
  }, {});
}

function bodyOf(request) {
  if (!request.body) return {};
  if (typeof request.body === 'object') return request.body;
  try { return JSON.parse(request.body); } catch (error) { return {}; }
}

async function forward(request, response, path, options) {
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
  var session = parseCookies(request)[SESSION_COOKIE];
  if (session) headers.authorization = 'Bearer ' + session;
  var upstream = await fetch(base + '/api/genesis/' + path, {
    method: method,
    headers: headers,
    body: method === 'GET' || method === 'DELETE' ? undefined : JSON.stringify(bodyOf(request))
  });
  var text = await upstream.text();
  var payload;
  try { payload = JSON.parse(text); } catch (error) { payload = { error: 'Respuesta inválida del CRM' }; }
  if (!(options && options.deferResponse)) response.status(upstream.status).json(payload);
  return { status: upstream.status, payload: payload };
}

function setSessionCookie(response, token) {
  var secure = process.env.VERCEL_ENV === 'production' ? '; Secure' : '';
  response.setHeader('Set-Cookie', SESSION_COOKIE + '=' + encodeURIComponent(token) +
    '; Path=/; HttpOnly; SameSite=Lax; Max-Age=2592000' + secure);
}

function clearSessionCookie(response) {
  var secure = process.env.VERCEL_ENV === 'production' ? '; Secure' : '';
  response.setHeader('Set-Cookie', SESSION_COOKIE + '=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0' + secure);
}

module.exports = { forward, setSessionCookie, clearSessionCookie };
