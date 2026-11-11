const { forward } = require('../../../lib/genesis-proxy');
const ruta = require('../../../lib/ruta-chat');

// Retomar a quien el chat dejó sin su paso (11-nov, pedido del usuario: «detecta la próxima vez
// que entren a ver su Ruta y activa el chat mostrando el mensaje para enviarlos a donde se debió
// enviar antes»). La página lo pregunta al entrar:
//   GET  → { retomar: { mensaje, opciones, tarjeta } | null }. No guarda nada.
//   POST → lo mismo, y deja el mensaje guardado como un turno del chat (accion «retomar») en la
//          conversación que manda el navegador. Lo llama cuando de verdad lo muestra: desde ahí
//          cuenta como paso dado y no vuelve a salir, tampoco en otro dispositivo.
// La regla (`pasoPendiente`) y el texto (`respuestaParaRetomar`) viven en lib/ruta-chat.js; el CRM
// sólo entrega los últimos turnos de la persona y lo que hizo fuera del chat. El texto es fijo:
// no pasa por el agente.
//
// Si el CRM tarda, falla o todavía no conoce `?reciente=1`, la respuesta es «nada que retomar»:
// esto nunca puede romper la entrada a la Ruta.

function cuerpo(request) {
  if (request.body && typeof request.body === 'object') return request.body;
  try { return JSON.parse(request.body || '{}'); } catch (error) { return {}; }
}

// null = nada que retomar; undefined = `forward` ya respondió (Preview sin configurar o sin clave).
async function pendienteDe(request, response) {
  const geo = ruta.geoDesde(request.headers || {});
  // En Cuba y Venezuela el chat no se muestra: no hay dónde retomar.
  if (!ruta.chatDisponiblePara(geo)) return null;

  // Primero los turnos: quien nunca usó el chat (casi todos) termina acá, con una sola consulta.
  const reciente = await forward(request, response, 'chat-log?reciente=1', { method: 'GET', deferResponse: true, timeoutMs: 4000 });
  if (!reciente) return undefined;
  const turnos = reciente.status === 200 && reciente.payload && Array.isArray(reciente.payload.turnos) ? reciente.payload.turnos : [];
  if (!turnos.length) return null;

  const sesion = await forward(request, response, 'session', { method: 'GET', deferResponse: true, timeoutMs: 4000 });
  if (!sesion) return undefined;
  if (sesion.status !== 200) return null;
  const perfil = ruta.perfilDesde(sesion.payload);
  if (!perfil.email) return null;

  // El camino se calcula hoy, con su país y su avance de hoy: si avanzó o viajó, va a donde le toca ahora.
  const camino = ruta.caminoPara(perfil, geo, {});
  const pendiente = ruta.pasoPendiente(turnos, reciente.payload.hechos, camino);
  if (!pendiente) return null;
  return { perfil: perfil, geo: geo, camino: camino, pendiente: pendiente, respuesta: ruta.respuestaParaRetomar(perfil, camino) };
}

module.exports = async function retomar(request, response) {
  response.setHeader('Cache-Control', 'private, no-store');
  if (request.method !== 'GET' && request.method !== 'POST') return response.status(405).json({ error: 'Método no permitido' });

  let caso;
  try {
    caso = await pendienteDe(request, response);
  } catch (error) {
    console.error('[ruta-chat] no se pudo ver si hay algo que retomar:', error.message);
    return response.status(200).json({ retomar: null });
  }
  if (caso === undefined) return null;
  if (!caso) return response.status(200).json({ retomar: null });

  const visible = { mensaje: caso.respuesta.mensaje, opciones: caso.respuesta.opciones, tarjeta: caso.respuesta.tarjeta };
  if (request.method === 'GET') return response.status(200).json({ retomar: visible });

  const conversacion = String(cuerpo(request).conversacion || '').replace(/[^a-z0-9-]/gi, '').slice(0, 40) || 'principal';
  let guardado = false;
  try {
    const r = await forward(request, response, 'chat-log', {
      method: 'POST', deferResponse: true, timeoutMs: 4000,
      body: {
        conversacion: conversacion,
        mensajeUsuario: ruta.MARCA_RETOMAR,
        mensajeEquipo: visible.mensaje,
        opciones: visible.opciones,
        tarjeta: visible.tarjeta,
        accion: 'retomar',
        calificacion: { camino: caso.camino.id, motivo: caso.pendiente.motivo, desde: caso.pendiente.at },
        mercado: ruta.mercadoPara(caso.geo, {}),
        paisIp: caso.geo.pais || null,
        estadoRuta: caso.perfil.estado_ruta || null,
        promptVersion: 'retomar'
      }
    });
    guardado = Boolean(r && r.status === 200);
    if (!guardado) console.error('[ruta-chat] el CRM no guardó el mensaje de retomar:', r && r.status);
  } catch (error) {
    console.error('[ruta-chat] el CRM no guardó el mensaje de retomar:', error.message);
  }
  console.log('[ruta-chat]', JSON.stringify({ accion: 'retomar', motivo: caso.pendiente.motivo, camino: caso.camino.id, pais_ip: caso.geo.pais, guardado: guardado }));
  return response.status(200).json({ retomar: visible, guardado: guardado });
};

module.exports.pendienteDe = pendienteDe;
