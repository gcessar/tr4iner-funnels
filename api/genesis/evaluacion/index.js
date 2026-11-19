const { forward } = require('../../../lib/genesis-proxy');
// Evaluación del primer mes en la Ruta (18-nov-2026): GET dice si le toca; POST guarda la
// evaluación o registra que pidió ayuda del equipo. Lo decide y lo guarda el CRM.
module.exports = async function evaluacion(request, response) {
  if (request.method === 'GET') return forward(request, response, 'evaluacion', { method: 'GET' });
  if (request.method !== 'POST') return response.status(405).json({ error: 'Método no permitido' });
  return forward(request, response, 'evaluacion', { method: 'POST' });
};
