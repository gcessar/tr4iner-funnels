const { forward } = require('../../../lib/genesis-proxy');
module.exports = async function me(request, response) {
  if (request.method !== 'GET') return response.status(405).json({ error: 'Método no permitido' });
  return forward(request, response, 'session', { method: 'GET' });
};
