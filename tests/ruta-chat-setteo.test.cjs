// Reglas del servidor para el setteo del chat de la Ruta (3-nov-2026): WhatsApp
// válido, la sesión nunca como «gratis» y el WhatsApp de Anthoni o de Veronika según el
// registro. 6-nov: ningún monto, el aviso de la sesión antes de los horarios y sin muletillas.
const test = require('node:test');
const assert = require('node:assert/strict');
const ruta = require('../lib/ruta-chat.js');

// Con 2 lecciones completas ya avanzó: fuera de un mercado alto queda «calificado» y puede ver horarios (6-nov).
const perfil = { email: 'x@y.com', nombre: 'Ana', atribucion: {}, orientaciones_completadas: 2, orientaciones_empezadas: 2 };
const geoUY = { pais: 'UY', ciudad: 'Montevideo' };
const geoUS = { pais: 'US', ciudad: 'Miami' };
const horarios = [{ id: 'h1', inicio: '2026-11-04T17:00:00Z', etiqueta: 'Mié 4 · 12:00', larga: 'miércoles, 4 de noviembre, 12:00' }];

function responder(cruda, persona, opciones) {
  const o = opciones || {};
  return ruta.resolverRespuesta(cruda, o.perfil || perfil, o.geo || geoUY, [], persona, 'c1', { numero: 3, mercado: o.mercado || 'latam' }, o.eco || {});
}

test('el WhatsApp de Uruguay sin código ni +: se completa sin el 0 de larga distancia', () => {
  assert.deepEqual(ruta.validarWhatsapp('091099271', 'UY'), { numero: '+59891099271', estado: 'ok' });
});

test('un «+» que no arranca con un código de país real no es un WhatsApp', () => {
  assert.equal(ruta.validarWhatsapp('+091099271', 'UY').estado, 'invalido');
  assert.equal(ruta.validarWhatsapp('+51 987 214 563', 'PE').numero, '+51987214563');
  assert.equal(ruta.validarWhatsapp('+51 912 345 678', 'PE').estado, 'falso'); // el ejemplo copiado tal cual
  assert.equal(ruta.validarWhatsapp('0051987214563', 'MX').numero, '+51987214563');
});

test('los números inventados se reconocen y los reales no', () => {
  for (const falso of ['999999999', '123456789', '+52 1234567890', '12121212', '000000000', '987654321']) {
    assert.equal(ruta.validarWhatsapp(falso, 'MX').estado, 'falso', falso);
  }
  for (const real of ['+52 55 4821 9037', '+1 305 782 4419', '+34 612 905 377', '3005821947']) {
    assert.equal(ruta.validarWhatsapp(real, 'CO').estado, 'ok', real);
  }
});

test('un número inventado al agendar: no se agenda y se pide de nuevo con humor', () => {
  const r = responder({ mensaje: 'Listo', accion: 'agendar', horario: 'h1', whatsapp: '+1234567890', calificacion: {} }, '1234567890',
    { eco: { horarios, horario_elegido: 'h1' } });
  assert.equal(r.pendiente, null);
  assert.equal(r.eco.whatsapp, null);
  assert.match(r.mensaje, /código de país/);
  assert.match(r.ajuste, /falso/);
});

test('el número que escribió la persona manda sobre el que armó el agente', () => {
  const r = responder({ mensaje: 'Listo', accion: 'agendar', horario: 'h1', whatsapp: '+091099271', calificacion: {} }, '091099271',
    { eco: { horarios, horario_elegido: 'h1' } });
  assert.equal(r.pendiente.tipo, 'agendar');
  assert.equal(r.pendiente.whatsapp, '+59891099271');
});

test('una fecha o unas medidas no se toman como WhatsApp si no se lo pidieron', () => {
  const r = responder({ mensaje: 'Perfecto, eso nos ayuda mucho.', accion: 'ninguna', calificacion: {} }, 'Peso 80 y empecé el 03-11-2026');
  assert.equal(r.mensaje, 'Perfecto, eso nos ayuda mucho.');
});

test('la sesión no se vende como gratis: se saca la frase y las respuestas rápidas', () => {
  const r = responder({ mensaje: 'Sí, la sesión es gratuita y dura 30 minutos.\n¿Qué día te acomoda?', opciones: ['Sesión gratis', 'Quiero empezar', 'Tengo una duda'], accion: 'ninguna', calificacion: {} }, '¿Es gratis?');
  assert.doesNotMatch(r.mensaje, /gratu|gratis/i);
  assert.match(r.mensaje, /qué día/i);
  // Sacar las dos dejaba sola «Tengo una duda»: con una sola no van botones (6-nov).
  assert.deepEqual(r.opciones, []);
});

test('ningún monto llega a la persona, en ningún país: tampoco el «desde US$100» (6-nov)', () => {
  for (const mercado of ['latam', 'alto']) {
    const r = responder({ mensaje: 'Puedes empezar desde US$100 y el plan se arma según tu caso.', accion: 'ninguna', calificacion: {} }, '¿Cuánto cuesta?', { mercado });
    assert.doesNotMatch(r.mensaje, /US\$|100/);
    assert.match(r.mensaje, /3 meses como mínimo/);
    assert.match(r.ajuste, /no se dan montos/);
  }
  const otro = responder({ mensaje: 'El plan de 3 meses sale US$397.', accion: 'ninguna', calificacion: {} }, '¿Cuánto cuesta?');
  assert.doesNotMatch(otro.mensaje, /397/);
});

test('Lima y Cuba ya no cuentan como mercado alto; EE. UU. sí', () => {
  assert.equal(ruta.mercadoPara({ pais: 'PE', ciudad: 'Lima' }, {}), 'latam');
  assert.equal(ruta.mercadoPara({ pais: 'CU', ciudad: 'La Habana' }, {}), 'latam');
  assert.equal(ruta.mercadoPara(geoUS, {}), 'alto');
});

test('el WhatsApp sale del lado en que se registró: Veronika con el marcador VA', () => {
  const va = responder({ mensaje: 'Te paso con un coach.', accion: 'pasar_a_whatsapp', resumen_whatsapp: 'Quiero empezar', calificacion: {} }, 'Prefiero WhatsApp',
    { perfil: Object.assign({}, perfil, { atribucion: { utm_source: 'STORIES-VA', utm_campaign: 'CASOS-VA' } }) });
  assert.match(va.tarjeta.url, /phone=15677024560/);
  assert.match(va.tarjeta.resumen, /respóndelas todas/);
  const an = responder({ mensaje: 'Te paso con un coach.', accion: 'pasar_a_whatsapp', calificacion: {} }, 'Prefiero WhatsApp');
  assert.match(an.tarjeta.url, /phone=17439014239/);
});

test('el IMC sale de peso y altura del test, y no se inventa sin ellos', () => {
  assert.deepEqual(ruta.imcDe({ peso: 82, altura: 160 }), { valor: 32, rango: 'obesidad' });
  assert.equal(ruta.imcDe({ peso: null, altura: 160 }), null);
});

test('el contexto no trae montos ni el mercado, y sí los 3 meses como mínimo', () => {
  for (const [geo, mercado] of [[geoUY, 'latam'], [geoUS, 'alto']]) {
    const ctx = ruta.contextoParaAgente(perfil, geo, mercado, [], null, 'America/Montevideo', '', ruta.ecoValido(null));
    assert.doesNotMatch(ctx, /precio_desde|US\$|"mercado"|latam/);
    assert.match(ctx, /3 meses como mínimo; ninguno es mensual/);
    assert.match(ctx, /30 a 40 minutos/);
    assert.match(ctx, /OFERTA VIGENTE: ninguna/);
    assert.match(ctx, /"ya_leyo_el_aviso_de_la_sesion":false/);
  }
});

// ── Aviso de la sesión (6-nov) ──────────────────────────────────────────────
const libres = [{ inicio: '2026-11-06T15:00:00Z' }, { inicio: '2026-11-06T20:00:00Z' }];
// Los horarios son sólo para los mercados altos (6-nov): estas pruebas son desde EE. UU.
function horariosCon(cruda, persona, opciones) {
  opciones = Object.assign({ geo: geoUS, mercado: 'alto' }, opciones);
  const r = responder(cruda, persona, opciones);
  return ruta.completarHorarios(r, (opciones && opciones.libres) || libres, 'America/Lima', (opciones && opciones.perfil) || perfil, 'c1', false);
}

test('la primera vez que ve horarios lee el aviso entero, con la línea de su caso arriba', () => {
  const r = horariosCon({ mensaje: 'Tiene sentido.\nLo de comer a deshora por el estrés de la casa es lo primero que el coach ordena contigo.\nTe dejo los horarios 👇 ¿cuál te queda mejor?', accion: 'proponer_horarios', calificacion: {} }, 'Sí, quiero empezar');
  const lineas = r.mensaje.split('\n');
  assert.equal(lineas[0], 'Lo de comer a deshora por el estrés de la casa es lo primero que el coach ordena contigo.');
  for (const linea of ruta.AVISO_SESION) assert.ok(lineas.includes(linea), linea);
  assert.match(r.mensaje, /no tiene costo y dura entre 30 y 40 minutos/);
  assert.match(r.mensaje, /profundiza contigo en nuestra metodología, para que decidas con toda la información/);
  assert.match(r.mensaje, /intención de inscribirse al programa, que sí es pagado/);
  assert.match(r.mensaje, /3 meses como mínimo, ninguno mensual/);
  assert.match(r.mensaje, /pareja, pueden conectarse los dos/);
  assert.equal(lineas[lineas.length - 1], '¿Qué te parece? Si estás pensando en inscribirte, elige el horario que te quede mejor 👇');
  assert.doesNotMatch(r.mensaje, /Tiene sentido|cuál te queda/);
  assert.equal(r.eco.aviso, true);
  assert.equal(r.opciones.length, 2);
  assert.match(r.ajuste, /leyó el aviso de la sesión/);
});

test('el cierre del aviso ata el horario a inscribirse, igual para todos', () => {
  for (const sexo of ['Mujer', 'Hombre', null]) {
    const r = horariosCon({ mensaje: '', accion: 'proponer_horarios', calificacion: {} }, 'Sí', { perfil: Object.assign({}, perfil, { sexo }) });
    assert.match(r.mensaje, /Si estás pensando en inscribirte, elige el horario que te quede mejor/);
  }
});

test('con el aviso ya leído no se repite: van sólo los horarios', () => {
  const r = horariosCon({ mensaje: 'Te dejo los horarios más próximos 👇', accion: 'proponer_horarios', calificacion: {} }, 'Otro día', { eco: { aviso: true } });
  assert.doesNotMatch(r.mensaje, /no tiene costo|como mínimo/);
  assert.equal(r.mensaje, 'Te dejo los horarios más próximos 👇');
  assert.equal(r.eco.aviso, true);
});

test('el aviso sale igual aunque no haya lugar en el momento que pidió o no haya horarios', () => {
  const sinLugar = horariosCon({ mensaje: '', accion: 'proponer_horarios', preferencia_horario: { fecha: '2026-11-06', franja: 'noche' }, calificacion: {} }, 'De noche');
  assert.match(sinLugar.mensaje, /como mínimo, ninguno mensual/);
  assert.match(sinLugar.mensaje, /No nos quedan horarios/);
  assert.doesNotMatch(sinLugar.mensaje, /elige el horario que te quede mejor/);
  const vacio = horariosCon({ mensaje: '', accion: 'proponer_horarios', calificacion: {} }, 'Sí', { libres: [] });
  assert.match(vacio.mensaje, /como mínimo, ninguno mensual/);
  assert.match(vacio.mensaje, /Te dejo el calendario del equipo/);
  assert.equal(vacio.tarjeta.destino, 'calendly');
});

test('del mensaje del agente no pasa lo que repite el aviso, una hora prometida ni una pregunta', () => {
  const r = horariosCon({ mensaje: 'La sesión no tiene costo y es de 30 minutos.\nTenemos el jueves a las 19:00.\n¿Te queda bien?', accion: 'proponer_horarios', calificacion: {} }, 'Sí');
  assert.equal(r.mensaje.split('\n')[0], ruta.AVISO_SESION[0]);
  assert.doesNotMatch(r.mensaje, /19:00|30 minutos|Te queda bien/);
});

test('el aviso cuenta como leído si está en la memoria del CRM', () => {
  assert.equal(ruta.avisoEnHistorial([{ rol: 'equipo', texto: ruta.AVISO_SESION.join('\n') }]), true);
  assert.equal(ruta.avisoEnHistorial([{ rol: 'persona', texto: 'como mínimo, ninguno mensual' }, { rol: 'equipo', texto: 'Hola' }]), false);
  const r = ruta.resolverRespuesta({ mensaje: 'Te dejo los horarios 👇', accion: 'proponer_horarios', calificacion: {} }, perfil, geoUS, [], 'Sí', 'c1', { numero: 6, mercado: 'alto', aviso: true }, {});
  assert.equal(r.pendiente.tipo, 'horarios');
  assert.equal(r.aviso, null);
});

// ── Muletillas (6-nov: «evita las respuestas con patrones de redundancia así como "tiene sentido"») ──
test('la muletilla del arranque se saca y el resto queda igual', () => {
  const casos = [
    ['Tiene sentido 💪\nPara bajar grasa, lo que más suele trabar es sostenerlo.', 'Para bajar grasa, lo que más suele trabar es sostenerlo.'],
    ['Te entiendo, ahí suele estar el freno más grande.', 'Ahí suele estar el freno más grande.'],
    ['Gracias, Lore 🙌 Eso nos ayuda mucho.\n\nPor lo que nos cuentas, ya tienes el tiempo.', 'Por lo que nos cuentas, ya tienes el tiempo.'],
    ['Perfecto, Jossi.\nPara ganar músculo de verdad hace falta un plan.', 'Para ganar músculo de verdad hace falta un plan.'],
    ['Eso explica mucho: estás intentando adivinar con la comida.', 'Estás intentando adivinar con la comida.'],
    ['¡Perfecto! Te armamos la rutina según tu tiempo.', 'Te armamos la rutina según tu tiempo.']
  ];
  for (const [entrada, salida] of casos) assert.equal(ruta.sinMuletilla(entrada).mensaje, salida, entrada);
});

test('lo que no es muletilla no se toca, y una muletilla sola tampoco', () => {
  for (const texto_ of ['Entiendo que quieras empezar ya, y se puede.', 'Sí, la sesión es por videollamada.', 'Gracias a ti por escribirnos.', 'Perfecto 🙌', 'Eso dice mucho de tu constancia.']) {
    assert.equal(ruta.sinMuletilla(texto_).mensaje, texto_, texto_);
  }
});

test('la muletilla sacada vuelve como nota para el turno siguiente', () => {
  const r = responder({ mensaje: 'Tiene sentido.\nLos antojos de la tarde suelen venir de llegar con hambre.\n¿Qué comes al mediodía?', accion: 'ninguna', calificacion: {} }, 'En la tarde');
  assert.match(r.mensaje, /^Los antojos de la tarde/);
  assert.match(r.ajuste, /Se sacó «Tiene sentido»/);
});

test('las preguntas que ya hizo llegan al agente para que no las repita', () => {
  const historial = [
    { rol: 'persona', texto: 'Bajar grasa' },
    { rol: 'equipo', texto: 'Para bajar grasa hay que sostenerlo.\n¿Qué es lo que más te cuesta hoy: la comida, el entrenamiento o la constancia?' },
    { rol: 'persona', texto: 'La comida' },
    { rol: 'equipo', texto: 'Te dejo el video 👇' }
  ];
  const preguntas = ruta.preguntasHechas(historial);
  assert.deepEqual(preguntas, ['¿Qué es lo que más te cuesta hoy: la comida, el entrenamiento o la constancia?']);
  const ctx = ruta.contextoParaAgente(perfil, geoUY, 'latam', [], null, 'America/Lima', '', ruta.ecoValido(null), null, preguntas);
  assert.match(ctx, /PREGUNTAS QUE YA LE HICISTE[^\n]*\n- ¿Qué es lo que más te cuesta hoy/);
});

test('la derivación a una línea de ayuda gratuita nunca se borra (crisis)', () => {
  const r = responder({ mensaje: 'Lo siento mucho por lo que estás pasando.\nPor favor llama hoy a una línea de ayuda gratuita o habla con alguien de confianza.', accion: 'ninguna', calificacion: {} }, 'todavía me siento mal');
  assert.match(r.mensaje, /línea de ayuda gratuita/);
  assert.doesNotMatch(r.mensaje, /3 meses/);
});

test('que la Ruta y sus videos son gratis se puede decir; la sesión gratis no', () => {
  const r = responder({ mensaje: 'Tu Ruta es gratuita y ya tiene orientaciones para empezar.\nLa sesión con el coach es gratis.', accion: 'ninguna', calificacion: {} }, 'hola');
  assert.match(r.mensaje, /Ruta es gratuita/);
  assert.doesNotMatch(r.mensaje, /sesión con el coach es gratis/);
});

// ── 6-nov (tarde): un chat preguntó dos veces si era gratis y recibió lo mismo ─────────────
test('si vuelve a preguntar por el costo y el agente repite su respuesta, sale la versión corta y directa', () => {
  const anterior = 'La sesión no tiene costo; el programa sí.\n¿Estás pensando en inscribirte?';
  const r = ruta.resolverRespuesta({ mensaje: anterior, accion: 'ninguna', opciones: ['Sí'], calificacion: {} }, perfil, geoUY, [], 'Es gratis?', 'c1',
    { numero: 5, mercado: 'latam', anteriores: ['Hola', anterior] }, {});
  assert.equal(r.mensaje, ruta.MENSAJE_COSTO_OTRA_VEZ);
  assert.deepEqual(r.opciones, []);
  assert.equal(r.repetido, true);
  assert.match(r.ajuste, /Ibas a repetir/);
  // Si la versión corta también ya la leyó, no se le repite a ella tampoco: queda el aviso al agente.
  const otra = ruta.resolverRespuesta({ mensaje: ruta.MENSAJE_COSTO_OTRA_VEZ, accion: 'ninguna', calificacion: {} }, perfil, geoUY, [], '¿Es gratis?', 'c1',
    { numero: 7, mercado: 'latam', anteriores: [anterior, ruta.MENSAJE_COSTO_OTRA_VEZ] }, {});
  assert.match(otra.ajuste, /repitió palabra por palabra/);
});

test('un mensaje distinto no cuenta como repetido aunque hable de lo mismo', () => {
  const r = ruta.resolverRespuesta({ mensaje: 'La sesión no se cobra y el programa sí, de 3 meses como mínimo.\n¿Lo estás pensando?', accion: 'ninguna', calificacion: {} }, perfil, geoUY, [], 'Es gratis?', 'c1',
    { numero: 5, mercado: 'latam', anteriores: ['La sesión no tiene costo; el programa sí.\n¿Estás pensando en inscribirte?'] }, {});
  assert.equal(r.repetido, false);
  assert.doesNotMatch(r.mensaje, /Te lo digo directo/);
});

test('la segunda pregunta por el costo llega al agente con su nota', () => {
  const historial = [{ rol: 'persona', texto: 'Es gratis?' }, { rol: 'equipo', texto: 'La sesión no tiene costo…' }];
  assert.match(ruta.notaDelTurno('Es gratis?', historial), /Ya había preguntado por el costo/);
  assert.equal(ruta.notaDelTurno('Es gratis?', [{ rol: 'persona', texto: 'Bajar grasa' }]), '');
  assert.equal(ruta.notaDelTurno('Tengo 4 días', historial), '');
  const ctx = ruta.contextoParaAgente(perfil, geoUY, 'latam', [], null, 'America/Lima', '', ruta.ecoValido(null), null, [], ruta.notaDelTurno('Es gratis?', historial));
  assert.match(ctx, /SOBRE ESTE MENSAJE: Ya había preguntado por el costo/);
});

test('la pregunta de si quiere inscribirse va sin botones', () => {
  const r = responder({ mensaje: 'La culpa después de picar te está frenando.\n¿Estás pensando en inscribirte a un programa con un coach en estos días, o por ahora prefieres avanzar con tu Ruta?', opciones: ['Empezar con coach', 'Seguir en mi Ruta'], accion: 'ninguna', calificacion: {} }, 'Me da culpa');
  assert.deepEqual(r.opciones, []);
  assert.match(r.ajuste, /lo contesta escribiendo/);
});

test('si al sacar un botón prohibido queda uno solo, no queda ninguno', () => {
  const r = responder({ mensaje: 'La constancia se rompe cuando el plan no encaja.\n¿Cómo lo quieres trabajar?', opciones: ['Quiero empezar', 'Seguir con mi Ruta'], accion: 'ninguna', calificacion: {} }, 'La constancia');
  assert.deepEqual(r.opciones, []);
});

test('al agente se le corrige «su Ruta» por «tu Ruta»', () => {
  const r = responder({ mensaje: 'Su Ruta ya tiene orientaciones para empezar.\nSi más adelante quieres, aquí seguimos con su Ruta.', accion: 'ninguna', calificacion: {} }, 'No');
  assert.equal(r.mensaje, 'Tu Ruta ya tiene orientaciones para empezar.\nSi más adelante quieres, aquí seguimos con tu Ruta.');
});

// ── Camino comercial (6-nov, calibrado con las compras de la Ruta) ─────────────────────────
const nuevo = { email: 'n@y.com', nombre: 'Lu', atribucion: {}, orientaciones_completadas: 0, orientaciones_empezadas: 0 };
const conTest = Object.assign({}, nuevo, { hizo_test: true });

test('el camino sale del país y de lo que ya hizo en su Ruta', () => {
  assert.equal(ruta.caminoPara(conTest, geoUS, {}).id, 'prioridad');
  assert.equal(ruta.caminoPara(perfil, { pais: 'ES' }, {}).id, 'prioridad');
  assert.equal(ruta.caminoPara(nuevo, geoUS, {}).id, 'alto_nuevo');
  assert.equal(ruta.caminoPara(perfil, geoUY, {}).id, 'calificado');
  assert.equal(ruta.caminoPara(conTest, { pais: 'PE' }, {}).id, 'calificado');
  // Sólo los mercados altos van a sesión.
  assert.equal(ruta.caminoPara(conTest, geoUS, {}).sesion, true);
  assert.equal(ruta.caminoPara(nuevo, geoUS, {}).sesion, true);
  assert.equal(ruta.caminoPara(perfil, geoUY, {}).sesion, false);
  assert.equal(ruta.caminoPara(nuevo, { pais: 'MX' }, {}).sesion, false);
  assert.equal(ruta.caminoPara(nuevo, { pais: 'MX' }, {}).id, 'nutrir');
  assert.equal(ruta.caminoPara(Object.assign({}, nuevo, { orientaciones_completadas: 1 }), { pais: 'CO' }, {}).id, 'nutrir');
  assert.equal(ruta.caminoPara(conTest, { pais: 'CU' }, {}).id, 'whatsapp');
  assert.equal(ruta.caminoPara(perfil, { pais: 'PE' }, { pais: 'VE' }).id, 'whatsapp');
  // Lo que declara sólo suma para el mercado alto (como mercadoPara).
  assert.equal(ruta.caminoPara(conTest, { pais: 'PE' }, { pais: 'US' }).id, 'prioridad');
});

test('el botón del chat se oculta sólo por la IP de Cuba o Venezuela', () => {
  assert.equal(ruta.chatDisponiblePara({ pais: 'CU' }), false);
  assert.equal(ruta.chatDisponiblePara({ pais: 've' }), false);
  for (const pais of ['PE', 'US', 'MX', '']) assert.equal(ruta.chatDisponiblePara({ pais }), true, pais);
});

test('a quien no va a sesión, los horarios que pide el agente se cambian por WhatsApp', () => {
  // Decisión del usuario (6-nov): fuera de los mercados altos, aunque haya avanzado, WhatsApp.
  for (const [p, geo] of [[nuevo, { pais: 'MX' }], [conTest, { pais: 'CU' }], [perfil, geoUY], [conTest, { pais: 'PE' }]]) {
    const r = ruta.resolverRespuesta({ mensaje: 'Te dejo los horarios 👇', accion: 'proponer_horarios', resumen_caso: 'Quiero bajar grasa', calificacion: {} }, p, geo, [], 'Quiero empezar', 'c1', { numero: 4, mercado: 'latam' }, {});
    assert.equal(r.pendiente, null);
    assert.equal(r.tarjeta.tipo, 'whatsapp');
    assert.equal(r.mensaje, ruta.MENSAJE_WHATSAPP_CAMINO);
    assert.equal(r.registro.accion, 'pasar_a_whatsapp');
    assert.ok(['nutrir', 'whatsapp', 'calificado'].includes(r.registro.camino));
    assert.match(r.mensaje, /inscribirte al programa, que es pagado/);
    assert.match(r.ajuste, /no va la sesión por videollamada/);
  }
  const prioridad = ruta.resolverRespuesta({ mensaje: '', accion: 'proponer_horarios', calificacion: {} }, conTest, geoUS, [], 'Quiero empezar', 'c1', { numero: 4, mercado: 'alto' }, {});
  assert.equal(prioridad.pendiente.tipo, 'horarios');
  assert.equal(prioridad.registro.calificacion.camino, 'prioridad');
});

test('el WhatsApp que reemplaza a la sesión no se repite igual dos veces', () => {
  const r = ruta.resolverRespuesta({ mensaje: 'Horarios 👇', accion: 'proponer_horarios', calificacion: {} }, nuevo, { pais: 'MX' }, [], 'Quiero agendar', 'c1',
    { numero: 6, mercado: 'latam', anteriores: [ruta.MENSAJE_WHATSAPP_CAMINO] }, {});
  assert.notEqual(r.mensaje, ruta.MENSAJE_WHATSAPP_CAMINO);
  assert.equal(r.tarjeta.tipo, 'whatsapp');
});

test('el agente recibe su camino y su avance, para hablarle sin recitarle datos', () => {
  const ctx = ruta.contextoParaAgente(nuevo, { pais: 'MX' }, 'latam', [], null, 'America/Mexico_City', '', ruta.ecoValido(null));
  assert.match(ctx, /CAMINO PARA ESTA PERSONA[^\n]*: nutrir\. Recién empieza su Ruta/);
  assert.match(ctx, /SU AVANCE EN LA RUTA: 0 lecciones completas; todavía no hizo el test de macros/);
  const alto = ruta.contextoParaAgente(conTest, geoUS, 'alto', [], null, 'America/New_York', '', ruta.ecoValido(null));
  assert.match(alto, /: prioridad\. Es de las personas que más compran/);
});

test('una reserva ya en curso (con horarios ofrecidos) no se corta aunque el camino no tenga sesión', () => {
  const r = ruta.resolverRespuesta({ mensaje: 'Listo.', accion: 'agendar', horario: 'h1', whatsapp: '+59891099271', calificacion: {} }, perfil, geoUY, [], '+59891099271', 'c1',
    { numero: 6, mercado: 'latam' }, { horarios, horario_elegido: 'h1' });
  assert.equal(r.pendiente.tipo, 'agendar');
});

// ── Chats que no avanzan (11-nov-2026) ─────────────────────
// Casos tomados de conversaciones reales del 6 al 11-nov: la persona escribía que sí y el chat
// volvía a ofrecer lo mismo sin dar el paso.
const OFERTA_EMPEZAR = 'Lo armamos contigo según tu rutina real y lo que comes hoy.\nSi ya quieres empezar, el coach revisa tu caso y te dice cómo seguir con claridad.';

test('se reconoce un sí escrito, un «ok» que no alcanza y lo que no es un sí', () => {
  for (const si of ['Si', 'Sí', 'Si por favor', 'Sí, quiero guía', 'Si por favor me ayudas a armar la rutina', 'Guia', 'Quiero que me guíen', 'Claro', 'Dale']) assert.equal(ruta.tipoDeSi(si), 'fuerte', si);
  for (const ok of ['Ok', 'Bien', 'Muy bien', 'Bueno', 'Vale', 'De acuerdo']) assert.equal(ruta.tipoDeSi(ok), 'debil', ok);
  for (const no of ['No', 'Sí, pero después', 'Si pero cuánto cuesta', 'Avanzar con mi ruta', 'Por ahora no', 'Bajar grasa', 'Entreno en casa de lunes a viernes', '']) assert.equal(ruta.tipoDeSi(no), null, no);
});

test('se reconoce qué le ofreció el agente en su último mensaje', () => {
  assert.equal(ruta.ofertaEn(OFERTA_EMPEZAR).tipo, 'empezar');
  assert.equal(ruta.ofertaEn('Si quieres, te mostramos el video de alimentación.').tipo, 'video');
  assert.equal(ruta.ofertaEn('¿Quieres que te muestre esa lección o prefieres seguir avanzando con tu Ruta?').dosOpciones, true);
  assert.equal(ruta.ofertaEn(OFERTA_EMPEZAR).dosOpciones, false);
  assert.equal(ruta.ofertaEn('¿Qué es lo que más te cuesta hoy?'), null);
});

test('EE. UU.: escribió «Si» a la oferta de empezar y el agente la repitió: el sistema le da a elegir sesión o WhatsApp', () => {
  const cruda = { mensaje: 'Ese “sí” nos sirve para avanzar.\nSi ya quieres empezar, te armamos el siguiente paso con un coach que revisa tu caso y te dice cómo seguir con claridad.', opciones: ['Quiero empezar'], accion: 'ninguna', calificacion: {} };
  const r = ruta.resolverRespuesta(cruda, nuevo, geoUS, [], 'Si', 'c1', { numero: 5, mercado: 'alto', anteriores: [OFERTA_EMPEZAR] }, {});
  assert.deepEqual(r.opciones, ['Sesión por videollamada', 'Por WhatsApp']);
  assert.match(r.mensaje, /¿Prefieres la sesión por videollamada o seguir por WhatsApp con un coach del equipo\?$/);
  assert.match(r.ajuste, /escribió que quiere empezar y no le diste el paso/);
});

test('fuera de EE. UU. y Europa: el mismo «sí» va directo a WhatsApp', () => {
  const cruda = { mensaje: 'Si ya quieres empezar, el coach revisa tu caso.', accion: 'ninguna', calificacion: {} };
  const r = ruta.resolverRespuesta(cruda, perfil, geoUY, [], 'Si por favor', 'c1', { numero: 5, mercado: 'latam', anteriores: [OFERTA_EMPEZAR] }, {});
  assert.equal(r.tarjeta.tipo, 'whatsapp');
  assert.equal(r.registro.accion, 'pasar_a_whatsapp');
  assert.equal(r.mensaje, ruta.MENSAJE_WHATSAPP_CAMINO);
});

test('a quien no va a sesión nunca se le da a elegir la videollamada: ve el WhatsApp', () => {
  // Colombia, 8-nov: «¿Prefieres seguir por WhatsApp o agendar una sesión por videollamada?» y la persona se fue.
  const cruda = { mensaje: 'Sí, te ayudamos a armarlo contigo.\n¿Prefieres seguir por WhatsApp con un coach del equipo o agendar una sesión por videollamada?', opciones: ['Por WhatsApp', 'Sesión por videollamada'], accion: 'ninguna', calificacion: {} };
  const r = ruta.resolverRespuesta(cruda, perfil, { pais: 'CO' }, [], 'Si por favor me ayudas a armar la rutina', 'c1', { numero: 4, mercado: 'latam', anteriores: ['¿Quieres que te ayudemos a armar eso contigo?'] }, {});
  assert.equal(r.tarjeta.tipo, 'whatsapp');
  assert.deepEqual(r.opciones, []);
  assert.doesNotMatch(r.mensaje, /videollamada/i);
  // En EE. UU. esa elección sí va, tal como la escribió el agente.
  const alto = ruta.resolverRespuesta(cruda, conTest, geoUS, [], 'Quiero empezar', 'c1', { numero: 4, mercado: 'alto' }, {});
  assert.deepEqual(alto.opciones, ['Por WhatsApp', 'Sesión por videollamada']);
  assert.equal(alto.tarjeta, null);
});

test('un «ok», una pregunta de dos opciones o una sesión ya agendada no fuerzan el paso', () => {
  const cruda = { mensaje: 'Ese orden evita que entrenes a ciegas.\n¿Cuánto tiempo llevas así?', accion: 'ninguna', calificacion: {} };
  const debil = ruta.resolverRespuesta(cruda, nuevo, geoUS, [], 'Bien', 'c1', { numero: 3, mercado: 'alto', anteriores: [OFERTA_EMPEZAR] }, {});
  assert.deepEqual(debil.opciones, []);
  assert.equal(debil.mensaje, cruda.mensaje);
  const dos = ruta.resolverRespuesta(cruda, perfil, geoUY, [], 'Si', 'c1', { numero: 3, mercado: 'latam', anteriores: ['Si quieres que un coach revise tu caso, lo vemos por WhatsApp.\n¿Quieres seguir por ahí o prefieres avanzar con tu Ruta?'] }, {});
  assert.equal(dos.tarjeta, null);
  const agendada = ruta.resolverRespuesta(cruda, nuevo, geoUS, ['agendo'], 'Si', 'c1', { numero: 9, mercado: 'alto', anteriores: [OFERTA_EMPEZAR] }, {});
  assert.deepEqual(agendada.opciones, []);
  // Si el agente ya dio el paso, no se toca.
  const yaDio = ruta.resolverRespuesta({ mensaje: 'Te dejo los horarios.', accion: 'proponer_horarios', calificacion: {} }, nuevo, geoUS, [], 'Si', 'c1', { numero: 5, mercado: 'alto', anteriores: [OFERTA_EMPEZAR] }, {});
  assert.equal(yaDio.pendiente.tipo, 'horarios');
});

test('el agente sabe, antes de responder, que la persona contestó que sí y qué paso toca', () => {
  const historial = [{ rol: 'persona', texto: 'Ganar músculo' }, { rol: 'equipo', texto: OFERTA_EMPEZAR }];
  const alto = ruta.notaDelTurno('Si', historial, ruta.caminoPara(nuevo, geoUS, {}));
  assert.match(alto, /ya es la señal de que quiere empezar/);
  assert.match(alto, /«Sesión por videollamada» y «Por WhatsApp»/);
  const latam = ruta.notaDelTurno('Sí, quiero guía', historial, ruta.caminoPara(perfil, geoUY, {}));
  assert.match(latam, /accion pasar_a_whatsapp/);
  assert.doesNotMatch(latam, /videollamada/);
  assert.match(ruta.notaDelTurno('Bien', historial, ruta.caminoPara(nuevo, geoUS, {})), /pregunta del paso 6/);
  const yaPregunto = historial.concat([{ rol: 'persona', texto: 'x' }, { rol: 'equipo', texto: '¿Estás pensando en inscribirte a un programa con un coach?' }, { rol: 'persona', texto: 'y' }, { rol: 'equipo', texto: OFERTA_EMPEZAR }]);
  assert.match(ruta.notaDelTurno('Ok', yaPregunto, ruta.caminoPara(nuevo, geoUS, {})), /no insistas/);
  const video = [{ rol: 'equipo', texto: '¿Quieres que te muestre el video de alimentación?' }];
  assert.match(ruta.notaDelTurno('Si', video, ruta.caminoPara(perfil, geoUY, {})), /mostrar_video/);
  const dos = [{ rol: 'equipo', texto: '¿Quieres que te muestre esa lección o prefieres seguir avanzando con tu Ruta?' }];
  assert.match(ruta.notaDelTurno('Si', dos, ruta.caminoPara(perfil, geoUY, {})), /un sí a la primera/);
  // Sin oferta previa, o sin un sí, no hay nota; y la del costo sigue saliendo.
  assert.equal(ruta.notaDelTurno('Si', [{ rol: 'equipo', texto: '¿Entrenas en casa?' }], ruta.caminoPara(perfil, geoUY, {})), '');
  assert.equal(ruta.notaDelTurno('Entreno en casa', historial, ruta.caminoPara(perfil, geoUY, {})), '');
  const ctx = ruta.contextoParaAgente(nuevo, geoUS, 'alto', [], null, 'America/New_York', '', ruta.ecoValido(null), null, [], alto);
  assert.ok(ctx.includes('SOBRE ESTE MENSAJE: ' + alto));
});

test('un mensaje sin pregunta ni paso le llega al agente como nota para el turno siguiente', () => {
  const r = ruta.resolverRespuesta({ mensaje: 'Ese orden evita que entrenes a ciegas.\nSi quieres, te mostramos cómo se ve el plan en tu caso.', opciones: ['Sí, quiero empezar'], accion: 'ninguna', calificacion: {} },
    nuevo, geoUS, [], 'Muy bien', 'c1', { numero: 2, mercado: 'alto' }, {});
  assert.deepEqual(r.opciones, []);
  assert.match(r.ajuste, /terminó sin una pregunta ni un paso concreto/);
  const conPregunta = ruta.resolverRespuesta({ mensaje: '¿Cuánto tiempo llevas así?', accion: 'ninguna', calificacion: {} }, nuevo, geoUS, [], 'Bien', 'c1', { numero: 2, mercado: 'alto' }, {});
  assert.equal(conPregunta.ajuste, null);
});

test('quien escribe por su cuenta que quiere empezar o que la guíen recibe su paso (el atajo)', () => {
  for (const si of ['Quiero empezar', 'Quiero que me guíen', 'Quisiera tener un coach', 'Necesito un coach', '¿Cómo me inscribo?', 'Quiero inscribirme']) assert.equal(ruta.pideEmpezar(si), true, si);
  for (const no of ['Quiero empezar a entrenar en casa', 'Quiero bajar grasa', 'Quiero empezar pero después', 'No quiero un coach', 'Bajar grasa']) assert.equal(ruta.pideEmpezar(no), false, no);
  // España, 8-nov: «Quiero que me guíen» y el chat siguió hablando sin dar el paso.
  const cruda = { mensaje: 'El coach revisa tu caso y te da un diagnóstico claro.', accion: 'ninguna', calificacion: {} };
  const alto = ruta.resolverRespuesta(cruda, nuevo, { pais: 'ES' }, [], 'Quiero que me guíen', 'c1', { numero: 2, mercado: 'alto', anteriores: ['¿Qué te gustaría lograr?'] }, {});
  assert.deepEqual(alto.opciones, ['Sesión por videollamada', 'Por WhatsApp']);
  const latam = ruta.resolverRespuesta(cruda, perfil, geoUY, [], 'Quiero que me guíen', 'c1', { numero: 2, mercado: 'latam', anteriores: ['¿Qué te gustaría lograr?'] }, {});
  assert.equal(latam.tarjeta.tipo, 'whatsapp');
  assert.match(ruta.notaDelTurno('Quiero que me guíen', [{ rol: 'equipo', texto: '¿Qué te gustaría lograr?' }], ruta.caminoPara(perfil, geoUY, {})), /es el atajo/);
});

test('«sí, muéstrenme» a «¿quieres que te mostremos cómo lo trabajamos con un coach?» pide ver, no empezar', () => {
  assert.equal(ruta.ofertaEn('¿Quieres que te mostremos cómo lo trabajamos con un coach?').tipo, 'video');
  assert.equal(ruta.ofertaEn('Si ya quieres que te guíen, te mostramos cómo sería la sesión y te damos el siguiente paso.').tipo, 'empezar');
  // Si después de la oferta cierra con otra pregunta, el «sí» responde a esa.
  assert.equal(ruta.ofertaEn('Si quieres, te mostramos cómo armamos el entrenamiento.\n¿Te hace sentido con lo que buscas?'), null);
  const r = ruta.resolverRespuesta({ mensaje: 'Te mostramos cómo lo trabajamos.\n¿Cuántos días entrenas?', accion: 'ninguna', calificacion: {} }, perfil, geoUY, [], 'Sí, muéstrenme', 'c1',
    { numero: 3, mercado: 'latam', anteriores: ['¿Quieres que te mostremos cómo lo trabajamos con un coach?'] }, {});
  assert.equal(r.tarjeta, null);
});

// ── Retomar a quien quedó sin su paso (11-nov-2026) ────────
const AHORA = new Date('2026-11-11T18:00:00Z');
function t(persona, equipo, extra) {
  return Object.assign({ conversacion: 'c1', at: '2026-11-10T15:00:00.000Z', persona, equipo, accion: 'ninguna', opciones: [], tarjeta: null, camino: 'alto_nuevo' }, extra || {});
}
const SIN_HECHOS = { agendo: false, whatsappAt: null, diagnosticoAt: null, cliente: false };
const SESION = { sesion: true };
const SIN_SESION = { sesion: false };

test('retomar: escribió que sí a la oferta de empezar y el chat no le dio el paso', () => {
  // EE. UU., 10-nov: el caso real que dijo «sí» cuatro veces.
  const turnos = [t('Ganar músculo', OFERTA_EMPEZAR), t('Si', 'Ese “sí” nos sirve para avanzar.\nSi ya quieres empezar, te armamos el siguiente paso con un coach.')];
  assert.deepEqual(ruta.pasoPendiente(turnos, SIN_HECHOS, SESION, AHORA), { motivo: 'si_sin_paso', at: '2026-11-10T15:00:00.000Z' });
  // Sin nada del CRM (falló la consulta de hechos) también se decide con los turnos.
  assert.equal(ruta.pasoPendiente(turnos, null, SESION, AHORA).motivo, 'si_sin_paso');
});

test('retomar: pidió empezar por su cuenta, o quedó en «¿videollamada o WhatsApp?» sin ir a sesión', () => {
  assert.equal(ruta.pasoPendiente([t('Quiero que me guíen', 'El coach revisa tu caso.')], SIN_HECHOS, SESION, AHORA).motivo, 'pidio_empezar');
  const eleccion = [t('Guia', '¿Prefieres seguir por WhatsApp o la sesión?', { opciones: ['Por WhatsApp', 'Sesión por videollamada'], camino: 'nutrir' })];
  assert.equal(ruta.pasoPendiente(eleccion, SIN_HECHOS, SIN_SESION, AHORA).motivo, 'eleccion_sin_sesion');
  // A quien sí va a sesión, esa elección fue su paso: no se la persigue.
  assert.equal(ruta.pasoPendiente(eleccion.map((x) => Object.assign({}, x, { camino: 'prioridad' })), SIN_HECHOS, SESION, AHORA), null);
});

test('retomar: no se molesta a quien ya tuvo su paso, frenó, pidió ver algo o ya fue', () => {
  const pendiente = [t('Ganar músculo', OFERTA_EMPEZAR), t('Si', 'Si ya quieres empezar, el coach revisa tu caso.')];
  const sin = (turnos, hechos, camino) => assert.equal(ruta.pasoPendiente(turnos, hechos || SIN_HECHOS, camino || SESION, AHORA), null);
  sin(pendiente.concat([t('Por WhatsApp', 'Te pasamos 👇', { accion: 'pasar_a_whatsapp', tarjeta: { tipo: 'whatsapp', destino: 'whatsapp' } })]));
  sin(pendiente.concat([t('Sesión por videollamada', 'Horarios:', { accion: 'proponer_horarios' })]));
  sin(pendiente.concat([t('[Volvió a su Ruta]', 'Hola de nuevo…', { accion: 'retomar' })]));
  sin(pendiente.concat([t('Por ahora sigo con mi Ruta', 'Sigue con tu Ruta.')]));
  sin([t('x', '¿Quieres que te mostremos cómo lo trabajamos con un coach?'), t('Sí, muéstrenme', 'Te mostramos.')]);
  sin([t('x', OFERTA_EMPEZAR), t('Si', 'Te dejo el video 👇', { accion: 'mostrar_video', tarjeta: { tipo: 'video', destino: null } })]);
  sin([t('x', OFERTA_EMPEZAR), t('Bien', 'Si ya quieres empezar…')]); // un «ok» no alcanza
  sin(pendiente, Object.assign({}, SIN_HECHOS, { agendo: true }));
  sin(pendiente, Object.assign({}, SIN_HECHOS, { cliente: true }));
  sin(pendiente, Object.assign({}, SIN_HECHOS, { whatsappAt: '2026-11-10T16:00:00.000Z' }));
  sin(pendiente, Object.assign({}, SIN_HECHOS, { diagnosticoAt: '2026-11-10T15:03:00.000Z' }));
  // Un clic ANTERIOR al «sí» no cuenta: después volvió a pedir y no recibió nada.
  assert.equal(ruta.pasoPendiente(pendiente, Object.assign({}, SIN_HECHOS, { whatsappAt: '2026-11-01T10:00:00.000Z' }), SESION, AHORA).motivo, 'si_sin_paso');
  // Charlas de antes del 6-nov (sin camino calculado): ahí el chat vendía el Plan Esencial o agendaba a todos.
  sin([t('x', '¿Estás buscando información o quieres empezar a hacer el cambio?', { camino: null }), t('Quiero empezar', 'Con el Esencial te armamos tu plan…', { camino: null })]);
  // Pasó más de un mes, o la charla siguió largo por otro lado.
  sin(pendiente.map((x) => Object.assign({}, x, { at: '2026-10-01T15:00:00.000Z' })));
  sin(pendiente.concat([t('a', 'b'), t('c', 'd'), t('e', 'f'), t('g', 'h')]));
  // La oferta de otra conversación no cuenta como la que contestó.
  sin([t('x', OFERTA_EMPEZAR, { conversacion: 'vieja' }), t('Si', 'Cuéntanos más.')]);
  sin([], SIN_HECHOS);
});

test('retomar: lo que lee al volver da el paso que faltó, según su camino', () => {
  const alto = ruta.respuestaParaRetomar({ nombre: 'Maria' }, SESION);
  assert.match(alto.mensaje, /^Hola de nuevo, Maria\. La última vez nos dijiste que querías empezar y nos faltó darte el siguiente paso\./);
  assert.match(alto.mensaje, /¿Prefieres la sesión por videollamada o seguir por WhatsApp con un coach del equipo\?$/);
  assert.deepEqual(alto.opciones, ['Sesión por videollamada', 'Por WhatsApp']);
  assert.equal(alto.tarjeta, null);
  const latam = ruta.respuestaParaRetomar(perfil, SIN_SESION);
  assert.equal(latam.tarjeta.tipo, 'whatsapp');
  assert.deepEqual(latam.opciones, []);
  assert.doesNotMatch(latam.mensaje, /videollamada|gratis|\$/i);
  assert.match(latam.mensaje, /es pagado y de 3 meses como mínimo/);
  assert.match(ruta.respuestaParaRetomar({}, SIN_SESION).mensaje, /^Hola de nuevo\. /);
  // El turno de retomar, ya guardado, cuenta como paso dado.
  assert.equal(ruta.MARCA_RETOMAR, '[Volvió a su Ruta]');
});
