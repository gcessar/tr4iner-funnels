// El punto que la Ruta consulta al entrar para retomar a quien el chat dejó sin su paso
// (11-nov-2026). El CRM se simula: se prueba qué se le pide, qué se devuelve y qué se guarda.
const test = require('node:test');
const assert = require('node:assert/strict');

process.env.GENESIS_CRM_API_URL = 'https://crm.test';
process.env.GENESIS_INTERNAL_SECRET = 'secreto-de-prueba';
delete process.env.VERCEL_ENV;
const retomar = require('../api/genesis/chat/retomar.js');

const TURNOS = [
  { conversacion: 'c1', at: new Date(Date.now() - 86400000).toISOString(), persona: 'Ganar músculo', equipo: 'Lo armamos contigo.\nSi ya quieres empezar, el coach revisa tu caso y te dice cómo seguir.', accion: 'ninguna', opciones: [], tarjeta: null, camino: 'alto_nuevo', bandera: null },
  { conversacion: 'c1', at: new Date(Date.now() - 86000000).toISOString(), persona: 'Si', equipo: 'Si ya quieres empezar, te armamos el siguiente paso.', accion: 'ninguna', opciones: [], tarjeta: null, camino: 'alto_nuevo', bandera: null }
];
const HECHOS = { agendo: false, whatsappAt: null, diagnosticoAt: null, cliente: false };
const SESION = { member: { email: 'ana@test.com', nombre: 'Ana Pérez', attribution: {} }, progress: [] };

function simular(crm) {
  const pedidos = [];
  global.fetch = async (url, init) => {
    const ruta = String(url).replace('https://crm.test/api/genesis/', '');
    pedidos.push({ ruta, method: init.method, body: init.body ? JSON.parse(init.body) : null });
    const r = crm(ruta, init.method);
    if (r instanceof Error) throw r;
    return { status: r.status || 200, text: async () => JSON.stringify(r.payload) };
  };
  return pedidos;
}

async function llamar(method, pais, body) {
  const salida = { headers: {} };
  const response = {
    setHeader: (k, v) => { salida.headers[k] = v; },
    status: (c) => { salida.status = c; return response; },
    json: (j) => { salida.json = j; return response; }
  };
  await retomar({ method, headers: { cookie: 'tr4_genesis_session=abc', 'x-vercel-ip-country': pais }, body: body || null }, response);
  return salida;
}

const crmCon = (turnos, hechos) => (ruta, method) => {
  if (ruta === 'chat-log?reciente=1') return { payload: { turnos, hechos } };
  if (ruta === 'session') return { payload: SESION };
  if (ruta === 'chat-log' && method === 'POST') return { payload: { ok: true } };
  return { status: 404, payload: {} };
};

test('quien nunca usó el chat: una sola consulta al CRM y nada que retomar', async () => {
  const pedidos = simular(crmCon([], null));
  const r = await llamar('GET', 'MX');
  assert.deepEqual(r.json, { retomar: null });
  assert.deepEqual(pedidos.map((p) => p.ruta), ['chat-log?reciente=1']);
  assert.equal(r.headers['Cache-Control'], 'private, no-store');
});

test('EE. UU.: le quedó el paso pendiente y al volver elige videollamada o WhatsApp; el GET no guarda nada', async () => {
  const pedidos = simular(crmCon(TURNOS, HECHOS));
  const r = await llamar('GET', 'US');
  assert.match(r.json.retomar.mensaje, /^Hola de nuevo, Ana\. La última vez nos dijiste que querías empezar/);
  assert.deepEqual(r.json.retomar.opciones, ['Sesión por videollamada', 'Por WhatsApp']);
  assert.equal(r.json.retomar.tarjeta, null);
  assert.ok(!pedidos.some((p) => p.method === 'POST'));
});

test('fuera de EE. UU. y Europa: al volver ve directo el WhatsApp del equipo', async () => {
  simular(crmCon(TURNOS, HECHOS));
  const r = await llamar('GET', 'CO');
  assert.equal(r.json.retomar.tarjeta.tipo, 'whatsapp');
  assert.match(r.json.retomar.tarjeta.url, /^https:\/\/(wa\.me|api\.whatsapp\.com)\//);
  assert.deepEqual(r.json.retomar.opciones, []);
});

test('al mostrarlo (POST) queda guardado como un turno del chat, en la conversación del navegador', async () => {
  const pedidos = simular(crmCon(TURNOS, HECHOS));
  const r = await llamar('POST', 'CO', { conversacion: 'abc-123<script>' });
  assert.equal(r.json.guardado, true);
  const guardado = pedidos.find((p) => p.ruta === 'chat-log' && p.method === 'POST').body;
  assert.equal(guardado.conversacion, 'abc-123script');
  assert.equal(guardado.mensajeUsuario, '[Volvió a su Ruta]');
  assert.equal(guardado.accion, 'retomar');
  assert.equal(guardado.mensajeEquipo, r.json.retomar.mensaje);
  assert.equal(guardado.tarjeta.tipo, 'whatsapp');
  assert.equal(guardado.calificacion.motivo, 'si_sin_paso');
  assert.equal(guardado.paisIp, 'CO');
});

test('no se retoma a quien ya agendó, ya es cliente, ya tocó el WhatsApp, o está en Cuba o Venezuela', async () => {
  for (const hechos of [{ ...HECHOS, agendo: true }, { ...HECHOS, cliente: true }, { ...HECHOS, whatsappAt: new Date().toISOString() }]) {
    simular(crmCon(TURNOS, hechos));
    assert.deepEqual((await llamar('GET', 'US')).json, { retomar: null });
  }
  const pedidos = simular(crmCon(TURNOS, HECHOS));
  assert.deepEqual((await llamar('GET', 'CU')).json, { retomar: null });
  assert.equal(pedidos.length, 0);
});

test('si el CRM falla, tarda o todavía no conoce la consulta, la Ruta sigue: nada que retomar', async () => {
  simular(() => new Error('timeout'));
  assert.deepEqual((await llamar('GET', 'US')).json, { retomar: null });
  // El CRM de antes de este cambio responde la memoria de siempre, sin `turnos`.
  simular(() => ({ payload: { historial: [] } }));
  assert.deepEqual((await llamar('GET', 'US')).json, { retomar: null });
  simular((ruta) => (ruta === 'session' ? { status: 401, payload: {} } : { payload: { turnos: TURNOS, hechos: HECHOS } }));
  assert.deepEqual((await llamar('GET', 'US')).json, { retomar: null });
  assert.equal((await llamar('DELETE', 'US')).status, 405);
});
