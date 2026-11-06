const ruta = require('../../../lib/ruta-chat');

// Si a esta persona se le muestra el botón del chat de la Ruta. En Cuba y Venezuela no (6-nov,
// pedido del usuario: «asegurándose de que sea la IP de esos países»): lo decide la IP que informa
// Vercel, no lo que la persona declare. Sin la sesión del miembro, a propósito: la página lo pide
// antes de montar el chat y la respuesta no dice nada de nadie. Nunca se guarda en caché: depende
// de la IP de quien pregunta.
module.exports = function disponible(request, response) {
  response.setHeader('Cache-Control', 'private, no-store');
  if (request.method !== 'GET') return response.status(405).json({ error: 'Método no permitido' });
  return response.status(200).json({ disponible: ruta.chatDisponiblePara(ruta.geoDesde(request.headers || {})) });
};
