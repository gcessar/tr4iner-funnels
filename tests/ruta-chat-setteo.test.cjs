// Reglas del servidor para el setteo del chat de la Ruta (3-nov-2026): WhatsApp
// válido, la sesión nunca como «gratis», el precio de entrada según el mercado y el
// WhatsApp de Anthoni o de Veronika según el registro.
const test = require('node:test');
const assert = require('node:assert/strict');
const ruta = require('../lib/ruta-chat.js');

const perfil = { email: 'x@y.com', nombre: 'Ana', atribucion: {}, orientaciones_completadas: 1, orientaciones_empezadas: 1 };
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
  assert.deepEqual(r.opciones, ['Tengo una duda']);
});

test('fuera de los mercados altos se puede decir «desde US$100» y nada más', () => {
  const ok = responder({ mensaje: 'Puedes empezar desde US$100 y el plan se arma según tu caso.', accion: 'ninguna', calificacion: {} }, '¿Cuánto cuesta?');
  assert.match(ok.mensaje, /US\$100/);
  const otro = responder({ mensaje: 'El plan de 3 meses sale US$397.', accion: 'ninguna', calificacion: {} }, '¿Cuánto cuesta?');
  assert.doesNotMatch(otro.mensaje, /397/);
});

test('en un mercado alto no llega ningún monto, ni el de entrada', () => {
  const r = responder({ mensaje: 'Puedes empezar desde US$100.', accion: 'ninguna', calificacion: {} }, '¿Cuánto cuesta?', { geo: geoUS, mercado: 'alto' });
  assert.doesNotMatch(r.mensaje, /US\$100/);
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

test('el contexto dice el precio de entrada sólo fuera de los mercados altos y no inventa ofertas', () => {
  const latam = ruta.contextoParaAgente(perfil, geoUY, 'latam', [], null, 'America/Montevideo', '', ruta.ecoValido(null));
  assert.match(latam, /"precio_desde_usd":100/);
  assert.match(latam, /OFERTA VIGENTE: ninguna/);
  const alto = ruta.contextoParaAgente(perfil, geoUS, 'alto', [], null, 'America/New_York', '', ruta.ecoValido(null));
  assert.match(alto, /"precio_desde_usd":null/);
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
