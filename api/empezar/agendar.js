const agenda = require('../../lib/empezar-agenda');

function cuerpo(request) {
  if (request.body && typeof request.body === 'object') return request.body;
  try { return JSON.parse(request.body || '{}'); } catch (error) { return {}; }
}

// Registra la sesión del Premium por la API de Calendly (vía n8n) con lo que la persona
// cargó en la hoja de /empezar. Sin RUTA_CHAT_SECRET o si Calendly falla, la página
// abre el calendario de Calendly en ese mismo horario: la reserva nunca se pierde.
module.exports = async function agendar(request, response) {
  response.setHeader('Cache-Control', 'no-store');
  if (request.method !== 'POST') return response.status(405).json({ ok: false, error: 'Método no permitido' });

  const b = cuerpo(request);
  // Campo trampa: invisible para una persona, lo completan los robots que llenan todo.
  if (b.sitio) return response.status(400).json({ ok: false, motivo: 'datos', campo: 'nombre' });

  const v = agenda.validar(b);
  if (!v.datos) return response.status(400).json({ ok: false, motivo: 'datos', campo: v.campo });
  const d = v.datos;

  if (!process.env.RUTA_CHAT_SECRET) return response.status(503).json({ ok: false, motivo: 'sin_configurar' });

  // El horario lo eligió hace un rato: si alguien lo tomó, se le ofrecen los que siguen
  // libres en vez de intentar una reserva que falla.
  let libres = null;
  try { libres = await agenda.horariosLibres(); } catch (error) { console.error('[empezar] sin horarios al reservar:', error.message); }
  if (libres && libres.length && !libres.some(function (h) { return h.inicio === d.inicio; })) {
    return response.status(409).json({ ok: false, motivo: 'horario_ocupado', horarios: libres });
  }

  const brazo = agenda.brazoDe(request.headers.cookie);
  let reserva;
  try {
    reserva = await agenda.n8n(agenda.urlAgendar(), {
      prueba: !agenda.agendaReal(),
      start_time: d.inicio,
      nombre: d.nombre,
      email: d.email,
      zona: d.zona,
      whatsapp: d.whatsapp,
      situacion: agenda.situacionParaAsesor(d.objetivo),
      tracking: agenda.trackingDe(b, brazo)
    }, 15000);
  } catch (error) {
    console.error('[empezar] no se pudo agendar:', error.message);
    return response.status(502).json({ ok: false, motivo: 'sin_respuesta' });
  }

  if (reserva && reserva.ok) {
    return response.status(200).json({
      ok: true,
      prueba: Boolean(reserva.prueba),
      inicio: reserva.inicio || d.inicio,
      reprogramar: reserva.reprogramar || null,
      cancelar: reserva.cancelar || null
    });
  }
  if (reserva && reserva.motivo === 'horario_ocupado') {
    return response.status(409).json({ ok: false, motivo: 'horario_ocupado', horarios: libres || [] });
  }
  console.error('[empezar] Calendly rechazó la reserva:', reserva && (reserva.motivo + ' ' + (reserva.detalle || '')));
  return response.status(502).json({ ok: false, motivo: (reserva && reserva.motivo) || 'error_calendly' });
};
