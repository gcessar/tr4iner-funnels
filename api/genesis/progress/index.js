const { forward } = require('../../../lib/genesis-proxy');
module.exports = async function progress(request, response) {
  if (request.method !== 'POST') return response.status(405).json({ error: 'Método no permitido' });
  return forward(request, response, 'progress', { method: 'POST' });
};
