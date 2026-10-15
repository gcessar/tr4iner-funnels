const { forward } = require('../../../lib/genesis-proxy');
module.exports = async function me(request, response) {
  // PATCH: el miembro elige sus días de entrenamiento (los de antes de la Ruta no los tenían).
  if (request.method === 'PATCH') return forward(request, response, 'session', { method: 'PATCH' });
  if (request.method !== 'GET') return response.status(405).json({ error: 'Método no permitido' });
  return forward(request, response, 'session', { method: 'GET' });
};
