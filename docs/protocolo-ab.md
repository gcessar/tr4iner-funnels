# Protocolo de test A/B — `/casos-de-estudio`

Cómo decidimos si un cambio en la landing sirve. La spec técnica está en
[`ab-casos-de-estudio.md`](ab-casos-de-estudio.md).

## Por qué partimos el tráfico

Publicar y comparar contra los días anteriores no decide nada: siempre hay algo más moviéndose
(presupuesto, creativo, día de la semana). Lo intentamos el 8-ago-2026 y el resultado fue
inservible.

Con el tráfico partido en dos, las dos versiones viven el mismo día con las mismas campañas.
Lo que cambia afecta a los dos brazos por igual.

## Cómo se reparte

- **50/50 al azar, decidido en el servidor.** Sin parpadeo ni versión intermedia.
- **Cada persona ve siempre lo mismo** (marca de 180 días en el navegador). Si no, alguien se
  registra en una versión y agenda en otra.
- **Solo tráfico pago.** El orgánico rebota 44% contra 74% del pago; mezclarlos diluye el
  segmento que se quiere leer.
- **La URL nunca cambia.** Redirigir pierde las UTMs, agrega un salto que la gente abandona y
  ensucia el tracking de Meta.

## Qué se mide y de dónde sale

| Escalón | De dónde | Ojo con |
|---|---|---|
| **Exposiciones** | Google Analytics | Contar personas, no veces. Quien recarga tres veces es uno. |
| **Registros** | CRM (tabla `OptIn`) | Volumen de arriba. Que suba no significa mejor. |
| **Typeform** | Typeform | Acá aparece el teléfono. |
| **Leads CRM** | CRM | **Filtrado a propósito:** entra a los 15 min y solo si no está en WhatsApp ni agendó directo. No es volumen. |
| **Agendas** | Calendly + setter | Las de WhatsApp llegan sin campaña y sin correo: solo se cruzan por teléfono. |
| **Ventas** | CRM | La mitad compra en 3 días, una de cada cuatro tarda más de 17. Antes de 3 semanas no hay lectura. |

**Dos cosas que cambian el resultado a la mitad:**

1. **El teléfono sale del Typeform y sin él no hay atribución de agendas.** La landing pide
   solo nombre y correo. En el último test, cruzar por teléfono llevó las agendas atribuibles
   de 12 a 30 — sin eso el resultado se leía al revés.
2. **Se sigue a las personas, no al calendario.** Se fija quiénes se registraron en la ventana
   y se los sigue hacia abajo sin límite de tiempo. Contar "agendas ocurridas durante el test"
   da siempre cero: maduran después.

## Qué número decide

**Agendas por cada mil personas que vieron la página.** Como los dos brazos reciben el mismo
tráfico, eso compara cuánto rinde cada peso invertido.

No decide el costo por lead ni la cantidad de registros: en el test de agosto la versión que
duplicó los registros trajo leads 43% peores. Tampoco decide el registro solo — quedó empatado
mientras la diferencia real estaba dos escalones más abajo.

Se elige **antes** de ver datos y no se cambia después.

## Cuándo el resultado es real

Se calcula la probabilidad de ver esa diferencia si las dos versiones fueran idénticas:

| Valor | Lectura |
|---|---|
| < 0,05 | Menos de 5% de que sea azar. **Se decide.** |
| 0,05 – 0,10 | Hay señal, puede ser suerte. Seguir midiendo. |
| > 0,10 | Indistinguible del azar. No es resultado. |

No llegar a 0,05 **no prueba que las versiones sean iguales**: prueba que todavía no sabemos.

Muestra necesaria: una diferencia del 50% se detecta con ~3.500 personas por brazo; una del
10% necesita diez veces más. Si la cuenta da más de un mes, conviene probar otra cosa.

## Reglas

1. Declarar la métrica antes de ver datos.
2. No espiar para cortar. Se mira para detectar fallas técnicas, no para decidir.
3. Empate deja lo que ya estaba.
4. No tocar campañas, presupuesto ni páginas siguientes mientras corre.
5. Una sola variable por test.
6. Nombre de variante nuevo en cada test.
7. Revisar el volumen diario. En los dos tests el tráfico cayó hasta 65% en tres días sin que
   nadie lo notara, y sin muestra el test no decide por más que lo dejes correr.

## Errores ya cometidos

| Error | Consecuencia |
|---|---|
| Cortar antes de tiempo (los dos tests) | El efecto real nunca se va a conocer. |
| Reusar el nombre «B» en dos tests seguidos | El día del cambio quedó ilegible: incluyéndolo ganaba una versión, excluyéndolo la otra. |
| Probar paquetes enteros (test 1: estructura + formulario + peso + título) | Ganó, pero no sabemos por qué. |
| Leer sin cruzar por teléfono | Más de la mitad de las agendas quedaban sin dueño. |
