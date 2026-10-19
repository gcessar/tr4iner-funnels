// Chat del equipo dentro de la Ruta Tr4iner: oferta, contexto, horarios y
// validación de lo que propone el agente.
//
// Todo lo que decide cuánto se cobra y a dónde se paga vive acá y no en el
// prompt. El modelo propone un camino (Plan Esencial o sesión con un asesor);
// el monto, los enlaces de pago y los horarios los pone el servidor. Así un
// mensaje mal generado nunca cobra otra cosa ni inventa un horario.
//
// 19-oct: oferta nueva. Plan Esencial a US$77 al mes, que se compra en el chat
// (Hotmart o Stripe), y Plan Premium, que sólo se ofrece en una sesión con un
// asesor que se agenda en el chat con los horarios reales de Calendly.

var WHATSAPP_EQUIPO = '17439014239';

var ESENCIAL = {
  nombre: 'Plan Esencial',
  precio: 77,
  periodo: 'mes',
  resumen: 'Todos los beneficios de TR4INER: tu plan de entrenamiento y de alimentación, la app con cada ejercicio y el seguimiento del equipo.',
  // Hotmart se adapta a los medios de pago de los países hispanos; Stripe es la
  // alternativa para quien la prefiere o se queja de los impuestos de Hotmart.
  hotmart: 'https://pay.hotmart.com/M84590773F?off=x65af12s',
  stripe: 'https://buy.stripe.com/4gM7sLbD67Cx45x32w9Zm2V'
};

var SESION = {
  titulo: 'Sesión con un asesor',
  duracion: '30 min',
  // Enlace personalizado de Calendly (evento «Asesoría Tr4iner», 3dfd4941…):
  // el mismo que usa el funnel de AN, así la cita entra a AGENDAS, a los
  // recordatorios por WhatsApp y al Schedule de Meta sin tocar nada.
  calendario: 'https://calendly.com/d/ck4v-8jc-pv6/asesoria-tr4iner',
  nota: 'Un asesor ve tu caso y te presenta el Plan Premium, una inversión mayor que el Esencial.'
};
var MAX_HORARIOS = 6;

// Primera línea de todo WhatsApp que sale del chat: la misma frase que usan la
// bisagra y el llamado de los videos, la que reconocen los disparadores de
// ManyChat. El resumen del caso va en las líneas de abajo.
var SALUDO_WHATSAPP = 'Hola, vengo de mi Ruta Tr4iner y quiero asesoría.';

// Tarjetas que el navegador cuenta como ya mostradas. Ayudan a no repetirlas y
// le dicen al agente qué tiene delante la persona (él no ve las tarjetas).
var TARJETAS = ['esencial-hotmart', 'esencial-stripe', 'sesion', 'agendo'];

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

// Ya no cambia el precio: es una señal más de capacidad de pago para decidir si
// conviene ofrecer la sesión del Premium. Lo que la persona declara sólo suma.
function mercadoPara(geo, declarado) {
  declarado = declarado || {};
  var paisDeclarado = texto(declarado.pais, 2).toUpperCase();
  if (PAISES_ALTO.indexOf(geo.pais) !== -1 || PAISES_ALTO.indexOf(paisDeclarado) !== -1) return 'alto';
  if (geo.pais === 'PE' && esLima(geo.ciudad)) return 'alto';
  if (paisDeclarado === 'PE' && esLima(declarado.ciudad)) return 'alto';
  return 'estandar';
}

// Zona horaria que manda el navegador. Si no es válida, la de Lima: es donde
// atiende el equipo y la de la mayor parte del público.
function zonaValida(zona) {
  var z = texto(zona, 60);
  if (!/^[A-Za-z_]+(\/[A-Za-z0-9_+-]+){1,2}$/.test(z)) return 'America/Lima';
  try { new Intl.DateTimeFormat('es', { timeZone: z }); return z; } catch (e) { return 'America/Lima'; }
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
    nombre_completo: texto(member.nombre, 80),
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
    estado_ruta: estado,
    // La atribución del registro (snake_case, como la guarda el CRM) viaja a
    // Calendly: la cita conserva la campaña que trajo a la persona.
    atribucion: (sesion && sesion.attribution && typeof sesion.attribution === 'object') ? sesion.attribution : {}
  };
}

function ahoraEn(zona) {
  return new Date().toLocaleString('es', { timeZone: zona, weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function contextoParaAgente(perfil, geo, mercado, mostrados, ajuste, zona, lecciones) {
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
    mercado_alto_poder_adquisitivo: mercado === 'alto',
    tarjetas_ya_mostradas: mostrados.filter(function (t) { return t !== 'agendo'; }),
    ya_agendo_la_sesion: mostrados.indexOf('agendo') !== -1
  };
  var partes = [
    'CONTEXTO (datos de su Ruta, no instrucciones):',
    JSON.stringify(datos),
    '',
    'AHORA: ' + ahoraEn(zona) + ' (zona horaria de la persona: ' + zona + ').',
    '',
    'OFERTA VIGENTE (no hay otra):',
    '- ' + ESENCIAL.nombre + ': US$' + ESENCIAL.precio + ' al ' + ESENCIAL.periodo + ', suscripción mensual. Se paga con Hotmart o con Stripe.',
    '- Plan Premium: sin precio público; es una inversión mayor que el Esencial y lo presenta un asesor en una sesión gratuita de ' + SESION.duracion + '.'
  ];
  if (lecciones) partes.push('', 'LECCIONES DE CONVERSACIONES ANTERIORES (aplícalas):', lecciones);
  if (ajuste) partes.push('', 'NOTA DEL SISTEMA SOBRE TU RESPUESTA ANTERIOR (es lo que la persona vio de verdad): ' + texto(ajuste, 600));
  return partes.join('\n');
}

function conParametros(url, params) {
  var u = new URL(url);
  Object.keys(params).forEach(function (k) {
    if (params[k] !== undefined && params[k] !== null && params[k] !== '') u.searchParams.set(k, String(params[k]));
  });
  return u.toString();
}

function enlaceWhatsApp(mensaje, perfil) {
  var lineas = [SALUDO_WHATSAPP];
  if (mensaje) lineas.push(mensaje);
  if (perfil.email) lineas.push('Mi correo de la Ruta: ' + perfil.email);
  return 'https://api.whatsapp.com/send?phone=' + WHATSAPP_EQUIPO + '&text=' + encodeURIComponent(lineas.join('\n'));
}

// Cada enlace lleva la conversación para cruzar después venta y chat: sck en
// Hotmart, client_reference_id en Stripe (sólo letras, números, - y _).
function tarjetaEsencial(metodo, perfil, conversacion) {
  var ref = 'rutachat-' + String(conversacion || '').replace(/[^a-z0-9-]/gi, '').slice(0, 40);
  var hotmart = conParametros(ESENCIAL.hotmart, { src: 'ruta-chat', sck: ref, email: perfil.email, name: perfil.nombre_completo });
  var stripe = conParametros(ESENCIAL.stripe, { prefilled_email: perfil.email, client_reference_id: ref });
  var porStripe = metodo === 'stripe';
  return {
    tipo: 'plan',
    escalon: porStripe ? 'esencial-stripe' : 'esencial-hotmart',
    titulo: ESENCIAL.nombre,
    duracion: 'Suscripción mensual',
    precio: ESENCIAL.precio,
    periodo: ESENCIAL.periodo,
    precio_antes: null,
    bonos: [],
    resumen: ESENCIAL.resumen,
    cuotas: null,
    boton: 'Empezar mi plan',
    url: porStripe ? stripe : hotmart,
    destino: porStripe ? 'stripe' : 'hotmart',
    alterna: porStripe
      ? { texto: '¿Prefieres pagar con Hotmart?', url: hotmart, destino: 'hotmart' }
      : { texto: '¿Prefieres pagar con Stripe?', url: stripe, destino: 'stripe' }
  };
}

function tarjetaWhatsApp(resumen, perfil) {
  var pedido = texto(resumen, 220);
  return {
    tipo: 'whatsapp',
    titulo: 'Te atiende una persona del equipo',
    boton: 'Seguir por WhatsApp',
    url: enlaceWhatsApp(pedido, perfil),
    destino: 'whatsapp'
  };
}

// La tarjeta de la sesión se arma en dos pasos: acá queda el esqueleto y la
// preferencia de horario que dijo la persona; el endpoint le suma los horarios
// libres que trae de Calendly con completarSesion().
function tarjetaSesion(preferencia) {
  return {
    tipo: 'sesion',
    escalon: 'sesion',
    titulo: SESION.titulo,
    duracion: SESION.duracion,
    nota: SESION.nota,
    preferencia: preferencia || null,
    horarios: [],
    calendario: SESION.calendario
  };
}

function parametrosCalendly(perfil, conversacion) {
  var a = perfil.atribucion || {};
  return {
    name: perfil.nombre_completo || perfil.nombre,
    email: perfil.email,
    utm_source: a.utm_source, utm_medium: a.utm_medium, utm_campaign: a.utm_campaign,
    utm_content: a.utm_content, utm_term: a.utm_term,
    // Calendly guarda este campo con la cita: es lo que une la agenda con el chat.
    salesforce_uuid: 'ruta-chat-' + String(conversacion || '').replace(/[^a-z0-9-]/gi, '').slice(0, 40)
  };
}

function partesEn(fecha, zona) {
  var f = new Intl.DateTimeFormat('es', { timeZone: zona, weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', hour12: false, year: 'numeric' });
  var p = {};
  f.formatToParts(fecha).forEach(function (x) { p[x.type] = x.value; });
  var iso = new Intl.DateTimeFormat('en-CA', { timeZone: zona, year: 'numeric', month: '2-digit', day: '2-digit' }).format(fecha);
  var hora = Number(p.hour === '24' ? 0 : p.hour);
  return {
    dia: (p.weekday + ' ' + p.day + ' ' + p.month).replace(/\./g, ''),
    hora: (p.hour === '24' ? '00' : p.hour) + ':' + p.minute,
    fecha: iso,
    franja: hora < 12 ? 'manana' : (hora < 18 ? 'tarde' : 'noche')
  };
}

// Elige qué horarios mostrar: si la persona pidió un día o una franja, primero
// esos; si no hay o no pidió nada, los más próximos, como mucho tres por día
// para que la tarjeta no sea una lista interminable.
function elegirHorarios(libres, preferencia, zona) {
  var conPartes = (Array.isArray(libres) ? libres : []).map(function (h) {
    var fecha = new Date(h.inicio);
    if (isNaN(fecha)) return null;
    return { inicio: fecha.toISOString(), url: h.url, partes: partesEn(fecha, zona) };
  }).filter(Boolean).sort(function (a, b) { return a.inicio < b.inicio ? -1 : 1; });

  var pref = preferencia || {};
  var calzan = conPartes.filter(function (h) {
    return (!pref.fecha || h.partes.fecha === pref.fecha) && (!pref.franja || h.partes.franja === pref.franja);
  });
  var coincide = Boolean((pref.fecha || pref.franja) && calzan.length);
  var base = coincide ? calzan : conPartes;
  var porDia = {};
  var elegidos = base.filter(function (h) {
    porDia[h.partes.fecha] = (porDia[h.partes.fecha] || 0) + 1;
    return coincide || porDia[h.partes.fecha] <= 3;
  }).slice(0, MAX_HORARIOS);
  return { horarios: elegidos, coincide: coincide, pidio: Boolean(pref.fecha || pref.franja) };
}

function completarSesion(tarjeta, libres, zona, perfil, conversacion) {
  var params = parametrosCalendly(perfil, conversacion);
  var eleccion = elegirHorarios(libres, tarjeta.preferencia, zona);
  tarjeta.zona = zona;
  tarjeta.zona_nombre = zona.split('/').pop().replace(/_/g, ' ');
  tarjeta.horarios = eleccion.horarios.map(function (h) {
    return { inicio: h.inicio, dia: h.partes.dia, hora: h.partes.hora, url: conParametros(h.url, params) };
  });
  tarjeta.calendario = conParametros(SESION.calendario, params);
  // Si pidió un momento que no tiene lugar, el agente se entera en el turno
  // siguiente y puede ofrecer los que sí hay.
  tarjeta.sin_lugar_en_su_preferencia = eleccion.pidio && !eleccion.coincide;
  return tarjeta;
}

// Montos de dinero que aparecen escritos en el mensaje del agente.
function montosEn(mensaje) {
  var montos = [];
  var re = /(?:US\$|USD\s*|\$)\s*(\d{2,4})|(\d{2,4})\s*(?:USD|d[oó]lares)/gi;
  var m;
  while ((m = re.exec(mensaje))) montos.push(Number(m[1] || m[2]));
  return montos;
}

var MENSAJE_PRIMERO = 'Tenemos dos caminos y te decimos cuál te conviene según tu caso. ¿Qué te gustaría lograr?';
var MENSAJE_MONTO = 'Tenemos dos caminos: el Plan Esencial, de US$77 al mes, y el Premium, que te presenta un asesor en una sesión. ¿Cuál se acerca más a lo que buscas?';
var MENSAJE_ESENCIAL = 'Te dejamos el Plan Esencial aquí abajo para que empieces hoy.';
var MENSAJE_SESION = 'Te dejamos los horarios disponibles aquí abajo. Elige el que mejor te quede.';

function normalizarSalida(cruda) {
  var salida = cruda && typeof cruda === 'object' ? cruda : {};
  var cal = salida.calificacion && typeof salida.calificacion === 'object' ? salida.calificacion : {};
  var opciones = Array.isArray(salida.opciones) ? salida.opciones : [];
  var pref = salida.preferencia_horario && typeof salida.preferencia_horario === 'object' ? salida.preferencia_horario : null;
  var fecha = pref && /^\d{4}-\d{2}-\d{2}$/.test(String(pref.fecha || '')) ? pref.fecha : null;
  var franja = pref && ['manana', 'tarde', 'noche'].indexOf(pref.franja) !== -1 ? pref.franja : null;
  return {
    mensaje: String(salida.mensaje || '').trim().slice(0, 1200),
    opciones: opciones.map(function (o) { return texto(o, 40); }).filter(Boolean).slice(0, 3),
    accion: texto(salida.accion, 30),
    metodo_pago: salida.metodo_pago === 'stripe' ? 'stripe' : 'hotmart',
    preferencia: fecha || franja ? { fecha: fecha, franja: franja } : null,
    resumen_whatsapp: salida.resumen_whatsapp ? texto(salida.resumen_whatsapp, 220) : null,
    calificacion: {
      nivel: texto(cal.nivel, 20) || 'desconocido',
      potencial: texto(cal.potencial, 20),
      recomendacion: texto(cal.recomendacion, 20),
      pais: texto(cal.pais_iso || cal.pais, 2).toUpperCase(),
      ciudad: texto(cal.ciudad, 60),
      objetivo: texto(cal.objetivo, 120),
      dolor: texto(cal.dolor, 160),
      senales_salud: Array.isArray(cal.senales_salud) ? cal.senales_salud.slice(0, 8) : [],
      urgencia: texto(cal.urgencia, 20),
      objecion: texto(cal.objecion, 30),
      objeciones_precio: Number(cal.objeciones_precio) || 0,
      bandera_clinica: texto(cal.bandera_clinica, 120),
      listo_para_pagar: Boolean(cal.listo_para_pagar)
    }
  };
}

// ── Crisis ───────────────────────────────────────────────
// Si alguien escribe que no quiere vivir, la respuesta no puede depender del
// modelo: el servidor descarta cualquier oferta y muestra un mensaje fijo con la
// línea de ayuda de su país. Números verificados el 6-oct-2026.
var LINEAS_AYUDA = {
  PE: [{ nombre: 'Línea 113, opción 5 (Minsa)', numero: '113', tel: '113' }],
  MX: [{ nombre: 'Línea de la Vida', numero: '800 911 2000', tel: '8009112000' }],
  CO: [{ nombre: 'Línea 192, opción 4 (Minsalud)', numero: '192', tel: '192' }],
  CL: [{ nombre: 'Línea de prevención del suicidio', numero: '*4141', tel: '*4141' }],
  AR: [{ nombre: 'Asistencia al Suicida (CABA y GBA)', numero: '135', tel: '135' },
       { nombre: 'Asistencia al Suicida (todo el país)', numero: '(011) 5275-1135', tel: '01152751135' }],
  US: [{ nombre: 'Línea 988 de crisis (en español)', numero: '988', tel: '988' }],
  ES: [{ nombre: 'Línea de atención a la conducta suicida', numero: '024', tel: '024' }]
};
var CRISIS_RE = new RegExp([
  // Se prefiere mostrar la línea de más que de menos: «no quiero vivir así»
  // también la dispara, y está bien que así sea.
  'suicid', 'quitarme la vida', 'no quiero (seguir )?viv', 'no quiero estar viv', 'ganas de morir', 'quiero morir',
  'me quiero morir', 'matarme', 'acabar con mi vida', 'no vale la pena vivir', 'mejor muert', 'quiero desaparecer',
  'autolesi', 'cortarme', 'lastimarme a m[ií] mism', 'hacerme da[ñn]o a m[ií] mism'
].join('|'), 'i');
var MENSAJE_CRISIS = 'Lamentamos mucho que estés pasando por esto, y gracias por decirlo.\n' +
  'No tienes que atravesarlo sin ayuda: habla hoy con alguien de confianza o con una línea gratuita que atiende a toda hora. ' +
  'Si estás en peligro ahora, llama al número de emergencias de tu país.';

function hayCrisis(texto) {
  return CRISIS_RE.test(String(texto || ''));
}

function tarjetaAyuda(pais) {
  var lineas = LINEAS_AYUDA[pais];
  if (!lineas) {
    lineas = [];
    Object.keys(LINEAS_AYUDA).forEach(function (codigo) {
      lineas.push(Object.assign({ pais: codigo }, LINEAS_AYUDA[codigo][0]));
    });
  }
  return {
    tipo: 'ayuda',
    titulo: 'Ayuda gratuita, a toda hora',
    lineas: lineas
  };
}

// Convierte la salida del agente en lo que ve la persona. Si escribe un monto
// que no es el del Esencial (un precio del Premium inventado, un descuento), su
// mensaje se reemplaza por uno fijo con los dos caminos. Las tarjetas repetidas
// no se vuelven a mostrar, salvo la de la sesión con un horario pedido nuevo.
//
// Cada corrección vuelve como `ajuste`: el navegador la reenvía en el turno
// siguiente y el agente se entera de lo que la persona vio de verdad.
function resolverRespuesta(cruda, perfil, geo, mostrados, mensajePersona, conversacion, turno) {
  turno = turno || {};
  var salida = normalizarSalida(cruda);
  var cal = salida.calificacion;
  if (hayCrisis(mensajePersona)) return respuestaDeCrisis(cal.pais || geo.pais, cal);
  var tarjeta = null;
  var ajustes = [];

  if (salida.accion === 'ofrecer_esencial') {
    // Se repite sólo si no es la última tarjeta que vio: cuando pregunta «¿cómo
    // pago?» varios mensajes después, el botón tiene que volver a estar a mano.
    var clave = 'esencial-' + salida.metodo_pago;
    if (mostrados.indexOf(clave) === -1 || turno.ultima !== clave) tarjeta = tarjetaEsencial(salida.metodo_pago, perfil, conversacion);
  } else if (salida.accion === 'ofrecer_sesion') {
    if (mostrados.indexOf('agendo') !== -1) {
      ajustes.push('La persona ya agendó la sesión: no se le volvieron a mostrar horarios.');
    } else if (mostrados.indexOf('sesion') === -1 || salida.preferencia) {
      tarjeta = tarjetaSesion(salida.preferencia);
    }
  } else if (salida.accion === 'pasar_a_whatsapp') {
    tarjeta = tarjetaWhatsApp(salida.resumen_whatsapp, perfil);
  }

  var montos = montosEn(salida.mensaje);
  var invalidos = montos.filter(function (monto) { return monto !== ESENCIAL.precio; });
  var mensaje = salida.mensaje;
  var opciones = salida.opciones;
  // Primero se entiende el caso, después el precio: en el primer mensaje no se
  // da, salvo que ya pida el plan (ahí sí va la tarjeta con su botón).
  if (turno.numero === 1 && montos.length && !(tarjeta && tarjeta.tipo === 'plan')) {
    mensaje = MENSAJE_PRIMERO;
    opciones = ['Bajar grasa', 'Ganar músculo', 'Mejorar mi salud'];
    tarjeta = null;
    ajustes.push('Diste un precio antes de saber qué quiere lograr: no se mostró. La persona leyó solamente: "' + mensaje + '"');
    montos = [];
    invalidos = [];
  }
  if (invalidos.length || !mensaje) {
    if (tarjeta && tarjeta.tipo === 'plan') mensaje = MENSAJE_ESENCIAL;
    else if (tarjeta && tarjeta.tipo === 'sesion') mensaje = MENSAJE_SESION;
    else { mensaje = MENSAJE_MONTO; tarjeta = null; }
    opciones = tarjeta ? [] : ['El Esencial', 'Quiero la sesión'];
    if (invalidos.length) ajustes.push('Tu mensaje no se mostró porque nombraba un monto que no existe (US$' + invalidos.join(', US$') + '). El único precio público es el del Esencial.');
    ajustes.push('La persona leyó solamente: "' + mensaje + '"');
  }

  return {
    mensaje: mensaje,
    opciones: opciones,
    tarjeta: tarjeta,
    eco: { pais: cal.pais || '', ciudad: cal.ciudad || '' },
    ajuste: ajustes.length ? ajustes.join(' ') : null,
    registro: { calificacion: cal, accion: salida.accion, escalon_pedido: tarjeta && tarjeta.escalon ? tarjeta.escalon : null, montos_invalidos: invalidos }
  };
}

var FRANJAS = { manana: 'en la mañana', tarde: 'en la tarde', noche: 'en la noche' };

// Si pidió un momento sin lugar, el texto del agente (escrito antes de ver la
// agenda) no puede prometerlo: se reemplaza por uno que dice lo que hay.
function mensajeSinLugar(tarjeta, zona) {
  var p = tarjeta.preferencia || {};
  var cuando = [];
  if (p.fecha) {
    var f = new Date(p.fecha + 'T12:00:00Z');
    cuando.push('el ' + f.toLocaleString('es', { timeZone: 'UTC', weekday: 'long', day: 'numeric' }));
  }
  if (p.franja) cuando.push(FRANJAS[p.franja]);
  return 'No nos quedan horarios ' + (cuando.join(' ') || 'en ese momento') + '. Te dejamos los más próximos; si ninguno te sirve, mira más días en el calendario.';
}

// Nota para el agente cuando la sesión no tenía lugar en lo que pidió la persona.
function ajusteDeSesion(tarjeta) {
  if (!tarjeta || tarjeta.tipo !== 'sesion') return null;
  if (!tarjeta.horarios.length) return 'No había horarios libres para mostrar: la persona vio sólo el botón del calendario completo.';
  if (tarjeta.sin_lugar_en_su_preferencia) {
    return 'No había lugar en el momento que pidió; vio los más próximos: ' +
      tarjeta.horarios.map(function (h) { return h.dia + ' ' + h.hora; }).join(', ') + '.';
  }
  return 'Vio estos horarios: ' + tarjeta.horarios.map(function (h) { return h.dia + ' ' + h.hora; }).join(', ') + '.';
}

function respuestaDeCrisis(pais, cal) {
  return {
    mensaje: MENSAJE_CRISIS,
    opciones: [],
    tarjeta: tarjetaAyuda(pais),
    eco: null,
    ajuste: 'La persona escribió algo que indica riesgo de vida. Vio solamente: "' + MENSAJE_CRISIS.replace(/\n/g, ' ') +
      '" y las líneas de ayuda de su país. No vendas ni ofrezcas nada más en esta conversación; si sigue escribiendo, acompaña con calma y repite que busque ayuda.',
    registro: { calificacion: cal, accion: 'crisis', escalon_pedido: null, montos_invalidos: [] }
  };
}

function respuestaDeError(perfil) {
  return {
    mensaje: 'Se nos cortó la respuesta. Si quieres, sigue la conversación con el equipo por WhatsApp.',
    opciones: [],
    tarjeta: tarjetaWhatsApp('', perfil || {}),
    eco: null
  };
}

// Texto de confirmación cuando agenda: lo ve la persona y queda en el historial.
function confirmacionDeAgenda(inicio, zona, nombre) {
  var fecha = inicio ? new Date(inicio) : null;
  var cuando = fecha && !isNaN(fecha)
    ? fecha.toLocaleString('es', { timeZone: zona, weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit', hour12: false }) +
      ' (hora de ' + zona.split('/').pop().replace(/_/g, ' ') + ')'
    : null;
  return (nombre ? 'Listo, ' + nombre + '. ' : 'Listo. ') +
    (cuando ? 'Tu sesión con un asesor quedó agendada para el ' + cuando + '.' : 'Tu sesión con un asesor quedó agendada.') +
    ' Te llegó la confirmación a tu correo.';
}

module.exports = {
  TARJETAS: TARJETAS,
  geoDesde: geoDesde,
  mercadoPara: mercadoPara,
  zonaValida: zonaValida,
  perfilDesde: perfilDesde,
  contextoParaAgente: contextoParaAgente,
  resolverRespuesta: resolverRespuesta,
  completarSesion: completarSesion,
  ajusteDeSesion: ajusteDeSesion,
  mensajeSinLugar: mensajeSinLugar,
  confirmacionDeAgenda: confirmacionDeAgenda,
  elegirHorarios: elegirHorarios,
  hayCrisis: hayCrisis,
  respuestaDeError: respuestaDeError,
  montosEn: montosEn
};
