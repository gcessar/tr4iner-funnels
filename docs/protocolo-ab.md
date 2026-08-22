# Cómo probamos cambios en la landing

Guía en castellano llano del método que usamos para decidir si un cambio en
`/casos-de-estudio` sirve o no. La especificación técnica está en
[`ab-casos-de-estudio.md`](ab-casos-de-estudio.md); esto explica el **porqué** y **cómo se
mide cada cosa**.

---

## El problema que resuelve

La forma intuitiva de probar un cambio es publicarlo y comparar contra los días anteriores.
**No funciona.** Lo intentamos el 8-ago-2026: el rebote se movió 0,6 puntos, dentro del ruido
normal de cualquier día, y encima ya venía bajando solo desde el 27-jul. El cambio y la mejora
pasaron en momentos distintos y no hay manera de separarlos.

Siempre hay algo más moviéndose: el presupuesto de Meta, el creativo, el día de la semana, la
quincena. Cuando comparás dos semanas distintas, estás midiendo todo eso junto.

**La solución es partir el tráfico en dos al mismo tiempo.** Las dos versiones viven el mismo
día, con las mismas campañas y la misma gente. Todo lo que cambia afecta a los dos brazos por
igual, así que la diferencia que queda es del cambio y de nada más.

---

## Cómo se reparte la gente

**Moneda al aire, 50/50, en el servidor.** Cada visitante nuevo cae en un brazo al azar antes
de que la página se dibuje. No hay parpadeo ni versión intermedia.

**Cada persona ve siempre lo mismo.** Se le guarda una marca en el navegador que dura 180
días. Si vuelve mañana, ve la misma versión. Sin esto, alguien podría registrarse en una
versión y agendar en otra, y no sabríamos a cuál acreditarle el resultado.

**Solo entra el tráfico pago.** El visitante orgánico se comporta muy distinto —rebota 44%
contra 74% del pago— y mezclarlos diluye justo el segmento que queremos leer. El orgánico ve
la versión ganadora vigente y no ocupa un lugar del experimento.

**La dirección web nunca cambia.** El visitante siempre ve `metodo.tr4iner.com/casos-de-estudio`
aunque por detrás se sirva otro archivo. Si en vez de eso lo mandáramos a otra dirección, se
perderían las etiquetas de campaña, habría un salto extra que la gente abandona, y Meta vería
una redirección que le ensucia el seguimiento.

---

## Qué medimos en cada escalón

El embudo tiene seis escalones y **cada uno se mide en un sistema distinto**. Esto no es
capricho: cada sistema ve una parte y ninguno ve todo.

| Escalón | Qué es | De dónde sale | La trampa |
|---|---|---|---|
| **Exposiciones** | Cuánta gente vio la página en cada brazo | Google Analytics | Contar **personas**, no veces. La misma persona que recarga tres veces es uno, no tres. |
| **Registros** | Dejaron nombre y correo en el formulario | Base del CRM | Es el volumen de arriba. Que suba no significa que sea mejor. |
| **Typeform** | Completaron el cuestionario largo | Typeform | Acá aparece el **teléfono**, que la landing no pide. Sin este dato no podemos rastrear a nadie más abajo. |
| **Leads CRM** | Los que el equipo va a llamar | CRM | **Está filtrado a propósito**: entra recién a los 15 minutos, y solo si la persona no está ya en WhatsApp ni agendó directo. No es el total de registros y no hay que leerlo como volumen. |
| **Agendas** | Sacaron turno para una llamada | Calendly + setter de WhatsApp | Las de WhatsApp llegan **sin etiquetas de campaña**. Solo se pueden cruzar por teléfono, y el teléfono vino del Typeform. |
| **Ventas** | Pagaron | CRM | Tarda. La mitad compra dentro de los 3 días, pero una de cada cuatro tarda más de 17. **Antes de tres semanas no hay nada que leer.** |

### El teléfono es la pieza que sostiene todo

Vale la pena entenderlo porque cambia los números a la mitad. La landing pide solo nombre y
correo. Las agendas que cierra el setter por WhatsApp llegan sin correo y sin campaña: lo
único que traen es un teléfono.

El único lugar donde correo y teléfono aparecen juntos es el Typeform. Cruzando por ahí, en el
último test las agendas que pudimos atribuir pasaron de **12 a 30**. Sin ese cruce
subcontábamos más de la mitad y el resultado se leía al revés.

### Seguimos personas, no fechas

Elegimos un grupo —los que se registraron entre tal y tal día— y **los seguimos hacia abajo sin
límite de tiempo**. Si alguien se registró el lunes y agenda dos semanas después, esa agenda
cuenta.

Lo contrario —contar "agendas ocurridas durante el test"— parece razonable y da siempre cero:
las agendas y las ventas maduran después de que el test terminó.

---

## Qué número decide

**Antes de ver un solo dato** se elige una métrica y se escribe. Después no se cambia.

El número que decide no es el costo por lead ni la cantidad de registros. El test de agosto
mostró por qué: la versión que **duplicó** los registros traía leads que valían **43% menos**.
Más volumen arriba con peor calidad abajo puede dejarte igual o peor.

La métrica que sirve es **agendas por cada mil personas que vieron la página**. Está pegada a
la caja: como los dos brazos reciben el mismo tráfico, comparar esto es comparar cuánto rinde
cada peso invertido.

**El registro solo no alcanza como juez.** Lo probamos: en el último test quedó empatado
mientras toda la diferencia real estaba dos escalones más abajo. Sirve como señal temprana,
no como veredicto.

---

## Cuándo un resultado es de verdad

Que un brazo esté arriba no significa nada por sí solo. Tirá una moneda diez veces: es normal
que salgan 6 caras. No por eso la moneda está cargada.

La pregunta correcta es: **¿qué probabilidad hay de ver esta diferencia si en realidad las dos
versiones fueran iguales?** Eso se calcula y da un número entre 0 y 1.

| Resultado | Significa |
|---|---|
| Menos de 0,05 | Menos de 5% de que sea casualidad. **Se puede decidir.** |
| Entre 0,05 y 0,10 | Hay algo, pero todavía puede ser suerte. Seguir midiendo. |
| Más de 0,10 | Indistinguible del azar. **No es un resultado.** |

Un test que no llega a 0,05 **no prueba que las dos versiones sean iguales**. Prueba que
todavía no sabemos. Son cosas distintas.

**Cuánta muestra hace falta:** depende de qué tan grande sea la diferencia. Una mejora del 50%
se detecta con unas 3.500 personas por brazo. Una del 10% necesita diez veces más. Por eso
antes de arrancar hay que estimar cuánto va a durar; si da más de un mes, conviene probar otra
cosa.

---

## Las reglas que no se negocian

1. **Declarar la métrica antes de ver datos.** Elegirla después es acomodar la vara al
   resultado. Ya nos pasó una vez.
2. **No espiar para cortar.** Mirar todos los días y frenar apenas uno gana garantiza
   encontrar ganadores falsos. Se mira para detectar fallas técnicas, no para decidir.
3. **Empate deja lo que ya estaba.** Cambiar sin evidencia es asumir riesgo gratis.
4. **No tocar nada mientras corre.** Ni campañas, ni presupuesto, ni las páginas siguientes.
   Cualquier cambio afecta a los dos brazos y devuelve el test a cero.
5. **Cambiar una sola cosa.** Si dos versiones difieren en el título, el diseño y el peso a la
   vez, ganar no te dice cuál de las tres funcionó.
6. **Etiquetas nuevas en cada test**, no solo identificador interno nuevo. Ver abajo.

---

## Lo que ya salió mal

| Error | Qué pasó | Cómo se evita |
|---|---|---|
| **Cortar antes de tiempo** | Los dos tests se cerraron sin evidencia concluyente. El efecto real nunca se va a conocer. | Decidir la duración antes y respetarla, o asumir explícitamente que se está eligiendo por velocidad. |
| **Reusar el nombre de la variante** | Dos tests seguidos llamaron «B» a versiones distintas. El día del cambio quedó ilegible: incluyéndolo ganaba una, excluyéndolo ganaba la otra. | Nombres nuevos en cada test. |
| **Probar paquetes enteros** | El primer test cambió estructura, formulario, peso y título a la vez. Ganó, pero no sabemos por qué. | Una variable por test. |
| **Medir sin el teléfono** | Sin cruzar por Typeform, más de la mitad de las agendas quedaban sin dueño. | El cruce por teléfono es obligatorio antes de leer nada. |

---

## El enemigo silencioso: el tráfico

En los dos tests el tráfico se derrumbó a la mitad del experimento —hasta 65% en tres días—
sin que nadie lo notara hasta revisar los números.

Sin tráfico no hay muestra, y sin muestra el test no puede decidir nada por más días que lo
dejes correr. **Revisar el volumen diario es parte del protocolo**, no un detalle.
