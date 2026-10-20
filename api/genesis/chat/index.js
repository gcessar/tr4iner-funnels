const crypto = require('crypto');
const { forward } = require('../../../lib/genesis-proxy');
const ruta = require('../../../lib/ruta-chat');
const PROMPT = require('../../../lib/ruta-chat-prompt');
const LECCIONES = require('../../../lib/ruta-chat-lecciones');

// El agente corre en n8n («RUTA-CHAT · Equipo») porque ahí está la credencial de
// OpenAI. La memoria ya no: vive en el CRM (7-oct), junto al historial que ve el
// admin, y se le pasa al agente en cada pedido.
// Los previews apuntan a sus propios workflows (RUTA_CHAT_AGENTE_URL,
// RUTA_CHAT_HORARIOS_URL y RUTA_CHAT_AGENDAR_URL) para probar sin tocar los de
// producción.
const N8N = 'https://primary-production-0efa.up.railway.app/webhook/';
const AGENTE_URL = process.env.RUTA_CHAT_AGENTE_URL || N8N + 'ruta-chat';
const HORARIOS_URL = process.env.RUTA_CHAT_HORARIOS_URL || N8N + 'ruta-chat-horarios';
const AGENDAR_URL = process.env.RUTA_CHAT_AGENDAR_URL || N8N + 'ruta-chat-agendar';
// Una reserva de verdad le llena la agenda a un asesor y dispara correos,
// WhatsApp de ManyChat y el evento de Meta. Mientras no se active a propósito,
// n8n arma la reserva completa pero no la envía a Calendly.
const AGENDA_REAL = process.env.RUTA_CHAT_AGENDA_REAL === '1';
// Cada turno guardado dice con qué prompt (y qué lecciones) se respondió: así se
// comparan versiones contra ventas.
const PROMPT_VERSION = crypto.createHash('sha256').update(PROMPT + '\n' + LECCIONES).digest('hex').slice(0, 10);

// El historial y el registro son accesorios: si el CRM tarda o falla, el chat sigue.
async function historialDe(request, response, conversacion) {
  try {
    const r = await forward(request, response, 'chat-log?conversacion=' + encodeURIComponent(conversacion), { method: 'GET', deferResponse: true, timeoutMs: 3000 });
    return r && r.status === 200 && Array.isArray(r.payload.historial) ? r.payload.historial : [];
  } catch (error) {
    console.error('[ruta-chat] sin historial del CRM:', error.message);
    return [];
  }
}

async function n8n(url, secreto, cuerpo, timeoutMs) {
  const r = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-ruta-chat-secret': secreto },
    body: JSON.stringify(cuerpo || {}),
    signal: AbortSignal.timeout(timeoutMs)
  });
  if (!r.ok) throw new Error('respondió ' + r.status);
  const d = await r.json();
  return Array.isArray(d) ? d[0] : d;
}

// Horarios libres de la sesión, traídos de Calendly por n8n (ahí vive la
// conexión con Calendly). Si tarda o falla, sale el botón del calendario.
async function horariosLibres(secreto) {
  try {
    const d = await n8n(HORARIOS_URL, secreto, {}, 6000);
    return d && Array.isArray(d.horarios) ? d.horarios : [];
  } catch (error) {
    console.error('[ruta-chat] sin horarios de Calendly:', error.message);
    return [];
  }
}

async function reservar(secreto, pendiente, perfil, zona, conversacion) {
  const params = ruta.parametrosCalendly(perfil, conversacion);
  const tracking = {};
  ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'salesforce_uuid'].forEach(function (k) {
    if (params[k]) tracking[k] = String(params[k]).slice(0, 255);
  });
  try {
    return await n8n(AGENDAR_URL, secreto, {
      prueba: !AGENDA_REAL,
      start_time: pendiente.horario.inicio,
      nombre: perfil.nombre_completo || perfil.nombre || 'Miembro de la Ruta',
      email: perfil.email,
      zona: zona,
      whatsapp: pendiente.whatsapp,
      situacion: pendiente.resumen || 'Viene del chat de su Ruta Tr4iner.',
      tracking: tracking
    }, 12000);
  } catch (error) {
    console.error('[ruta-chat] no se pudo agendar:', error.message);
    return { ok: false, motivo: 'sin_respuesta' };
  }
}

async function guardarTurno(request, response, turno) {
  try {
    const r = await forward(request, response, 'chat-log', { method: 'POST', deferResponse: true, body: turno, timeoutMs: 3000 });
    if (!r || r.status !== 200) console.error('[ruta-chat] el CRM no guardó el turno:', r && r.status);
  } catch (error) {
    console.error('[ruta-chat] el CRM no guardó el turno:', error.message);
  }
}

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

  // El perfil sale del CRM y no del navegador: nombre, correo y atribución van
  // a la reserva de Calendly, así que no se aceptan de quien los pide.
  const sesion = await forward(request, response, 'session', { method: 'GET', deferResponse: true });
  if (!sesion) return null;
  if (sesion.status !== 200) {
    return response.status(401).json({ error: 'Tu sesión venció. Vuelve a entrar desde el enlace de tu correo.' });
  }

  const perfil = ruta.perfilDesde(sesion.payload);
  if (!perfil.email) return response.status(401).json({ error: 'No pudimos reconocer tu Ruta.' });

  // Lo que manda el navegador sólo ordena la conversación: qué tarjetas ya vio,
  // lo que fue diciendo (país, horarios ofrecidos, WhatsApp) y la corrección del
  // turno anterior, si el servidor tuvo que hacer una. Los horarios se vuelven a
  // comprobar contra Calendly antes de reservar.
  const conversacion = String(body.conversacion || '').replace(/[^a-z0-9-]/gi, '').slice(0, 40) || 'principal';
  const mostrados = (Array.isArray(body.mostrados) ? body.mostrados : []).filter(ruta.tarjetaValida).slice(0, 40);
  const eco = ruta.ecoValido(body.eco);
  const geo = ruta.geoDesde(request.headers);
  const mercado = ruta.mercadoPara(geo, eco);
  const zona = ruta.zonaValida(body.zona);
  const sistema = PROMPT + '\n\n' + ruta.contextoParaAgente(perfil, geo, mercado, mostrados, String(body.ajuste || '').slice(0, 900), zona, LECCIONES, eco);

  const historial = await historialDe(request, response, conversacion);
  const base = {
    conversacion: conversacion,
    mensajeUsuario: mensaje,
    mercado: mercado,
    paisIp: geo.pais || null,
    estadoRuta: perfil.estado_ruta || null,
    promptVersion: PROMPT_VERSION
  };

  let cruda;
  const inicio = Date.now();
  try {
    cruda = await n8n(AGENTE_URL, secreto, { sesion: 'ruta:' + perfil.email + ':' + conversacion, sistema: sistema, mensaje: mensaje, historial: historial }, 28000);
  } catch (error) {
    console.error('[ruta-chat] sin respuesta del agente:', error.message);
    const fallo = ruta.respuestaDeError(perfil);
    await guardarTurno(request, response, Object.assign({}, base, {
      mensajeEquipo: fallo.mensaje, tarjeta: fallo.tarjeta, error: true, latenciaMs: Date.now() - inicio
    }));
    return response.status(200).json(fallo);
  }
  const latenciaMs = Date.now() - inicio;

  const turno = { numero: Math.floor(historial.length / 2) + 1, ultima: String(body.ultima || '').slice(0, 40) || null };
  let respuesta = ruta.resolverRespuesta(cruda, perfil, geo, mostrados, mensaje, conversacion, turno, body.eco);
  let reserva = null;
  if (respuesta.pendiente && respuesta.pendiente.tipo === 'horarios') {
    respuesta = ruta.completarHorarios(respuesta, await horariosLibres(secreto), zona, perfil, conversacion, false);
  } else if (respuesta.pendiente && respuesta.pendiente.tipo === 'agendar') {
    // El horario lo eligió hace un rato: si alguien lo tomó mientras tanto, se
    // le ofrecen los que siguen libres en vez de intentar una reserva que falla.
    const libres = await horariosLibres(secreto);
    const sigue = libres.some(function (h) { return new Date(h.inicio).toISOString() === respuesta.pendiente.horario.inicio; });
    if (libres.length && !sigue) {
      respuesta = ruta.completarHorarios(respuesta, libres, zona, perfil, conversacion, true);
    } else {
      reserva = await reservar(secreto, respuesta.pendiente, perfil, zona, conversacion);
      if (reserva && reserva.motivo === 'horario_ocupado') respuesta = ruta.completarHorarios(respuesta, libres, zona, perfil, conversacion, true);
      else respuesta = ruta.completarAgenda(respuesta, reserva, zona, perfil, conversacion);
    }
  }
  // Sin email ni teléfono en los logs: alcanza con ver qué pidió el agente y qué se mostró.
  console.log('[ruta-chat]', JSON.stringify({
    mercado: mercado,
    pais_ip: geo.pais,
    estado_ruta: perfil.estado_ruta,
    accion: respuesta.registro.accion,
    escalon_pedido: respuesta.registro.escalon_pedido,
    tarjeta: respuesta.tarjeta ? (respuesta.tarjeta.escalon || respuesta.tarjeta.tipo) : null,
    nivel: respuesta.registro.calificacion.nivel,
    reserva: reserva ? (reserva.ok ? (reserva.prueba ? 'prueba' : 'real') : reserva.motivo) : null,
    montos_invalidos: respuesta.registro.montos_invalidos
  }));

  // Se guarda lo que leyó la persona (ya corregido) y, aparte, lo que propuso el modelo.
  await guardarTurno(request, response, Object.assign({}, base, {
    mensajeEquipo: respuesta.mensaje,
    opciones: respuesta.opciones,
    tarjeta: respuesta.tarjeta,
    agente: cruda && typeof cruda === 'object' ? cruda : null,
    calificacion: respuesta.registro.calificacion,
    accion: respuesta.registro.accion,
    escalonPedido: respuesta.registro.escalon_pedido,
    ajuste: respuesta.ajuste,
    latenciaMs: latenciaMs
  }));

  return response.status(200).json({
    mensaje: respuesta.mensaje,
    opciones: respuesta.opciones,
    tarjeta: respuesta.tarjeta,
    eco: respuesta.eco,
    ajuste: respuesta.ajuste
  });
};
