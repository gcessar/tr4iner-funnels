const agenda = require('../../lib/empezar-agenda');

// Horarios libres de la sesión del Premium para /empezar. La tarjeta muestra el más
// próximo y la hoja de agenda los lista en la hora local de la persona.
module.exports = async function horarios(request, response) {
  if (request.method !== 'GET') return response.status(405).json({ error: 'Método no permitido' });
  try {
    const libres = await agenda.horariosLibres();
    // Medio minuto en el CDN: con tráfico pago no se le pega a Calendly en cada visita, y
    // un horario que se ocupó mientras tanto se vuelve a comprobar al reservar.
    response.setHeader('Cache-Control', 'public, max-age=0, s-maxage=30, stale-while-revalidate=30');
    // reserva_directa: si la página registra la cita ella misma o la termina en Calendly.
    return response.status(200).json({ horarios: libres, reserva_directa: agenda.reservaDirecta() });
  } catch (error) {
    console.error('[empezar] sin horarios de Calendly:', error.message);
    response.setHeader('Cache-Control', 'no-store');
    // La página cae al calendario de Calendly: nadie se queda sin poder agendar.
    return response.status(503).json({ horarios: [], error: 'sin_horarios' });
  }
};
