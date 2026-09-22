/* Dosis y alternativas del Sheet. Rotación continua confirmada por Gulhio. */
(function () {
  'use strict';
  const source = window.RutaTrainerData;
  const slug = name => 'sheet-' + name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-$/, '');
  const names = new Set();
  Object.values(source).forEach(groups => Object.values(groups).forEach(days => days.forEach(day => day.exercises.forEach(ex => [ex.name, ...ex.alternatives].forEach(name => names.add(name))))));
  names.forEach(name => window.RutaExerciseLibrary.push({ id: slug(name), name, area: 'Entrenamiento de fuerza', pattern: 'segun-entrenador', equipment: 'Gimnasio', status: 'disponible', note: 'Demostración pendiente de vincular en Bunny.' }));
  const definitions = {};
  ['MEN', 'WOMEN'].forEach(sex => [3, 4, 5].forEach(frequency => {
    const rotating = sex === 'MEN' && frequency > 3;
    definitions[sex + '-' + frequency] = { sex, frequency, rotating, title: (rotating ? 'Empuje / Jalón / Piernas' : frequency === 3 ? 'Torso, piernas y cuerpo completo' : 'Piernas y torso') + ' · ' + frequency + ' días', focus: sex === 'MEN' ? 'Todo el cuerpo' : 'Piernas y glúteos' };
  }));
  function makeRoutine(frequency, sex = 'MEN', week = 0) {
    const plan = definitions[sex + '-' + frequency];
    if (!plan) throw new Error('No existe esa combinación de rutina.');
    const sessions = source[sex === 'MEN' ? 'men' : 'women'][plan.rotating ? '4 & 5 DIAS' : frequency + ' DIAS'];
    const weekdays = { 3: ['Lunes', 'Miércoles', 'Viernes'], 4: ['Lunes', 'Martes', 'Jueves', 'Viernes'], 5: ['Lunes', 'Martes', 'Miércoles', 'Viernes', 'Sábado'] };
    return Array.from({ length: frequency }, (_, i) => {
      const sessionIndex = plan.rotating ? ((week * frequency) + i) % sessions.length : i;
      const session = sessions[sessionIndex];
      return { id: 'day-' + (i + 1), name: session.name, weekday: weekdays[frequency][i], exercises: session.exercises.map((ex, n) => ({ ...ex, id: slug(ex.name), slot: 'w' + week + '-d' + i + '-e' + n, area: 'Entrenamiento de fuerza', equipment: 'Gimnasio', pattern: 'segun-entrenador', alternativeIds: ex.alternatives.map(slug) })) };
    });
  }
  window.RutaPrograms = {
    definitions, makeRoutine, version: 3,
    audience: 'Rutinas del entrenador para hombres y mujeres. La adaptación individual se revisa con el equipo.',
    duration: 'Objetivo: 30–45 minutos. El Sheet incluye sesiones de hasta 7 ejercicios y 21 series; su duración aún debe validarse en práctica.',
    adaptation: 'Se conservan las series, repeticiones, descansos y reemplazos del entrenador, sin reducirlos automáticamente.',
    intensity: 'Consulta con el entrenador la carga y el esfuerzo adecuados para empezar o retomar.',
    warmup: 'Prepara los movimientos antes de las series de trabajo. El calentamiento específico no está detallado en el Sheet.',
    progression: 'El equipo debe confirmar la pauta de progresión y las indicaciones de técnica de cada ejercicio.',
    recovery: 'Sigue el orden de las sesiones. En hombres de 4 y 5 días, continúa Empuje → Jalón → Piernas entre semanas. Los días de calendario son un ejemplo.',
    substitutions: 'Los reemplazos son los indicados en el Sheet. Conservan la dosis de la fila; revisa la carga al cambiar de variante.',
    age: 'Estas bases no cambian por rango de edad. Las modificaciones individuales se revisan con el entrenador.',
    boundary: 'Si aparece dolor, detén el ejercicio y pide al equipo una adaptación.',
    missing: 'La vinculación de los videos de cada variante con Bunny está pendiente. Los enlaces privados de Vimeo no se publican en este preview.',
    sources: [{ title: 'Rutinas del entrenador · Google Sheet', url: 'https://docs.google.com/spreadsheets/d/1OfJJlnXqbHlUkPXKkA7KvGV6gygISr4wnk50uS1oXfI/edit' }]
  };
})();
