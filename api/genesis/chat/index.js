const { forward } = require('../../../lib/genesis-proxy');
const ruta = require('../../../lib/ruta-chat');
const PROMPT = require('../../../lib/ruta-chat-prompt');

// El agente corre en n8n («RUTA-CHAT · Equipo») porque ahí ya está la
// credencial de OpenAI y la memoria de conversaciones de los otros bots.
const AGENTE_URL = 'https://primary-production-0efa.up.railway.app/webhook/ruta-chat';
const ESCALONES = ['apertura', 'piso', 'promo', 'llamada'];

function cuerpo(request) {
  if (request.body && typeof request.body === 'object') return request.body;
  try { return JSON.parse(request.body || '{}'); } catch (error) { return {}; }
}

module.exports = async function chat(request, response) {
  if (request.method !== 'POST') return response.status(405).json({ error: 'Método no permitido' });

  const body = cuerpo(request);
  const mensaje = String(body.mensaje || '').trim().slice(0, 800);
  if (!mensaje) return response.status(400).json({ error: 'Escribe un mensaje.' });

  const secreto = process.env.RUTA_CHAT_SECRET;
  if (!secreto) return response.status(503).json({ error: 'El chat todavía no está configurado.' });

  // El perfil sale del CRM y no del navegador: de esos datos depende hasta
  // dónde puede bajar el precio, así que no se aceptan de quien los pide.
  const sesion = await forward(request, response, 'session', { method: 'GET', deferResponse: true });
  if (!sesion) return null;
  if (sesion.status !== 200) {
    return response.status(401).json({ error: 'Tu sesión venció. Vuelve a entrar desde el enlace de tu correo.' });
  }

  const perfil = ruta.perfilDesde(sesion.payload);
  if (!perfil.email) return response.status(401).json({ error: 'No pudimos reconocer tu Ruta.' });

  // Lo que manda el navegador sólo ordena la conversación: qué escalones ya vio
  // (para no saltarse ninguno), el país que dijo (que sólo puede subir el precio)
  // y la corrección del turno anterior, si el servidor tuvo que hacer una.
  const conversacion = String(body.conversacion || '').replace(/[^a-z0-9-]/gi, '').slice(0, 40) || 'principal';
  const mostrados = (Array.isArray(body.mostrados) ? body.mostrados : []).filter(function (e) {
    return ESCALONES.indexOf(e) !== -1;
  });
  const geo = ruta.geoDesde(request.headers);
  const mercado = ruta.mercadoPara(geo, body.eco || {});
  const sistema = PROMPT + '\n\n' + ruta.contextoParaAgente(perfil, geo, mercado, mostrados, String(body.ajuste || '').slice(0, 600));

  let cruda;
  try {
    const upstream = await fetch(AGENTE_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-ruta-chat-secret': secreto },
      body: JSON.stringify({ sesion: 'ruta:' + perfil.email + ':' + conversacion, sistema: sistema, mensaje: mensaje }),
      signal: AbortSignal.timeout(28000)
    });
    if (!upstream.ok) throw new Error('agente respondió ' + upstream.status);
    cruda = await upstream.json();
    if (Array.isArray(cruda)) cruda = cruda[0];
  } catch (error) {
    console.error('[ruta-chat] sin respuesta del agente:', error.message);
    return response.status(200).json(ruta.respuestaDeError(perfil));
  }

  const respuesta = ruta.resolverRespuesta(cruda, perfil, geo, mostrados, mensaje);
  // Sin email en los logs: alcanza con ver qué pidió el agente y qué se mostró.
  console.log('[ruta-chat]', JSON.stringify({
    mercado: mercado,
    pais_ip: geo.pais,
    estado_ruta: perfil.estado_ruta,
    accion: respuesta.registro.accion,
    escalon_pedido: respuesta.registro.escalon_pedido,
    tarjeta: respuesta.tarjeta ? (respuesta.tarjeta.escalon || respuesta.tarjeta.tipo) : null,
    nivel: respuesta.registro.calificacion.nivel,
    objeciones_precio: respuesta.registro.calificacion.objeciones_precio,
    montos_invalidos: respuesta.registro.montos_invalidos
  }));

  return response.status(200).json({
    mensaje: respuesta.mensaje,
    opciones: respuesta.opciones,
    tarjeta: respuesta.tarjeta,
    eco: respuesta.eco,
    ajuste: respuesta.ajuste
  });
};
