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

module.exports = [
  '- No preguntes cuánto puede invertir: 2 de cada 3 compradores declaran menos de lo que terminan pagando. La capacidad de pago se lee en las señales, no se pregunta.',
  '- Quien ya tiene un problema de salud provocado por sus hábitos (análisis alterados, insulina, hígado graso, presión) o descontrol con la comida es quien más compra acompañamiento: a esa persona, la sesión.',
  '- «Lo tengo que hablar con mi pareja» y pedir cuotas aparecen igual entre quienes compran: no son un no. Responde la duda de fondo y deja el siguiente paso listo.',
  '- El motivo más común para no comprar es no tener el dinero ese día, no el precio. Si dice que cobra en unos días, no prometas nada: ofrécele la sesión en un horario de esos días.',
  '- Una de cada cuatro personas llega con miedo a una estafa: si pregunta el precio, no lo esquives con vueltas. Explícale de frente por qué el monto se lo da el asesor (el plan se arma según su caso) y qué va a saber al salir de la sesión.',
  '- «Ya sé lo que tengo que hacer pero no lo hago» o «necesito que me guíen» es de las señales más fuertes de compra: no hace falta convencer, hace falta el siguiente paso.'
].join('\n');
