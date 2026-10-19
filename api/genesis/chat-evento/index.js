const { forward } = require('../../../lib/genesis-proxy');
const ruta = require('../../../lib/ruta-chat');

// Cuando la persona confirma la sesión en el calendario de Calendly dentro del
// chat, el navegador avisa acá. Se guarda como un turno más de la conversación:
// el admin lo ve en «Chats» y el agente lo recuerda («ya agendó») en los turnos
// siguientes. La cita en sí ya la registró Calendly (AGENDAS, recordatorios).

function cuerpo(request) {
  if (request.body && typeof request.body === 'object') return request.body;
  try { return JSON.parse(request.body || '{}'); } catch (error) { return {}; }
}

module.exports = async function chatEvento(request, response) {
  if (request.method !== 'POST') return response.status(405).json({ error: 'Método no permitido' });
  const body = cuerpo(request);
  if (body.tipo !== 'agenda') return response.status(400).json({ error: 'Evento desconocido' });

  const sesion = await forward(request, response, 'session', { method: 'GET', deferResponse: true });
  if (!sesion) return null;
  if (sesion.status !== 200) return response.status(401).json({ error: 'Tu sesión venció.' });

  const perfil = ruta.perfilDesde(sesion.payload);
  const zona = ruta.zonaValida(body.zona);
  const inicio = typeof body.inicio === 'string' && !isNaN(new Date(body.inicio)) ? new Date(body.inicio).toISOString() : null;
  const conversacion = String(body.conversacion || '').replace(/[^a-z0-9-]/gi, '').slice(0, 40) || 'principal';
  const mensaje = ruta.confirmacionDeAgenda(inicio, zona, perfil.nombre);

  try {
    const r = await forward(request, response, 'chat-log', {
      method: 'POST',
      deferResponse: true,
      timeoutMs: 3000,
      body: {
        conversacion: conversacion,
        mensajeUsuario: '(Agendó la sesión con un asesor desde el calendario del chat)',
        mensajeEquipo: mensaje,
        accion: 'agendo',
        tarjeta: { tipo: 'agenda', inicio: inicio, zona: zona, evento: String(body.evento || '').slice(0, 200) }
      }
    });
    if (!r || r.status !== 200) console.error('[ruta-chat] el CRM no guardó la agenda:', r && r.status);
  } catch (error) {
    console.error('[ruta-chat] el CRM no guardó la agenda:', error.message);
  }
  console.log('[ruta-chat]', JSON.stringify({ accion: 'agendo', con_horario: Boolean(inicio), zona: zona }));
  return response.status(200).json({ mensaje: mensaje });
};
