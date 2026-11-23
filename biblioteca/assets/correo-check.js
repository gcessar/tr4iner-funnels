/*
 * Revisión del correo en el registro de la Ruta (23-nov-2026).
 *
 * Copia del algoritmo del CRM (`src/lib/email/revisar-correo.ts`, con sus tests): si se toca
 * uno, se toca el otro. Existe porque casi todos los rebotes del enlace de acceso eran
 * direcciones mal escritas (gamil.com, gmail.con, gmail..com): esa persona se registraba y
 * nunca recibía su ruta. Sobre los 33.959 registros, 520 (1,5%) tenían un error así.
 *
 *   TR4Correo.revisar('ana@gamil.com')
 *   → { estado: 'sugerencia', correo: 'ana@gamil.com', sugerencia: 'ana@gmail.com', obligatoria: false }
 *
 * 'sugerencia' no bloquea (puede ser su dirección real); 'obligatoria' sí, porque lo escrito
 * no tiene formato válido. 'invalido' no tiene arreglo.
 */
(function (global) {
  var REALES = {};
  [
    'gmail.com', 'googlemail.com', 'hotmail.com', 'outlook.com', 'live.com', 'yahoo.com', 'icloud.com',
    'me.com', 'mac.com', 'msn.com', 'aol.com', 'ymail.com', 'rocketmail.com', 'mail.com', 'email.com',
    'gmx.com', 'gmx.es', 'gmx.net', 'gmx.de', 'proton.me', 'protonmail.com', 'pm.me', 'zoho.com',
    'yandex.com', 'yandex.ru', 'tutanota.com', 'inbox.com', 'hey.com', 'fastmail.com',
    'mozmail.com', 'duck.com', 'privaterelay.appleid.com', 'yopmail.com', 'yopmail.fr'
  ].forEach(function (d) { REALES[d] = true; });

  var PROVEEDORES = { gmail: 'solo-com', icloud: 'solo-com', hotmail: 'pais', outlook: 'pais', yahoo: 'pais', live: 'pais', ymail: 'solo-com' };
  var SIN_PARECIDO = { live: true, ymail: true };
  var TYPOS_COM = {};
  ['con', 'cmo', 'comm', 'coml', 'come', 'comn', 'comf', 'comi', 'comy', 'comc', 'coms', 'comd', 'comj', 'comg',
    'comom', 'comcom', 'cpm', 'xom', 'vom', 'cim', 'clm', 'ocm', 'om', 'c', 'co', 'coma', 'cm', 'conm', 'cok'
  ].forEach(function (t) { TYPOS_COM[t] = true; });

  function damerau(a, b) {
    var d = [], i, j;
    for (i = 0; i <= a.length; i++) { d[i] = [i]; for (j = 1; j <= b.length; j++) d[i][j] = 0; }
    for (j = 0; j <= b.length; j++) d[0][j] = j;
    for (i = 1; i <= a.length; i++) {
      for (j = 1; j <= b.length; j++) {
        var costo = a[i - 1] === b[j - 1] ? 0 : 1;
        d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + costo);
        if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
      }
    }
    return d[a.length][b.length];
  }

  function formatoValido(correo) {
    if (correo.length > 254 || /\s/.test(correo)) return false;
    var partes = correo.split('@');
    if (partes.length !== 2) return false;
    var local = partes[0], dominio = partes[1];
    if (!local || local.length > 64 || !dominio) return false;
    if (/^\.|\.$|\.\./.test(local)) return false;
    var etiquetas = dominio.split('.');
    if (etiquetas.length < 2) return false;
    for (var i = 0; i < etiquetas.length; i++) {
      if (!/^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/i.test(etiquetas[i])) return false;
    }
    return /^[a-z]{2,24}$/i.test(etiquetas[etiquetas.length - 1]);
  }

  function proveedorParecido(etiqueta) {
    if (PROVEEDORES[etiqueta]) return etiqueta;
    if (etiqueta === 'mail' || etiqueta.indexOf('yop') === 0) return null;
    var mejor = null, mejorD = Infinity;
    for (var p in PROVEEDORES) {
      if (SIN_PARECIDO[p]) continue;
      var tope = p.length >= 6 ? 2 : 1;
      var dist = damerau(etiqueta, p);
      if (dist <= tope && dist < mejorD) { mejor = p; mejorD = dist; }
    }
    if (mejor) return mejor;
    var pegados = ['gmail', 'hotmail', 'outlook', 'icloud'];
    for (var k = 0; k < pegados.length; k++) {
      var q = pegados[k];
      if (etiqueta.length > q.length && etiqueta.slice(-q.length) === q && etiqueta.length - q.length <= 6) return q;
    }
    return null;
  }

  function terminacionValida(tipo, resto) {
    var t = resto.join('.');
    if (t === 'com') return true;
    if (tipo === 'solo-com') return false;
    return (/^[a-z]{2}$/.test(t) && t !== 'co') || /^com\.[a-z]{2}$/.test(t) || /^co\.[a-z]{2}$/.test(t);
  }

  function sugerirDominio(dominio) {
    var limpio = dominio.replace(/\.{2,}/g, '.').replace(/^\.+|\.+$/g, '').replace(/,/g, '.');
    if (limpio.indexOf('.') === -1) {
      var m = limpio.match(/^(gmail|hotmail|outlook|yahoo|icloud)(com)$/);
      return m ? m[1] + '.com' : null;
    }
    if (REALES[limpio]) return limpio === dominio ? null : limpio;
    var partes = limpio.split('.');
    var etiqueta = partes[0], resto = partes.slice(1);
    var proveedor = proveedorParecido(etiqueta);
    if (!proveedor) {
      var quedaSoloTerminacion = /^(com|con|net|org|co|edu|gob)$/.test(etiqueta);
      return limpio !== dominio && !quedaSoloTerminacion ? limpio : null;
    }
    var tipo = PROVEEDORES[proveedor];
    var exacto = proveedor === etiqueta;
    var terminacion = resto;
    if (!terminacionValida(tipo, terminacion)) {
      var pareceCom = !!TYPOS_COM[terminacion[0]] || terminacion[0].indexOf('com') === 0;
      if (pareceCom || (tipo === 'solo-com' && exacto)) terminacion = ['com'];
      else return null;
    }
    var propuesto = proveedor + '.' + terminacion.join('.');
    return propuesto === dominio ? null : propuesto;
  }

  function revisar(valor) {
    var correo = String(valor == null ? '' : valor).trim().toLowerCase().replace(/^mailto:/, '');
    var arroba = correo.lastIndexOf('@');
    if (arroba <= 0) return { estado: 'invalido', correo: correo };
    var local = correo.slice(0, arroba).replace(/^\.+|\.+$/g, '');
    var dominio = correo.slice(arroba + 1);
    var dominioSugerido = sugerirDominio(dominio);
    if (dominioSugerido) {
      var sugerencia = local + '@' + dominioSugerido;
      if (formatoValido(sugerencia)) return { estado: 'sugerencia', correo: correo, sugerencia: sugerencia, obligatoria: !formatoValido(correo) };
    }
    if (!formatoValido(correo)) return { estado: 'invalido', correo: correo };
    return { estado: 'ok', correo: correo };
  }

  global.TR4Correo = { revisar: revisar, formatoValido: formatoValido };
})(typeof window !== 'undefined' ? window : globalThis);
