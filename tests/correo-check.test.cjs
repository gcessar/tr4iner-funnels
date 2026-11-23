const test = require('node:test');
const assert = require('node:assert');
require('../biblioteca/assets/correo-check.js');
const { revisar } = globalThis.TR4Correo;

// Mismos casos que src/lib/email/revisar-correo.test.ts del CRM: los dos tienen que dar igual.
test('propone la corrección de los errores reales de la Ruta', () => {
  [
    ['ana@gamil.com', 'ana@gmail.com'], ['ana@gmail.con', 'ana@gmail.com'], ['ana@gmail.coma', 'ana@gmail.com'],
    ['ana@gimail.com', 'ana@gmail.com'], ['ana@hmail.com', 'ana@gmail.com'], ['ana@gmail.com.com', 'ana@gmail.com'],
    ['ana@gmailcom', 'ana@gmail.com'], ['ana@688gmail.com', 'ana@gmail.com'], ['ana@hotmail.con', 'ana@hotmail.com'],
    ['ana@hotamil.com', 'ana@hotmail.com'], ['ana@iclud.com', 'ana@icloud.com'], ['ana@yahoo.con', 'ana@yahoo.com'],
    ['ana@ymail.comr', 'ana@ymail.com'], ['Ana@Gmail.Con ', 'ana@gmail.com'],
  ].forEach(([entra, sale]) => {
    const r = revisar(entra);
    assert.strictEqual(r.estado, 'sugerencia', entra);
    assert.strictEqual(r.sugerencia, sale, entra);
  });
});

test('dos puntos seguidos: corrección obligatoria', () => {
  assert.strictEqual(revisar('ana@gmail..com').obligatoria, true);
  assert.strictEqual(revisar('ana@gamil.com').obligatoria, false);
});

test('no toca dominios reales', () => {
  ['ana@gmail.com', 'ana@hotmail.es', 'ana@outlook.com.pe', 'ana@yahoo.fr', 'ana@ymail.com', 'ana@mail.com',
    'ana@mail.irsc.edu', 'ana@abc.mozmail.com', 'ana@tr4iner.com', 'ana.perez+ruta@gmail.com'].forEach((ok) => {
    assert.strictEqual(revisar(ok).estado, 'ok', ok);
  });
});

test('sin arreglo: inválido', () => {
  ['', 'ana', 'ana@', '@gmail.com', 'ana@gmail', 'ana perez@gmail.com', 'ana..p@gmail.com'].forEach((m) => {
    assert.strictEqual(revisar(m).estado, 'invalido', m);
  });
});
