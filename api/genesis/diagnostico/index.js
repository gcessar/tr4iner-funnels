const { forward } = require('../../../lib/genesis-proxy');
// Sesión de diagnóstico por WhatsApp de las páginas de planes (26-oct-2026): el número que
// dejó la persona, con su página y sus UTMs. Pasa por acá y no directo al CRM para viajar
// con el secreto interno y, si la persona tiene sesión de la Ruta, con su token: así el CRM
// pone el número guardado del miembro sin que el navegador lo tenga completo.
module.exports = async function diagnostico(request, response) {
  if (request.method !== 'POST') return response.status(405).json({ error: 'Método no permitido' });
  return forward(request, response, 'diagnostico', { method: 'POST' });
};
