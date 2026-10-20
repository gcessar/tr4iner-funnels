// Chat del equipo dentro de la Ruta Tr4iner: oferta, material, horarios y
// validación de lo que propone el agente.
//
// Todo lo que decide cuánto se cobra, a dónde se paga, qué video se muestra y
// qué horario se reserva vive acá y no en el prompt. El modelo propone una
// acción; el monto, los enlaces, las rutas de los videos y los horarios reales
// los pone el servidor. Así un mensaje mal generado nunca cobra otra cosa, ni
// muestra un video que no existe, ni reserva un horario inventado.
//
// 19-oct: oferta nueva. Plan Esencial a US$77 al mes, que se compra en el chat
// (Hotmart o Stripe), y Plan Premium, que sólo se ofrece en una sesión con un
// asesor. 20-oct: la sesión la registra el propio agente por la API de Calendly
// (pregunta día y hora, ofrece los horarios libres y pide el WhatsApp), y el
// chat puede mostrar videos del método y testimonios guardados en R2.

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

// Enlace personalizado de Calendly (evento «Asesoría Tr4iner», 3dfd4941…, de
// reparto entre asesores). Sólo de respaldo: la reserva la hace el agente por API.
var CALENDARIO = 'https://calendly.com/d/ck4v-8jc-pv6/asesoria-tr4iner';
var MAX_HORARIOS = 4;
var VIDEO_BASE = 'https://video.mediatr4iner.com/';

// Videos del método (20-oct, en R2) y testimonios que ya usan las páginas de
// agenda. El agente elige por id; rutas y portadas las pone el servidor.
var VIDEOS = {
  entrenamiento: { titulo: 'Entrenamiento personalizado', para: 'cómo armamos su entrenamiento según su tiempo, sus días y si entrena en gimnasio o en casa', carpeta: 'beneficios/entrenamiento-personalizado--f430edae' },
  alimentacion: { titulo: 'Alimentación personalizada', para: 'cómo armamos su plan de comidas con lo que le gusta y sus macros, sin dietas extremas', carpeta: 'beneficios/alimentacion-personalizada--6ae9d55b' },
  acompanamiento: { titulo: 'Acompañamiento del equipo', para: 'cómo la acompaña el equipo de entrenadores y nutricionistas, con ajustes y respuestas en el día', carpeta: 'beneficios/acompanamiento--d5bee47f' },
  comunidad: { titulo: 'La comunidad TR4INER', para: 'la comunidad de personas con su mismo objetivo', carpeta: 'beneficios/comunidad--3ac41012' }
};
var TESTIMONIOS = {
  'same-leon': { nombre: 'Same Leon', sexo: 'Hombre', pais: 'Chile', resumen: 'Pasó de 89 a 69 kg y del 30% al 20% de grasa en 12 meses, sin dietas extremas.', carpeta: 'testimonios/same-leon-925219212' },
  'ana-briones': { nombre: 'Ana Briones', sexo: 'Mujer', pais: 'Perú', resumen: 'Enfermera de UCI y madre de dos: perdió 13 kg sin pasar hambre ni dejar su vida.', carpeta: 'testimonios/ana-briones-856509800' },
  'fernando-pena': { nombre: 'Fernando Peña', sexo: 'Hombre', pais: 'Perú', resumen: 'A sus 57 años bajó 7 kg y 5 puntos de grasa.', carpeta: 'testimonios/fernando-pena-856846588' },
  'guadalupe-eligio': { nombre: 'Guadalupe Eligio', sexo: 'Mujer', pais: 'EE. UU.', resumen: 'A los 48 perdió 10 kg empezando desde cero, sin saber qué era un macro.', carpeta: 'testimonios/guadalupe-eligio-925245130' },
  'victoria-sifuentes': { nombre: 'Victoria Sifuentes', sexo: 'Mujer', pais: 'Perú', resumen: 'Llegó por salud tras un cuadro de estrés y bajó 10 kg entrenando desde casa.', carpeta: 'testimonios/victoria-sifuentes-925245461' },
  'anzonny-malave': { nombre: 'Anzonny Malave', sexo: 'Hombre', pais: 'Chile', resumen: 'Bajó del 26% al 18% de grasa en 6 meses, sin comida desabrida.', carpeta: 'testimonios/anzonny-malave-925218713' },
  'leticia-pereira': { nombre: 'Leticia Pereira', sexo: 'Mujer', pais: 'EE. UU.', resumen: 'Perdió 10 kg y definió el abdomen que otras dietas nunca le dieron.', carpeta: 'testimonios/leticia-pereira-856835613' },
  'daniel-alarcon': { nombre: 'Daniel Alarcón', sexo: 'Hombre', pais: 'México', resumen: 'Perdió 11 kg y llegó al 17% de grasa en 6 meses, con un plan a su medida.', carpeta: 'testimonios/daniel-alarcon-925218766' },
  'josefa-damian': { nombre: 'Josefa Damian', sexo: 'Mujer', pais: 'EE. UU.', resumen: 'A sus 46 años perdió 11 kg y recuperó su autoestima.', carpeta: 'testimonios/josefa-damian-925245204' },
  'dashiell-ezequiel': { nombre: 'Dashiell Ezequiel', sexo: 'Hombre', pais: 'Perú', resumen: 'Bajó del 32% al 22% de grasa viviendo solo y sin dejar los dulces.', carpeta: 'testimonios/dashiell-ezequiel-925218792' },
  'irene-salom': { nombre: 'Irene Salom', sexo: 'Mujer', pais: 'EE. UU.', resumen: 'Entrenó desde casa y comió lo mismo que su familia, sin platos aparte.', carpeta: 'testimonios/irene-salom-925245166' }
};

// Primera línea de todo WhatsApp que sale del chat: la misma frase que usan la
// bisagra y el llamado de los videos, la que reconocen los disparadores de
// ManyChat. El resumen del caso va en las líneas de abajo.
var SALUDO_WHATSAPP = 'Hola, vengo de mi Ruta Tr4iner y quiero asesoría.';

// Código de país para completar el WhatsApp cuando la persona lo escribe sin «+».
var PREFIJOS = {
  PE: '51', MX: '52', CO: '57', CL: '56', AR: '54', US: '1', CA: '1', PR: '1', DO: '1', ES: '34', EC: '593',
  BO: '591', VE: '58', GT: '502', CR: '506', UY: '598', PY: '595', PA: '507', SV: '503', HN: '504', NI: '505'
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

// Tarjetas que el navegador cuenta como ya mostradas. Ayudan a no repetirlas y
// le dicen al agente qué tiene delante la persona (él no ve las tarjetas).
function tarjetaValida(clave) {
  var k = String(clave || '');
  if (['esencial-hotmart', 'esencial-stripe', 'agendo'].indexOf(k) !== -1) return true;
  var m = /^video:(.+)$/.exec(k);
  return Boolean(m && (VIDEOS[m[1]] || TESTIMONIOS[m[1]]));
}

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

// Ya no cambia el precio: es una señal más de capacidad de pago. Lo que la
// persona declara sólo suma.
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
    peso: plan && plan.peso ? plan.peso : null,
    altura: plan && plan.altura ? plan.altura : null,
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

// Lo que el navegador devuelve en cada turno (país dicho, horarios ofrecidos,
// horario elegido y WhatsApp). Se valida porque viene del navegador.
function ecoValido(eco) {
  var e = eco && typeof eco === 'object' ? eco : {};
  var horarios = (Array.isArray(e.horarios) ? e.horarios : []).filter(function (h) {
    return h && /^h[1-9]$/.test(h.id) && !isNaN(new Date(h.inicio)) && typeof h.etiqueta === 'string';
  }).slice(0, MAX_HORARIOS).map(function (h) { return { id: h.id, inicio: new Date(h.inicio).toISOString(), etiqueta: texto(h.etiqueta, 40), larga: texto(h.larga, 80) }; });
  return {
    pais: texto(e.pais, 2).toUpperCase(),
    ciudad: texto(e.ciudad, 60),
    horarios: horarios,
    horario_elegido: horarios.some(function (h) { return h.id === e.horario_elegido; }) ? e.horario_elegido : null,
    whatsapp: /^\+\d{8,15}$/.test(String(e.whatsapp || '')) ? e.whatsapp : null
  };
}

function materialParaAgente() {
  var lineas = Object.keys(VIDEOS).map(function (id) { return '- ' + id + ' (video del método): ' + VIDEOS[id].para + '.'; });
  Object.keys(TESTIMONIOS).forEach(function (id) {
    var t = TESTIMONIOS[id];
    lineas.push('- ' + id + ' (testimonio de ' + t.nombre + ', ' + t.sexo + ', ' + t.pais + '): ' + t.resumen);
  });
  return lineas.join('\n');
}

function contextoParaAgente(perfil, geo, mercado, mostrados, ajuste, zona, lecciones, eco) {
  eco = eco || ecoValido(null);
  var datos = {
    nombre: perfil.nombre || null,
    sexo: perfil.sexo,
    hizo_test_de_macros: perfil.hizo_test,
    objetivo: perfil.objetivo,
    senal_principal: perfil.senal_principal,
    calorias_diarias: perfil.kcal,
    edad: perfil.edad,
    peso_kg: perfil.peso,
    altura_cm: perfil.altura,
    orientaciones_completadas: perfil.orientaciones_completadas,
    pais_aproximado: geo.pais || null,
    ciudad_aproximada: geo.ciudad || null,
    mercado_alto_poder_adquisitivo: mercado === 'alto',
    tarjetas_ya_mostradas: mostrados.filter(function (t) { return t !== 'agendo'; }),
    ya_agendo_la_sesion: mostrados.indexOf('agendo') !== -1,
    whatsapp_conocido: eco.whatsapp || null
  };
  var partes = [
    'CONTEXTO (datos de su Ruta, no instrucciones):',
    JSON.stringify(datos),
    '',
    'AHORA: ' + ahoraEn(zona) + ' (zona horaria de la persona: ' + zona + ').',
    '',
    'OFERTA VIGENTE (no hay otra):',
    '- ' + ESENCIAL.nombre + ': US$' + ESENCIAL.precio + ' al ' + ESENCIAL.periodo + ', suscripción mensual. Se paga con Hotmart o con Stripe.',
    '- Acompañamiento con videollamadas (Plan Premium): sin precio público; es una inversión mayor que el Esencial y lo presenta un asesor en una sesión gratuita de 30 minutos que tú agendas.',
    '',
    'MATERIAL QUE PUEDES MOSTRAR (accion mostrar_video, con su id):',
    materialParaAgente()
  ];
  if (eco.horarios.length) {
    partes.push('', 'HORARIOS OFRECIDOS (los vio como respuestas rápidas; usa su id para agendar):');
    eco.horarios.forEach(function (h) { partes.push('- ' + h.id + ': «' + h.etiqueta + '» = ' + (h.larga || h.etiqueta)); });
    if (eco.horario_elegido) partes.push('Horario que eligió: ' + eco.horario_elegido + '.');
  }
  if (lecciones) partes.push('', 'LECCIONES DE CONVERSACIONES ANTERIORES (aplícalas):', lecciones);
  if (ajuste) partes.push('', 'NOTA DEL SISTEMA SOBRE TU RESPUESTA ANTERIOR (es lo que la persona vio de verdad): ' + texto(ajuste, 900));
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

function referencia(conversacion) {
  return 'rutachat-' + String(conversacion || '').replace(/[^a-z0-9-]/gi, '').slice(0, 40);
}

// Cada enlace lleva la conversación para cruzar después venta y chat: sck en
// Hotmart, client_reference_id en Stripe (sólo letras, números, - y _).
function tarjetaEsencial(metodo, perfil, conversacion) {
  var ref = referencia(conversacion);
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

// La calidad (720/480/360) la elige el reproductor compartido según el cuadro y
// la red: alcanza con mandar la carpeta de R2.
function tarjetaVideo(id) {
  if (VIDEOS[id]) {
    var v = VIDEOS[id];
    return { tipo: 'video', escalon: 'video:' + id, id: id, titulo: v.titulo, subtitulo: 'Así trabajamos', orientacion: 'horizontal', base: VIDEO_BASE + v.carpeta + '/', portada: VIDEO_BASE + v.carpeta + '/thumbnail.jpg' };
  }
  if (TESTIMONIOS[id]) {
    var t = TESTIMONIOS[id];
    // Portada = un fotograma del propio video (thumbnail.jpg de R2), no el afiche
    // amarillo de las páginas de agenda: en el chat se veía como un aviso (20-oct).
    return { tipo: 'video', escalon: 'video:' + id, id: id, titulo: t.nombre + ' · ' + t.pais, subtitulo: t.resumen, orientacion: 'vertical', base: VIDEO_BASE + t.carpeta + '/', portada: VIDEO_BASE + t.carpeta + '/thumbnail.jpg' };
  }
  return null;
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

function tarjetaCalendario(perfil, conversacion) {
  return {
    tipo: 'whatsapp',
    titulo: 'Elige tu horario en el calendario del equipo',
    boton: 'Ver horarios',
    url: conParametros(CALENDARIO, parametrosCalendly(perfil, conversacion)),
    destino: 'calendly'
  };
}

function partesEn(fecha, zona) {
  var f = new Intl.DateTimeFormat('es', { timeZone: zona, weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', hour12: false, year: 'numeric' });
  var p = {};
  f.formatToParts(fecha).forEach(function (x) { p[x.type] = x.value; });
  var iso = new Intl.DateTimeFormat('en-CA', { timeZone: zona, year: 'numeric', month: '2-digit', day: '2-digit' }).format(fecha);
  var hora = Number(p.hour === '24' ? 0 : p.hour);
  var hhmm = (p.hour === '24' ? '00' : p.hour) + ':' + p.minute;
  var dia = String(p.weekday || '').replace(/\./g, '');
  return {
    dia: (dia + ' ' + p.day + ' ' + p.month).replace(/\./g, ''),
    corta: dia.charAt(0).toUpperCase() + dia.slice(1) + ' ' + p.day + ' · ' + hhmm,
    larga: fecha.toLocaleString('es', { timeZone: zona, weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit', hour12: false }),
    hora: hhmm,
    fecha: iso,
    franja: hora < 12 ? 'manana' : (hora < 18 ? 'tarde' : 'noche')
  };
}

// Elige qué horarios ofrecer: si la persona pidió un día o una franja, primero
// esos; si no hay o no pidió nada, los más próximos, como mucho dos por día para
// que haya variedad entre las cuatro respuestas rápidas.
function elegirHorarios(libres, preferencia, zona) {
  var conPartes = (Array.isArray(libres) ? libres : []).map(function (h) {
    var fecha = new Date(h.inicio);
    if (isNaN(fecha)) return null;
    return { inicio: fecha.toISOString(), partes: partesEn(fecha, zona) };
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
    return coincide || porDia[h.partes.fecha] <= 2;
  }).slice(0, MAX_HORARIOS);
  var ultimo = conPartes[conPartes.length - 1];
  var ultimoDia = ultimo ? { fecha: ultimo.partes.fecha, dia: new Date(ultimo.inicio).toLocaleString('es', { timeZone: zona, weekday: 'long', day: 'numeric' }) } : null;
  return { horarios: elegidos, coincide: coincide, pidio: Boolean(pref.fecha || pref.franja), ultimoDia: ultimoDia };
}

// WhatsApp con código de país. Sin «+», se completa con el código del país de
// la persona; si no se puede saber, no se inventa: el agente lo vuelve a pedir.
function normalizarWhatsapp(valor, pais) {
  var s = String(valor || '').replace(/[^\d+]/g, '');
  if (!s) return null;
  var d;
  if (s.charAt(0) === '+') { d = s.slice(1).replace(/\D/g, ''); return d.length >= 8 && d.length <= 15 ? '+' + d : null; }
  if (s.indexOf('00') === 0) { d = s.slice(2); return d.length >= 8 && d.length <= 15 ? '+' + d : null; }
  var pre = PREFIJOS[pais];
  if (!pre) return null;
  if (s.indexOf(pre) === 0 && s.length - pre.length >= 8) return '+' + s;
  return s.length >= 7 && s.length <= 11 ? '+' + pre + s : null;
}

function whatsappEnTexto(texto_) {
  var m = String(texto_ || '').match(/\+?\d[\d\s().-]{6,18}\d/);
  return m ? m[0] : null;
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
var MENSAJE_MONTO = 'El Plan Esencial es de US$77 al mes. El acompañamiento con videollamadas te lo presenta un asesor en una sesión gratuita. ¿Cuál se acerca más a lo que buscas?';
var MENSAJE_ESENCIAL = 'Te dejamos el Plan Esencial aquí abajo para que empieces hoy.';
var MENSAJE_HORARIOS = 'Estos son los horarios que tenemos libres:';
var FRANJAS = { manana: 'en la mañana', tarde: 'en la tarde', noche: 'en la noche' };

function normalizarSalida(cruda) {
  var salida = cruda && typeof cruda === 'object' ? cruda : {};
  var cal = salida.calificacion && typeof salida.calificacion === 'object' ? salida.calificacion : {};
  var opciones = Array.isArray(salida.opciones) ? salida.opciones : [];
  var pref = salida.preferencia_horario && typeof salida.preferencia_horario === 'object' ? salida.preferencia_horario : null;
  var fecha = pref && /^\d{4}-\d{2}-\d{2}$/.test(String(pref.fecha || '')) ? pref.fecha : null;
  var franja = pref && ['manana', 'tarde', 'noche'].indexOf(pref.franja) !== -1 ? pref.franja : null;
  var accion = texto(salida.accion, 30);
  if (accion === 'ofrecer_sesion') accion = 'proponer_horarios';
  return {
    mensaje: String(salida.mensaje || '').trim().slice(0, 1200),
    opciones: opciones.map(function (o) { return texto(o, 40); }).filter(Boolean).slice(0, 3),
    accion: accion,
    // El modelo a veces repite el rótulo de la lista («video alimentacion»).
    video: texto(salida.video, 60).toLowerCase().replace(/^(video|testimonio)[:\s]+/, '').replace(/\s+/g, '-') || null,
    metodo_pago: salida.metodo_pago === 'stripe' ? 'stripe' : 'hotmart',
    preferencia: fecha || franja ? { fecha: fecha, franja: franja } : null,
    horario: /^h[1-9]$/.test(String(salida.horario || '')) ? salida.horario : null,
    whatsapp: salida.whatsapp ? texto(salida.whatsapp, 30) : null,
    resumen_caso: salida.resumen_caso ? texto(salida.resumen_caso, 900) : null,
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

function hayCrisis(texto_) {
  return CRISIS_RE.test(String(texto_ || ''));
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

// Convierte la salida del agente en lo que ve la persona. Lo que necesita ir a
// buscar algo afuera (horarios libres, la reserva en Calendly) queda en
// `pendiente`: lo resuelve el endpoint y lo completa con completarHorarios() o
// completarAgenda(). Cada corrección vuelve como `ajuste`, que el navegador
// reenvía en el turno siguiente para que el agente sepa lo que se vio de verdad.
function resolverRespuesta(cruda, perfil, geo, mostrados, mensajePersona, conversacion, turno, ecoEntrada) {
  turno = turno || {};
  var eco = ecoValido(ecoEntrada);
  var salida = normalizarSalida(cruda);
  var cal = salida.calificacion;
  if (hayCrisis(mensajePersona)) return respuestaDeCrisis(cal.pais || geo.pais, cal);
  if (cal.pais) eco.pais = cal.pais;
  if (cal.ciudad) eco.ciudad = cal.ciudad;
  var tarjeta = null;
  var ajustes = [];
  var pendiente = null;
  var mensaje = salida.mensaje;
  var opciones = salida.opciones;
  var yaAgendo = mostrados.indexOf('agendo') !== -1;

  // El WhatsApp puede llegar del agente o escrito tal cual por la persona.
  var paisWhatsapp = eco.pais || geo.pais;
  var whatsapp = normalizarWhatsapp(salida.whatsapp, paisWhatsapp) || normalizarWhatsapp(whatsappEnTexto(mensajePersona), paisWhatsapp);
  if (whatsapp) eco.whatsapp = whatsapp;

  // Si tocó una de las respuestas rápidas de horario, ese es el elegido aunque
  // el agente no lo haya marcado.
  var tocado = eco.horarios.filter(function (h) { return texto(mensajePersona, 40) === h.etiqueta; })[0];
  if (tocado) eco.horario_elegido = tocado.id;

  if (salida.accion === 'mostrar_video') {
    var clave = 'video:' + salida.video;
    if (tarjetaVideo(salida.video) && mostrados.indexOf(clave) === -1) tarjeta = tarjetaVideo(salida.video);
    else if (!tarjetaVideo(salida.video)) ajustes.push('El video «' + salida.video + '» no existe: no se mostró nada.');
  } else if (salida.accion === 'ofrecer_esencial') {
    // Se repite sólo si no es la última tarjeta que vio.
    var claveE = 'esencial-' + salida.metodo_pago;
    if (mostrados.indexOf(claveE) === -1 || turno.ultima !== claveE) tarjeta = tarjetaEsencial(salida.metodo_pago, perfil, conversacion);
  } else if (salida.accion === 'proponer_horarios') {
    if (yaAgendo) ajustes.push('La persona ya tiene la sesión agendada: no se le ofrecieron más horarios.');
    else pendiente = { tipo: 'horarios', preferencia: salida.preferencia };
  } else if (salida.accion === 'agendar') {
    if (yaAgendo) {
      ajustes.push('La persona ya tiene la sesión agendada: no se reservó otra.');
    } else {
      var id = salida.horario || eco.horario_elegido;
      var horario = eco.horarios.filter(function (h) { return h.id === id; })[0];
      if (!horario) {
        pendiente = { tipo: 'horarios', preferencia: salida.preferencia };
        ajustes.push('Quisiste agendar sin un horario de los ofrecidos: se le mostraron horarios para que elija.');
      } else if (!eco.whatsapp) {
        eco.horario_elegido = horario.id;
        mensaje = 'Perfecto, te reservo el ' + (horario.larga || horario.etiqueta) + '. ¿A qué WhatsApp te escribe el asesor? Escríbelo con el código de país, por ejemplo +51 999 999 999.';
        opciones = [];
        ajustes.push('Faltaba el WhatsApp: no se agendó todavía. La persona leyó: "' + mensaje + '"');
      } else {
        eco.horario_elegido = horario.id;
        pendiente = { tipo: 'agendar', horario: horario, whatsapp: eco.whatsapp, resumen: salida.resumen_caso || [cal.objetivo, cal.dolor].filter(Boolean).join('. ') };
      }
    }
  } else if (salida.accion === 'pasar_a_whatsapp') {
    tarjeta = tarjetaWhatsApp(salida.resumen_whatsapp, perfil);
  }

  // Con el video ya a la vista, «muéstramelo» no tiene sentido como respuesta.
  if (tarjeta && tarjeta.tipo === 'video') opciones = opciones.filter(function (o) { return !/mu[eé]stra|el video/i.test(o); });

  var montos = montosEn(mensaje);
  var invalidos = montos.filter(function (monto) { return monto !== ESENCIAL.precio; });
  // Primero se entiende el caso, después el precio: en el primer mensaje no se
  // da, salvo que ya pida el plan (ahí sí va la tarjeta con su botón).
  if (turno.numero === 1 && montos.length && !(tarjeta && tarjeta.tipo === 'plan')) {
    mensaje = MENSAJE_PRIMERO;
    opciones = ['Bajar grasa', 'Ganar músculo', 'Mejorar mi salud'];
    tarjeta = null;
    ajustes.push('Diste un precio antes de saber qué quiere lograr: no se mostró. La persona leyó solamente: "' + mensaje + '"');
    invalidos = [];
  }
  if ((invalidos.length || !mensaje) && !pendiente) {
    if (tarjeta && tarjeta.tipo === 'plan') mensaje = MENSAJE_ESENCIAL;
    else { mensaje = MENSAJE_MONTO; if (!tarjeta || tarjeta.tipo !== 'video') tarjeta = null; }
    opciones = tarjeta ? [] : ['El Plan Esencial', 'Quiero videollamadas'];
    if (invalidos.length) ajustes.push('Tu mensaje no se mostró porque nombraba un monto que no existe (US$' + invalidos.join(', US$') + '). El único precio público es el del Esencial.');
    ajustes.push('La persona leyó solamente: "' + mensaje + '"');
  }

  return {
    mensaje: mensaje,
    opciones: opciones,
    tarjeta: tarjeta,
    eco: eco,
    pendiente: pendiente,
    ajuste: ajustes.length ? ajustes.join(' ') : null,
    registro: { calificacion: cal, accion: salida.accion, escalon_pedido: tarjeta && tarjeta.escalon ? tarjeta.escalon : null, montos_invalidos: invalidos }
  };
}

function mensajeSinLugar(preferencia, ultimoDia) {
  var p = preferencia || {};
  // Calendly abre la agenda sólo unos días hacia adelante: si pidió más allá,
  // se lo dice así y no como si el equipo estuviera lleno.
  if (p.fecha && ultimoDia && p.fecha > ultimoDia.fecha) return 'Por ahora la agenda del equipo está abierta hasta el ' + ultimoDia.dia + '. Estos son los horarios libres:';
  var cuando = [];
  if (p.fecha) {
    var f = new Date(p.fecha + 'T12:00:00Z');
    cuando.push('el ' + f.toLocaleString('es', { timeZone: 'UTC', weekday: 'long', day: 'numeric' }));
  }
  if (p.franja) cuando.push(FRANJAS[p.franja]);
  return 'No nos quedan horarios ' + (cuando.join(' ') || 'en ese momento') + '. Estos son los más próximos:';
}

// Pone los horarios libres reales como respuestas rápidas. El texto del agente
// se escribió antes de ver la agenda: si nombra horas o promete un momento sin
// lugar, se reemplaza por uno que dice lo que hay.
function completarHorarios(respuesta, libres, zona, perfil, conversacion, ocupado) {
  var pref = respuesta.pendiente && respuesta.pendiente.preferencia;
  var eleccion = elegirHorarios(libres, pref, zona);
  respuesta.eco.horario_elegido = null;
  if (!eleccion.horarios.length) {
    respuesta.eco.horarios = [];
    respuesta.mensaje = 'En los próximos días no nos quedan horarios libres para la sesión. Te dejo el calendario del equipo para que elijas otra fecha:';
    respuesta.opciones = [];
    respuesta.tarjeta = tarjetaCalendario(perfil, conversacion);
    respuesta.ajuste = [respuesta.ajuste, 'No había horarios libres: la persona vio el botón del calendario del equipo.'].filter(Boolean).join(' ');
    return respuesta;
  }
  respuesta.eco.horarios = eleccion.horarios.map(function (h, i) {
    return { id: 'h' + (i + 1), inicio: h.inicio, etiqueta: h.partes.corta, larga: h.partes.larga };
  });
  respuesta.opciones = respuesta.eco.horarios.map(function (h) { return h.etiqueta; });
  if (ocupado) respuesta.mensaje = 'Ese horario se acaba de ocupar. Estos siguen libres:';
  else if (eleccion.pidio && !eleccion.coincide) respuesta.mensaje = mensajeSinLugar(pref, eleccion.ultimoDia);
  else if (!respuesta.mensaje || /\d{1,2}:\d{2}|\d{1,2}\s?(am|pm)/i.test(respuesta.mensaje)) respuesta.mensaje = MENSAJE_HORARIOS;
  respuesta.ajuste = [respuesta.ajuste, (ocupado ? 'El horario que eligió se ocupó. ' : '') + 'Le ofreciste estos horarios como respuestas rápidas: ' +
    respuesta.eco.horarios.map(function (h) { return h.id + ' = ' + h.larga; }).join('; ') + '.'].filter(Boolean).join(' ');
  return respuesta;
}

// Resultado de la reserva en Calendly. El texto de confirmación lo arma el
// servidor y no el agente: dice exactamente lo que quedó registrado.
function completarAgenda(respuesta, reserva, zona, perfil, conversacion) {
  var h = respuesta.pendiente.horario;
  if (reserva && reserva.ok) {
    respuesta.mensaje = (perfil.nombre ? 'Listo, ' + perfil.nombre + '. ' : 'Listo. ') +
      'Te agendé una sesión con un asesor para el ' + h.larga + ' (hora de ' + zona.split('/').pop().replace(/_/g, ' ') + '). ' +
      'Te llegó la invitación a tu correo y te escribimos por WhatsApp para confirmarla 🙌';
    respuesta.opciones = [];
    respuesta.tarjeta = {
      tipo: 'agenda', escalon: 'agendo', inicio: h.inicio, etiqueta: h.larga, zona_nombre: zona.split('/').pop().replace(/_/g, ' '),
      reprogramar: reserva.reprogramar || null, cancelar: reserva.cancelar || null, prueba: Boolean(reserva.prueba)
    };
    respuesta.eco.horarios = [];
    respuesta.eco.horario_elegido = null;
    respuesta.registro.accion = 'agendo';
    respuesta.ajuste = 'La sesión quedó agendada para el ' + h.larga + '. La persona leyó: "' + respuesta.mensaje + '"';
    return respuesta;
  }
  respuesta.mensaje = 'No pude registrar la sesión en este momento. Te dejo el calendario del equipo para que la agendes en un minuto:';
  respuesta.opciones = [];
  respuesta.tarjeta = tarjetaCalendario(perfil, conversacion);
  respuesta.ajuste = 'La reserva falló (' + (reserva && reserva.motivo || 'sin respuesta') + '): la persona vio el botón del calendario del equipo.';
  return respuesta;
}

function respuestaDeCrisis(pais, cal) {
  return {
    mensaje: MENSAJE_CRISIS,
    opciones: [],
    tarjeta: tarjetaAyuda(pais),
    eco: null,
    pendiente: null,
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

module.exports = {
  tarjetaValida: tarjetaValida,
  geoDesde: geoDesde,
  mercadoPara: mercadoPara,
  zonaValida: zonaValida,
  perfilDesde: perfilDesde,
  ecoValido: ecoValido,
  contextoParaAgente: contextoParaAgente,
  resolverRespuesta: resolverRespuesta,
  completarHorarios: completarHorarios,
  completarAgenda: completarAgenda,
  parametrosCalendly: parametrosCalendly,
  elegirHorarios: elegirHorarios,
  normalizarWhatsapp: normalizarWhatsapp,
  hayCrisis: hayCrisis,
  respuestaDeError: respuestaDeError,
  montosEn: montosEn
};
