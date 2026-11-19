const { forward } = require('../../../lib/genesis-proxy');
// Vistas y clics del banner Black Friday (test A/B, 19-nov-2026). La persona y su versión las
// pone el CRM desde la sesión; el navegador sólo dice qué pasó.
module.exports = async function black(request, response) {
  if (request.method !== 'POST') return response.status(405).json({ error: 'Método no permitido' });
  return forward(request, response, 'black', { method: 'POST' });
};
