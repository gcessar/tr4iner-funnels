const { forward, clearSessionCookie } = require('../../../lib/genesis-proxy');
module.exports = async function logout(request, response) {
  if (request.method !== 'POST') return response.status(405).json({ error: 'Método no permitido' });
  var result = await forward(request, response, 'session', { method: 'DELETE', deferResponse: true });
  clearSessionCookie(response);
  response.status(result ? result.status : 200).json(result ? result.payload : { success: true });
};
