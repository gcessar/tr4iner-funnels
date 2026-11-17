// Lecciones que el agente aplica en cada conversación. Es la parte del prompt
// que aprende: se revisa contra las ventas y las agendas que salieron del chat
// (el CRM cruza cada conversación con su venta por correo y por la referencia
// `rutachat-<conversación>` de Hotmart, Stripe y Calendly).
//
// Regla: una lección entra sólo si la respaldan datos (conversaciones que
// vendieron contra las que no) y la aprueba una persona. Cambiar este archivo
// cambia la versión del prompt que se guarda en cada turno, así se compara
// cuánto vende cada versión.
//
// 19-oct-2026: punto de partida con lo que ya sabíamos del estudio de 230
// llamadas de venta (ene–may 2026) y de los bots de WhatsApp.
// 26-oct-2026: el chat ya no da precios ni tiene botón de pago (lo decide el
// usuario): las dos lecciones que hablaban de eso dicen lo mismo para la sesión.
// 17-nov-2026: sin sesión desde el chat (todo va a WhatsApp con una persona del equipo) y lo que
// se aprendió de 83 expedientes de clientes de oct–nov (llamadas de Martin y chats de WhatsApp).

module.exports = [
  '- No preguntes cuánto puede invertir ni la descartes por lo que diga de su presupuesto: unos 25 de 83 clientes de oct–nov declararon el presupuesto más bajo o «no puedo invertir» y terminaron pagando varias veces eso, casi siempre empezando en partes.',
  '- Quien compra quiere contarle su caso a una persona y que le digan qué hacer. Las preguntas de diagnóstico las hace la persona del equipo por WhatsApp (y ahí las contestan todas); en el chat, como mucho una o dos, y después la pregunta de si quiere que la guíen.',
  '- Preguntar el precio es la señal de compra más fuerte del chat: quienes lo preguntaron compraron el doble que el promedio. Respóndelo de frente (no son mensualidades, son 3 meses o más, se puede empezar en partes) y pásala con una persona del equipo, que le da el número.',
  '- Varios clientes creían que el programa era una mensualidad barata. Si sale el tema del dinero, aclara que son planes de 3 meses o más antes de que se lleve una sorpresa.',
  '- Una señal de salud (análisis alterados, insulina, hígado graso, menopausia, una indicación médica), entrenar y no ver cambios, o «ya lo intenté mil veces» son de las razones más comunes de quienes compran: no hace falta convencer, hace falta el siguiente paso.',
  '- «Lo tengo que hablar con mi pareja», pedir cuotas o «cuando cobre» aparecen igual entre quienes compran: no son un no. Que lo vean con la persona del equipo.',
  '- Lo que más se queja la gente después es esperar una respuesta («Hola?», «no me han respondido»). Cuando la pases por WhatsApp, que sepa quién le responde y cuándo.'
].join('\n');
