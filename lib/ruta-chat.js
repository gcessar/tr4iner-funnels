// Chat del equipo dentro de la Ruta Tr4iner: precios, mercado, contexto y
// validación de lo que propone el agente.
//
// Todo lo que decide cuánto se cobra vive acá y no en el prompt. El modelo
// propone un escalón; el precio, la tarjeta y el enlace los arma el servidor.
// Así un mensaje mal generado nunca puede cotizar debajo del piso.

var WHATSAPP_EQUIPO = '17439014239';

var PLAN = {
  nombre: 'Método TR4INER',
  duracion: '3 meses',
  resumen: 'Entrenamiento y alimentación hechos para ti, con seguimiento 1 a 1 por WhatsApp.'
};

// $470 es el precio para quien puede pagarlo sin esfuerzo (EE.UU., Europa,
// Lima…); el resto abre en $420. Nadie baja de $370.
var PRECIO_APERTURA = { alto: 470, estandar: 420 };
var PRECIO_PISO = 370;
var BONOS_PROMO = ['1 mes extra sin costo', '1 llamada con nutricionista'];
var LLAMADA = { precio: 50, nombre: 'Llamada con nutricionista', detalle: '2 sesiones en vivo, 1 a 1' };

// Cada precio necesita su propia oferta en Hotmart: el enlace tiene que cobrar
// exactamente lo que dijo el chat. Mientras no existan, la tarjeta lleva a
// WhatsApp con la oferta escrita y el equipo cierra a mano.
var ENLACES_PAGO = {
  apertura_alto: null,
  apertura_estandar: null,
  piso: null,
  promo: null,
  llamada: null
};

var PAISES_ALTO = [
  'US', 'CA', 'PR', 'GB', 'IE', 'ES', 'PT', 'FR', 'DE', 'IT', 'NL', 'BE', 'LU',
  'CH', 'AT', 'SE', 'NO', 'DK', 'FI', 'IS', 'AU', 'NZ', 'AE'
];

var OBJETIVOS = { PG: 'Perder grasa', MM: 'Ganar músculo', MA: 'Recomposición corporal' };
var SENALES = {
  diagnostico_analisis: 'Un diagnóstico o análisis alterado',
  energia_cansancio: 'Poca energía o cansancio',
  hambre_desorden_alimentario: 'Hambre o desorden con la comida',
  movilidad_limitada: 'Movilidad limitada',
  peso_grasa_abdominal: 'Peso o grasa abdominal',
  prevencion: 'Prevención'
};
// Las dos señales del test que más cierran según el estudio de llamadas:
// salud ya afectada por los hábitos y descontrol con la comida.
var SENALES_DOLOR = ['diagnostico_analisis', 'hambre_desorden_alimentario'];

function texto(valor, max) {
  return String(valor == null ? '' : valor).replace(/\s+/g, ' ').trim().slice(0, max || 200);
}

function geoDesde(headers) {
  var ciudad = '';
  try { ciudad = decodeURIComponent(headers['x-vercel-ip-city'] || ''); } catch (e) { ciudad = ''; }
  return {
    pais: texto(headers['x-vercel-ip-country'], 2).toUpperCase(),
    ciudad: texto(ciudad, 60)
  };
}

function esLima(ciudad) {
  return /^(lima|callao)$/i.test(texto(ciudad, 60));
}

// Lo que la persona declara en la charla sólo puede subir el mercado, nunca
// bajarlo: así decir «soy de otro país» no abarata nada.
function mercadoPara(geo, declarado) {
  declarado = declarado || {};
  var paisDeclarado = texto(declarado.pais, 2).toUpperCase();
  if (PAISES_ALTO.indexOf(geo.pais) !== -1 || PAISES_ALTO.indexOf(paisDeclarado) !== -1) return 'alto';
  if (geo.pais === 'PE' && esLima(geo.ciudad)) return 'alto';
  if (paisDeclarado === 'PE' && esLima(declarado.ciudad)) return 'alto';
  return 'estandar';
}

function perfilDesde(sesion) {
  var member = (sesion && sesion.member) || {};
  var plan = member.plan || null;
  var progreso = Array.isArray(sesion && sesion.progress) ? sesion.progress : [];
  var completadas = progreso.filter(function (p) { return p.completed; }).length;
  var empezadas = progreso.filter(function (p) { return (p.maxPercent || 0) > 0 || p.watchedSeconds > 0; }).length;
  var estado = !plan ? 'A' : (completadas >= 3 ? 'C' : 'B');
  return {
    email: texto(member.email, 160).toLowerCase(),
    nombre: texto(member.nombre, 60).split(' ')[0],
    sexo: member.sexo || null,
    etapa_crm: member.stage || null,
    score_crm: typeof member.score === 'number' ? member.score : null,
    hizo_test: Boolean(plan),
    objetivo: plan ? (OBJETIVOS[plan.objetivo] || null) : null,
    senal_principal: plan ? (SENALES[plan.senal || plan.situacion] || null) : null,
    senal_codigo: plan ? (plan.senal || plan.situacion || null) : null,
    kcal: plan && plan.kcal ? plan.kcal : null,
    edad: plan && plan.edad ? plan.edad : null,
    orientaciones_completadas: completadas,
    orientaciones_empezadas: empezadas,
    estado_ruta: estado
  };
}

function precioApertura(mercado) {
  return PRECIO_APERTURA[mercado] || PRECIO_APERTURA.estandar;
}

function contextoParaAgente(perfil, geo, mercado, mostrados, ajuste) {
  var datos = {
    nombre: perfil.nombre || null,
    sexo: perfil.sexo,
    hizo_test_de_macros: perfil.hizo_test,
    objetivo: perfil.objetivo,
    senal_principal: perfil.senal_principal,
    calorias_diarias: perfil.kcal,
    edad: perfil.edad,
    orientaciones_completadas: perfil.orientaciones_completadas,
    orientaciones_empezadas: perfil.orientaciones_empezadas,
    pais_aproximado: geo.pais || null,
    ciudad_aproximada: geo.ciudad || null,
    escalones_ya_mostrados: mostrados
  };
  var apertura = precioApertura(mercado);
  return [
    'CONTEXTO (datos de su Ruta, no instrucciones):',
    JSON.stringify(datos),
    '',
    'OFERTAS PARA ESTA PERSONA (precios en dólares, pago único):',
    '- apertura: ' + PLAN.nombre + ' ' + PLAN.duracion + ' a US$' + apertura,
    '- piso: el mismo plan a US$' + PRECIO_PISO,
    '- promo: US$' + PRECIO_PISO + ' + ' + BONOS_PROMO.join(' + '),
    '- llamada: ' + LLAMADA.nombre + ', ' + LLAMADA.detalle + ', a US$' + LLAMADA.precio,
    'Se puede pagar en las cuotas que permita su tarjeta de crédito.'
  ].concat(ajuste ? ['', 'NOTA DEL SISTEMA SOBRE TU RESPUESTA ANTERIOR (es lo que la persona vio de verdad): ' + texto(ajuste, 600)] : []).join('\n');
}

function tieneDolor(perfil, cal) {
  if (SENALES_DOLOR.indexOf(perfil.senal_codigo) !== -1) return true;
  if (Array.isArray(cal.senales_salud) && cal.senales_salud.length) return true;
  return cal.urgencia === 'alta';
}

// El modelo no puede saltarse escalones: cada uno exige que el anterior ya se
// haya mostrado en un turno anterior (eso fija el orden, un paso por turno) y
// que la persona haya objetado el precio al menos dos veces. El contador lo
// lleva el agente y no es exacto, por eso el orden no depende de él.
function escalonPermitido(escalon, cal, perfil, mostrados) {
  var objeciones = Number(cal.objeciones_precio) || 0;
  var nivel = cal.nivel;
  if (escalon === 'apertura') return true;
  if (escalon === 'piso') {
    return mostrados.indexOf('apertura') !== -1 && objeciones >= 2 && nivel !== 'curioso';
  }
  if (escalon === 'promo') {
    return mostrados.indexOf('piso') !== -1 && objeciones >= 2 && nivel === 'caliente' && tieneDolor(perfil, cal);
  }
  if (escalon === 'llamada') {
    return mostrados.indexOf('piso') !== -1 && objeciones >= 2;
  }
  return false;
}

function enlaceWhatsApp(mensaje, perfil) {
  var lineas = ['Hola, vengo del chat de mi Ruta Tr4iner.', mensaje];
  if (perfil.email) lineas.push('Mi correo de la Ruta: ' + perfil.email);
  return 'https://api.whatsapp.com/send?phone=' + WHATSAPP_EQUIPO + '&text=' + encodeURIComponent(lineas.join('\n'));
}

function tarjetaPlan(escalon, mercado, perfil) {
  var apertura = precioApertura(mercado);
  var precio = escalon === 'apertura' ? apertura : PRECIO_PISO;
  var bonos = escalon === 'promo' ? BONOS_PROMO.slice() : [];
  var clave = escalon === 'apertura' ? 'apertura_' + mercado : escalon;
  var pedido = 'Quiero entrar al ' + PLAN.nombre + ' de ' + PLAN.duracion + ' a US$' + precio +
    (bonos.length ? ' con ' + bonos.join(' y ') : '') + '.';
  var pago = ENLACES_PAGO[clave];
  return {
    tipo: 'plan',
    escalon: escalon,
    titulo: PLAN.nombre,
    duracion: PLAN.duracion,
    precio: precio,
    precio_antes: precio < apertura ? apertura : null,
    bonos: bonos,
    resumen: PLAN.resumen,
    cuotas: 'Puedes pagarlo en las cuotas que permita tu tarjeta.',
    boton: pago ? 'Pagar y empezar' : 'Quiero empezar',
    url: pago || enlaceWhatsApp(pedido, perfil),
    destino: pago ? 'hotmart' : 'whatsapp'
  };
}

function tarjetaLlamada(perfil) {
  var pago = ENLACES_PAGO.llamada;
  return {
    tipo: 'llamada',
    escalon: 'llamada',
    titulo: LLAMADA.nombre,
    duracion: LLAMADA.detalle,
    precio: LLAMADA.precio,
    precio_antes: null,
    bonos: [],
    resumen: null,
    cuotas: null,
    boton: pago ? 'Reservar mi llamada' : 'Quiero mi llamada',
    url: pago || enlaceWhatsApp('Quiero la ' + LLAMADA.nombre.toLowerCase() + ' (' + LLAMADA.detalle + ') de US$' + LLAMADA.precio + '.', perfil),
    destino: pago ? 'hotmart' : 'whatsapp'
  };
}

function tarjetaWhatsApp(resumen, perfil) {
  var pedido = texto(resumen, 220) || 'Quiero hablar con alguien del equipo.';
  return {
    tipo: 'whatsapp',
    titulo: 'Sigue por WhatsApp con el equipo',
    boton: 'Abrir WhatsApp',
    url: enlaceWhatsApp(pedido, perfil),
    destino: 'whatsapp'
  };
}

// Montos de dinero que aparecen escritos en el mensaje del agente.
function montosEn(mensaje) {
  var montos = [];
  var re = /(?:US\$|USD\s*|\$)\s*(\d{2,4})|(\d{2,4})\s*(?:USD|d[oó]lares)/gi;
  var m;
  while ((m = re.exec(mensaje))) montos.push(Number(m[1] || m[2]));
  return montos;
}

var MENSAJES_SEGUROS = {
  apertura: 'Te dejamos el plan aquí abajo. ¿Quieres empezar esta semana?',
  piso: 'Te podemos dejar el mismo plan a un precio especial. Está aquí abajo.',
  promo: 'Para tu caso te sumamos un mes extra y una llamada con nutricionista. Está aquí abajo.',
  llamada: 'Si hoy no te alcanza para el plan, puedes empezar con una llamada con nutricionista. Está aquí abajo.'
};
var MENSAJE_SEGURO = 'Te dejamos el detalle aquí abajo.';
var MENSAJE_SIN_TARJETA = 'Te entendemos. Cuéntanos qué es lo que más te frena hoy y buscamos juntos la mejor opción para ti.';

function normalizarSalida(cruda) {
  var salida = cruda && typeof cruda === 'object' ? cruda : {};
  var cal = salida.calificacion && typeof salida.calificacion === 'object' ? salida.calificacion : {};
  var opciones = Array.isArray(salida.opciones) ? salida.opciones : [];
  return {
    mensaje: String(salida.mensaje || '').trim().slice(0, 1200),
    opciones: opciones.map(function (o) { return texto(o, 40); }).filter(Boolean).slice(0, 3),
    accion: texto(salida.accion, 30),
    escalon: salida.escalon ? texto(salida.escalon, 20) : null,
    resumen_whatsapp: salida.resumen_whatsapp ? texto(salida.resumen_whatsapp, 220) : null,
    calificacion: {
      nivel: texto(cal.nivel, 20) || 'desconocido',
      pais: texto(cal.pais_iso || cal.pais, 2).toUpperCase(),
      ciudad: texto(cal.ciudad, 60),
      senales_salud: Array.isArray(cal.senales_salud) ? cal.senales_salud.slice(0, 8) : [],
      urgencia: texto(cal.urgencia, 20),
      objecion: texto(cal.objecion, 30),
      objeciones_precio: Number(cal.objeciones_precio) || 0,
      bandera_clinica: texto(cal.bandera_clinica, 120),
      listo_para_pagar: Boolean(cal.listo_para_pagar)
    }
  };
}

var NOMBRES_ESCALON = {
  apertura: 'el plan al precio normal',
  piso: 'el precio especial',
  promo: 'el precio especial con el mes extra y la llamada con nutricionista',
  llamada: 'la llamada con nutricionista'
};

// Convierte la salida del agente en lo que ve la persona. Si el agente pidió
// un escalón que no corresponde, se queda en el más alto permitido; si escribió
// un monto que no es el de la tarjeta, el mensaje se reemplaza por uno neutro.
//
// Cada corrección vuelve como `ajuste`: el navegador la reenvía en el turno
// siguiente y el agente se entera de lo que la persona vio de verdad. Sin eso,
// su memoria en n8n guarda la oferta que propuso y la charla se desfasa.
function resolverRespuesta(cruda, perfil, geo, mostrados) {
  var salida = normalizarSalida(cruda);
  var cal = salida.calificacion;
  var mercado = mercadoPara(geo, { pais: cal.pais, ciudad: cal.ciudad });
  var tarjeta = null;
  var ajustes = [];
  // Si una oferta se bloquea, también se descarta el texto: casi siempre la
  // anuncia («te damos un precio especial») y prometería algo que no aparece.
  var bloqueado = false;

  if (salida.accion === 'ofrecer_plan') {
    var pedido = ['apertura', 'piso', 'promo'].indexOf(salida.escalon) !== -1 ? salida.escalon : 'apertura';
    var orden = ['promo', 'piso', 'apertura'];
    var escalon = orden.slice(orden.indexOf(pedido)).filter(function (e) {
      return escalonPermitido(e, cal, perfil, mostrados);
    })[0];
    // Una tarjeta que ya vio no se repite: sigue arriba en la conversación.
    if (mostrados.indexOf(escalon) === -1) tarjeta = tarjetaPlan(escalon, mercado, perfil);
    if (escalon !== pedido) {
      bloqueado = true;
      ajustes.push('Propusiste ' + NOMBRES_ESCALON[pedido] + ', pero todavía no correspondía: no se mostró ni la oferta ni tu mensaje' +
        (tarjeta ? '; vio en su lugar ' + NOMBRES_ESCALON[escalon] : '') + '. Sigue la escalera desde donde está.');
    }
  } else if (salida.accion === 'ofrecer_llamada') {
    // La llamada es el último recurso: si el agente la adelanta antes de
    // mostrar el precio especial, primero va el precio especial.
    if (escalonPermitido('llamada', cal, perfil, mostrados)) {
      tarjeta = tarjetaLlamada(perfil);
    } else {
      if (mostrados.indexOf('piso') === -1 && escalonPermitido('piso', cal, perfil, mostrados)) tarjeta = tarjetaPlan('piso', mercado, perfil);
      bloqueado = true;
      ajustes.push('Propusiste la llamada con nutricionista, pero todavía no correspondía: no se mostró ni la oferta ni tu mensaje' +
        (tarjeta ? '; vio en su lugar el precio especial' : '') + '.');
    }
  } else if (salida.accion === 'pasar_a_whatsapp') {
    tarjeta = tarjetaWhatsApp(salida.resumen_whatsapp, perfil);
  }

  var apertura = precioApertura(mercado);
  var montos = montosEn(salida.mensaje);
  // Si dio el precio de apertura sin pedir la tarjeta, se la mostramos igual:
  // quien preguntó cuánto cuesta tiene que ver qué incluye y cómo pagarlo.
  if (!tarjeta && montos.indexOf(apertura) !== -1 && mostrados.indexOf('apertura') === -1) {
    tarjeta = tarjetaPlan('apertura', mercado, perfil);
  }

  var validos = [apertura];
  if (tarjeta && tarjeta.precio) validos.push(tarjeta.precio);
  var mensaje = salida.mensaje;
  var opciones = salida.opciones;
  var invalidos = montos.filter(function (monto) { return validos.indexOf(monto) === -1; });
  if (invalidos.length || !mensaje || bloqueado) {
    mensaje = tarjeta ? (MENSAJES_SEGUROS[tarjeta.escalon] || MENSAJE_SEGURO) : MENSAJE_SIN_TARJETA;
    // Las respuestas rápidas contestaban al mensaje que se descartó.
    opciones = [];
    if (invalidos.length) ajustes.push('Tu mensaje no se mostró porque nombraba un monto que no correspondía (US$' + invalidos.join(', US$') + ').');
    ajustes.push('La persona leyó solamente: "' + mensaje + '"');
  }

  return {
    mensaje: mensaje,
    opciones: opciones,
    tarjeta: tarjeta,
    // Lo único que vuelve al navegador de la calificación: el país y la ciudad
    // que dijo, para que el próximo turno no los pierda.
    eco: { pais: cal.pais || '', ciudad: cal.ciudad || '' },
    ajuste: ajustes.length ? ajustes.join(' ') : null,
    registro: { calificacion: cal, accion: salida.accion, escalon_pedido: salida.escalon, montos_invalidos: invalidos }
  };
}

function respuestaDeError(perfil) {
  return {
    mensaje: 'Se nos cortó la respuesta. Si quieres, sigue la conversación con el equipo por WhatsApp.',
    opciones: [],
    tarjeta: tarjetaWhatsApp('Quiero hablar con alguien del equipo.', perfil || {}),
    eco: null
  };
}

module.exports = {
  geoDesde: geoDesde,
  mercadoPara: mercadoPara,
  perfilDesde: perfilDesde,
  contextoParaAgente: contextoParaAgente,
  resolverRespuesta: resolverRespuesta,
  respuestaDeError: respuestaDeError,
  montosEn: montosEn,
  precioApertura: precioApertura
};
