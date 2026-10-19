const { forward, setSessionCookie } = require('../../../lib/genesis-proxy');
// Entrada directa con correo o teléfono (19-oct-2026). Igual que verify: el CRM abre la sesión
// y la cookie HttpOnly se pone acá; el token nunca llega al navegador.
module.exports = async function directAccess(request, response) {
  if (request.method !== 'POST') return response.status(405).json({ error: 'Método no permitido' });
  var result = await forward(request, response, 'direct-access', { method: 'POST', deferResponse: true });
  if (!result) return;
  if (result.status === 200 && result.payload.sessionToken) {
    setSessionCookie(response, result.payload.sessionToken);
    delete result.payload.sessionToken;
  }
  response.status(result.status).json(result.payload);
};
