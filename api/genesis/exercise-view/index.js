const { forward } = require('../../../lib/genesis-proxy');
// Reproducciones de los videos de ejercicios de la rutina: sólo medición, el CRM las suma por miembro.
module.exports = async function exerciseView(request, response) {
  if (request.method !== 'POST') return response.status(405).json({ error: 'Método no permitido' });
  return forward(request, response, 'exercise-view', { method: 'POST' });
};
