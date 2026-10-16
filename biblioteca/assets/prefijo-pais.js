/*
  Código de país del WhatsApp en el registro de la Ruta (16-oct-2026).

  Antes era un <select> con 15 países: el 9 % de los registros entraba desde un país que no
  estaba (Alemania, Suiza, Reino Unido, Japón, Emiratos…) y no tenía cómo poner su código.
  Ahora están todos, pero nadie desliza por 245 filas:

  - Arranca en el país de la visita: el que da Vercel por IP (`TR4_RUNTIME.country`, lo agrega
    /api/genesis/config); si no hay, la zona horaria del teléfono; si tampoco, Perú.
  - Tocar el código abre una hoja con buscador (nombre sin tildes, código o alias) y los
    sugeridos arriba: el país detectado y los que más se registran.
  - El número se acomoda solo: «+58…» o «0058…» elige el país, y el 0 o el código repetido
    se quitan si sobran. Si el largo no es el del país, se avisa una vez, sin bloquear.

  El WhatsApp es del chip, no de dónde está la persona (≈5 % se registra desde un país con el
  número de otro): por eso el código siempre se ve y el aviso de largo existe.

  La lista sale de libphonenumber-js con
  `~/Documents/Ruta Tr4iner/herramientas/generar-prefijos.mjs`. Cada fila:
  [ISO, código, nombre, prefijo nacional, largo mínimo, largo máximo del celular, alias].
*/
(function () {
  'use strict';

  var DATOS = {"paises":[["AF","93","Afganistán","0",9,9,"Afghanistan"],["AL","355","Albania","0",9,9,""],["DE","49","Alemania","0",10,11,"Germany alemania deutschland"],["AD","376","Andorra","0",6,9,""],["AO","244","Angola","0",9,9,""],["AI","1","Anguila","1",10,10,"Anguilla"],["AG","1","Antigua y Barbuda","1",10,10,"Antigua & Barbuda"],["SA","966","Arabia Saudita","0",9,9,"Saudi Arabia arabia"],["DZ","213","Argelia","0",9,9,"Algeria"],["AR","54","Argentina","0",10,11,""],["AM","374","Armenia","0",8,8,""],["AW","297","Aruba","0",7,7,""],["AU","61","Australia","0",9,9,""],["AT","43","Austria","0",7,13,""],["AZ","994","Azerbaiyán","0",9,9,"Azerbaijan"],["BS","1","Bahamas","1",10,10,""],["BD","880","Bangladés","0",10,10,"Bangladesh"],["BB","1","Barbados","1",10,10,""],["BH","973","Baréin","0",8,8,"Bahrain"],["BE","32","Bélgica","0",9,9,"Belgium"],["BZ","501","Belice","0",7,7,"Belize"],["BJ","229","Benín","0",10,10,"Benin"],["BM","1","Bermudas","1",10,10,"Bermuda"],["BY","375","Bielorrusia","8",9,9,"Belarus"],["BO","591","Bolivia","0",8,8,""],["BA","387","Bosnia y Herzegovina","0",8,9,"Bosnia & Herzegovina"],["BW","267","Botsuana","0",8,8,"Botswana"],["BR","55","Brasil","0",10,11,"Brazil brasil"],["BN","673","Brunéi","0",7,7,"Brunei"],["BG","359","Bulgaria","0",8,9,""],["BF","226","Burkina Faso","0",8,8,""],["BI","257","Burundi","0",8,8,""],["BT","975","Bután","0",8,8,"Bhutan"],["CV","238","Cabo Verde","0",7,7,"Cape Verde"],["KH","855","Camboya","0",8,9,"Cambodia"],["CM","237","Camerún","0",9,9,"Cameroon"],["CA","1","Canadá","1",10,10,"Canada"],["BQ","599","Caribe neerlandés","0",7,7,"Caribbean Netherlands"],["QA","974","Catar","0",8,8,"Qatar"],["TD","235","Chad","0",8,8,""],["CL","56","Chile","0",9,9,""],["CN","86","China","0",11,11,"china"],["CY","357","Chipre","0",8,8,"Cyprus"],["VA","39","Ciudad del Vaticano","0",9,10,"Vatican City"],["CO","57","Colombia","0",10,10,""],["KM","269","Comoras","0",7,7,"Comoros"],["KP","850","Corea del Norte","0",10,10,"North Korea"],["KR","82","Corea del Sur","0",9,10,"South Korea corea"],["CI","225","Costa de Marfil","0",10,10,"Côte d’Ivoire"],["CR","506","Costa Rica","0",8,8,""],["HR","385","Croacia","0",8,9,"Croatia"],["CU","53","Cuba","0",8,8,""],["CW","599","Curazao","0",7,8,"Curaçao"],["DK","45","Dinamarca","0",8,8,"Denmark"],["DM","1","Dominica","1",10,10,""],["EC","593","Ecuador","0",9,9,""],["EG","20","Egipto","0",10,10,"Egypt"],["SV","503","El Salvador","0",8,8,""],["AE","971","Emiratos Árabes Unidos","0",9,9,"United Arab Emirates emiratos dubai abu dabi uae"],["ER","291","Eritrea","0",7,7,""],["SK","421","Eslovaquia","0",9,9,"Slovakia"],["SI","386","Eslovenia","0",8,8,"Slovenia"],["ES","34","España","0",9,9,"Spain espana"],["US","1","Estados Unidos","1",10,10,"United States usa eeuu ee uu estados unidos america"],["EE","372","Estonia","0",7,8,""],["SZ","268","Esuatini (Suazilandia)","0",8,8,"Eswatini suazilandia"],["ET","251","Etiopía","0",9,9,"Ethiopia"],["PH","63","Filipinas","0",10,10,"Philippines"],["FI","358","Finlandia","0",6,10,"Finland"],["FJ","679","Fiyi","0",7,7,"Fiji"],["FR","33","Francia","0",9,9,"France"],["GA","241","Gabón","0",7,8,"Gabon"],["GM","220","Gambia","0",7,7,""],["GE","995","Georgia","0",9,9,""],["GH","233","Ghana","0",9,9,""],["GI","350","Gibraltar","0",8,8,""],["GD","1","Granada","1",10,10,"Grenada"],["GR","30","Grecia","0",10,10,"Greece"],["GL","299","Groenlandia","0",6,6,"Greenland"],["GP","590","Guadalupe","0",9,9,"Guadeloupe"],["GU","1","Guam","1",10,10,""],["GT","502","Guatemala","0",8,8,""],["GF","594","Guayana Francesa","0",9,9,"French Guiana"],["GG","44","Guernesey","0",10,10,"Guernsey"],["GN","224","Guinea","0",9,9,""],["GQ","240","Guinea Ecuatorial","0",9,9,"Equatorial Guinea"],["GW","245","Guinea-Bisáu","0",9,9,"Guinea-Bissau"],["GY","592","Guyana","0",7,7,""],["HT","509","Haití","0",8,8,"Haiti"],["HN","504","Honduras","0",8,8,""],["HK","852","Hong Kong","0",8,8,"Hong Kong SAR China"],["HU","36","Hungría","06",9,9,"Hungary"],["IN","91","India","0",10,10,"india"],["ID","62","Indonesia","0",9,12,""],["IQ","964","Irak","0",10,10,"Iraq"],["IR","98","Irán","0",10,10,"Iran"],["IE","353","Irlanda","0",9,9,"Ireland"],["AC","247","Isla Ascensión","0",5,5,"Ascension Island"],["IM","44","Isla de Man","0",10,10,"Isle of Man"],["CX","61","Isla de Navidad","0",9,9,"Christmas Island"],["NF","672","Isla Norfolk","0",6,6,"Norfolk Island"],["IS","354","Islandia","0",7,9,"Iceland"],["AX","358","Islas Aland","0",6,10,"Åland Islands"],["KY","1","Islas Caimán","1",10,10,"Cayman Islands"],["CC","61","Islas Cocos","0",9,9,"Cocos (Keeling) Islands"],["CK","682","Islas Cook","0",5,5,"Cook Islands"],["FO","298","Islas Feroe","0",6,6,"Faroe Islands"],["FK","500","Islas Malvinas","0",5,5,"Falkland Islands"],["MP","1","Islas Marianas del Norte","1",10,10,"Northern Mariana Islands"],["MH","692","Islas Marshall","1",7,7,"Marshall Islands"],["SB","677","Islas Salomón","0",5,7,"Solomon Islands"],["TC","1","Islas Turcas y Caicos","1",10,10,"Turks & Caicos Islands"],["VG","1","Islas Vírgenes Británicas","1",10,10,"British Virgin Islands"],["VI","1","Islas Vírgenes de EE. UU.","1",10,10,"U.S. Virgin Islands"],["IL","972","Israel","0",9,9,""],["IT","39","Italia","0",9,10,"Italy"],["JM","1","Jamaica","1",10,10,""],["JP","81","Japón","0",10,10,"Japan japon"],["JE","44","Jersey","0",10,10,""],["JO","962","Jordania","0",9,9,"Jordan"],["KZ","7","Kazajistán","8",10,10,"Kazakhstan"],["KE","254","Kenia","0",9,9,"Kenya"],["KG","996","Kirguistán","0",9,9,"Kyrgyzstan"],["KI","686","Kiribati","0",8,8,""],["XK","383","Kosovo","0",8,8,""],["KW","965","Kuwait","0",8,8,""],["LA","856","Laos","0",9,10,""],["LS","266","Lesoto","0",8,8,"Lesotho"],["LV","371","Letonia","0",8,8,"Latvia"],["LB","961","Líbano","0",7,8,"Lebanon"],["LR","231","Liberia","0",7,9,""],["LY","218","Libia","0",9,9,"Libya"],["LI","423","Liechtenstein","0",7,9,""],["LT","370","Lituania","0",8,8,"Lithuania"],["LU","352","Luxemburgo","0",9,9,"Luxembourg"],["MO","853","Macao","0",8,8,"Macao SAR China"],["MK","389","Macedonia del Norte","0",8,8,"North Macedonia"],["MG","261","Madagascar","0",9,9,""],["MY","60","Malasia","0",9,10,"Malaysia"],["MW","265","Malaui","0",9,9,"Malawi"],["MV","960","Maldivas","0",7,7,"Maldives"],["ML","223","Mali","0",8,8,""],["MT","356","Malta","0",8,8,""],["MA","212","Marruecos","0",9,9,"Morocco"],["MQ","596","Martinica","0",9,9,"Martinique"],["MU","230","Mauricio","0",8,8,"Mauritius"],["MR","222","Mauritania","0",8,8,""],["YT","262","Mayotte","0",9,9,""],["MX","52","México","0",10,10,"Mexico mejico"],["FM","691","Micronesia","0",7,7,""],["MD","373","Moldavia","0",8,8,"Moldova"],["MC","377","Mónaco","0",8,9,"Monaco"],["MN","976","Mongolia","0",8,8,""],["ME","382","Montenegro","0",8,8,""],["MS","1","Montserrat","1",10,10,""],["MZ","258","Mozambique","0",9,9,""],["MM","95","Myanmar (Birmania)","0",7,10,"Myanmar (Burma) birmania"],["NA","264","Namibia","0",9,9,""],["NR","674","Nauru","0",7,7,""],["NP","977","Nepal","0",10,10,""],["NI","505","Nicaragua","0",8,8,""],["NE","227","Níger","0",8,8,"Niger"],["NG","234","Nigeria","0",10,10,""],["NU","683","Niue","0",4,7,""],["NO","47","Noruega","0",8,8,"Norway"],["NC","687","Nueva Caledonia","0",6,6,"New Caledonia"],["NZ","64","Nueva Zelanda","0",8,10,"New Zealand"],["OM","968","Omán","0",8,8,"Oman"],["NL","31","Países Bajos","0",9,11,"Netherlands holanda"],["PK","92","Pakistán","0",10,10,"Pakistan"],["PW","680","Palaos","0",7,7,"Palau"],["PS","970","Palestina","0",9,9,"Palestinian Territories"],["PA","507","Panamá","0",7,8,"Panama"],["PG","675","Papúa Nueva Guinea","0",8,8,"Papua New Guinea"],["PY","595","Paraguay","0",9,9,""],["PE","51","Perú","0",9,9,"Peru"],["PF","689","Polinesia Francesa","0",8,8,"French Polynesia"],["PL","48","Polonia","0",9,9,"Poland"],["PT","351","Portugal","0",9,9,""],["PR","1","Puerto Rico","1",10,10,"puerto rico"],["GB","44","Reino Unido","0",10,10,"United Kingdom uk inglaterra escocia gales gran bretana"],["CF","236","República Centroafricana","0",8,8,"Central African Republic"],["CZ","420","República Checa","0",9,9,"Czechia chequia"],["CG","242","República del Congo","0",9,9,"Congo - Brazzaville"],["CD","243","República Democrática del Congo","0",7,9,"Congo - Kinshasa"],["DO","1","República Dominicana","1",10,10,"Dominican Republic dominicana rd"],["RE","262","Reunión","0",9,9,"Réunion"],["RW","250","Ruanda","0",9,9,"Rwanda"],["RO","40","Rumanía","0",9,9,"Romania"],["RU","7","Rusia","8",10,10,"Russia rusia"],["EH","212","Sáhara Occidental","0",9,9,"Western Sahara"],["WS","685","Samoa","0",7,10,""],["AS","1","Samoa Americana","1",10,10,"American Samoa"],["BL","590","San Bartolomé","0",9,9,"St. Barthélemy"],["KN","1","San Cristóbal y Nieves","1",10,10,"St. Kitts & Nevis"],["SM","378","San Marino","0",8,8,""],["MF","590","San Martín","0",9,9,"St. Martin"],["PM","508","San Pedro y Miquelón","0",6,9,"St. Pierre & Miquelon"],["VC","1","San Vicente y las Granadinas","1",10,10,"St. Vincent & Grenadines"],["SH","290","Santa Elena","0",5,5,"St. Helena"],["LC","1","Santa Lucía","1",10,10,"St. Lucia"],["ST","239","Santo Tomé y Príncipe","0",7,7,"São Tomé & Príncipe"],["SN","221","Senegal","0",9,9,""],["RS","381","Serbia","0",8,10,""],["SC","248","Seychelles","0",7,7,""],["SL","232","Sierra Leona","0",8,8,"Sierra Leone"],["SG","65","Singapur","0",8,8,"Singapore"],["SX","1","Sint Maarten","1",10,10,""],["SY","963","Siria","0",9,9,"Syria"],["SO","252","Somalia","0",7,9,""],["LK","94","Sri Lanka","0",9,9,""],["ZA","27","Sudáfrica","0",5,9,"South Africa"],["SD","249","Sudán","0",9,9,"Sudan"],["SS","211","Sudán del Sur","0",9,9,"South Sudan"],["SE","46","Suecia","0",9,9,"Sweden"],["CH","41","Suiza","0",9,9,"Switzerland suiza schweiz"],["SR","597","Surinam","0",7,7,"Suriname"],["SJ","47","Svalbard y Jan Mayen","0",8,8,"Svalbard & Jan Mayen"],["TH","66","Tailandia","0",9,9,"Thailand"],["TW","886","Taiwán","0",9,9,"Taiwan taiwan"],["TZ","255","Tanzania","0",9,9,""],["TJ","992","Tayikistán","0",9,9,"Tajikistan"],["IO","246","Territorio Británico del Océano Índico","0",7,7,"British Indian Ocean Territory"],["TL","670","Timor Oriental","0",8,8,"Timor-Leste"],["TG","228","Togo","0",8,8,""],["TK","690","Tokelau","0",4,7,""],["TO","676","Tonga","0",7,7,""],["TT","1","Trinidad y Tobago","1",10,10,"Trinidad & Tobago"],["TA","290","Tristán de Acuña","0",4,4,"Tristan da Cunha"],["TN","216","Túnez","0",8,8,"Tunisia"],["TM","993","Turkmenistán","8",8,8,"Turkmenistan"],["TR","90","Turquía","0",10,10,"Türkiye"],["TV","688","Tuvalu","0",6,7,""],["UA","380","Ucrania","0",9,9,"Ukraine"],["UG","256","Uganda","0",9,9,""],["UY","598","Uruguay","0",8,8,""],["UZ","998","Uzbekistán","0",9,9,"Uzbekistan"],["VU","678","Vanuatu","0",7,7,""],["VE","58","Venezuela","0",10,10,"venezuela"],["VN","84","Vietnam","0",9,9,""],["WF","681","Wallis y Futuna","0",6,6,"Wallis & Futuna"],["YE","967","Yemen","0",9,9,""],["DJ","253","Yibuti","0",8,8,"Djibouti"],["ZM","260","Zambia","0",9,9,""],["ZW","263","Zimbabue","0",9,9,"Zimbabwe"]],"principal":{"1":"US","7":"RU","39":"IT","44":"GB","47":"NO","61":"AU","212":"MA","262":"RE","290":"SH","358":"FI","590":"GP","599":"CW"}};
  // Los que más se registran (CRM, 15-ago → 16-oct-2026), después del país detectado.
  var SUGERIDOS = ['AR', 'CO', 'PE', 'MX', 'US', 'CL', 'ES'];
  // En un empate de búsqueda van primero los de nuestro público: «arg» → Argentina antes que Argelia.
  var PRIMERO = SUGERIDOS.concat(['EC', 'BO', 'VE', 'UY', 'PY', 'PA', 'CR', 'GT', 'SV', 'HN', 'NI', 'DO', 'CU', 'PR', 'CA', 'BR']);
  var POR_DEFECTO = 'PE';
  // Sólo el respaldo cuando Vercel no da país (o en local): la IP manda.
  var ZONAS = {
    'America/Lima': 'PE', 'America/Mexico_City': 'MX', 'America/Monterrey': 'MX', 'America/Tijuana': 'MX', 'America/Cancun': 'MX',
    'America/Merida': 'MX', 'America/Chihuahua': 'MX', 'America/Hermosillo': 'MX', 'America/Mazatlan': 'MX', 'America/Bogota': 'CO',
    'America/Santiago': 'CL', 'America/Guayaquil': 'EC', 'America/La_Paz': 'BO', 'America/Caracas': 'VE', 'America/Montevideo': 'UY',
    'America/Asuncion': 'PY', 'America/Panama': 'PA', 'America/Costa_Rica': 'CR', 'America/Guatemala': 'GT', 'America/El_Salvador': 'SV',
    'America/Tegucigalpa': 'HN', 'America/Managua': 'NI', 'America/Santo_Domingo': 'DO', 'America/Havana': 'CU', 'America/Puerto_Rico': 'PR',
    'America/Sao_Paulo': 'BR', 'America/New_York': 'US', 'America/Chicago': 'US', 'America/Denver': 'US', 'America/Phoenix': 'US',
    'America/Los_Angeles': 'US', 'America/Anchorage': 'US', 'Pacific/Honolulu': 'US', 'America/Toronto': 'CA', 'America/Vancouver': 'CA',
    'America/Edmonton': 'CA', 'America/Winnipeg': 'CA', 'America/Halifax': 'CA', 'Europe/Madrid': 'ES', 'Atlantic/Canary': 'ES',
    'Europe/Lisbon': 'PT', 'Europe/London': 'GB', 'Europe/Dublin': 'IE', 'Europe/Paris': 'FR', 'Europe/Berlin': 'DE', 'Europe/Rome': 'IT',
    'Europe/Amsterdam': 'NL', 'Europe/Brussels': 'BE', 'Europe/Zurich': 'CH', 'Europe/Vienna': 'AT', 'Europe/Stockholm': 'SE',
    'Europe/Oslo': 'NO', 'Europe/Copenhagen': 'DK', 'Europe/Helsinki': 'FI', 'Europe/Warsaw': 'PL', 'Europe/Prague': 'CZ',
    'Europe/Athens': 'GR', 'Europe/Istanbul': 'TR', 'Europe/Moscow': 'RU', 'Europe/Kyiv': 'UA', 'Europe/Kiev': 'UA', 'Europe/Bucharest': 'RO',
    'Asia/Dubai': 'AE', 'Asia/Riyadh': 'SA', 'Asia/Qatar': 'QA', 'Asia/Jerusalem': 'IL', 'Asia/Tokyo': 'JP', 'Asia/Seoul': 'KR',
    'Asia/Shanghai': 'CN', 'Asia/Hong_Kong': 'HK', 'Asia/Singapore': 'SG', 'Asia/Kolkata': 'IN', 'Asia/Calcutta': 'IN', 'Asia/Bangkok': 'TH',
    'Asia/Manila': 'PH', 'Asia/Jakarta': 'ID', 'Australia/Sydney': 'AU', 'Australia/Melbourne': 'AU', 'Australia/Perth': 'AU',
    'Pacific/Auckland': 'NZ'
  };

  var boton = document.getElementById('prefijo-btn');
  var oculto = document.getElementById('prefijo');
  var telefono = document.getElementById('whatsapp');
  var aviso = document.getElementById('whatsapp-aviso');
  if (!DATOS || !boton || !oculto || !telefono) return;

  var paises = DATOS.paises.map(function (fila) {
    return {
      iso: fila[0], codigo: fila[1], nombre: fila[2], nacional: fila[3], min: fila[4], max: fila[5],
      busqueda: plano(fila[2] + ' ' + fila[6] + ' ' + fila[0])
    };
  });
  var porIso = {};
  paises.forEach(function (pais) { porIso[pais.iso] = pais; });

  function plano(texto) {
    return String(texto).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  }
  function bandera(iso) {
    // Indicadores regionales: «PE» → 🇵🇪. En Windows se ven como letras, y está bien.
    return String.fromCodePoint(127397 + iso.charCodeAt(0), 127397 + iso.charCodeAt(1));
  }
  function detectar() {
    var pais = String((window.TR4_RUNTIME || {}).country || '').toUpperCase();
    if (porIso[pais]) return { iso: pais, origen: 'ip' };
    try {
      var zona = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
      if (zona.indexOf('America/Argentina/') === 0) return { iso: 'AR', origen: 'zona' };
      if (porIso[ZONAS[zona]]) return { iso: ZONAS[zona], origen: 'zona' };
    } catch (error) { /* navegadores sin Intl completo */ }
    return { iso: POR_DEFECTO, origen: 'defecto' };
  }

  var detectado = detectar();
  // `avisado`: el próximo envío ya no se frena. `huboAviso`: para la medición, no se borra.
  var estado = { iso: detectado.iso, cambio: null, avisado: false, huboAviso: false };

  // ── Botón y número ─────────────────────────────────────────
  function rangoDeLargo(pais) {
    if (pais.min === pais.max) return String(pais.min);
    return pais.min + (pais.max - pais.min === 1 ? ' u ' : ' a ') + pais.max;
  }
  function pintarBoton() {
    var pais = porIso[estado.iso];
    oculto.value = '+' + pais.codigo;
    oculto.setAttribute('data-pais', pais.iso);
    boton.querySelector('.prefix-flag').textContent = bandera(pais.iso);
    boton.querySelector('.prefix-code').textContent = '+' + pais.codigo;
    boton.setAttribute('aria-label', 'Código de país: ' + pais.nombre + ', +' + pais.codigo + '. Cambiar');
    // Corto: en el celular el campo deja ~16 caracteres.
    telefono.placeholder = pais.iso === 'PE' ? '987 654 321…' : rangoDeLargo(pais) + ' dígitos';
  }
  function cabe(largo, pais) { return largo >= pais.min && largo <= pais.max; }
  // Quita lo que sobra si así el largo cuadra: el código repetido («51 987…» con +51 elegido)
  // y el prefijo de llamada nacional («07700…» en Reino Unido, «0151…» en Alemania). Si nada
  // cuadra, el número queda como lo escribió la persona.
  function nacional(digitos, pais) {
    var opciones = [digitos];
    if (digitos.indexOf(pais.codigo) === 0) opciones.push(digitos.slice(pais.codigo.length));
    opciones.slice().forEach(function (opcion) {
      if (pais.nacional && opcion.indexOf(pais.nacional) === 0) opciones.push(opcion.slice(pais.nacional.length));
    });
    for (var i = 0; i < opciones.length; i++) if (cabe(opciones[i].length, pais)) return opciones[i];
    return digitos;
  }
  function paisDelCodigo(digitos) {
    // Los códigos de país no son prefijo uno de otro: el primero que encaja es el único.
    for (var largo = 1; largo <= 3 && largo < digitos.length; largo++) {
      var codigo = digitos.slice(0, largo);
      var actual = porIso[estado.iso];
      if (actual.codigo === codigo) return actual;
      var principal = DATOS.principal[codigo];
      if (principal && porIso[principal]) return porIso[principal];
      for (var i = 0; i < paises.length; i++) if (paises[i].codigo === codigo) return paises[i];
    }
    return null;
  }
  function ocultarAviso() {
    if (aviso) aviso.hidden = true;
  }
  function mostrarAviso() {
    var pais = porIso[estado.iso];
    aviso.querySelector('.phone-hint-text').textContent =
      'Para ' + pais.nombre + ' esperábamos ' + rangoDeLargo(pais) + ' dígitos después del +' + pais.codigo + '. ¿Tu número es de otro país?';
    aviso.hidden = false;
  }
  function largoDudoso() {
    var digitos = telefono.value.replace(/\D/g, '');
    return digitos.length >= 7 && !cabe(nacional(digitos, porIso[estado.iso]).length, porIso[estado.iso]);
  }

  telefono.addEventListener('input', function () {
    // «+58 412…» o «0058 412…»: el número trae su país.
    var internacional = /^\s*(?:\+|00)([\d\s\-().]*)$/.exec(telefono.value);
    if (internacional) {
      var digitos = internacional[1].replace(/\D/g, '');
      var pais = paisDelCodigo(digitos);
      if (pais) {
        if (pais.iso !== estado.iso) estado.cambio = 'numero';
        estado.iso = pais.iso;
        pintarBoton();
        telefono.value = digitos.slice(pais.codigo.length);
      }
    }
    if (aviso && !aviso.hidden && !largoDudoso()) ocultarAviso();
  });
  // El aviso sale al enviar, no al salir del campo: aparecer en el blur empujaba el botón
  // y el clic del mouse caía en el vacío.

  // ── Hoja con buscador ──────────────────────────────────────
  var capa = document.createElement('div');
  capa.className = 'pais-capa';
  capa.hidden = true;
  capa.innerHTML =
    '<div class="pais-hoja" role="dialog" aria-modal="true" aria-labelledby="pais-titulo">' +
      '<div class="pais-cabeza">' +
        '<p class="pais-titulo" id="pais-titulo">Código de país</p>' +
        '<button class="pais-cerrar" type="button" aria-label="Cerrar">×</button>' +
      '</div>' +
      '<div class="pais-buscar">' +
        '<input class="control pais-busqueda" type="search" role="combobox" aria-expanded="true" aria-controls="pais-lista" ' +
          'aria-autocomplete="list" placeholder="Busca tu país o su código" autocomplete="off" autocapitalize="off" ' +
          'autocorrect="off" spellcheck="false" enterkeyhint="done" />' +
      '</div>' +
      '<ul class="pais-lista" id="pais-lista" role="listbox" aria-label="Países"></ul>' +
    '</div>';
  // Fuera del formulario: un Enter en el buscador no puede enviar el registro.
  document.body.appendChild(capa);
  var busqueda = capa.querySelector('.pais-busqueda');
  var lista = capa.querySelector('.pais-lista');
  var activo = -1;

  function fila(pais) {
    var elegido = pais.iso === estado.iso;
    return '<li class="pais-opcion" role="option" id="pais-' + pais.iso + '" data-iso="' + pais.iso + '" aria-selected="' + elegido + '">' +
      '<span class="pais-bandera" aria-hidden="true">' + bandera(pais.iso) + '</span>' +
      '<span class="pais-nombre">' + pais.nombre + '</span>' +
      '<span class="pais-codigo">+' + pais.codigo + '</span></li>';
  }
  function grupo(texto) {
    return '<li class="pais-grupo" role="presentation">' + texto + '</li>';
  }
  function resultados(texto) {
    var consulta = plano(texto).trim().replace(/^\+/, '');
    if (!consulta) return null;
    var soloDigitos = /^\d+$/.test(consulta);
    var puntaje = function (pais) {
      if (soloDigitos) return pais.codigo === consulta ? 3 : pais.codigo.indexOf(consulta) === 0 ? 2 : 0;
      var nombre = plano(pais.nombre);
      if (nombre.indexOf(consulta) === 0) return 4;
      if (pais.busqueda.indexOf(' ' + consulta) !== -1) return 3;
      if (consulta.length >= 2 && pais.iso.toLowerCase() === consulta) return 3;
      return consulta.length >= 3 && pais.busqueda.indexOf(consulta) !== -1 ? 1 : 0;
    };
    return paises.map(function (pais) {
      var puntos = puntaje(pais);
      return { pais: pais, puntos: puntos && puntos + (pais.iso === detectado.iso || PRIMERO.indexOf(pais.iso) !== -1 ? 0.5 : 0) };
    })
      .filter(function (r) { return r.puntos > 0; })
      .sort(function (a, b) { return b.puntos - a.puntos || a.pais.nombre.localeCompare(b.pais.nombre, 'es'); })
      .map(function (r) { return r.pais; });
  }
  function pintarLista() {
    var encontrados = resultados(busqueda.value);
    var html = '';
    if (encontrados === null) {
      var arriba = [detectado.iso, estado.iso].concat(SUGERIDOS).filter(function (iso, i, todos) {
        return porIso[iso] && todos.indexOf(iso) === i;
      });
      html = grupo('Sugeridos') + arriba.map(function (iso) { return fila(porIso[iso]); }).join('') +
        grupo('Todos los países') + paises.map(fila).join('');
    } else if (encontrados.length) {
      html = encontrados.map(fila).join('');
    } else {
      html = '<li class="pais-vacio" role="presentation">No encontramos «' + busqueda.value.replace(/[<>&"]/g, '') +
        '». Prueba con el nombre en español o con el código, como +49.</li>';
    }
    lista.innerHTML = html;
    activo = encontrados && encontrados.length ? 0 : -1;
    marcarActivo();
  }
  function opciones() { return lista.querySelectorAll('.pais-opcion'); }
  function marcarActivo() {
    var todas = opciones();
    for (var i = 0; i < todas.length; i++) todas[i].classList.toggle('activa', i === activo);
    if (activo >= 0 && todas[activo]) {
      busqueda.setAttribute('aria-activedescendant', todas[activo].id);
      todas[activo].scrollIntoView({ block: 'nearest' });
    } else {
      busqueda.removeAttribute('aria-activedescendant');
    }
  }
  function abrir() {
    busqueda.value = '';
    pintarLista();
    capa.hidden = false;
    document.documentElement.classList.add('pais-abierta');
    boton.setAttribute('aria-expanded', 'true');
    lista.scrollTop = 0;
    // Dentro del toque: así el teclado del celular abre listo para escribir.
    busqueda.focus();
  }
  function cerrar(devolverFoco) {
    capa.hidden = true;
    document.documentElement.classList.remove('pais-abierta');
    boton.setAttribute('aria-expanded', 'false');
    if (devolverFoco) devolverFoco.focus();
  }
  function elegir(iso) {
    if (iso !== estado.iso) estado.cambio = 'manual';
    estado.iso = iso;
    estado.avisado = false;
    pintarBoton();
    ocultarAviso();
    cerrar(telefono);
    // Si ya se había avisado y el país nuevo tampoco cuadra, el aviso se actualiza.
    if (aviso && estado.huboAviso && largoDudoso()) mostrarAviso();
  }

  boton.addEventListener('click', abrir);
  capa.querySelector('.pais-cerrar').addEventListener('click', function () { cerrar(boton); });
  capa.addEventListener('click', function (event) { if (event.target === capa) cerrar(boton); });
  lista.addEventListener('click', function (event) {
    var opcion = event.target.closest('.pais-opcion');
    if (opcion) elegir(opcion.getAttribute('data-iso'));
  });
  busqueda.addEventListener('input', pintarLista);
  busqueda.addEventListener('keydown', function (event) {
    var todas = opciones();
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      if (!todas.length) return;
      activo = Math.max(0, Math.min(todas.length - 1, activo + (event.key === 'ArrowDown' ? 1 : -1)));
      marcarActivo();
    } else if (event.key === 'Enter') {
      event.preventDefault();
      if (activo >= 0 && todas[activo]) elegir(todas[activo].getAttribute('data-iso'));
    } else if (event.key === 'Escape') {
      event.preventDefault();
      cerrar(boton);
    }
  });
  if (aviso) {
    aviso.querySelector('.phone-hint-cambiar').addEventListener('click', abrir);
  }

  pintarBoton();

  window.TR4Prefijo = {
    /** El número sin código de país, ya acomodado al país elegido. */
    telefono: function () {
      return nacional(telefono.value.replace(/\D/g, ''), porIso[estado.iso]);
    },
    /** Primer envío con un largo raro: muestra el aviso y frena. El segundo pasa. */
    frenarPorLargo: function () {
      if (!aviso || estado.avisado || !largoDudoso()) return false;
      estado.avisado = true;
      estado.huboAviso = true;
      mostrarAviso();
      return true;
    },
    /** Para medir cuánto acierta el país sugerido (va en el registro al CRM). */
    medicion: function () {
      return { sugerido: detectado.iso, origen: detectado.origen, elegido: estado.iso, cambio: estado.cambio, aviso: estado.huboAviso };
    }
  };
})();
