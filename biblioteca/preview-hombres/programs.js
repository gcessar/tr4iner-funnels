/* Propuesta de programación para revisión del equipo, sin asignaciones a miembros reales. */
(function () {
  'use strict';
  const library = new Map(window.RutaExerciseLibrary.map(ex => [ex.id, ex]));
  // El reemplazo conserva el patrón principal, pero la carga se vuelve a elegir.
  const replacements = {
    prensa: ['hack','goblet'], hack: ['prensa','goblet'], goblet: ['prensa','hack'],
    'rumano-mancuernas': ['rumano-barra'],
    'hip-thrust-maquina': ['hip-thrust-barra'],
    'curl-femoral-sentado': ['curl-femoral-acostado','curl-femoral-pie'],
    'curl-femoral-acostado': ['curl-femoral-sentado','curl-femoral-pie'],
    'press-plano-maquina': ['press-plano-mancuernas','lagartijas-rodillas'],
    'press-inclinado-maquina': ['press-inclinado-mancuernas'],
    'remo-polea-neutro': ['remo-polea-cerrado','remo-unilateral-neutro'],
    'jalon-neutro': ['jalon-pecho','jalon-cerrado'],
    'press-hombros-maquina': ['press-hombros-mancuernas'],
    'lateral-mancuernas': ['lateral-maquina','lateral-polea'],
    'curl-biceps-mancuernas': ['curl-biceps-polea','curl-biceps-predicador-maquina'],
    'triceps-alta': ['triceps-sobre-cabeza'],
    'talones-maquina': ['talones-mancuerna','talones-smith'],
    'abduccion-maquina': ['patada-lateral-polea']
  };
  const day = (name, weekday, ids) => ({ name, weekday, ids });
  const definitions = {
    'MEN-3': { sex:'MEN', frequency:3, title:'Cuerpo completo · 3 días', focus:'Todo el cuerpo', days:[
      day('Cuerpo completo A','Lunes',['prensa','press-plano-maquina','remo-polea-neutro','curl-femoral-sentado','lateral-mancuernas','talones-maquina']),
      day('Cuerpo completo B','Miércoles',['goblet','jalon-neutro','press-hombros-maquina','rumano-mancuernas','curl-biceps-mancuernas','triceps-alta']),
      day('Cuerpo completo C','Viernes',['hack','press-inclinado-maquina','remo-polea-neutro','curl-femoral-acostado','talones-maquina','lateral-mancuernas'])
    ] },
    'MEN-4': { sex:'MEN', frequency:4, title:'Superior / inferior · 4 días', focus:'Todo el cuerpo', days:[
      day('Superior A','Lunes',['press-plano-maquina','remo-polea-neutro','jalon-neutro','lateral-mancuernas','triceps-alta']),
      day('Inferior A','Martes',['prensa','rumano-mancuernas','curl-femoral-sentado','talones-maquina']),
      day('Superior B','Jueves',['press-inclinado-maquina','remo-polea-neutro','press-hombros-maquina','curl-biceps-mancuernas','triceps-alta']),
      day('Inferior B','Viernes',['goblet','hip-thrust-maquina','curl-femoral-acostado','talones-maquina'])
    ] },
    'MEN-5': { sex:'MEN', frequency:5, title:'Sesiones breves · 5 días', focus:'Todo el cuerpo', days:[
      day('Superior A','Lunes',['press-plano-maquina','remo-polea-neutro','lateral-mancuernas','curl-biceps-mancuernas']),
      day('Inferior A','Martes',['prensa','rumano-mancuernas','talones-maquina']),
      day('Superior B','Miércoles',['jalon-neutro','press-inclinado-maquina','press-hombros-maquina','triceps-alta']),
      day('Inferior B','Viernes',['goblet','hip-thrust-maquina','curl-femoral-sentado','talones-maquina']),
      day('Superior C · breve','Sábado',['remo-polea-neutro','press-plano-maquina',['curl-biceps-mancuernas',1],['triceps-alta',1]])
    ] },
    'WOMEN-3': { sex:'WOMEN', frequency:3, title:'Cuerpo completo con prioridad inferior · 3 días', focus:'Piernas y glúteos', days:[
      day('Piernas + superior A','Lunes',['prensa','hip-thrust-maquina','remo-polea-neutro','press-plano-maquina','abduccion-maquina']),
      day('Piernas + superior B','Miércoles',['rumano-mancuernas','goblet','jalon-neutro','press-hombros-maquina','curl-femoral-sentado']),
      day('Glúteos + superior','Viernes',['hip-thrust-maquina','prensa','remo-polea-neutro','press-plano-maquina','curl-femoral-acostado'])
    ] },
    'WOMEN-4': { sex:'WOMEN', frequency:4, title:'Inferior / superior · 4 días', focus:'Piernas y glúteos', days:[
      day('Piernas y glúteos A','Lunes',['prensa','hip-thrust-maquina','curl-femoral-sentado','abduccion-maquina']),
      day('Superior A','Martes',['remo-polea-neutro','press-plano-maquina','jalon-neutro','lateral-mancuernas']),
      day('Piernas y glúteos B','Jueves',['goblet','rumano-mancuernas','hip-thrust-maquina','talones-maquina']),
      day('Superior B','Viernes',['remo-polea-neutro','press-inclinado-maquina','curl-biceps-mancuernas','triceps-alta'])
    ] },
    'WOMEN-5': { sex:'WOMEN', frequency:5, title:'Tres sesiones de piernas y glúteos · 5 días', focus:'Piernas y glúteos', days:[
      day('Piernas y glúteos A','Lunes',['prensa','hip-thrust-maquina',['abduccion-maquina',1]]),
      day('Superior A','Martes',['remo-polea-neutro','press-plano-maquina','jalon-neutro','lateral-mancuernas']),
      day('Piernas y glúteos B','Miércoles',['rumano-mancuernas','goblet','curl-femoral-sentado']),
      day('Superior B','Viernes',['remo-polea-neutro','press-inclinado-maquina',['curl-biceps-mancuernas',1],['triceps-alta',1]]),
      day('Glúteos y piernas C','Sábado',['hip-thrust-maquina','prensa','curl-femoral-acostado'])
    ] }
  };
  const isolations = new Set(['curl','triceps','pantorrilla','abduccion','elevacion-lateral','flexion-rodilla']);
  function prescription(ex) {
    const isolation = isolations.has(ex.pattern);
    return { reps:['abduccion','elevacion-lateral','pantorrilla'].includes(ex.pattern)?'12–15':'8–12', rest:isolation?60:120 };
  }
  function makeRoutine(frequency, sex = 'MEN') {
    const plan = definitions[sex + '-' + frequency];
    if (!plan) throw new Error('No existe esa combinación de rutina.');
    return plan.days.map((d,i) => ({ id:'day-'+(i+1),name:d.name,weekday:d.weekday,exercises:d.ids.map(item => {
      const [id,sets] = Array.isArray(item)?item:[item,2];
      const ex=library.get(id); if(!ex || ex.status!=='disponible') throw new Error('Ejercicio no disponible: '+id);
      return { ...ex,...prescription(ex),sets,slot:'d'+i+'-'+id,alternativeIds:replacements[id]||[],alternatives:(replacements[id]||[]).map(id=>library.get(id).name) };
    }) }));
  }
  window.RutaPrograms = {
    definitions,makeRoutine,version:2,
    audience:'Adultos principiantes o que retoman, con acceso a gimnasio y sin restricciones que requieran una rutina específica.',
    duration:'Tope objetivo: 30–45 minutos, incluido calentamiento. Las sesiones de 3–4 ejercicios pueden durar menos.',
    adaptation:'Primeras 1–2 semanas: una serie de trabajo por ejercicio. Pasa a las series indicadas cuando controles la técnica y te recuperes bien. Si retomas con buena tolerancia, el equipo puede ajustar esta fase.',
    intensity:'Elige una carga con la que podrías hacer unas 3 repeticiones más al terminar cada serie. No necesitas llegar al fallo.',
    warmup:'Dedica 5–7 minutos a moverte y preparar los movimientos de la sesión. Antes del primer ejercicio de piernas y del primer empuje o tirón, haz 1–2 series ligeras de aproximación. No cuentan como series de trabajo.',
    progression:'Mantén el peso hasta alcanzar el máximo del rango en todas las series durante dos sesiones de ese ejercicio, con técnica controlada y unas 2–3 repeticiones en reserva. Después sube el incremento mínimo disponible y vuelve a la parte baja del rango. Si no llegas al mínimo, baja la carga.',
    recovery:'Respeta los días de descanso del ejemplo. Si pierdes una sesión, continúa el orden; no juntes dos sesiones para compensar. Si necesitas más recuperación, empieza por 3 días.',
    substitutions:'Los reemplazos conservan el patrón, no los kilos. Vuelve a elegir la carga; en ejercicios a un lado, haz las repeticiones por cada lado. Las alternativas aún requieren validar su demostración.',
    age:'Las seis bases se comparten entre los tres rangos de edad. Cumplir 36 años no activa automáticamente una rutina más suave: experiencia, capacidad, molestias y recuperación guían la edición individual.',
    boundary:'Si un ejercicio provoca dolor, detenlo y solicita una adaptación. Estas plantillas requieren revisión individual cuando hay lesión, embarazo/posparto o una condición que limite el ejercicio.',
    missing:'El catálogo no incluye ejercicios específicos de abdomen. No se han inventado ni añadido fuera de tu lista.',
    sources:[
      {title:'ACSM · Guías de entrenamiento de fuerza 2026',url:'https://acsm.org/resistance-training-guidelines-update-2026/'},
      {title:'NSCA · Frecuencia de entrenamiento según experiencia',url:'https://www.nsca.com/education/articles/kinetic-select/determination-of-resistance-training-frequency/'}
    ]
  };
})();
