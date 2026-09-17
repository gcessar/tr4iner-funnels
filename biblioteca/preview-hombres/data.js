/* Datos separados del catálogo real: el preview no registra leads ni publica contenido. */
(function () {
  'use strict';
  const lesson = (id, title, youtubeId, status = 'ready', extra = {}) => ({ id, title, youtubeId, status, ...extra });
  const modules = [
    { id: 'empieza', title: 'Empieza aquí para toda la ruta', short: 'Empieza aquí', description: 'Primero conoce tu ruta. Después, avanza una idea a la vez.', lessons: [
      lesson('bienvenida', 'Empieza aquí para toda la ruta', 'iv038ZlizMs', 'preview')
    ] },
    { id: 'pesas', title: 'Entrenamiento de pesas', short: 'Entrenamiento de pesas', description: 'Entiende tu rutina, aprende a entrenar y lleva tus sesiones a la práctica.', lessons: [
      lesson('rutina-intro', 'Tu rutina: introducción + 3× semana + cierre · Hombres', 'gKV5At5iPz4', 'preview', { routine: true }),
      lesson('pilares', 'Los 3 pilares · Hombres', null, 'pending'),
      lesson('sobrecarga', 'Sobrecarga progresiva: los hombres que entrenan así transforman su cuerpo más rápido', 'sTbfGQ5aqjs')
    ] },
    { id: 'alimentacion', title: 'Alimentación', short: 'Alimentación', description: 'Comprende las bases y termina con un plan de comidas para llevarlas a tu día a día.', lessons: [
      lesson('dieta', 'Si haces dieta y no bajas de peso, mira esto', 'HT31HA-hwVI'),
      lesson('carbohidratos', 'Pierde grasa rápido comiendo más carbohidratos', 'bY6sAaBeGgk'),
      lesson('rebote', 'Cómo perder grasa para siempre y evitar el efecto rebote', 'SFvwRz-q6lw'),
      lesson('saludable', 'Como saludable pero no bajo de peso', null, 'pending'),
      lesson('ayuno', 'Cuántas veces comer y ayuno intermitente', null, 'missing', { sources: ['pQKyl2X7bNE', 'sY3z2CGhGLY'] }),
      lesson('hambre', 'Pierde 10 kg de grasa sin pasar hambre', 'brR2OZEfepQ', 'ready', { youngTitle: 'Pierde grasa sin pasar hambre' }),
      lesson('comidas', 'Ahora que ya dominas las bases, voy a mostrarte un plan de comidas · Hombres', 'fJ3q8QXFb0I')
    ] },
    { id: 'cardio', title: 'Cardio / actividad', short: 'Cardio / actividad', description: 'Este módulo forma parte de tu ruta. Su contenido todavía está en preparación.', lessons: [] },
    { id: 'vida-real', title: 'Cómo seguir el plan en tu vida real', short: 'El plan en tu vida real', description: 'La constancia se construye también fuera del entrenamiento.', lessons: [
      lesson('constancia', 'Cómo ser constante', 'SSz4p9XnEEc')
    ] }
  ];
  const exercise = (id, name, area, reps, rest, alternatives) => ({ id, name, area, sets: 3, reps, rest, libraryId: '', videoId: '', alternatives });
  const exercises = {
    squat: exercise('squat', 'Sentadilla goblet', 'Piernas', '10–12', 90, ['Prensa de piernas', 'Sentadilla a un banco']),
    press: exercise('press', 'Press de pecho con mancuernas', 'Pecho', '8–12', 90, ['Press de pecho en máquina', 'Flexiones inclinadas']),
    row: exercise('row', 'Remo sentado en polea', 'Espalda', '10–12', 90, ['Remo con mancuerna', 'Remo en máquina']),
    hinge: exercise('hinge', 'Peso muerto rumano con mancuernas', 'Piernas', '10–12', 90, ['Peso muerto rumano con barra', 'Extensión de cadera en banco']),
    lateral: exercise('lateral', 'Elevaciones laterales', 'Hombros', '12–15', 60, ['Elevaciones laterales en polea', 'Elevaciones laterales en máquina']),
    pulldown: exercise('pulldown', 'Jalón al pecho', 'Espalda', '10–12', 90, ['Jalón con agarre neutro', 'Jalón unilateral en polea']),
    lunge: exercise('lunge', 'Zancadas con mancuernas', 'Piernas', '10 por lado', 90, ['Sentadilla dividida', 'Subidas al banco']),
    shoulder: exercise('shoulder', 'Press de hombros sentado', 'Hombros', '8–12', 90, ['Press de hombros en máquina', 'Press de hombros con mancuernas']),
    curl: exercise('curl', 'Curl de bíceps con mancuernas', 'Bíceps', '10–12', 60, ['Curl de bíceps en polea', 'Curl de bíceps en máquina']),
    triceps: exercise('triceps', 'Extensión de tríceps en polea', 'Tríceps', '10–12', 60, ['Extensión de tríceps con cuerda', 'Extensión de tríceps en máquina']),
    legcurl: exercise('legcurl', 'Curl femoral sentado', 'Piernas', '10–12', 60, ['Curl femoral acostado', 'Curl femoral de pie']),
    calf: exercise('calf', 'Elevaciones de talones', 'Pantorrillas', '12–15', 60, ['Elevaciones de talones sentado', 'Elevaciones de talones en prensa'])
  };
  const schedules = {
    3: [ ['Cuerpo completo A', 'squat', 'press', 'row', 'hinge', 'lateral'], ['Cuerpo completo B', 'lunge', 'pulldown', 'shoulder', 'legcurl', 'curl'], ['Cuerpo completo C', 'squat', 'row', 'press', 'calf', 'triceps'] ],
    4: [ ['Tren superior A', 'press', 'row', 'shoulder', 'curl', 'triceps'], ['Tren inferior A', 'squat', 'hinge', 'legcurl', 'calf'], ['Tren superior B', 'pulldown', 'press', 'row', 'lateral', 'curl'], ['Tren inferior B', 'lunge', 'hinge', 'legcurl', 'calf'] ],
    5: [ ['Empuje', 'press', 'shoulder', 'lateral', 'triceps'], ['Tirón', 'pulldown', 'row', 'curl'], ['Piernas', 'squat', 'hinge', 'legcurl', 'calf'], ['Tren superior', 'press', 'row', 'lateral', 'curl'], ['Tren inferior', 'lunge', 'hinge', 'legcurl', 'calf'] ]
  };
  function makeRoutine(frequency) {
    return schedules[frequency].map(([name, ...keys], day) => ({ id: 'day-' + (day + 1), name, exercises: keys.map(key => ({ ...structuredClone(exercises[key]), slot: 'd' + day + '-' + key })) }));
  }
  window.RutaPreviewData = {
    modules, makeRoutine,
    ageLabels: { '18-25': '18 a 25 años', '26-35': '26 a 35 años', '36+': '36 años en adelante' },
    members: { mateo: { name: 'Mateo', age: '26-35', frequency: 3 }, diego: { name: 'Diego', age: '18-25', frequency: 4 } }
  };
})();
