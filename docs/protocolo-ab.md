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

| Escalón | Qué es | De dónde sale | Ojo con |
|---|---|---|---|
| **Exposiciones** | Cuánta gente vio la página en cada brazo | Google Analytics | Contar personas, no veces. Quien recarga tres veces es uno. |
| **Registros** | Dejaron nombre y correo en el formulario de la landing | CRM (tabla `OptIn`) | Volumen de arriba. Que suba no significa mejor. |
| **Typeform** | Completaron el cuestionario largo | Typeform | Acá aparece el teléfono, que la landing no pide. |
| **Leads CRM** | Los que el equipo efectivamente va a llamar | CRM | **Filtrado a propósito:** entra a los 15 min y solo si no está en WhatsApp ni agendó directo. No es volumen. |
| **Agendas** | Sacaron turno para una llamada | Calendly + setter de WhatsApp | Las de WhatsApp llegan sin campaña y sin correo: solo se cruzan por teléfono. |
| **Ventas** | Pagaron | CRM | Una cada 386 personas que ven la landing. La mitad compra en 3 días, pero el 10% tarda más de 34 y el 5% más de 82. |

**Dos cosas que cambian el resultado a la mitad:**

1. **El teléfono sale del Typeform y sin él no hay atribución de agendas.** La landing pide
   solo nombre y correo. En el último test, cruzar por teléfono llevó las agendas atribuibles
   de 12 a 30 — sin eso el resultado se leía al revés.
2. **Se sigue a las personas, no al calendario.** Se fija quiénes se registraron en la ventana
   y se los sigue hacia abajo sin límite de tiempo. Contar "agendas ocurridas durante el test"
   da siempre cero: maduran después.

## Qué NO decide

Ni el costo por lead ni la cantidad de registros. En el test de agosto la versión que duplicó
los registros trajo leads 43% peores: más volumen arriba con peor calidad abajo puede dejarte
igual o peor.

Lo que decide se elige **antes** de ver datos y no se cambia después.

## Los tres niveles de decisión

El plazo de decisión es de **7 días**. Eso define qué puede y qué no puede decidir, porque
cada escalón del embudo es más chico que el anterior y necesita más gente para dar señal.

Con 430 personas por brazo por día, a los 7 días hay 3.010 por brazo:

| Escalón | Casos por brazo | Cambio mínimo que detecta | Rol |
|---|---|---|---|
| Opt-in rate | ~662 | 14% | **decide** |
| Typeform por exposición | ~241 | 26% | **guardarraíl** |
| Agenda por exposición | ~14 | 135% | no sirve a 7 días |
| Venta por exposición | ~8 | 200% | no sirve a 7 días |

**1. Decide el opt-in rate.** Es el único escalón con gente suficiente para dar una respuesta
en 7 días.

**2. El guardarraíl es el Typeform por exposición**, no la agenda. Es el primer paso que
separa al curioso del interesado, y es donde el test de agosto mostró la diferencia real que
el opt-in no veía. La regla es numérica y se fija antes: **si el retador gana el opt-in pero
baja el Typeform más de un 20%, no se publica**, aunque esa caída no sea estadísticamente
significativa. Es una regla de decisión, no una prueba.

**3. Agendas y ventas NO pueden vetar en 7 días.** Con 14 y 8 casos por brazo, cualquier
diferencia es ruido. Exigirles un veredicto sería decidir por azar creyendo que se decide por
caja. Pasan a la fase siguiente.

## Después de publicar: ratificación a 90 días

Ganar un test no prueba que el cambio sirva para vender. Al publicar al ganador se abre una
cohorte y se la sigue **90 días**, midiendo venta por exposición contra el período anterior.

Hace falta esa ventana porque la venta tarda: sobre 637 ventas reales, la mitad ocurre en 3
días, pero el 10% tarda más de 34 y el 5% más de 82.

**Si la venta por exposición cae, se revierte.** No es un test —no hay grupo de control una
vez publicado— y por eso no prueba causalidad; es un control de daño. Sin este paso nunca se
sabe si el ganador de un test sirvió: es lo que pasó con los dos primeros.

## Antes de arrancar: ¿vale la pena este test?

Como el plazo es de 7 días, **sólo se pueden detectar cambios que muevan el opt-in un 14% o
más**. Si el cambio propuesto no puede mover tanto, el test va a terminar en empate y no se
va a aprender nada.

Cambios de una palabra o de color de botón no llegan. Cambios de ángulo, de promesa, de
estructura o de cantidad de pasos, sí. **Si no esperás un 14%, no lo testees: publicalo
directo o probá algo más grande.**

## Cuándo el resultado es real

Se calcula la probabilidad de ver esa diferencia si las dos versiones fueran idénticas:

| Valor | Lectura |
|---|---|
| < 0,05 | Menos de 5% de que sea azar. **Se decide.** |
| 0,05 – 0,10 | Hay señal, puede ser suerte. Seguir midiendo. |
| > 0,10 | Indistinguible del azar. No es resultado. |

No llegar a 0,05 **no prueba que las versiones sean iguales**: prueba que todavía no sabemos.

## Reglas

1. Declarar las métricas y el umbral del guardarraíl antes de ver datos.
2. No espiar para cortar. Se mira para detectar fallas técnicas, no para decidir.
3. Empate deja lo que ya estaba.
4. No tocar campañas, presupuesto ni páginas siguientes mientras corre.
5. Una sola variable por test.
6. Nombre de variante nuevo en cada test.
7. Revisar el volumen diario. Los 7 días suponen 430 personas por brazo por día; si el
   tráfico cae, el plazo se estira. En los dos primeros tests cayó hasta 65% en tres días sin
   que nadie lo notara.
8. **Al promover al ganador, devolverle el paquete SEO.** Las variantes salen sin indexar y
   sin metadatos sociales —correcto mientras son variantes—; si se promueven así, la landing
   queda fuera de Google.
9. Abrir la cohorte de ratificación el día que se publica.

## Errores ya cometidos

| Error | Consecuencia |
|---|---|
| Cortar antes de tiempo (los dos tests) | El efecto real nunca se va a conocer. |
| Reusar el nombre «B» en dos tests seguidos | El día del cambio quedó ilegible: incluyéndolo ganaba una versión, excluyéndolo la otra. |
| Probar paquetes enteros (test 1: estructura + formulario + peso + título) | Ganó, pero no sabemos por qué. |
| Leer sin cruzar por teléfono | Más de la mitad de las agendas quedaban sin dueño. |
| Publicar sin seguir la cohorte | De los dos ganadores publicados no sabemos si vendieron más. Por eso existe la ratificación. |
| Promover una variante con su `noindex` de variante | La landing quedó 5 días fuera de Google contradiciendo al sitemap. |

## Una advertencia sobre atribución

Para leer un test **no se usa first ni last touch**. La asignación al brazo es aleatoria y
ocurre al ver la landing: todo lo que haga después esa persona cuenta para su brazo, entró
por donde entró.

Aplicar last-touch reasigna ventas a otros funnels y saca gente del experimento, que es
justamente lo que rompe la comparación. First y last touch sirven para repartir presupuesto
entre funnels; adentro de un test, manda la asignación del test.
