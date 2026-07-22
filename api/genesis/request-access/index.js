const { forward } = require('../../../lib/genesis-proxy');
module.exports = async function requestAccess(request, response) {
  if (request.method !== 'POST') return response.status(405).json({ error: 'Método no permitido' });
  return forward(request, response, 'request-access', { method: 'POST' });
};
