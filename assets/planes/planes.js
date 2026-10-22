/*
  TR4Planes — la tabla de planes de /empezar para las páginas que tenían el Typeform
  (los cuatro casos de Anthoni, los tres de Veronika y /empezar-va), desde el 21-oct-2026.

  La página sólo pone el contenedor y este script arma todo lo demás:

    <section class="tr4p" id="planes"
      data-slug="flor"                  código corto de la página (ver PAGINAS en el CRM)
      data-ruta="/testimonio-flor"      ruta canónica, la que el CRM muestra
      data-tema="neu"                   neu (Caso de Estudio) | vino (VA) | champan (/empezar-va)
      data-testimonios="mujer"          filtro inicial: mujer | hombre | todos | solo-mujer
      data-cabecera="no"                opcional: la página ya trae su «Siguiente paso»
      data-utm-source="…" data-utm-campaign="…"
                                        opcional: respaldo si el enlace llega sin UTMs
    ></section>

  Mide igual que /empezar: el pago lleva un código de clic («flor-org-k3h2j1x9p0») que
  viaja como `sck` (Hotmart) y `client_reference_id` (Stripe) y que el CRM guarda con las
  UTMs; la agenda del Premium deja en Calendly `salesforce_uuid` = «flor-org-…», que n8n
  copia al CRM. El «org» es el lugar del brazo de un test: acá no hay test.

  /empezar conserva su propia copia inline (es la que se midió en PageSpeed): si cambia
  algo de la lógica de pago o de agenda, cambiarlo en los dos lados.
*/
(function () {
  var raiz = document.getElementById("planes");
  if (!raiz || raiz.getAttribute("data-montado")) return;
  raiz.setAttribute("data-montado", "1");

  var SLUG = (raiz.getAttribute("data-slug") || "").toLowerCase();
  var RUTA = raiz.getAttribute("data-ruta") || window.location.pathname;
  var TEMA = raiz.getAttribute("data-tema") || "neu";
  var FILTRO_INICIAL = raiz.getAttribute("data-testimonios") || "todos";
  var CON_CABECERA = raiz.getAttribute("data-cabecera") !== "no";
  if (!/^[a-z0-9]{2,20}$/.test(SLUG)) return;

  var CALENDARIO = "https://calendly.com/d/ck4v-8jc-pv6/asesoria-tr4iner";
  var HOTMART = "https://pay.hotmart.com/M84590773F?off=x65af12s";
  var STRIPE = "https://buy.stripe.com/4gM7sLbD67Cx45x32w9Zm2V";
  var CRM_CLIC = "https://crm-ventas-eosin.vercel.app/api/checkout/click";
  var R2 = "https://video.mediatr4iner.com/";
  var REF = SLUG + "-org";

  // ── Marcado ───────────────────────────────────────────────────
  var FLECHA = '<b aria-hidden="true">→</b>';
  var PLAY = '<span class="caso-play"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 1.5v13l11-6.5z"/></svg></span>';

  // Los 19 testimonios de R2 de /empezar, en el mismo orden (alternan mujer y hombre).
  // Las portadas son las de /empezar: WebP de 360×640 servidos desde este dominio.
  var CASOS = [
    ["mujer", "ana-briones-856509800", "ana-briones", "Ana Briones", "Perú", "Enfermera de UCI y madre de dos: perdió 13 kg sin pasar hambre ni dejar su vida."],
    ["hombre", "same-leon-925219212", "same-leon", "Same Leon", "Chile", "Pasó de 89 a 69 kg y del 30% al 20% de grasa en 12 meses, sin dietas extremas."],
    ["mujer", "flor-zevallos-925596958", "flor-zevallos", "Flor Zevallos", "29 años", "Pasó de 78 a 56 kg, con pérdida de grasa en todo el cuerpo."],
    ["hombre", "alejandro-sorto-1053581216", "alejandro-sorto", "Alejandro Sorto", "30 años", "Nunca había entrenado y pasó de 115 a 87 kg, bajando grasa en todo el cuerpo."],
    ["mujer", "guadalupe-eligio-925245130", "guadalupe-eligio", "Guadalupe Eligio", "EE. UU.", "A los 48 perdió 10 kg empezando desde cero, sin saber qué era un macro."],
    ["hombre", "daniel-alarcon-925218766", "daniel-alarcon", "Daniel Alarcón", "México", "Perdió 11 kg y llegó al 17% de grasa en 6 meses, con un plan a su medida."],
    ["mujer", "victoria-sifuentes-925245461", "victoria-sifuentes", "Victoria Sifuentes", "Perú", "Llegó por salud tras un cuadro de estrés y bajó 10 kg entrenando desde casa."],
    ["hombre", "mauricio-custode-1053581311", "mauricio-custode", "Mauricio Custode", "42 años", "Pasó de 107 a 80 kg, con menos grasa en la zona media y brazos y hombros firmes."],
    ["mujer", "josefa-damian-925245204", "josefa-damian", "Josefa Damian", "EE. UU.", "A sus 46 años perdió 11 kg y recuperó su autoestima."],
    ["hombre", "anzonny-malave-925218713", "anzonny-malave", "Anzonny Malave", "Chile", "Bajó del 26% al 18% de grasa en 6 meses, sin comida desabrida."],
    ["mujer", "edith-jimenez-1053581383", "edith-jimenez", "Edith Jimenez", "45 años", "Pasó de 73 a 59 kg, con brazos tonificados y menos grasa abdominal."],
    ["hombre", "dashiell-ezequiel-925218792", "dashiell-ezequiel", "Dashiell Ezequiel", "Perú", "Bajó del 32% al 22% de grasa viviendo solo y sin dejar los dulces."],
    ["mujer", "leticia-pereira-856835613", "leticia-pereira", "Leticia Pereira", "EE. UU.", "Perdió 10 kg y definió el abdomen que otras dietas nunca le dieron."],
    ["hombre", "jhonatan-coronado-1053507277", "jhonatan-coronado", "Jhonatan Coronado", "25 años", "Pasó de 87 a 76 kg y ganó músculo en brazos, hombros y piernas, con el abdomen marcado."],
    ["mujer", "martha-munguia-1053507164", "martha-munguia", "Martha Munguia", "51 años", "Su cuerpo no cambiaba: pasó de 55 a 47 kg, con menos grasa abdominal y piernas más firmes."],
    ["hombre", "fernando-pena-856846588", "fernando-pena", "Fernando Peña", "Perú", "A sus 57 años bajó 7 kg y 5 puntos de grasa."],
    ["mujer", "irene-salom-925245166", "irene-salom", "Irene Salom", "EE. UU.", "Entrenó desde casa y comió lo mismo que su familia, sin platos aparte."],
    ["hombre", "kevin-de-la-cruz-1053507210", "kevin-de-la-cruz", "Kevin De la Cruz", "29 años", "Pasó de 67 a 59 kg, con brazos y hombros definidos y el abdomen marcado."],
    ["mujer", "elisa-linares-1053506420", "elisa-linares", "Elisa Linares", "36 años", "Se sentía débil: con casi el mismo peso (de 53 a 54 kg) tonificó brazos, piernas y abdomen."]
  ];

  var soloMujeres = FILTRO_INICIAL === "solo-mujer";
  var filtro = soloMujeres ? "mujer" : (/^(mujer|hombre)$/.test(FILTRO_INICIAL) ? FILTRO_INICIAL : "todos");

  function htmlCaso(c) {
    var img = "/assets/empezar/testimonios/" + c[2];
    return '<button class="caso" type="button" data-sexo="' + c[0] + '" data-carpeta="testimonios/' + c[1] + '/"' +
      (filtro !== "todos" && c[0] !== filtro ? " hidden" : "") + '>' +
      '<span class="caso-marco"><img src="' + img + '-240.webp" srcset="' + img + '-240.webp 240w, ' + img + '.webp 360w" sizes="(min-width: 760px) 200px, 42vw" width="360" height="640" loading="lazy" decoding="async" alt="Antes y después de ' + c[3] + '" />' + PLAY + '</span>' +
      '<span class="caso-nombre">' + c[3] + '</span><span class="caso-meta">' + c[4] + '</span><span class="caso-texto">' + c[5] + '</span></button>';
  }

  function htmlFiltro(clave, texto) {
    return '<button class="filtro" type="button" role="tab" aria-selected="' + (clave === filtro) + '" data-filtro="' + clave + '">' + texto + '</button>';
  }

  raiz.setAttribute("aria-labelledby", "planes-title");
  if (!CON_CABECERA) raiz.removeAttribute("aria-labelledby");
  raiz.innerHTML =
    (CON_CABECERA
      ? '<header class="planes-head">' +
          '<p class="kicker">Siguiente paso</p>' +
          '<h2 class="planes-titulo" id="planes-title">Elige cómo quieres <em>empezar.</em></h2>' +
          '<p class="dek">Los dos planes arman tu entrenamiento y tu alimentación para tu caso, con el seguimiento del equipo por WhatsApp. La diferencia es si además quieres videollamadas en vivo con tus entrenadores y nutricionistas.</p>' +
        '</header>'
      : "") +
    '<div class="plan-grid">' +
      '<article class="plan plan-esencial" aria-labelledby="esencial-nombre">' +
        '<div class="plan-top"><h3 class="plan-name" id="esencial-nombre">Plan Esencial</h3></div>' +
        '<p class="plan-price"><span class="price-pre">Suscripción mensual</span><span class="price-main"><span class="cur">US$</span>77<span class="per">/ mes</span></span></p>' +
        '<p class="plan-terms">Se renueva cada mes y la cancelas cuando quieras, antes de la renovación.</p>' +
        '<ul class="plan-list">' +
          '<li>Plan de entrenamiento hecho para tu caso: tu tiempo, tus días libres, en gimnasio o en casa. Cada ejercicio explicado en video en la app TR4INER.</li>' +
          '<li>Plan de alimentación con las comidas que te gustan, según tus calorías. Sin dietas extremas ni platos aparte.</li>' +
          '<li>Evaluación inicial y chequeo mensual de tu progreso.</li>' +
          '<li>Seguimiento 1 a 1 por WhatsApp con entrenadores certificados por la IFBB y nutricionistas colegiadas.</li>' +
          '<li>Una comunidad de personas con tu mismo objetivo.</li>' +
        '</ul>' +
        '<div class="plan-foot">' +
          '<a class="btn btn-principal pagar" id="pagar-hotmart" data-metodo="hotmart" href="' + HOTMART + '">Empezar con el Esencial ' + FLECHA + '</a>' +
          '<p class="plan-alt">Pago seguro con Hotmart · <a class="pagar" id="pagar-stripe" data-metodo="stripe" href="' + STRIPE + '">Prefiero pagar con Stripe</a></p>' +
        '</div>' +
      '</article>' +
      '<article class="plan plan-premium" aria-labelledby="premium-nombre">' +
        '<div class="plan-top"><h3 class="plan-name" id="premium-nombre">Plan Premium</h3><span class="plan-badge">Sesión personalizada</span></div>' +
        '<p class="plan-price"><span class="price-pre">Planes desde</span><span class="price-main"><span class="cur">US$</span>400</span></p>' +
        '<p class="plan-terms">Un asesor revisa tu caso y te presenta tu plan en una sesión gratuita de 30 minutos.</p>' +
        '<ul class="plan-list">' +
          '<li><strong>Todo lo del Plan Esencial.</strong></li>' +
          '<li>Videollamadas 1 a 1 en vivo exclusivas con nuestros entrenadores profesionales y nutricionistas.</li>' +
          '<li>Revisan contigo cada ajuste para asegurar que cada paso que des sea el correcto.</li>' +
        '</ul>' +
        '<div class="plan-foot">' +
          '<p class="next-slot" id="proximo" hidden><span class="pulse" aria-hidden="true"></span><span>Próximo horario libre: <strong id="proximo-texto"></strong></span></p>' +
          '<button class="btn btn-premium" type="button" id="abrir-agenda" aria-haspopup="dialog">Agendar mi sesión ' + FLECHA + '</button>' +
          '<p class="plan-alt">Sujeto a disponibilidad y cupos.</p>' +
        '</div>' +
      '</article>' +
    '</div>' +
    // Testimonios de clientes, en video vertical desde R2 (video.mediatr4iner.com).
    '<div class="casos" id="casos" aria-labelledby="casos-title">' +
      '<div class="casos-head"><div>' +
        '<p class="kicker">Casos reales</p>' +
        '<h2 class="casos-titulo" id="casos-title">Personas como tú que <em>ya empezaron.</em></h2>' +
        '<p class="dek">Toca una historia para verla. Son clientes de TR4INER contando su proceso.</p>' +
      '</div><div class="flechas">' +
        '<button type="button" id="casos-antes" aria-label="Testimonios anteriores">‹</button>' +
        '<button type="button" id="casos-despues" aria-label="Más testimonios">›</button>' +
      '</div></div>' +
      (soloMujeres ? "" :
        '<div class="filtros" role="tablist" aria-label="Filtrar testimonios">' +
          htmlFiltro("todos", "Todos") + htmlFiltro("mujer", "Mujeres") + htmlFiltro("hombre", "Hombres") +
        '</div>') +
      '<div class="casos-fila" id="casos-fila">' +
        CASOS.filter(function (c) { return !soloMujeres || c[0] === "mujer"; }).map(htmlCaso).join("") +
      '</div>' +
    '</div>';

  // La hoja de agenda y el visor van al final del <body>, fuera del flujo de la página,
  // pero con el mismo tema: comparten sus variables con la sección.
  var capas = document.createElement("div");
  capas.className = "tr4p tr4p-capas";
  capas.setAttribute("data-tema", TEMA);
  capas.innerHTML =
    '<div class="agenda-capa" id="agenda" hidden>' +
      '<div class="agenda-hoja" role="dialog" aria-modal="true" aria-labelledby="agenda-titulo">' +
        '<header class="agenda-cabeza"><div>' +
          '<p class="agenda-kicker">Plan Premium · Sesión gratuita</p>' +
          '<h2 class="agenda-titulo" id="agenda-titulo" tabindex="-1">Elige día y hora</h2>' +
          '<p class="agenda-meta">' +
            '<span><svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="6.2" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M8 4.6V8l2.3 1.5" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>30 min</span>' +
            '<span><svg viewBox="0 0 16 16" aria-hidden="true"><rect x="1.6" y="4.2" width="9" height="7.6" rx="1.6" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M10.6 7.2l3.6-2v5.6l-3.6-2" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/></svg>Sesión con un asesor</span>' +
          '</p>' +
        '</div><button class="agenda-cerrar" type="button" id="cerrar-agenda" aria-label="Cerrar">×</button></header>' +
        '<ol class="agenda-progreso" aria-hidden="true"><li data-tramo="horario">Horario</li><li data-tramo="datos">Tus datos</li><li data-tramo="listo">Listo</li></ol>' +
        '<div class="agenda-cuerpo">' +
          '<section class="agenda-paso" data-paso="horario">' +
            '<p class="aviso" id="aviso-horario" role="status" hidden></p>' +
            '<div class="esqueleto" id="esqueleto" aria-label="Buscando horarios libres"><span></span><span></span><span></span><span></span><span></span><span></span></div>' +
            '<div class="dias" id="dias" role="tablist" aria-label="Día"></div>' +
            '<div id="horas"></div>' +
            '<p class="zona" id="zona"></p>' +
            '<button class="link-calendario" type="button" id="ver-calendario">¿Ningún horario te queda? Ver el calendario completo</button>' +
          '</section>' +
          '<form class="agenda-paso" data-paso="datos" id="agenda-form" novalidate hidden>' +
            '<div class="elegido"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="5" width="17" height="15.5" rx="3" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M3.5 10h17M8 3v4M16 3v4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg><span class="elegido-texto" id="elegido-texto"></span><button class="boton-texto" type="button" id="cambiar-horario">Cambiar</button></div>' +
            '<div class="field" id="f-nombre"><label for="nombre">Tu nombre</label><input class="control" id="nombre" name="nombre" type="text" autocomplete="name" maxlength="100" placeholder="Nombre y apellido" /><p class="err">Escribe tu nombre para que el asesor sepa cómo llamarte.</p></div>' +
            '<div class="field" id="f-email"><label for="email">Tu correo</label><input class="control" id="email" name="email" type="email" inputmode="email" autocomplete="email" maxlength="160" placeholder="tu@correo.com" /><p class="err">Revisa tu correo: ahí te llega la invitación a la videollamada.</p></div>' +
            '<div class="field" id="f-whatsapp"><label for="whatsapp">Tu WhatsApp</label><div class="phone-row">' +
              '<input type="hidden" id="prefijo" value="+51" />' +
              '<button class="control prefix-btn" type="button" id="prefijo-btn" aria-haspopup="dialog" aria-expanded="false" aria-label="Código de país: Perú, +51. Cambiar"><span class="prefix-flag" aria-hidden="true">🇵🇪</span><span class="prefix-code">+51</span><span class="prefix-caret" aria-hidden="true"></span></button>' +
              '<input class="control" id="whatsapp" name="whatsapp" type="tel" inputmode="tel" autocomplete="tel-national" maxlength="25" placeholder="987 654 321…" />' +
            '</div><p class="err">Escribe tu número de WhatsApp, sólo dígitos.</p>' +
            '<p class="phone-hint" id="whatsapp-aviso" aria-live="polite" hidden><span class="phone-hint-text"></span> <button class="phone-hint-cambiar" type="button">Cambiar país</button><span class="phone-hint-pie">Si está bien así, vuelve a tocar el botón.</span></p></div>' +
            '<div class="field" id="f-objetivo"><label for="objetivo">¿Qué te gustaría lograr?</label><textarea class="control" id="objetivo" name="objetivo" rows="2" maxlength="600" placeholder="Ej.: bajar 8 kilos y dejar de picar de noche"></textarea><p class="err">Cuéntale al asesor en una línea qué quieres lograr.</p></div>' +
            '<div class="trampa" aria-hidden="true"><label for="sitio">Sitio web</label><input id="sitio" name="sitio" type="text" tabindex="-1" autocomplete="off" /></div>' +
            '<p class="aviso" id="aviso-datos" role="alert" hidden></p>' +
            '<button class="btn btn-principal" type="submit" id="confirmar">Confirmar mi sesión ' + FLECHA + '<span class="spinner" aria-hidden="true"></span></button>' +
            '<p class="nota">Te llega la invitación a tu correo y te escribimos por WhatsApp para confirmarla. Al continuar aceptas la <a href="https://tr4iner.com/politica-de-privacidad/" target="_blank" rel="noopener">Política de Privacidad</a>.</p>' +
          '</form>' +
          '<section class="agenda-paso listo" data-paso="listo" hidden>' +
            '<div class="listo-icono"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5.5 12.6l4.2 4.1L18.5 7.8" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg></div>' +
            '<p class="listo-fecha" id="listo-fecha"></p><p class="listo-hora" id="listo-hora"></p>' +
            '<p>Te llegó la invitación a tu correo y te escribimos por WhatsApp para confirmarla. Ten a mano lo que quieres lograr: el asesor parte de ahí.</p>' +
            '<p class="listo-enlaces" id="listo-enlaces" hidden><a id="reprogramar" href="#" target="_blank" rel="noopener">Cambiar día u hora</a> · <a id="cancelar" href="#" target="_blank" rel="noopener">Cancelar</a></p>' +
            '<span class="etiqueta-prueba" id="etiqueta-prueba" hidden>Modo prueba · la cita no se creó en Calendly</span>' +
          '</section>' +
          '<section class="agenda-paso" data-paso="calendly" hidden><p class="aviso" id="aviso-calendly" role="status" hidden></p><iframe class="calendly-marco" id="calendly-marco" title="Calendario del equipo TR4INER"></iframe></section>' +
        '</div>' +
      '</div>' +
    '</div>' +
    '<div class="visor" id="visor" role="dialog" aria-modal="true" aria-labelledby="visor-pie" hidden>' +
      '<div class="visor-caja"><div class="visor-video" id="visor-video"></div><p class="visor-pie" id="visor-pie"></p></div>' +
      '<button class="visor-cerrar" type="button" id="visor-cerrar" aria-label="Cerrar video">×</button>' +
    '</div>';
  document.body.appendChild(capas);

  // ── Atribución ────────────────────────────────────────────────
  var tr4 = window.TR4Track || {};
  var params = tr4.getCanonicalParams ? tr4.getCanonicalParams() : new URLSearchParams(window.location.search);
  var limpiar = tr4.decodeUtmValue || function (valor) { return valor == null ? "" : String(valor); };
  var ZONA = "America/Lima";
  try { ZONA = Intl.DateTimeFormat().resolvedOptions().timeZone || ZONA; } catch (error) { /* navegador viejo */ }

  window.dataLayer = window.dataLayer || [];
  function medir(evento, extra) {
    var datos = { event: evento, planes_pagina: SLUG };
    Object.keys(extra || {}).forEach(function (clave) { datos[clave] = extra[clave]; });
    window.dataLayer.push(datos);
  }

  // Lo que no hace falta durante la carga (los horarios de Calendly) espera al primer
  // toque o desliz. /empezar trae su propio despertador; las demás, este.
  var alDespertar = window.TR4_AL_DESPERTAR || (function () {
    var hecho = false;
    var pendientes = [];
    var EVENTOS = ["pointerdown", "touchstart", "keydown", "scroll", "wheel", "mousemove"];
    function despertar() {
      if (hecho) return;
      hecho = true;
      EVENTOS.forEach(function (evento) { window.removeEventListener(evento, despertar, { passive: true }); });
      pendientes.splice(0).forEach(function (fn) { fn(); });
    }
    EVENTOS.forEach(function (evento) { window.addEventListener(evento, despertar, { passive: true }); });
    if (document.readyState === "complete") setTimeout(despertar, 5000);
    else window.addEventListener("load", function () { setTimeout(despertar, 5000); }, { once: true });
    return function (fn) { if (hecho) fn(); else pendientes.push(fn); };
  })();

  // Todo lo que trae la URL más la atribución guardada (first-touch, fbc/fbp): cada
  // salto reenvía todos los parámetros presentes, no una lista que quede vieja.
  var RESERVADOS = ["off", "offer", "checkoutMode", "src", "sck", "client_reference_id", "prefilled_email", "name", "email", "first_name", "sexo", "rango_edad"];
  function atribucion() {
    var salida = {};
    params.forEach(function (valor, clave) {
      if (valor && RESERVADOS.indexOf(clave) === -1) salida[clave] = limpiar(valor);
    });
    if (tr4.getAttribution) {
      var guardada = tr4.getAttribution();
      Object.keys(guardada).forEach(function (clave) {
        if (!(clave in salida) && guardada[clave] && RESERVADOS.indexOf(clave) === -1) salida[clave] = guardada[clave];
      });
    }
    return salida;
  }
  var ATRIB = atribucion();
  // Las páginas de Veronika rellenan source y campaña cuando el enlace llega sin UTMs, igual
  // que hacía su Typeform: así el pago y la agenda se cuentan del lado VA.
  ["utm_source", "utm_campaign"].forEach(function (clave) {
    var respaldo = raiz.getAttribute("data-" + clave.replace("_", "-"));
    if (respaldo && !ATRIB[clave]) ATRIB[clave] = respaldo;
  });
  // El registro de Caso de Estudio trae nombre y correo en la URL: se precargan en los
  // dos checkouts, en la hoja de agenda y en Calendly.
  var NOMBRE = limpiar(params.get("first_name") || params.get("name") || "").trim();
  var EMAIL = limpiar(params.get("email") || "").trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(EMAIL)) EMAIL = "";

  // ── Plan Esencial ─────────────────────────────────────────────
  function azar(largo) {
    var abc = "abcdefghijklmnopqrstuvwxyz0123456789";
    var salida = "";
    try {
      var bytes = new Uint8Array(largo);
      window.crypto.getRandomValues(bytes);
      for (var i = 0; i < largo; i++) salida += abc[bytes[i] % 36];
      return salida;
    } catch (error) { /* sin crypto: alcanza Math.random para no chocar */ }
    while (salida.length < largo) salida += Math.random().toString(36).slice(2);
    return salida.slice(0, largo);
  }
  var CODIGO = REF + "-" + azar(10);

  function utms() {
    var utm = {};
    ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"].forEach(function (clave) {
      if (ATRIB[clave]) utm[clave] = ATRIB[clave];
    });
    return utm;
  }

  function avisarClic(pasarela) {
    var cuerpo = JSON.stringify({
      codigo: CODIGO,
      pasarela: pasarela,
      producto: "esencial",
      pagina: RUTA,
      variant: null,
      page_url: window.location.href,
      timestamp: new Date().toISOString(),
      utm: utms(),
      fbclid: ATRIB.fbclid || null,
      fbc: ATRIB.fbc || null,
      fbp: ATRIB.fbp || null,
      video: ATRIB.video || null
    });
    // sendBeacon sobrevive a la salida hacia el checkout y va como text/plain, sin
    // preflight. Si no está o lo rechaza, fetch con keepalive hace lo mismo.
    try { if (navigator.sendBeacon && navigator.sendBeacon(CRM_CLIC, cuerpo)) return; } catch (error) { /* sigue */ }
    try { fetch(CRM_CLIC, { method: "POST", body: cuerpo, keepalive: true, mode: "no-cors" }); } catch (error) { /* nunca frena el pago */ }
  }

  function enlaceHotmart() {
    var url = new URL(HOTMART);
    Object.keys(ATRIB).forEach(function (clave) { url.searchParams.set(clave, ATRIB[clave]); });
    url.searchParams.set("src", SLUG);
    url.searchParams.set("sck", CODIGO);
    if (NOMBRE) url.searchParams.set("name", NOMBRE);
    if (EMAIL) url.searchParams.set("email", EMAIL);
    return url.toString();
  }

  function enlaceStripe() {
    var url = new URL(STRIPE);
    url.searchParams.set("client_reference_id", CODIGO);
    var utm = utms();
    Object.keys(utm).forEach(function (clave) { url.searchParams.set(clave, utm[clave]); });
    if (EMAIL) url.searchParams.set("prefilled_email", EMAIL);
    return url.toString();
  }

  document.getElementById("pagar-hotmart").href = enlaceHotmart();
  document.getElementById("pagar-stripe").href = enlaceStripe();
  raiz.querySelectorAll(".pagar").forEach(function (enlace) {
    enlace.addEventListener("click", function () {
      avisarClic(enlace.getAttribute("data-metodo"));
      medir("planes_esencial_click", { metodo_pago: enlace.getAttribute("data-metodo"), codigo_clic: CODIGO });
    });
  });

  // ── Horarios libres ───────────────────────────────────────────
  var pedido = null;
  var horarios = [];
  var horariosFallaron = false;
  // Lo decide el servidor (EMPEZAR_AGENDA_REAL): si es falso, el horario elegido se
  // confirma en Calendly en vez del formulario propio, para no simular una cita.
  var reservaDirecta = true;

  function pedirHorarios(otraVez) {
    if (pedido && !otraVez) return pedido;
    pedido = fetch("/api/empezar/horarios", { headers: { accept: "application/json" } })
      .then(function (respuesta) {
        // El cuerpo se lee SIEMPRE, también en un error: si no, Chrome deja el pedido
        // abierto y PageSpeed espera hasta su límite.
        return respuesta.json().catch(function () { return {}; }).then(function (datos) {
          if (!respuesta.ok) throw new Error("horarios " + respuesta.status);
          return datos;
        });
      })
      .then(function (datos) {
        aceptarHorarios(datos.horarios);
        reservaDirecta = datos.reserva_directa !== false;
        horariosFallaron = false;
        return horarios;
      })
      .catch(function () {
        horarios = [];
        horariosFallaron = true;
        return horarios;
      });
    return pedido;
  }

  function aceptarHorarios(lista) {
    // Cinco minutos de margen: un horario que empieza ya no se puede tomar.
    var desde = Date.now() + 5 * 60 * 1000;
    horarios = (Array.isArray(lista) ? lista : []).filter(function (h) {
      return h && h.inicio && new Date(h.inicio).getTime() > desde;
    });
  }

  function claveDia(fecha) { return fecha.toLocaleDateString("en-CA", { timeZone: ZONA }); }
  function horaDe(fecha) { return fecha.toLocaleTimeString("es", { timeZone: ZONA, hour: "numeric", minute: "2-digit", hour12: true }); }
  function horaLocal(fecha) { return Number(fecha.toLocaleTimeString("en-GB", { timeZone: ZONA, hour: "2-digit", hour12: false })); }
  function mayuscula(texto) { return texto.charAt(0).toUpperCase() + texto.slice(1); }

  function diaRelativo(fecha) {
    var hoy = claveDia(new Date());
    var manana = claveDia(new Date(Date.now() + 24 * 60 * 60 * 1000));
    var clave = claveDia(fecha);
    if (clave === hoy) return "Hoy";
    if (clave === manana) return "Mañana";
    return mayuscula(fecha.toLocaleDateString("es", { timeZone: ZONA, weekday: "long" }));
  }

  // «mié 21 oct» debajo de Hoy y Mañana; debajo de «Viernes», sólo «23 oct».
  function fechaCorta(fecha, conDia) {
    var partes = {};
    new Intl.DateTimeFormat("es", { timeZone: ZONA, weekday: "short", day: "numeric", month: "short" })
      .formatToParts(fecha)
      .forEach(function (parte) { partes[parte.type] = parte.value.replace(/\./g, ""); });
    return (conDia ? partes.weekday + " " : "") + partes.day + " " + partes.month;
  }

  function diaLargo(fecha) {
    return mayuscula(fecha.toLocaleDateString("es", { timeZone: ZONA, weekday: "long", day: "numeric", month: "long" }).replace(",", ""));
  }

  function fechaLarga(fecha) { return diaLargo(fecha) + ", " + horaDe(fecha); }
  function nombreZona() { return ZONA.split("/").pop().replace(/_/g, " "); }

  // La firma de la tarjeta: el horario libre más próximo, de Calendly al momento.
  function pintarProximo() {
    var proximo = document.getElementById("proximo");
    if (!horarios.length) { proximo.hidden = true; return; }
    var fecha = new Date(horarios[0].inicio);
    var dia = diaRelativo(fecha);
    document.getElementById("proximo-texto").textContent =
      (dia === "Hoy" || dia === "Mañana" ? dia.toLowerCase() : dia) + ", " + horaDe(fecha);
    proximo.hidden = false;
  }

  var premium = raiz.querySelector(".plan-premium");
  if ("IntersectionObserver" in window) {
    var cerca = new IntersectionObserver(function (entradas) {
      if (!entradas[0].isIntersecting) return;
      cerca.disconnect();
      alDespertar(function () { pedirHorarios().then(pintarProximo); });
    }, { rootMargin: "400px 0px" });
    cerca.observe(premium);

    // Cuántos llegaron a ver los planes: es el denominador de los clics y las agendas.
    var visto = new IntersectionObserver(function (entradas) {
      if (!entradas[0].isIntersecting) return;
      visto.disconnect();
      medir("planes_vistos", { non_interaction: true });
    }, { threshold: 0.4 });
    visto.observe(raiz.querySelector(".plan-grid"));
  } else {
    alDespertar(function () { pedirHorarios().then(pintarProximo); });
  }

  // ── Hoja de agenda ────────────────────────────────────────────
  var capa = document.getElementById("agenda");
  var titulo = document.getElementById("agenda-titulo");
  var abrir = document.getElementById("abrir-agenda");
  var pasos = capa.querySelectorAll(".agenda-paso");
  var tramos = capa.querySelectorAll(".agenda-progreso li");
  var diasBox = document.getElementById("dias");
  var horasBox = document.getElementById("horas");
  var esqueleto = document.getElementById("esqueleto");
  var avisoHorario = document.getElementById("aviso-horario");
  var form = document.getElementById("agenda-form");
  var elegido = null;
  var diaActivo = null;
  var pasoActual = "horario";
  var prefijoCargado = false;

  var TITULOS = { horario: "Elige día y hora", datos: "Tus datos para la sesión", listo: "Tu sesión quedó agendada", calendly: "Elige en el calendario" };
  var ORDEN = ["horario", "datos", "listo"];

  function irA(paso) {
    pasoActual = paso;
    pasos.forEach(function (seccion) { seccion.hidden = seccion.getAttribute("data-paso") !== paso; });
    titulo.textContent = TITULOS[paso];
    var indice = ORDEN.indexOf(paso === "calendly" ? "horario" : paso);
    tramos.forEach(function (tramo, i) {
      tramo.classList.toggle("hecho", i < indice);
      tramo.classList.toggle("actual", i === indice);
    });
    capa.querySelector(".agenda-cuerpo").scrollTop = 0;
    titulo.focus({ preventScroll: true });
    if (paso === "datos") cargarPrefijo();
  }

  function abrirAgenda() {
    capa.hidden = false;
    document.documentElement.classList.add("tr4p-bloqueo");
    medir("planes_premium_open");
    if (pasoActual === "listo") { titulo.focus(); return; }
    irA("horario");
    mostrarHorarios();
  }

  function cerrarAgenda() {
    capa.hidden = true;
    document.documentElement.classList.remove("tr4p-bloqueo");
    abrir.focus({ preventScroll: true });
  }

  abrir.addEventListener("click", abrirAgenda);
  // Los horarios empiezan a pedirse en cuanto el dedo toca el botón.
  abrir.addEventListener("pointerdown", function () { pedirHorarios(); }, { passive: true });
  document.getElementById("cerrar-agenda").addEventListener("click", cerrarAgenda);
  capa.addEventListener("click", function (evento) { if (evento.target === capa) cerrarAgenda(); });

  function mostrarHorarios(aviso) {
    avisoHorario.hidden = !aviso;
    avisoHorario.textContent = aviso || "";
    esqueleto.hidden = false;
    diasBox.innerHTML = "";
    horasBox.innerHTML = "";
    pedirHorarios().then(function () {
      esqueleto.hidden = true;
      if (!horarios.length) {
        abrirCalendly(null, horariosFallaron
          ? "No pudimos traer los horarios desde aquí. Elige tu sesión en el calendario del equipo:"
          : "En los próximos días no quedan horarios libres. Mira otras fechas en el calendario del equipo:");
        return;
      }
      pintarDias();
    });
  }

  function porDia() {
    var grupos = {};
    var orden = [];
    horarios.forEach(function (h) {
      var clave = claveDia(new Date(h.inicio));
      if (!grupos[clave]) { grupos[clave] = []; orden.push(clave); }
      grupos[clave].push(h);
    });
    return { grupos: grupos, orden: orden };
  }

  function pintarDias() {
    var dias = porDia();
    if (!diaActivo || !dias.grupos[diaActivo]) diaActivo = dias.orden[0];
    diasBox.innerHTML = "";
    dias.orden.forEach(function (clave) {
      var fecha = new Date(dias.grupos[clave][0].inicio);
      var boton = document.createElement("button");
      boton.type = "button";
      boton.className = "dia";
      boton.setAttribute("role", "tab");
      boton.setAttribute("aria-selected", String(clave === diaActivo));
      var cantidad = dias.grupos[clave].length;
      boton.innerHTML = '<span class="dia-rel"></span><span class="dia-fecha"></span><span class="dia-cant"></span>';
      var relativo = diaRelativo(fecha);
      boton.querySelector(".dia-rel").textContent = relativo;
      boton.querySelector(".dia-fecha").textContent = fechaCorta(fecha, relativo === "Hoy" || relativo === "Mañana");
      boton.querySelector(".dia-cant").textContent = cantidad + (cantidad === 1 ? " horario" : " horarios");
      boton.addEventListener("click", function () {
        diaActivo = clave;
        pintarDias();
      });
      diasBox.appendChild(boton);
    });
    pintarHoras(dias.grupos[diaActivo]);
    document.getElementById("zona").textContent = "Horarios en tu hora local (" + nombreZona() + ").";
  }

  function pintarHoras(lista) {
    // «Por la mañana» y no «Mañana»: arriba, en los días, «Mañana» ya es el día siguiente.
    var franjas = [
      { nombre: "Por la mañana", desde: 0, hasta: 12 },
      { nombre: "Por la tarde", desde: 12, hasta: 18 },
      { nombre: "Por la noche", desde: 18, hasta: 24 }
    ];
    horasBox.innerHTML = "";
    franjas.forEach(function (franja) {
      var deLaFranja = lista.filter(function (h) {
        var hora = horaLocal(new Date(h.inicio));
        return hora >= franja.desde && hora < franja.hasta;
      });
      if (!deLaFranja.length) return;
      var rotulo = document.createElement("p");
      rotulo.className = "franja-titulo";
      rotulo.textContent = franja.nombre;
      var grilla = document.createElement("div");
      grilla.className = "horas";
      grilla.setAttribute("role", "group");
      grilla.setAttribute("aria-label", franja.nombre);
      deLaFranja.forEach(function (h) {
        var fecha = new Date(h.inicio);
        var boton = document.createElement("button");
        boton.type = "button";
        boton.className = "hora";
        boton.textContent = horaDe(fecha);
        boton.setAttribute("aria-label", fechaLarga(fecha));
        boton.addEventListener("click", function () { elegirHorario(h, boton); });
        grilla.appendChild(boton);
      });
      horasBox.appendChild(rotulo);
      horasBox.appendChild(grilla);
    });
  }

  function elegirHorario(horario, boton) {
    elegido = horario;
    boton.classList.add("elegida");
    var fecha = new Date(horario.inicio);
    var texto = document.getElementById("elegido-texto");
    texto.textContent = diaLargo(fecha);
    var zona = document.createElement("small");
    zona.textContent = horaDe(fecha) + " · hora de " + nombreZona();
    texto.appendChild(zona);
    medir("planes_horario_elegido", { dias_hasta: Math.floor((fecha - Date.now()) / 86400000) });
    // Un instante para que se vea el botón hundido antes de pasar de paso.
    setTimeout(function () {
      if (reservaDirecta) irA("datos");
      else abrirCalendly(horario, "Completa tus datos para confirmar tu sesión del " + fechaLarga(fecha).replace(/^./, function (l) { return l.toLowerCase(); }));
    }, 140);
  }

  document.getElementById("cambiar-horario").addEventListener("click", function () {
    irA("horario");
    mostrarHorarios();
  });

  document.getElementById("ver-calendario").addEventListener("click", function () {
    abrirCalendly(null, null);
  });

  // ── Datos y reserva ───────────────────────────────────────────
  var campoNombre = document.getElementById("nombre");
  var campoEmail = document.getElementById("email");
  var campoWhatsapp = document.getElementById("whatsapp");
  var campoObjetivo = document.getElementById("objetivo");
  var avisoDatos = document.getElementById("aviso-datos");
  var confirmar = document.getElementById("confirmar");
  if (NOMBRE) campoNombre.value = NOMBRE;
  if (EMAIL) campoEmail.value = EMAIL;

  function cargarPrefijo() {
    if (prefijoCargado) return;
    prefijoCargado = true;
    var script = document.createElement("script");
    script.src = "/biblioteca/assets/prefijo-pais.js?v=20261016";
    document.body.appendChild(script);
  }

  function marcar(id, conError) {
    document.getElementById(id).classList.toggle("has-error", conError);
  }

  function numeroWhatsapp() {
    var prefijo = document.getElementById("prefijo").value || "";
    var numero = window.TR4Prefijo ? window.TR4Prefijo.telefono() : campoWhatsapp.value.replace(/\D/g, "");
    return numero ? prefijo + numero : "";
  }

  function validar() {
    var ok = true;
    var nombre = campoNombre.value.trim();
    var email = campoEmail.value.trim();
    var digitos = campoWhatsapp.value.replace(/\D/g, "");
    var objetivo = campoObjetivo.value.trim();
    marcar("f-nombre", nombre.length < 2); ok = ok && nombre.length >= 2;
    var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
    marcar("f-email", !emailOk); ok = ok && emailOk;
    var whatsappOk = digitos.length >= 6 && digitos.length <= 15;
    marcar("f-whatsapp", !whatsappOk); ok = ok && whatsappOk;
    marcar("f-objetivo", objetivo.length < 3); ok = ok && objetivo.length >= 3;
    if (!ok) {
      var primero = form.querySelector(".has-error .control");
      if (primero) primero.focus();
    }
    return ok;
  }

  ["f-nombre", "f-email", "f-whatsapp", "f-objetivo"].forEach(function (id) {
    document.getElementById(id).addEventListener("input", function () { marcar(id, false); });
  });

  function enviando(activo) {
    confirmar.disabled = activo;
    confirmar.classList.toggle("enviando", activo);
  }

  form.addEventListener("submit", function (evento) {
    evento.preventDefault();
    avisoDatos.hidden = true;
    if (!elegido) { irA("horario"); mostrarHorarios(); return; }
    if (!validar()) return;
    if (window.TR4Prefijo && window.TR4Prefijo.frenarPorLargo()) return;

    enviando(true);
    medir("planes_agenda_enviada");
    fetch("/api/empezar/agendar", {
      method: "POST",
      headers: { "content-type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({
        inicio: elegido.inicio,
        nombre: campoNombre.value.trim(),
        email: campoEmail.value.trim(),
        whatsapp: numeroWhatsapp(),
        objetivo: campoObjetivo.value.trim(),
        zona: ZONA,
        pagina: SLUG,
        tracking: utms(),
        sitio: document.getElementById("sitio").value
      })
    })
      .then(function (respuesta) {
        return respuesta.json().catch(function () { return {}; }).then(function (datos) {
          return { status: respuesta.status, datos: datos };
        });
      })
      .then(function (r) {
        enviando(false);
        if (r.datos.ok) return confirmada(r.datos);
        if (r.datos.motivo === "horario_ocupado") {
          aceptarHorarios(r.datos.horarios);
          pedido = Promise.resolve(horarios);
          elegido = null;
          irA("horario");
          mostrarHorarios("Ese horario se acaba de ocupar. Estos siguen libres:");
          return;
        }
        if (r.datos.motivo === "datos" && r.datos.campo && r.datos.campo !== "inicio") {
          marcar("f-" + r.datos.campo, true);
          return;
        }
        respaldo();
      })
      .catch(function () {
        enviando(false);
        respaldo();
      });
  });

  // Si la reserva no sale desde acá, se termina en Calendly en el mismo horario y con
  // los datos cargados: la persona no vuelve a empezar.
  function respaldo() {
    medir("planes_agenda_respaldo");
    abrirCalendly(elegido, "No pudimos registrar la sesión desde aquí. Termínala en el calendario del equipo, ya con tus datos:");
  }

  function confirmada(datos) {
    var fecha = new Date(datos.inicio || elegido.inicio);
    document.getElementById("listo-fecha").textContent = diaLargo(fecha);
    document.getElementById("listo-hora").textContent = horaDe(fecha) + " · hora de " + nombreZona();
    var enlaces = document.getElementById("listo-enlaces");
    if (datos.reprogramar && datos.cancelar) {
      document.getElementById("reprogramar").href = datos.reprogramar;
      document.getElementById("cancelar").href = datos.cancelar;
      enlaces.hidden = false;
    }
    document.getElementById("etiqueta-prueba").hidden = !datos.prueba;
    medir("planes_agendo", { via: "api", prueba: Boolean(datos.prueba) });
    irA("listo");
  }

  // ── Calendario de Calendly (respaldo y «ver el calendario completo») ──
  function urlCalendly(horario) {
    // Calendly abre un horario con «…T16:00:00Z», no con «…T16:00:00.000Z» (404).
    var deHorario = horario && (horario.url || CALENDARIO + "/" + String(horario.inicio).replace(/\.\d{3}Z$/, "Z"));
    var url = new URL(deHorario || CALENDARIO);
    url.searchParams.set("embed_domain", window.location.host);
    url.searchParams.set("embed_type", "Inline");
    url.searchParams.set("hide_gdpr_banner", "1");
    url.searchParams.set("hide_event_type_details", "1");
    url.searchParams.set("background_color", "ffffff");
    url.searchParams.set("text_color", "16181a");
    url.searchParams.set("primary_color", "16181a");
    var utm = utms();
    Object.keys(utm).forEach(function (clave) { url.searchParams.set(clave, utm[clave]); });
    // La marca de la página: Calendly la guarda con la cita y n8n la copia al CRM.
    url.searchParams.set("salesforce_uuid", REF + "-cal");
    var nombre = campoNombre.value.trim() || NOMBRE;
    var email = campoEmail.value.trim() || EMAIL;
    if (nombre) url.searchParams.set("name", nombre);
    if (email) url.searchParams.set("email", email);
    return url.toString();
  }

  function abrirCalendly(horario, aviso) {
    var marco = document.getElementById("calendly-marco");
    var avisoCal = document.getElementById("aviso-calendly");
    avisoCal.hidden = !aviso;
    avisoCal.textContent = aviso || "";
    marco.src = urlCalendly(horario);
    medir("planes_calendly_abierto", { con_horario: Boolean(horario) });
    irA("calendly");
    if (horario) titulo.textContent = "Confirma tu sesión";
  }

  window.addEventListener("message", function (evento) {
    if (evento.origin !== "https://calendly.com" || !evento.data) return;
    if (evento.data.event === "calendly.event_scheduled") medir("planes_agendo", { via: "calendly", prueba: false });
  });

  // ── Testimonios ───────────────────────────────────────────────
  var fila = document.getElementById("casos-fila");
  var casos = fila.querySelectorAll(".caso");
  var visor = document.getElementById("visor");
  var visorVideo = document.getElementById("visor-video");
  var reproductor = null;
  var casoAbierto = null;

  // El reproductor (18 KB) se pide cuando la sección se acerca, no con la página: así
  // ya está cuando tocan una tarjeta y el play sale dentro del mismo toque (iPhone no
  // deja arrancar con sonido si el video se monta después de una espera).
  function cargarReproductor(alListo) {
    if (window.TR4Video) { if (alListo) alListo(); return; }
    var script = document.getElementById("tr4-video-js");
    if (!script) {
      script = document.createElement("script");
      script.id = "tr4-video-js";
      script.src = "/assets/tr4-video/tr4-video.js?v=20261013";
      document.body.appendChild(script);
    }
    if (alListo) script.addEventListener("load", alListo, { once: true });
  }
  if ("IntersectionObserver" in window) {
    var cercaCasos = new IntersectionObserver(function (entradas) {
      if (!entradas[0].isIntersecting) return;
      cercaCasos.disconnect();
      cargarReproductor();
    }, { rootMargin: "600px 0px" });
    cercaCasos.observe(document.getElementById("casos"));
  } else {
    cargarReproductor();
  }

  // 720p salvo ahorro de datos o red lenta.
  function calidad() {
    var c = navigator.connection || {};
    if (c.saveData || /^(slow-)?2g$/.test(c.effectiveType || "")) return "play_360p.mp4";
    if (c.effectiveType === "3g") return "play_480p.mp4";
    return "play_720p.mp4";
  }

  // La regla WAF de R2 exige el origen de la página; si un teléfono pide el video sin
  // él, R2 responde 403 y el mismo testimonio se abre en Vimeo desde donde iba.
  function respaldoVimeo() {
    var id = casoAbierto && (/-(\d+)\/$/.exec(casoAbierto.getAttribute("data-carpeta")) || [])[1];
    if (!id || visor.hidden) return false;
    var en = Math.floor(reproductor ? reproductor.getCurrentTime() : 0);
    if (reproductor) { reproductor.destruir(); reproductor = null; }
    var marco = document.createElement("iframe");
    marco.title = "Video testimonio";
    marco.allow = "autoplay; fullscreen";
    marco.src = "https://player.vimeo.com/video/" + id + "?autoplay=1" + (en ? "#t=" + en + "s" : "");
    visorVideo.innerHTML = "";
    visorVideo.appendChild(marco);
    medir("testimonio_respaldo_vimeo", { testimonio_vimeo_id: id });
    return true;
  }

  function abrirCaso(caso) {
    // Si tocaron antes de que llegara el reproductor, se abre apenas carga.
    if (!window.TR4Video) { cargarReproductor(function () { abrirCaso(caso); }); return; }
    casoAbierto = caso;
    var nombre = caso.querySelector(".caso-nombre").textContent;
    var pie = document.getElementById("visor-pie");
    pie.innerHTML = "<b></b> · ";
    pie.firstChild.textContent = nombre;
    pie.appendChild(document.createTextNode(caso.querySelector(".caso-meta").textContent));
    visor.hidden = false;
    document.documentElement.classList.add("tr4p-bloqueo");
    reproductor = window.TR4Video.montar(visorVideo, {
      base: R2 + caso.getAttribute("data-carpeta"),
      archivo: calidad(),
      poster: caso.querySelector("img").currentSrc || caso.querySelector("img").src,
      titulo: "Testimonio de " + nombre,
      alError: respaldoVimeo
    });
    medir("planes_testimonio_play", { testimonio: caso.getAttribute("data-carpeta").split("/")[1] });
    document.getElementById("visor-cerrar").focus({ preventScroll: true });
  }

  function cerrarCaso() {
    if (visor.hidden) return;
    if (reproductor) { reproductor.destruir(); reproductor = null; }
    visorVideo.innerHTML = "";
    visor.hidden = true;
    document.documentElement.classList.remove("tr4p-bloqueo");
    if (casoAbierto) casoAbierto.focus({ preventScroll: true });
    casoAbierto = null;
  }

  casos.forEach(function (caso) {
    caso.addEventListener("click", function () { abrirCaso(caso); });
  });
  document.getElementById("visor-cerrar").addEventListener("click", cerrarCaso);
  visor.addEventListener("click", function (evento) { if (evento.target === visor) cerrarCaso(); });

  document.addEventListener("keydown", function (evento) {
    if (evento.key !== "Escape") return;
    if (!visor.hidden) { cerrarCaso(); return; }
    // La hoja de países frena su propio Escape: ese no cierra la agenda.
    if (!capa.hidden && !evento.defaultPrevented) cerrarAgenda();
  });

  raiz.querySelectorAll(".filtro").forEach(function (boton) {
    boton.addEventListener("click", function () {
      var elegidoFiltro = boton.getAttribute("data-filtro");
      raiz.querySelectorAll(".filtro").forEach(function (otro) {
        otro.setAttribute("aria-selected", String(otro === boton));
      });
      casos.forEach(function (caso) {
        caso.hidden = elegidoFiltro !== "todos" && caso.getAttribute("data-sexo") !== elegidoFiltro;
      });
      fila.scrollLeft = 0;
      medir("planes_testimonios_filtro", { filtro: elegidoFiltro });
    });
  });

  function desplazar(direccion) {
    fila.scrollBy({ left: direccion * Math.max(220, fila.clientWidth * 0.8), behavior: "smooth" });
  }
  document.getElementById("casos-antes").addEventListener("click", function () { desplazar(-1); });
  document.getElementById("casos-despues").addEventListener("click", function () { desplazar(1); });
})();
