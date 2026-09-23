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
      lesson('constancia', 'Cómo ser constante', 'SSZ4p9XnEEc')
    ] }
  ];
  window.RutaPreviewData = {
    modules: modules.map((m, i) => ({ ...m, unlockAfterDays: [0, 0, 2, 4, 6][i] })), makeRoutine: window.RutaPrograms.makeRoutine,
    ageLabels: { '18-25': '18 a 25 años', '26-35': '26 a 35 años', '36+': '36 años en adelante' },
    members: { mateo: { name: 'Mateo', sex: 'MEN', age: '26-35', frequency: 3 }, diego: { name: 'Diego', sex: 'MEN', age: '18-25', frequency: 4 }, laura: { name: 'Laura', sex: 'WOMEN', age: '26-35', frequency: 3 }, carmen: { name: 'Carmen', sex: 'WOMEN', age: '36+', frequency: 4 } }
  };
})();
