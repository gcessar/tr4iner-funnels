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

test('nada se presenta como gratis: se saca la frase y el botón que lo dicen', () => {
  const r = responder({ mensaje: 'Sí, la sesión es gratuita y dura 30 minutos.\n¿Qué día te acomoda?', opciones: ['Sesión gratis', 'Quiero empezar', 'Tengo una duda'], accion: 'ninguna', calificacion: {} }, '¿Es gratis?');
  assert.doesNotMatch(r.mensaje, /gratu|gratis/i);
  // 17-nov: sin sesión, «Quiero empezar» de un toque ya no se saca (lleva a una persona por WhatsApp).
  assert.deepEqual(r.opciones, ['Quiero empezar', 'Tengo una duda']);
});

test('ningún monto llega a la persona, en ningún país (6-nov): lo que llega es cómo se paga y quién da el precio', () => {
  for (const geo of [geoUY, geoUS]) {
    const r = responder({ mensaje: 'El plan de 3 meses sale US$397 y puedes empezar desde US$100.', accion: 'ninguna', calificacion: {} }, 'Quiero bajar grasa', { geo });
    assert.doesNotMatch(r.mensaje, /US\$|397|100/);
    assert.match(r.mensaje, /no son mensualidades/);
    assert.match(r.mensaje, /empezar en partes/);
    assert.equal(r.tarjeta.tipo, 'whatsapp');
    assert.match(r.ajuste, /no se dan montos/);
  }
});

test('preguntar el precio lleva directo a una persona por WhatsApp, sin «¿estás pensando en inscribirte?» (17-nov)', () => {
  for (const pregunta of ['¿Cuánto cuesta?', 'Precio?', 'cuanto sale el programa', '¿Es mensual?', '¿Tienen cuotas?', 'Me gustaría saber el costo de sus servicios', 'Hola deseo saber las tarifas actuales']) {
    const r = responder({ mensaje: 'El programa se arma según tu caso.\n¿Estás pensando en inscribirte?', accion: 'ninguna', calificacion: { objetivo: 'Bajar grasa' } }, pregunta);
    assert.equal(r.tarjeta.tipo, 'whatsapp', pregunta);
    assert.equal(r.registro.accion, 'pasar_a_whatsapp', pregunta);
    assert.equal(r.mensaje, ruta.MENSAJE_PRECIO, pregunta);
    assert.doesNotMatch(r.mensaje, /inscribirte/);
  }
  // Lo de la Ruta es gratis y no es una pregunta de precio; «¿es gratis?» tampoco.
  for (const otra of ['¿La Ruta tiene costo?', '¿Es gratis?', 'El test de macros cuánto cuesta?', 'No me importa el precio, quiero resultados']) assert.equal(ruta.pidePrecio(otra), false, otra);
  // Si el agente ya la pasó por WhatsApp, su mensaje se respeta.
  const propio = responder({ mensaje: 'Te paso con una persona del equipo que te cuenta precio y formas de pago 👇', accion: 'pasar_a_whatsapp', calificacion: {} }, '¿Cuánto cuesta?');
  assert.match(propio.mensaje, /^Te paso con una persona/);
  // Un menor de edad no se pasa a WhatsApp.
  const menor = responder({ mensaje: 'Los planes son para adultos.\n¿Te ayudo con tu Ruta?', accion: 'ninguna', calificacion: { bandera_clinica: 'menor de 18' } }, '¿Cuánto cuesta?');
  assert.equal(menor.tarjeta, null);
});

test('Lima y Cuba ya no cuentan como mercado alto; EE. UU. sí', () => {
  assert.equal(ruta.mercadoPara({ pais: 'PE', ciudad: 'Lima' }, {}), 'latam');
  assert.equal(ruta.mercadoPara({ pais: 'CU', ciudad: 'La Habana' }, {}), 'latam');
  assert.equal(ruta.mercadoPara(geoUS, {}), 'alto');
});

test('el WhatsApp sale del lado en que se registró, dice quién responde y lleva lo que contó', () => {
  const va = responder({ mensaje: 'Te paso con una persona del equipo.', accion: 'pasar_a_whatsapp', resumen_whatsapp: 'Quiero bajar la grasa del abdomen', calificacion: {} }, 'Quiero que me guíen',
    { perfil: Object.assign({}, perfil, { atribucion: { utm_source: 'STORIES-VA', utm_campaign: 'CASOS-VA' } }), geo: geoUS });
  assert.match(va.tarjeta.url, /phone=15677024560/);
  assert.match(va.tarjeta.resumen, /^Te responde una persona del equipo de Veronika/);
  assert.match(va.tarjeta.resumen, /no tienes que repetirlo/);
  assert.doesNotMatch(va.tarjeta.resumen, /respóndelas todas/);
  const texto = decodeURIComponent(va.tarjeta.url.split('&text=')[1]);
  assert.match(texto, /^Hola, vengo de mi Ruta Tr4iner y quiero asesoría\.\nQuiero bajar la grasa del abdomen\nEscribo desde Estados Unidos\./);
  const an = responder({ mensaje: 'Te paso con una persona del equipo.', accion: 'pasar_a_whatsapp', calificacion: { objetivo: 'Ganar músculo', dolor: 'No ve cambios' } }, 'Quiero que me guíen');
  assert.match(an.tarjeta.url, /phone=17439014239/);
  assert.match(an.tarjeta.resumen, /equipo de Anthoni/);
  // Sin resumen del agente, lo que contó sale de la calificación.
  assert.match(decodeURIComponent(an.tarjeta.url), /Ganar músculo\. No ve cambios/);
});

test('cuándo le responden: lunes a viernes 9 a 18 y sábados 9 a 13, hora de Perú', () => {
  const en = (iso) => ruta.atencionDelEquipo(new Date(iso));
  assert.equal(en('2026-11-17T15:00:00Z'), 'abierto'); // martes 10:00 Lima
  assert.equal(en('2026-11-17T23:30:00Z'), 'manana'); // martes 18:30
  assert.equal(en('2026-11-17T12:00:00Z'), 'hoy'); // martes 07:00
  assert.equal(en('2026-11-21T16:00:00Z'), 'abierto'); // sábado 11:00
  assert.equal(en('2026-11-21T19:00:00Z'), 'lunes'); // sábado 14:00
  assert.equal(en('2026-11-22T16:00:00Z'), 'lunes'); // domingo
  assert.equal(en('2026-11-20T23:30:00Z'), 'lunes'); // viernes 18:30
  const t = ruta.tarjetaWhatsApp('', perfil, 'PE', new Date('2026-11-22T16:00:00Z'));
  assert.match(t.resumen, /el lunes desde las 9 de la mañana \(hora de Perú\)\.$/);
  assert.doesNotMatch(t.resumen, /repetirlo/); // sin resumen no se promete
});

test('el IMC sale de peso y altura del test, y no se inventa sin ellos', () => {
  assert.deepEqual(ruta.imcDe({ peso: 82, altura: 160 }), { valor: 32, rango: 'obesidad' });
  assert.equal(ruta.imcDe({ peso: null, altura: 160 }), null);
});

test('el contexto no trae montos ni el mercado, y sí los 3 meses como mínimo; ya no ofrece videollamadas', () => {
  for (const [geo, mercado] of [[geoUY, 'latam'], [geoUS, 'alto']]) {
    const ctx = ruta.contextoParaAgente(perfil, geo, mercado, [], null, 'America/Montevideo', '', ruta.ecoValido(null));
    assert.doesNotMatch(ctx, /precio_desde|US\$|"mercado"|latam/);
    assert.match(ctx, /3 meses como mínimo; ninguno es mensual\. Se puede empezar en partes/);
    assert.match(ctx, /Desde el chat no se agendan videollamadas/);
    assert.doesNotMatch(ctx, /30 a 40 minutos/);
    assert.match(ctx, /OFERTA VIGENTE: ninguna/);
  }
});

test('el aviso de la sesión cuenta como leído si está en la memoria del CRM (reservas en curso)', () => {
  assert.equal(ruta.avisoEnHistorial([{ rol: 'equipo', texto: ruta.AVISO_SESION.join('\n') }]), true);
  assert.equal(ruta.avisoEnHistorial([{ rol: 'persona', texto: 'como mínimo, ninguno mensual' }, { rol: 'equipo', texto: 'Hola' }]), false);
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
test('si vuelve a preguntar si es gratis y el agente repite su respuesta, sale la versión corta y directa', () => {
  const anterior = 'Tu Ruta es gratis; el acompañamiento no.\n¿Quieres que te cuente cómo es?';
  const r = ruta.resolverRespuesta({ mensaje: anterior, accion: 'ninguna', opciones: ['Sí'], calificacion: {} }, perfil, geoUY, [], 'Es gratis?', 'c1',
    { numero: 5, mercado: 'latam', anteriores: [anterior] }, {});
  assert.equal(r.mensaje, ruta.MENSAJE_COSTO_OTRA_VEZ);
  assert.match(r.mensaje, /tu Ruta es gratis; el acompañamiento con el equipo es pagado/);
  assert.deepEqual(r.opciones, ruta.OPCIONES_COACH);
  assert.equal(r.repetido, true);
  assert.match(r.ajuste, /Ibas a repetir/);
  const otra = ruta.resolverRespuesta({ mensaje: ruta.MENSAJE_COSTO_OTRA_VEZ, accion: 'ninguna', calificacion: {} }, perfil, geoUY, [], '¿Es gratis?', 'c1',
    { numero: 7, mercado: 'latam', anteriores: [anterior, ruta.MENSAJE_COSTO_OTRA_VEZ] }, {});
  assert.match(otra.ajuste, /repitió palabra por palabra/);
});

test('un mensaje distinto no cuenta como repetido aunque hable de lo mismo', () => {
  const r = ruta.resolverRespuesta({ mensaje: 'Tu Ruta no se cobra; el acompañamiento sí, de 3 meses o más.\n¿Te cuento cómo es?', accion: 'ninguna', calificacion: {} }, perfil, geoUY, [], 'Es gratis?', 'c1',
    { numero: 5, mercado: 'latam', anteriores: ['Tu Ruta es gratis; el acompañamiento no.\n¿Quieres que te cuente cómo es?'] }, {});
  assert.equal(r.repetido, false);
  assert.doesNotMatch(r.mensaje, /Te lo digo directo/);
});

test('la segunda pregunta por si es gratis llega al agente con su nota; la de precio, siempre', () => {
  const historial = [{ rol: 'persona', texto: 'Es gratis?' }, { rol: 'equipo', texto: 'Tu Ruta es gratis…' }];
  assert.match(ruta.notaDelTurno('Es gratis?', historial), /Ya había preguntado si algo es gratis/);
  assert.equal(ruta.notaDelTurno('Es gratis?', [{ rol: 'persona', texto: 'Bajar grasa' }]), '');
  assert.equal(ruta.notaDelTurno('Tengo 4 días', historial), '');
  assert.match(ruta.notaDelTurno('¿Cuánto cuesta?', []), /Pregunta el precio: es la mejor señal/);
  const ctx = ruta.contextoParaAgente(perfil, geoUY, 'latam', [], null, 'America/Lima', '', ruta.ecoValido(null), null, [], ruta.notaDelTurno('Es gratis?', historial));
  assert.match(ctx, /SOBRE ESTE MENSAJE: Ya había preguntado/);
});

test('«¿estás pensando en inscribirte?» se cambia por la pregunta de si quiere que la guíen, con sus dos botones', () => {
  const r = responder({ mensaje: 'La culpa después de picar te está frenando.\n¿Estás pensando en inscribirte a un programa con un coach en estos días, o por ahora prefieres avanzar con tu Ruta?', opciones: ['Empezar con coach', 'Seguir en mi Ruta'], accion: 'ninguna', calificacion: {} }, 'Me da culpa');
  assert.equal(r.mensaje, 'La culpa después de picar te está frenando.\n' + ruta.PREGUNTA_COACH);
  assert.deepEqual(r.opciones, ruta.OPCIONES_COACH);
  // Si ya se la ofreció, esa línea se saca y no se repite.
  const ya = ruta.resolverRespuesta({ mensaje: 'Eso se ordena con un plan.\n¿Estás pensando en inscribirte?', accion: 'ninguna', calificacion: {} }, perfil, geoUY, [], 'No sé', 'c1',
    { numero: 4, historial: [{ rol: 'equipo', texto: 'Hola.\n' + ruta.PREGUNTA_COACH }, { rol: 'persona', texto: 'No sé' }] }, {});
  assert.equal(ya.mensaje, 'Eso se ordena con un plan.');
  assert.deepEqual(ya.opciones, []);
});

test('si al sacar un botón prohibido queda uno solo, no queda ninguno', () => {
  const r = responder({ mensaje: 'La constancia se rompe cuando el plan no encaja.\n¿Cómo lo quieres trabajar?', opciones: ['Sesión gratis', 'Seguir con mi Ruta'], accion: 'ninguna', calificacion: {} }, 'La constancia');
  assert.deepEqual(r.opciones, []);
});

test('al agente se le corrige «su Ruta» por «tu Ruta»', () => {
  const r = responder({ mensaje: 'Su Ruta ya tiene orientaciones para empezar.\nSi más adelante quieres, aquí seguimos con su Ruta.', accion: 'ninguna', calificacion: {} }, 'No');
  assert.equal(r.mensaje, 'Tu Ruta ya tiene orientaciones para empezar.\nSi más adelante quieres, aquí seguimos con tu Ruta.');
});

// ── Camino comercial (6-nov, calibrado con las compras de la Ruta) ─────────────────────────
const nuevo = { email: 'n@y.com', nombre: 'Lu', atribucion: {}, orientaciones_completadas: 0, orientaciones_empezadas: 0 };
const conTest = Object.assign({}, nuevo, { hizo_test: true });

test('el camino sale del país y de lo que ya hizo en su Ruta; desde el 17-nov ninguno va a sesión', () => {
  assert.equal(ruta.caminoPara(conTest, geoUS, {}).id, 'prioridad');
  assert.equal(ruta.caminoPara(perfil, { pais: 'ES' }, {}).id, 'prioridad');
  assert.equal(ruta.caminoPara(nuevo, geoUS, {}).id, 'alto_nuevo');
  assert.equal(ruta.caminoPara(perfil, geoUY, {}).id, 'calificado');
  assert.equal(ruta.caminoPara(conTest, { pais: 'PE' }, {}).id, 'calificado');
  assert.equal(ruta.caminoPara(nuevo, { pais: 'MX' }, {}).id, 'nutrir');
  assert.equal(ruta.caminoPara(Object.assign({}, nuevo, { orientaciones_completadas: 1 }), { pais: 'CO' }, {}).id, 'nutrir');
  assert.equal(ruta.caminoPara(conTest, { pais: 'CU' }, {}).id, 'whatsapp');
  assert.equal(ruta.caminoPara(perfil, { pais: 'PE' }, { pais: 'VE' }).id, 'whatsapp');
  assert.equal(ruta.caminoPara(conTest, { pais: 'PE' }, { pais: 'US' }).id, 'prioridad');
  for (const [p, geo] of [[conTest, geoUS], [nuevo, geoUS], [perfil, geoUY], [nuevo, { pais: 'MX' }]]) assert.equal(ruta.caminoPara(p, geo, {}).sesion, false);
});

test('el botón del chat se oculta sólo por la IP de Cuba o Venezuela', () => {
  assert.equal(ruta.chatDisponiblePara({ pais: 'CU' }), false);
  assert.equal(ruta.chatDisponiblePara({ pais: 've' }), false);
  for (const pais of ['PE', 'US', 'MX', '']) assert.equal(ruta.chatDisponiblePara({ pais }), true, pais);
});

test('los horarios que pida el agente se cambian por WhatsApp, también en EE. UU. y Europa', () => {
  for (const [p, geo] of [[nuevo, { pais: 'MX' }], [conTest, { pais: 'CU' }], [perfil, geoUY], [conTest, geoUS], [nuevo, { pais: 'ES' }]]) {
    const r = ruta.resolverRespuesta({ mensaje: 'Te dejo los horarios 👇', accion: 'proponer_horarios', resumen_caso: 'Quiero bajar grasa', calificacion: {} }, p, geo, [], 'Quiero empezar', 'c1', { numero: 4, mercado: 'latam' }, {});
    assert.equal(r.pendiente, null);
    assert.equal(r.tarjeta.tipo, 'whatsapp');
    assert.equal(r.mensaje, ruta.MENSAJE_WHATSAPP_CAMINO);
    assert.equal(r.registro.accion, 'pasar_a_whatsapp');
    assert.match(r.mensaje, /el precio y las formas de pago/);
    assert.match(decodeURIComponent(r.tarjeta.url), /Quiero bajar grasa/);
  }
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
  assert.match(alto, /: prioridad\. Ya avanzó en su Ruta/);
  assert.doesNotMatch(alto, /sesión por videollamada|proponer_horarios/);
});

test('una reserva ya en curso (con horarios ofrecidos) no se corta', () => {
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

test('escribió «Si» a la oferta de empezar y el agente la repitió: va a WhatsApp, en cualquier país', () => {
  const cruda = { mensaje: 'Si ya quieres empezar, el coach revisa tu caso.', accion: 'ninguna', calificacion: {} };
  for (const [p, geo] of [[perfil, geoUY], [nuevo, geoUS]]) {
    const r = ruta.resolverRespuesta(cruda, p, geo, [], 'Si por favor', 'c1', { numero: 5, mercado: 'latam', anteriores: [OFERTA_EMPEZAR] }, {});
    assert.equal(r.tarjeta.tipo, 'whatsapp');
    assert.equal(r.registro.accion, 'pasar_a_whatsapp');
    assert.equal(r.mensaje, ruta.MENSAJE_WHATSAPP_CAMINO);
  }
});

test('nunca se da a elegir la videollamada: ve el WhatsApp', () => {
  const cruda = { mensaje: 'Sí, te ayudamos a armarlo contigo.\n¿Prefieres seguir por WhatsApp con un coach del equipo o agendar una sesión por videollamada?', opciones: ['Por WhatsApp', 'Sesión por videollamada'], accion: 'ninguna', calificacion: {} };
  for (const [p, geo] of [[perfil, { pais: 'CO' }], [conTest, geoUS]]) {
    const r = ruta.resolverRespuesta(cruda, p, geo, [], 'Si por favor me ayudas a armar la rutina', 'c1', { numero: 4, mercado: 'latam', anteriores: ['¿Quieres que te ayudemos a armar eso contigo?'] }, {});
    assert.equal(r.tarjeta.tipo, 'whatsapp');
    assert.deepEqual(r.opciones, []);
    assert.doesNotMatch(r.mensaje, /videollamada/i);
  }
});

test('un «ok», una pregunta de dos opciones o una sesión ya agendada no fuerzan el paso', () => {
  const cruda = { mensaje: 'Ese orden evita que entrenes a ciegas.\n¿Cuánto tiempo llevas así?', accion: 'ninguna', calificacion: {} };
  const debil = ruta.resolverRespuesta(cruda, nuevo, geoUS, [], 'Bien', 'c1', { numero: 3, mercado: 'alto', anteriores: [OFERTA_EMPEZAR] }, {});
  assert.deepEqual(debil.opciones, []);
  assert.equal(debil.tarjeta, null);
  const dos = ruta.resolverRespuesta(cruda, perfil, geoUY, [], 'Si', 'c1', { numero: 3, mercado: 'latam', anteriores: ['Si quieres que un coach revise tu caso, lo vemos por WhatsApp.\n¿Quieres seguir por ahí o prefieres avanzar con tu Ruta?'] }, {});
  assert.equal(dos.tarjeta, null);
  const agendada = ruta.resolverRespuesta(cruda, nuevo, geoUS, ['agendo'], 'Si', 'c1', { numero: 9, mercado: 'alto', anteriores: [OFERTA_EMPEZAR] }, {});
  assert.deepEqual(agendada.opciones, []);
  assert.equal(agendada.tarjeta, null);
});

test('el agente sabe, antes de responder, que la persona contestó que sí y qué paso toca', () => {
  const historial = [{ rol: 'persona', texto: 'Ganar músculo' }, { rol: 'equipo', texto: OFERTA_EMPEZAR }];
  for (const camino of [ruta.caminoPara(nuevo, geoUS, {}), ruta.caminoPara(perfil, geoUY, {})]) {
    const nota = ruta.notaDelTurno('Si', historial, camino);
    assert.match(nota, /ya es la señal de que quiere empezar/);
    assert.match(nota, /accion pasar_a_whatsapp/);
    assert.doesNotMatch(nota, /videollamada/);
  }
  const video = [{ rol: 'equipo', texto: '¿Quieres que te muestre el video de alimentación?' }];
  assert.match(ruta.notaDelTurno('Si', video, ruta.caminoPara(perfil, geoUY, {})), /mostrar_video/);
  const dos = [{ rol: 'equipo', texto: '¿Quieres que te muestre esa lección o prefieres seguir avanzando con tu Ruta?' }];
  assert.match(ruta.notaDelTurno('Si', dos, ruta.caminoPara(perfil, geoUY, {})), /un sí a la primera/);
  assert.equal(ruta.notaDelTurno('Si', [{ rol: 'equipo', texto: '¿Entrenas en casa?' }], ruta.caminoPara(perfil, geoUY, {})), '');
  assert.equal(ruta.notaDelTurno('Entreno en casa', historial, ruta.caminoPara(perfil, geoUY, {})), '');
});

test('un mensaje sin pregunta ni paso le llega al agente como nota para el turno siguiente', () => {
  const r = ruta.resolverRespuesta({ mensaje: 'Ese orden evita que entrenes a ciegas.\nUn plan a tu medida lo cambia todo.', accion: 'ninguna', calificacion: {} },
    nuevo, geoUS, [], 'Muy bien', 'c1', { numero: 2, mercado: 'alto' }, {});
  assert.deepEqual(r.opciones, []);
  assert.match(r.ajuste, /terminó sin una pregunta ni un paso concreto/);
  const conPregunta = ruta.resolverRespuesta({ mensaje: '¿Cuánto tiempo llevas así?', accion: 'ninguna', calificacion: {} }, nuevo, geoUS, [], 'Bien', 'c1', { numero: 2, mercado: 'alto' }, {});
  assert.equal(conPregunta.ajuste, null);
});

test('quien escribe por su cuenta que quiere empezar o que la guíen recibe su paso (el atajo)', () => {
  for (const si of ['Quiero empezar', 'Quiero que me guíen', 'Quisiera tener un coach', 'Necesito un coach', '¿Cómo me inscribo?', 'Quiero inscribirme']) assert.equal(ruta.pideEmpezar(si), true, si);
  for (const no of ['Quiero empezar a entrenar en casa', 'Quiero bajar grasa', 'Quiero empezar pero después', 'No quiero un coach', 'Bajar grasa']) assert.equal(ruta.pideEmpezar(no), false, no);
  const cruda = { mensaje: 'El coach revisa tu caso y te da un diagnóstico claro.', accion: 'ninguna', calificacion: {} };
  for (const [p, geo] of [[nuevo, { pais: 'ES' }], [perfil, geoUY]]) {
    const r = ruta.resolverRespuesta(cruda, p, geo, [], 'Quiero que me guíen', 'c1', { numero: 2, mercado: 'alto', anteriores: ['¿Qué te gustaría lograr?'] }, {});
    assert.equal(r.tarjeta.tipo, 'whatsapp');
  }
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

test('retomar: lo que lee al volver da el paso que faltó: WhatsApp con una persona', () => {
  const r = ruta.respuestaParaRetomar({ nombre: 'Maria', atribucion: {} }, ruta.caminoPara(nuevo, geoUS, {}));
  assert.match(r.mensaje, /^Hola de nuevo, Maria\. La última vez nos dijiste que querías empezar y nos faltó darte el siguiente paso\./);
  assert.equal(r.tarjeta.tipo, 'whatsapp');
  assert.deepEqual(r.opciones, []);
  assert.doesNotMatch(r.mensaje, /videollamada|gratis|\$/i);
  assert.match(r.mensaje, /te responde una persona del equipo/);
  assert.match(ruta.respuestaParaRetomar({}, SIN_SESION).mensaje, /^Hola de nuevo\. /);
  assert.equal(ruta.MARCA_RETOMAR, '[Volvió a su Ruta]');
});


// ── Chat más humano (17-nov-2026) ───────────────────────────
// Análisis de 1.022 chats contra las ventas y de 83 expedientes de clientes de oct–nov.
test('el eco del arranque se saca: no se repite ni se comenta lo que dijo la persona', () => {
  const casos = [
    ['Ese “sí” ya nos dice que quieres avanzar. El coach ordena tu entrenamiento contigo.', 'El coach ordena tu entrenamiento contigo.'],
    ['Ese "ok" sigue sonando a que quieres que lo revisemos en serio. Con lo que cuentas, el plan cambia.', 'Con lo que cuentas, el plan cambia.'],
    ['Lo de ganar músculo es justo lo que el coach revisa contigo. Entrenas en casa o en gimnasio?', 'Entrenas en casa o en gimnasio?']
  ];
  for (const [entrada, salida] of casos) assert.equal(ruta.sinEco(entrada).mensaje, salida, entrada);
  for (const igual of ['Ese entrenamiento en casa se puede armar bien.', 'Eso dice mucho.', 'Lo de la comida se ordena con porciones.']) assert.equal(ruta.sinEco(igual).mensaje, igual, igual);
  const r = responder({ mensaje: 'Ese “sí” ya nos dice que quieres avanzar.\nLos antojos de la tarde suelen venir de llegar con hambre.\n¿Qué comes al mediodía?', accion: 'ninguna', calificacion: {} }, 'Sí');
  assert.match(r.mensaje, /^Los antojos de la tarde/);
  assert.match(r.ajuste, /no repitas ni comentes lo que dijo/);
});

test('a la tercera respuesta seguida sin un paso, se pregunta si quiere que la guíen (con sus dos botones)', () => {
  const sinPaso = [
    { rol: 'persona', texto: 'Bajar grasa' }, { rol: 'equipo', texto: 'Para bajar grasa hay que sostenerlo.\n¿Qué te cuesta más?' },
    { rol: 'persona', texto: 'La comida' }, { rol: 'equipo', texto: 'La comida se ordena con porciones.\n¿Almuerzo o cena?' }
  ];
  assert.equal(ruta.estadoDeLaCharla(sinPaso).sinPaso, 2);
  const cruda = { mensaje: 'Si llegas con hambre a la cena, te sirves de más.\n¿Cuántas horas pasas sin comer?', accion: 'ninguna', calificacion: {} };
  const r = ruta.resolverRespuesta(cruda, perfil, geoUY, [], 'La cena', 'c1', { numero: 3, historial: sinPaso.concat([{ rol: 'persona', texto: 'La cena' }]) }, {});
  assert.equal(r.mensaje, 'Si llegas con hambre a la cena, te sirves de más.\n' + ruta.PREGUNTA_COACH);
  assert.deepEqual(r.opciones, ['Quiero que me guíen', 'Sigo por mi cuenta']);
  assert.match(r.ajuste, /tercera respuesta seguida sin ofrecerle nada/);
  assert.match(ruta.notaDelTurno('La cena', sinPaso, ruta.caminoPara(perfil, geoUY, {})), /no hagas otra pregunta de diagnóstico/);
  // Con un paso en el medio (un video, el WhatsApp) la cuenta vuelve a cero.
  const conVideo = sinPaso.slice(0, 2).concat([{ rol: 'persona', texto: 'x' }, { rol: 'equipo', texto: 'Mira este caso 👇 [Se le mostró el video «Ana Briones».]' }]);
  assert.equal(ruta.estadoDeLaCharla(conVideo).sinPaso, 0);
  const tras = ruta.resolverRespuesta(cruda, perfil, geoUY, [], 'La cena', 'c1', { numero: 3, historial: conVideo }, {});
  assert.equal(tras.mensaje, cruda.mensaje);
});

test('la pregunta de si quiere que la guíen va una sola vez, y nunca a quien eligió seguir por su cuenta', () => {
  const ofrecida = [{ rol: 'equipo', texto: 'Hola.\n' + ruta.PREGUNTA_COACH }, { rol: 'persona', texto: 'mmm' }, { rol: 'equipo', texto: 'Cuéntame.\n¿Entrenas?' }, { rol: 'persona', texto: 'No' }, { rol: 'equipo', texto: 'Ok.\n¿Por qué?' }];
  const cruda = { mensaje: 'Empezar es lo que más cuesta.\n¿Qué te frena?', accion: 'ninguna', calificacion: {} };
  assert.equal(ruta.resolverRespuesta(cruda, perfil, geoUY, [], 'Tiempo', 'c1', { numero: 4, historial: ofrecida }, {}).mensaje, cruda.mensaje);
  const suCuenta = [{ rol: 'equipo', texto: 'a\n¿b?' }, { rol: 'persona', texto: 'Sigo por mi cuenta' }, { rol: 'equipo', texto: 'c\n¿d?' }, { rol: 'persona', texto: 'e' }, { rol: 'equipo', texto: 'f\n¿g?' }];
  assert.equal(ruta.estadoDeLaCharla(suCuenta).porSuCuenta, true);
  assert.equal(ruta.resolverRespuesta(cruda, perfil, geoUY, [], 'Tiempo', 'c1', { numero: 4, historial: suCuenta }, {}).mensaje, cruda.mensaje);
  const nota = ruta.notaDelTurno('Sigo por mi cuenta', [{ rol: 'equipo', texto: 'Hola.\n' + ruta.PREGUNTA_COACH }], ruta.caminoPara(perfil, geoUY, {}));
  assert.match(nota, /Acaba de elegir seguir por su cuenta/);
  assert.match(nota, /no le ofrezcas el acompañamiento salvo que ella lo pida/);
});

test('«Quiero que me guíen» (el botón) va directo a WhatsApp', () => {
  const r = ruta.resolverRespuesta({ mensaje: 'Genial, te ayudamos.', accion: 'ninguna', calificacion: { objetivo: 'Bajar grasa' } }, nuevo, { pais: 'MX' }, [], 'Quiero que me guíen', 'c1',
    { numero: 2, historial: [{ rol: 'equipo', texto: 'Para bajar grasa…\n' + ruta.PREGUNTA_COACH }] }, {});
  assert.equal(r.tarjeta.tipo, 'whatsapp');
  assert.equal(r.registro.accion, 'pasar_a_whatsapp');
});

test('el agente no recibe la sesión en sus instrucciones ni pide negritas', () => {
  const prompt = require('../lib/ruta-chat-prompt.js');
  assert.doesNotMatch(prompt, /proponer_horarios|agendar|pensando en inscribirte/);
  assert.match(prompt, /sin negritas/);
  assert.match(prompt, new RegExp(ruta.PREGUNTA_COACH.replace(/[?¿()]/g, '\\$&')));
  assert.doesNotMatch(prompt, /\*\*/);
});
