// Países que no ven las páginas que terminan en el WhatsApp de ManyChat (18-nov-2026, pedido
// del usuario: «para reducir costos en el uso de whatsapp de manychat»; «ninguno de allá nos
// compra»). Los decide la IP que informa Vercel (`x-vercel-ip-country`), no lo que la persona
// declare. Quien llega de uno de estos países:
//   /empezar y /empezar-va      → se desvía a /fit4 o /fit4-va antes de cargar la página.
//   los 7 casos con planes      → ve su video, y abajo un botón a Fit4 en vez del WhatsApp.
// La Ruta sigue abierta para todos; su botón a /empezar cae en el mismo desvío.

var LATAM = ['VE', 'CU', 'NI', 'HN'];
var ASIA = ['IN'];
// Los 54 países de África, más los territorios del continente con código propio (Sahara
// Occidental, Santa Elena, Reunión y Mayotte).
var AFRICA = [
  'DZ', 'AO', 'BJ', 'BW', 'BF', 'BI', 'CV', 'CM', 'CF', 'TD', 'KM', 'CG', 'CD', 'CI', 'DJ', 'EG',
  'GQ', 'ER', 'SZ', 'ET', 'GA', 'GM', 'GH', 'GN', 'GW', 'KE', 'LS', 'LR', 'LY', 'MG', 'MW', 'ML',
  'MR', 'MU', 'MA', 'MZ', 'NA', 'NE', 'NG', 'RW', 'ST', 'SN', 'SC', 'SL', 'SO', 'ZA', 'SS', 'SD',
  'TZ', 'TG', 'TN', 'UG', 'ZM', 'ZW',
  'EH', 'SH', 'RE', 'YT'
];
var PAISES_FIT4 = LATAM.concat(ASIA, AFRICA);

function vaAFit4(pais) {
  return PAISES_FIT4.indexOf(String(pais || '').trim().toUpperCase()) !== -1;
}

// La definición única de «tráfico VA» de AGENTS.md. Desde la Ruta (`utm_medium=RUTA-TR4INER`)
// manda el lado en que se registró el miembro: `funnel=AN` gana aunque las UTMs digan VA,
// igual que en assets/planes/planes.js.
function esTraficoVA(params) {
  var marcador = /(^|[-_])VA($|[-_])/i;
  var valor = function (clave) { return String(params.get(clave) || ''); };
  var funnel = valor('funnel').toUpperCase();
  if (funnel === 'AN') return false;
  if (funnel === 'VA') return true;
  var campana = valor('utm_campaign').toUpperCase();
  if (campana === 'TR4INER-VA' || campana === 'CASOS-VA') return true;
  if (marcador.test(valor('funnel_variant'))) return true;
  var va = false;
  params.forEach(function (v, clave) { if (clave.indexOf('utm_') === 0 && marcador.test(String(v))) va = true; });
  return va;
}

// La página de Fit4 que le toca, con todos los parámetros de la URL original (cada salto
// reenvía toda la atribución). /empezar-va es de Veronika: siempre a /fit4-va.
function destinoFit4(url) {
  var origen = new URL(url);
  var pagina = origen.pathname.replace(/\/+$/, '');
  var ruta = pagina === '/empezar-va' || esTraficoVA(origen.searchParams) ? '/fit4-va' : '/fit4';
  var destino = new URL(ruta, origen);
  origen.searchParams.forEach(function (v, clave) {
    if (clave !== 'geo_pais') destino.searchParams.append(clave, v);
  });
  return destino.toString();
}

module.exports = { PAISES_FIT4: PAISES_FIT4, vaAFit4: vaAFit4, esTraficoVA: esTraficoVA, destinoFit4: destinoFit4 };
