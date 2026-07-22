const { forward, setSessionCookie } = require('../../../lib/genesis-proxy');
module.exports = async function verify(request, response) {
  if (request.method !== 'POST') return response.status(405).json({ error: 'Método no permitido' });
  var result = await forward(request, response, 'verify', { method: 'POST', deferResponse: true });
  if (!result) return;
  if (result.status === 200 && result.payload.sessionToken) {
    setSessionCookie(response, result.payload.sessionToken);
    delete result.payload.sessionToken;
  }
  response.status(result.status).json(result.payload);
};
