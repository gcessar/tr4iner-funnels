const { forward } = require('../../../lib/genesis-proxy');
module.exports = async function catalog(request, response) {
  if (request.method !== 'GET') return response.status(405).json({ error: 'Método no permitido' });
  return forward(request, response, 'catalog', { method: 'GET' });
};
