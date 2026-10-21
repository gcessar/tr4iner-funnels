// Sesión del Plan Premium agendada desde /empezar (21-oct-2026).
//
// Reusa los dos webhooks de n8n que ya usa el chat de la Ruta: ahí vive la conexión
// OAuth con Calendly («Calendly Tr4iner»), así que el token nunca pasa por Vercel ni
// por el navegador. Es el mismo evento «Asesoría Tr4iner» que agenda AN: la cita entra
// sola a AGENDAS, a los recordatorios de ManyChat y al Schedule de Meta.
//
// Los previews pueden apuntar a sus workflows de prueba con las mismas variables que
// el chat (RUTA_CHAT_HORARIOS_URL, RUTA_CHAT_AGENDAR_URL, RUTA_CHAT_SECRET).
const N8N = 'https://primary-production-0efa.up.railway.app/webhook/';
const CALENDARIO = 'https://calendly.com/d/ck4v-8jc-pv6/asesoria-tr4iner';

function urlHorarios() { return process.env.RUTA_CHAT_HORARIOS_URL || N8N + 'ruta-chat-horarios'; }
function urlAgendar() { return process.env.RUTA_CHAT_AGENDAR_URL || N8N + 'ruta-chat-agendar'; }

// Una reserva de verdad le llena la agenda a un asesor y dispara correos, WhatsApp y el
// evento de Meta. Tiene su propia llave y no la del chat: prender las reservas del chat
// no tiene por qué prender las de esta página.
function agendaReal() { return process.env.EMPEZAR_AGENDA_REAL === '1'; }

async function n8n(url, cuerpo, timeoutMs) {
  const secreto = process.env.RUTA_CHAT_SECRET;
  if (!secreto) throw new Error('sin RUTA_CHAT_SECRET');
  const r = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-ruta-chat-secret': secreto },
    body: JSON.stringify(cuerpo || {}),
    signal: AbortSignal.timeout(timeoutMs)
  });
  if (!r.ok) throw new Error('n8n respondió ' + r.status);
  const d = await r.json();
  return Array.isArray(d) ? d[0] : d;
}

// Sólo el inicio de cada horario libre (en UTC) y su enlace de Calendly, ordenados.
async function horariosLibres() {
  const d = await n8n(urlHorarios(), {}, 6000);
  return (d && Array.isArray(d.horarios) ? d.horarios : [])
    .map(function (h) {
      const f = new Date(h && h.inicio);
      if (isNaN(f)) return null;
      const url = typeof h.url === 'string' && h.url.indexOf('https://calendly.com/') === 0 ? h.url : null;
      return { inicio: f.toISOString(), url: url };
    })
    .filter(Boolean)
    .sort(function (a, b) { return a.inicio < b.inicio ? -1 : 1; });
}

function texto(valor, max) {
  return String(valor == null ? '' : valor).replace(/\s+/g, ' ').trim().slice(0, max);
}

function zonaValida(zona) {
  const z = texto(zona, 60);
  if (!/^[A-Za-z_]+(\/[A-Za-z0-9_+-]+){1,2}$/.test(z)) return 'America/Lima';
  try { new Intl.DateTimeFormat('es', { timeZone: z }); return z; } catch (e) { return 'America/Lima'; }
}

// El WhatsApp llega armado por prefijo-pais.js («+51987654321»). Calendly lo pide con
// código de país en su pregunta obligatoria.
function whatsappValido(valor) {
  const d = String(valor || '').replace(/[^\d+]/g, '');
  const digitos = d.replace(/\D/g, '');
  return d.charAt(0) === '+' && digitos.length >= 8 && digitos.length <= 15 ? '+' + digitos : null;
}

// El brazo del test sale de la cookie que puso el middleware, no de lo que diga el
// navegador en el cuerpo: es la misma fuente que decide qué precio se vio.
function brazoDe(cookie) {
  const m = /(?:^|;\s*)ab_emp=(OCU|VIS)/.exec(String(cookie || ''));
  return m ? m[1] : null;
}

function validar(b) {
  const datos = {
    inicio: texto(b.inicio, 40),
    nombre: texto(b.nombre, 100),
    email: texto(b.email, 160).toLowerCase(),
    whatsapp: whatsappValido(b.whatsapp),
    objetivo: texto(b.objetivo, 600),
    zona: zonaValida(b.zona)
  };
  const f = new Date(datos.inicio);
  if (!datos.inicio || isNaN(f) || f.getTime() < Date.now()) return { campo: 'inicio' };
  datos.inicio = f.toISOString();
  if (datos.nombre.length < 2) return { campo: 'nombre' };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(datos.email)) return { campo: 'email' };
  if (!datos.whatsapp) return { campo: 'whatsapp' };
  if (datos.objetivo.length < 3) return { campo: 'objetivo' };
  return { datos: datos };
}

function trackingDe(b, brazo) {
  const origen = (b && typeof b.tracking === 'object' && b.tracking) || {};
  const tracking = {};
  ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach(function (k) {
    const v = texto(origen[k], 255);
    if (v) tracking[k] = v;
  });
  // Calendly guarda este campo con la cita y n8n lo copia al CRM: es lo que une cada
  // agenda con esta página y con el brazo del test, sin pisar las UTM de la persona.
  tracking.salesforce_uuid = 'empezar-' + (brazo ? brazo.toLowerCase() : 'org') + '-' + Math.random().toString(36).slice(2, 10);
  return tracking;
}

// Lo que lee el asesor en la pregunta «situación actual y meta» de la cita. No dice qué
// precio vio la persona: el closer no debería saber en qué brazo del test cayó.
function situacionParaAsesor(objetivo) {
  return objetivo + '\n\nAgendó desde la página de planes (metodo.tr4iner.com/empezar): le interesa el Plan Premium, con videollamadas.';
}

module.exports = {
  CALENDARIO: CALENDARIO,
  urlAgendar: urlAgendar,
  agendaReal: agendaReal,
  n8n: n8n,
  horariosLibres: horariosLibres,
  validar: validar,
  brazoDe: brazoDe,
  trackingDe: trackingDe,
  situacionParaAsesor: situacionParaAsesor
};
