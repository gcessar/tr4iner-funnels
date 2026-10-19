const crypto = require('crypto');
const { forward } = require('../../../lib/genesis-proxy');
const ruta = require('../../../lib/ruta-chat');
const PROMPT = require('../../../lib/ruta-chat-prompt');
const LECCIONES = require('../../../lib/ruta-chat-lecciones');

// El agente corre en n8n («RUTA-CHAT · Equipo») porque ahí está la credencial de
// OpenAI. La memoria ya no: vive en el CRM (7-oct), junto al historial que ve el
// admin, y se le pasa al agente en cada pedido.
// Los previews apuntan a sus propios workflows (RUTA_CHAT_AGENTE_URL y
// RUTA_CHAT_HORARIOS_URL) para probar sin tocar el agente de producción.
const AGENTE_URL = process.env.RUTA_CHAT_AGENTE_URL || 'https://primary-production-0efa.up.railway.app/webhook/ruta-chat';
const HORARIOS_URL = process.env.RUTA_CHAT_HORARIOS_URL || 'https://primary-production-0efa.up.railway.app/webhook/ruta-chat-horarios';
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

// Horarios libres de la sesión, traídos de Calendly por n8n (ahí vive la
// conexión con Calendly). Si tarda o falla, la tarjeta igual sale con el
// calendario completo.
async function horariosLibres(secreto) {
  try {
    const r = await fetch(HORARIOS_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-ruta-chat-secret': secreto },
      body: '{}',
      signal: AbortSignal.timeout(6000)
    });
    if (!r.ok) throw new Error('horarios respondió ' + r.status);
    const d = await r.json();
    return Array.isArray(d.horarios) ? d.horarios : [];
  } catch (error) {
    console.error('[ruta-chat] sin horarios de Calendly:', error.message);
    return [];
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
    return ruta.TARJETAS.indexOf(e) !== -1;
  });
  const geo = ruta.geoDesde(request.headers);
  const mercado = ruta.mercadoPara(geo, body.eco || {});
  const zona = ruta.zonaValida(body.zona);
  const sistema = PROMPT + '\n\n' + ruta.contextoParaAgente(perfil, geo, mercado, mostrados, String(body.ajuste || '').slice(0, 600), zona, LECCIONES);

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
    const upstream = await fetch(AGENTE_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-ruta-chat-secret': secreto },
      body: JSON.stringify({ sesion: 'ruta:' + perfil.email + ':' + conversacion, sistema: sistema, mensaje: mensaje, historial: historial }),
      signal: AbortSignal.timeout(28000)
    });
    if (!upstream.ok) throw new Error('agente respondió ' + upstream.status);
    cruda = await upstream.json();
    if (Array.isArray(cruda)) cruda = cruda[0];
  } catch (error) {
    console.error('[ruta-chat] sin respuesta del agente:', error.message);
    const fallo = ruta.respuestaDeError(perfil);
    await guardarTurno(request, response, Object.assign({}, base, {
      mensajeEquipo: fallo.mensaje, tarjeta: fallo.tarjeta, error: true, latenciaMs: Date.now() - inicio
    }));
    return response.status(200).json(fallo);
  }
  const latenciaMs = Date.now() - inicio;

  const turno = { numero: Math.floor(historial.length / 2) + 1, ultima: String(body.ultima || '').slice(0, 30) || null };
  const respuesta = ruta.resolverRespuesta(cruda, perfil, geo, mostrados, mensaje, conversacion, turno);
  if (respuesta.tarjeta && respuesta.tarjeta.tipo === 'sesion') {
    ruta.completarSesion(respuesta.tarjeta, await horariosLibres(secreto), zona, perfil, conversacion);
    if (respuesta.tarjeta.sin_lugar_en_su_preferencia) respuesta.mensaje = ruta.mensajeSinLugar(respuesta.tarjeta, zona);
    const nota = ruta.ajusteDeSesion(respuesta.tarjeta);
    respuesta.ajuste = [respuesta.ajuste, nota].filter(Boolean).join(' ') || null;
  }
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
