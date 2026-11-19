const { forward } = require('../../../lib/genesis-proxy');
// Señales que deciden el siguiente paso del miembro: abrió su rutina o respondió el chequeo de
// la semana. Va directo al CRM (no por el webhook de eventos, que rechaza nombres que no conoce).
module.exports = async function paso(request, response) {
  if (request.method !== 'POST') return response.status(405).json({ error: 'Método no permitido' });
  return forward(request, response, 'paso', { method: 'POST' });
};
