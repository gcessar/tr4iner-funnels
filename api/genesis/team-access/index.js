const { createHash, timingSafeEqual } = require('node:crypto');
const { TEAM_COOKIE, TEAM_TTL_SECONDS, teamKey, previewConfigured, issueTeamCookie, privateHeaders } = require('../../../lib/genesis-team');

module.exports = async function teamAccess(request, response) {
  privateHeaders(response);
  if (!previewConfigured()) return response.status(404).json({ error: 'Este acceso de equipo no está habilitado' });
  if (request.method !== 'POST') return response.status(405).json({ error: 'Método no permitido' });
  var origin;
  try { origin = new URL('https://' + request.headers.host).origin; } catch (_) { origin = null; }
  if (!origin || request.headers.origin !== origin || request.headers['sec-fetch-site'] === 'cross-site') {
    return response.status(403).json({ error: 'Abre el acceso desde esta página' });
  }
  if (!String(request.headers['content-type'] || '').startsWith('application/json')) return response.status(415).json({ error: 'Formato no admitido' });
  var body = request.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch (_) { body = null; } }
  var supplied = body && typeof body.key === 'string' ? body.key : '';
  if (!supplied || supplied.length > 512) return response.status(401).json({ error: 'La clave de equipo no es correcta' });
  // Ambas huellas miden lo mismo, incluso si se intenta una clave de otra longitud.
  var actual = createHash('sha256').update(supplied).digest();
  var expected = createHash('sha256').update(teamKey()).digest();
  if (!timingSafeEqual(actual, expected)) return response.status(401).json({ error: 'La clave de equipo no es correcta' });
  var cookie = await issueTeamCookie();
  response.setHeader('Set-Cookie', TEAM_COOKIE + '=' + cookie + '; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=' + TEAM_TTL_SECONDS);
  return response.status(200).json({ accepted: true });
};
