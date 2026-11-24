const { forward } = require('../../../lib/genesis-proxy');
// Vistas y clics de los avisos y la franja del chat en prueba A/B (23-nov-2026). La persona y su
// versión las pone el CRM desde la sesión; el navegador sólo dice qué prueba vio o tocó.
module.exports = async function prueba(request, response) {
  if (request.method !== 'POST') return response.status(405).json({ error: 'Método no permitido' });
  return forward(request, response, 'prueba', { method: 'POST' });
};
