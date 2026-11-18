const test = require('node:test');
const assert = require('node:assert');
const { PAISES_FIT4, vaAFit4, destinoFit4 } = require('../lib/paises-fit4');

test('la lista trae los 5 de Latinoamérica, India y los 54 países de África', () => {
  ['VE', 'CU', 'NI', 'HN', 'BO', 'IN', 'NG', 'ZA', 'EG', 'MA', 'KE'].forEach((p) => assert.ok(vaAFit4(p), p));
  assert.strictEqual(new Set(PAISES_FIT4).size, PAISES_FIT4.length);
  assert.strictEqual(PAISES_FIT4.length, 6 + 54 + 4);
});

test('el resto sigue de largo', () => {
  ['PE', 'US', 'MX', 'ES', 'CO', 'AR', 'CL', 'GT', 'SV', '', undefined].forEach((p) => assert.ok(!vaAFit4(p), String(p)));
  assert.ok(vaAFit4(' ve '));
});

test('/empezar con UTMs de AN va a /fit4 con toda la atribución', () => {
  const d = new URL(destinoFit4('https://metodo.tr4iner.com/empezar?utm_source=MetaAds&utm_campaign=TR4INER-AN&fbclid=x1&email=a%40b.com'));
  assert.strictEqual(d.pathname, '/fit4');
  assert.strictEqual(d.searchParams.get('utm_source'), 'MetaAds');
  assert.strictEqual(d.searchParams.get('fbclid'), 'x1');
  assert.strictEqual(d.searchParams.get('email'), 'a@b.com');
});

test('/empezar con el marcador VA va a /fit4-va', () => {
  assert.strictEqual(new URL(destinoFit4('https://x.com/empezar?utm_campaign=TR4INER-VA')).pathname, '/fit4-va');
  assert.strictEqual(new URL(destinoFit4('https://x.com/empezar/?utm_source=YOUTUBE-VA-descripcion')).pathname, '/fit4-va');
  assert.strictEqual(new URL(destinoFit4('https://x.com/empezar?funnel=VA')).pathname, '/fit4-va');
  assert.strictEqual(new URL(destinoFit4('https://x.com/empezar?utm_campaign=NAVA-2026')).pathname, '/fit4');
});

test('desde la Ruta manda funnel: AN gana aunque las UTMs digan VA', () => {
  assert.strictEqual(new URL(destinoFit4('https://x.com/empezar?utm_medium=RUTA-TR4INER&funnel=AN&utm_campaign=TR4INER-VA')).pathname, '/fit4');
});

test('/empezar-va siempre va a /fit4-va y geo_pais no viaja', () => {
  const d = new URL(destinoFit4('https://x.com/empezar-va?geo_pais=VE&utm_source=IG'));
  assert.strictEqual(d.pathname, '/fit4-va');
  assert.strictEqual(d.searchParams.get('geo_pais'), null);
  assert.strictEqual(d.searchParams.get('utm_source'), 'IG');
});
