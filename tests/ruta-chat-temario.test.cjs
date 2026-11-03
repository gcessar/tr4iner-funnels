// El agente del chat responde dudas de una lección con lo que dice el video (3-nov-2026):
// índice de la Ruta en cada turno y el texto literal de una lección sólo cuando preguntan.
const test = require('node:test');
const assert = require('node:assert/strict');

process.env.GENESIS_CRM_API_URL = 'https://crm.test';
process.env.GENESIS_INTERNAL_SECRET = 'interno';
process.env.RUTA_CHAT_SECRET = 'agente';
delete process.env.VERCEL_ENV;
delete process.env.RUTA_CHAT_AGENDA_REAL;

const temario = require('../lib/ruta-chat-temario.js');
const ruta = require('../lib/ruta-chat.js');
const chat = require('../api/genesis/chat');
const { DATOS } = temario;

const mujer = { sexo: 'Mujer', edad: 30, progreso: [] };
const hombre = { sexo: 'Hombre', edad: 30, progreso: [] };
const consultada = (mensaje, perfil, opciones) => {
  const o = opciones || {};
  const r = temario.leccionConsultada(mensaje, o.historial || [], perfil || mujer, o.abierta || null);
  return r && r.slug;
};

// ── Las transcripciones ──────────────────────────────────

test('las 14 lecciones publicadas tienen su texto y su línea en el índice', () => {
  const slugs = Object.keys(DATOS.lecciones);
  assert.equal(slugs.length, 14);
  assert.deepEqual(Object.keys(temario.RESUMEN).sort(), slugs.slice().sort());
  for (const slug of slugs) {
    for (const [carpeta, v] of Object.entries(DATOS.lecciones[slug].versiones)) {
      assert.match(carpeta, /^lecciones\/[a-z0-9-]+$/);
      assert.ok(DATOS.textos[v.texto] && DATOS.textos[v.texto].length > 500, carpeta);
    }
  }
});

// Un texto cortado o un bucle de Whisper cambian el ritmo: alguien hablando dice de 150 a
// 220 palabras por minuto. Medido el 3-nov: entre 171 y 205 en las 50 versiones.
test('ninguna transcripción quedó cortada ni repetida', () => {
  for (const l of Object.values(DATOS.lecciones)) {
    for (const [carpeta, v] of Object.entries(l.versiones)) {
      const porMinuto = DATOS.textos[v.texto].split(/\s+/).length / (v.segundos / 60);
      assert.ok(porMinuto > 150 && porMinuto < 220, carpeta + ': ' + Math.round(porMinuto) + ' palabras por minuto');
    }
  }
});

test('la marca está bien escrita (Whisper la oye como «trainer»)', () => {
  const todo = Object.values(DATOS.textos).join('\n');
  assert.doesNotMatch(todo, /\btrainer\b|\btrader\b|\bAnthony\b/i);
  assert.match(todo, /Ruta Tr4iner/);
});

// ── Qué lección consulta ─────────────────────────────────

test('la nombra por el título: esa lección, en la versión de su sexo', () => {
  assert.equal(consultada('No entendí lo del lunes empiezo, ¿me explicas?'), 'ruta-lunes-empiezo');
  assert.equal(consultada('¿Qué es la sobrecarga progresiva?', mujer), 'ruta-sobrecarga-mujeres');
  assert.equal(consultada('¿Qué es la sobrecarga progresiva?', hombre), 'ruta-sobrecarga');
  assert.equal(consultada('¿Puedo entrenar con el ciclo menstrual?', mujer), 'ruta-ciclo-menstrual');
  assert.equal(consultada('¿Puedo entrenar estando con la regla?', mujer), 'ruta-ciclo-menstrual');
  assert.equal(consultada('¿Cada cuánto la comida libre?', hombre), 'ruta-comidas');
});

test('hablar de su vida no es preguntar por una lección', () => {
  for (const m of ['Hola, quiero bajar de peso', 'Me cuesta mucho ser constante con la dieta', 'Tengo 42 años y trabajo de noche', 'Quiero una rutina para casa']) {
    assert.equal(consultada(m, mujer, { abierta: { slug: 'ruta-dieta', carpeta: null } }), null, m);
  }
});

test('un tema más una referencia al video sí apunta a la lección', () => {
  assert.equal(consultada('En el video de la constancia Anthoni habla de un horario de respaldo, ¿cómo sería?'), 'ruta-constancia');
  assert.equal(consultada('En la clase dijo que el cuerpo responde al promedio, ¿y si salgo el fin de semana?'), 'ruta-lunes-empiezo');
});

test('«¿qué quiso decir en el video?» sin decir cuál: la que abrió por última vez', () => {
  const abierta = { slug: 'ruta-pilares', carpeta: null };
  assert.equal(consultada('¿Qué quiso decir Anthoni en el video con que las últimas tienen que costar?', mujer, { abierta }), 'ruta-pilares');
  assert.equal(consultada('¿Qué quiso decir en el video?', mujer), null);
});

test('la repregunta sigue con la lección del mensaje anterior', () => {
  const historial = [{ rol: 'persona', texto: '¿Qué es eso de la dieta fantasma?' }, { rol: 'equipo', texto: 'En el video Anthoni explica…' }];
  const r = temario.leccionConsultada('¿Y eso cómo lo aplico en mi caso?', historial, mujer, null);
  assert.deepEqual(r, { slug: 'ruta-dieta', motivo: 'anterior' });
});

test('una lección que no es de su sexo no se usa', () => {
  assert.equal(consultada('¿Qué dice el video del ciclo menstrual?', hombre), null);
});

test('la lección del navegador sólo vale si existe y su video es de esa lección', () => {
  const base = 'https://video.mediatr4iner.com/lecciones/si-haces-dieta--mujer-36-mas--3c6e9bc5/';
  assert.deepEqual(temario.leccionDelNavegador({ slug: 'ruta-dieta', video: base }), { slug: 'ruta-dieta', carpeta: 'lecciones/si-haces-dieta--mujer-36-mas--3c6e9bc5' });
  assert.deepEqual(temario.leccionDelNavegador({ slug: 'ruta-pilares', video: base }), { slug: 'ruta-pilares', carpeta: null });
  assert.equal(temario.leccionDelNavegador({ slug: 'ruta-otra', video: base }), null);
  assert.equal(temario.leccionDelNavegador({ slug: 'ruta-dieta', video: 'https://otro.com/x/' }).carpeta, null);
  assert.equal(temario.leccionDelNavegador('ruta-dieta'), null);
});

// ── Qué versión ve ───────────────────────────────────────

test('la versión que ve: su sexo, su edad o sus días; la que abrió manda', () => {
  assert.equal(temario.versionPara('ruta-dieta', { sexo: 'Mujer', edad: 41 }), 'lecciones/si-haces-dieta--mujer-36-mas--3c6e9bc5');
  assert.equal(temario.versionPara('ruta-dieta', { sexo: 'Hombre' }), 'lecciones/si-haces-dieta--hombre-26-35--772bb8d1');
  assert.equal(temario.versionPara('ruta-rutina-intro', { sexo: 'Hombre', dias_entrenamiento: 5 }), 'lecciones/tu-rutina--hombre-5-dias--f9232357');
  assert.equal(temario.versionPara('ruta-rutina-intro', { sexo: 'Mujer' }), 'lecciones/tu-rutina--mujer-3-dias--9934c438');
  assert.equal(temario.versionPara('ruta-constancia', {}), 'lecciones/constancia--hombre--116255bb');
  assert.equal(temario.versionPara('ruta-dieta', { sexo: 'Mujer', edad: 41 }, { slug: 'ruta-dieta', carpeta: 'lecciones/si-haces-dieta--mujer-18-25--63eadcf5' }), 'lecciones/si-haces-dieta--mujer-18-25--63eadcf5');
});

// ── TU RUTA ──────────────────────────────────────────────

test('el índice muestra sólo sus lecciones y cuáles ya vio', () => {
  const t = temario.temarioPara({ sexo: 'Mujer', edad: 30, dias_entrenamiento: 4, progreso: [{ videoId: 'iv038ZlizMs', completed: true }, { videoId: 'HT31HA-hwVI', completed: false, maxPercent: 40 }] });
  assert.match(t, /«EMPIEZA AQUÍ» \(vista\)/);
  assert.match(t, /«Si haces dieta y no pierdes grasa, mira esto» \(empezada\)/);
  assert.match(t, /«Tu Rutina de 4 días por semana» \(sin ver\)/);
  assert.match(t, /Ciclo Menstrual/);
  assert.match(t, /Las mujeres que entrenan así/);
  assert.doesNotMatch(t, /Los hombres que entrenan así/);
  assert.doesNotMatch(t, /cerca de tus 40/); // es sólo para mayores de 36
  const h = temario.temarioPara({ sexo: 'Hombre', progreso: [] });
  assert.doesNotMatch(h, /Ciclo Menstrual/);
  assert.match(h, /cerca de tus 40 o tienes más, urgente mira esto» \(sin ver, sólo para mayores de 36\)/);
});

// El índice va en cada turno: que no se vuelva un segundo prompt.
test('el índice es corto y el texto literal sólo llega cuando preguntan', () => {
  assert.ok(temario.temarioPara(mujer).length < 4000);
  const perfil = Object.assign({ nombre: 'Ana', orientaciones_completadas: 1, orientaciones_empezadas: 1 }, mujer);
  const geo = { pais: 'PE', ciudad: 'Lima' };
  const sin = ruta.contextoParaAgente(perfil, geo, 'latam', [], null, 'America/Lima', '', null, null);
  assert.match(sin, /TU RUTA/);
  assert.doesNotMatch(sin, /LECCIÓN QUE CONSULTA: «/);
  const consulta = temario.consultaPara({ slug: 'ruta-lunes-empiezo', motivo: 'mensaje' }, perfil, null);
  const con = ruta.contextoParaAgente(perfil, geo, 'latam', [], null, 'America/Lima', '', null, consulta);
  const literal = DATOS.textos[DATOS.lecciones['ruta-lunes-empiezo'].versiones['lecciones/lunes-empiezo--mujer-26-35--3d5ed74a'].texto];
  assert.ok(con.includes(literal), 'el texto del video llega entero y sin tocar');
  assert.match(con, /LECCIÓN QUE CONSULTA: «Si dices siempre ‘El lunes empiezo’ mira esto»/);
});

// ── De punta a punta ─────────────────────────────────────

function simular(historial) {
  const llamadas = { agente: null, turnos: [] };
  global.fetch = async (url, init = {}) => {
    const responder = (status, body) => ({ ok: status < 400, status, text: async () => JSON.stringify(body), json: async () => body });
    if (url === 'https://crm.test/api/genesis/session') {
      return responder(200, { member: { email: 'ana@x.com', nombre: 'Ana Pérez', sexo: 'Mujer', trainingDays: 3, plan: { edad: 44 } }, progress: [{ videoId: 'iv038ZlizMs', completed: true }], attribution: {} });
    }
    if (url.startsWith('https://crm.test/api/genesis/chat-log?')) return responder(200, { historial: historial || [] });
    if (url === 'https://crm.test/api/genesis/chat-log') { llamadas.turnos.push(JSON.parse(init.body)); return responder(200, { ok: true }); }
    if (url.endsWith('/webhook/ruta-chat')) { llamadas.agente = JSON.parse(init.body); return responder(200, { mensaje: 'En el video Anthoni explica que el cuerpo responde al promedio de tus días.', accion: 'ninguna', calificacion: {} }); }
    throw new Error('URL inesperada ' + url);
  };
  return llamadas;
}
function pedir(mensaje, extra) {
  const res = { code: 0, body: null, headers: {}, status(c) { this.code = c; return this; }, json(b) { this.body = b; return this; }, setHeader(k, v) { this.headers[k] = v; } };
  const req = { method: 'POST', body: Object.assign({ mensaje, conversacion: 'principal', zona: 'America/Lima' }, extra || {}), headers: { cookie: 'tr4_genesis_session=abc' } };
  return { req, res };
}

test('pregunta por una lección: el agente recibe lo que dice su versión del video', async () => {
  const llamadas = simular();
  const { req, res } = pedir('¿Por qué Anthoni dice que el lunes empiezo es una trampa?');
  await chat(req, res);
  assert.equal(res.code, 200);
  // Mujer de 44 años (por su test de macros): la versión de 36 en adelante.
  const literal = DATOS.textos[DATOS.lecciones['ruta-lunes-empiezo'].versiones['lecciones/lunes-empiezo--mujer-36-mas--a395b529'].texto];
  assert.ok(llamadas.agente.sistema.includes(literal));
  assert.match(llamadas.agente.sistema, /«EMPIEZA AQUÍ» \(vista\)/);
  assert.equal(llamadas.turnos.length, 1);
});

test('un saludo no carga ninguna lección', async () => {
  const llamadas = simular();
  const { req, res } = pedir('Hola, quiero bajar grasa');
  await chat(req, res);
  assert.equal(res.code, 200);
  assert.match(llamadas.agente.sistema, /TU RUTA/);
  assert.doesNotMatch(llamadas.agente.sistema, /LECCIÓN QUE CONSULTA: «/);
});

test('sin decir cuál, usa la lección que el navegador dice que abrió', async () => {
  const llamadas = simular();
  const { req } = pedir('No entendí una parte del video, ¿me la explicas?', {
    leccion: { slug: 'ruta-pilares', video: 'https://video.mediatr4iner.com/lecciones/los-3-pilares--mujer--a699203f/' }
  });
  await chat(req, pedir('').res);
  assert.match(llamadas.agente.sistema, /LECCIÓN QUE CONSULTA: «Mira esto ANTES de llevar a cabo tu rutina»/);
  assert.ok(llamadas.agente.sistema.includes(DATOS.textos[DATOS.lecciones['ruta-pilares'].versiones['lecciones/los-3-pilares--mujer--a699203f'].texto]));
});
