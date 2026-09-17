(function () {
  'use strict';
  const D = window.RutaPreviewData;
  const KEY = 'tr4_ruta_hombres_preview_v1';
  const main = document.getElementById('main');
  const SAMPLE = { libraryId: '658343', videoId: '71554740-2a7e-4bb6-9e92-3a1778871360' };
  const icons = {
    play: '<path d="m9 5 11 7-11 7V5Z" fill="currentColor" stroke="none"/>',
    arrow: '<path d="M4 12h15m-6-6 6 6-6 6"/>',
    back: '<path d="M20 12H5m6-6-6 6 6 6"/>',
    down: '<path d="m6 9 6 6 6-6"/>',
    weight: '<path d="M8 12h8M4 8v8m4-11v14m8-14v14m4-11v8"/>',
    clock: '<circle cx="12" cy="13" r="8"/><path d="M12 9v5l3 2M9 2h6"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-10v1"/>',
    swap: '<path d="M4 7h15m-4-4 4 4-4 4M20 17H5m4-4-4 4 4 4"/>',
    video: '<rect x="3" y="3" width="18" height="18" rx="3"/><path d="m10 8 6 4-6 4Z"/>'
  };
  const icon = name => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + icons[name] + '</svg>';
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  let storageAvailable = true;
  let store = { members: structuredClone(D.members), routines: {}, completed: {}, lessons: {} };
  try {
    const saved = JSON.parse(localStorage.getItem(KEY));
    if (saved && saved.members && saved.routines && saved.completed && saved.lessons) {
      // Se aceptan únicamente los dos perfiles ficticios del preview.
      for (const id of Object.keys(D.members)) {
        const member = saved.members[id];
        if (member && Object.hasOwn(D.ageLabels, member.age) && [3, 4, 5].includes(member.frequency)) store.members[id] = { ...D.members[id], age: member.age, frequency: member.frequency };
      }
      store.routines = saved.routines;
      store.completed = saved.completed;
      store.lessons = saved.lessons;
    }
  } catch (_) { storageAvailable = false; }
  let params, memberId, member, view, moduleIndex, lessonId, dayIndex;
  let dirty = false;
  let toastTimeout;
  let replaceSlot = '';
  let returnFocus = null;
  const timer = { end: 0, remaining: 0, paused: false, interval: null, trigger: null };
  function announce(message) { document.getElementById('announcer').textContent = message; }
  function toast(message) {
    clearTimeout(toastTimeout);
    const el = document.getElementById('toast');
    el.textContent = message; el.hidden = false;
    toastTimeout = setTimeout(() => { el.hidden = true; }, 4200);
  }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(store)); storageAvailable = true; return true; }
    catch (_) { storageAvailable = false; return false; }
  }
  function readState() {
    params = new URLSearchParams(location.search);
    memberId = Object.hasOwn(D.members, params.get('miembro')) ? params.get('miembro') : 'mateo';
    member = store.members[memberId];
    view = ['ruta', 'rutina', 'registro', 'editor'].includes(params.get('vista')) ? params.get('vista') : 'ruta';
    moduleIndex = Math.max(0, D.modules.findIndex(m => m.id === params.get('modulo')));
    lessonId = params.get('leccion');
    dayIndex = Math.max(0, Math.min(member.frequency - 1, Number.parseInt(params.get('dia'), 10) || 0));
  }
  function url(updates) {
    const query = new URLSearchParams(location.search);
    Object.entries(updates).forEach(([key, value]) => value == null ? query.delete(key) : query.set(key, value));
    return location.pathname + '?' + query.toString();
  }
  function routineKey() { return memberId + ':' + member.frequency; }
  function getRoutine() {
    const key = routineKey();
    const saved = store.routines[key];
    if (!Array.isArray(saved) || saved.length !== member.frequency || !saved.every(day => Array.isArray(day.exercises) && day.exercises.length && day.exercises.every(ex => ex.slot && typeof ex.name === 'string' && ex.sets > 0 && ex.rest > 0 && Array.isArray(ex.alternatives)))) {
      store.routines[key] = D.makeRoutine(member.frequency).map(day => ({ ...day, exercises: day.exercises.map(ex => ({ ...ex, ...SAMPLE, sampleVideo: true })) }));
    }
    return store.routines[key];
  }
  function completionKey(slot) { return routineKey() + ':' + slot; }
  function lessonKey(id) { return memberId + ':' + id; }
  function titleOf(lesson) { return member.age === '18-25' && lesson.youngTitle ? lesson.youngTitle : lesson.title; }
  function statusOf(lesson) {
    const labels = { ready: 'Disponible', preview: 'Video de prueba', pending: 'Pendiente', missing: 'Por crear' };
    return '<span class="status ' + lesson.status + '">' + labels[lesson.status] + '</span>';
  }
  function guardChanges() { return !dirty || window.confirm('Tienes cambios sin guardar. ¿Quieres salir del editor y descartarlos?'); }
  function navigate(updates, focus = true) {
    if (!guardChanges()) return;
    dirty = false;
    history.pushState({}, '', url(updates)); render();
    if (focus) { main.focus({ preventScroll: true }); window.scrollTo(0, 0); }
  }
  function topNavigation() {
    document.getElementById('preview-nav').innerHTML = [['registro', 'Registro'], ['ruta', 'Módulos'], ['rutina', 'Mi rutina'], ['editor', 'Editor por miembro']].map(([key, label]) => '<a href="' + esc(url({ vista: key })) + '" data-view="' + key + '"' + (view === key ? ' aria-current="page"' : '') + '>' + label + '</a>').join('');
    document.querySelector('.brand').href = url({ vista: 'ruta' });
    document.getElementById('profile-name').textContent = member.name;
    document.querySelector('.avatar').textContent = member.name[0];
  }
  function moduleLinks() {
    return D.modules.map((m, i) => '<a class="module-link" href="' + esc(url({ vista: 'ruta', modulo: m.id, leccion: null })) + '" data-module="' + m.id + '"' + (i === moduleIndex ? ' aria-current="step"' : '') + '><span class="step-number">' + String(i + 1).padStart(2, '0') + '</span><strong>' + m.short + '</strong></a>').join('');
  }
  function renderRoute() {
    const module = D.modules[moduleIndex];
    const playable = module.lessons.filter(l => l.youtubeId);
    const selected = playable.find(l => l.id === lessonId) || playable[0];
    const next = D.modules[moduleIndex + 1];
    const watched = Object.keys(store.lessons).filter(key => key.startsWith(memberId + ':') && store.lessons[key]).length;
    main.innerHTML = '<div class="shell"><aside class="sidebar"><div class="sidebar-intro"><p class="eyebrow">TU RUTA, PASO A PASO</p><strong>Vamos, ' + member.name + '.</strong><p>Hombres · ' + D.ageLabels[member.age] + '</p></div><nav class="module-nav" aria-label="Módulos de tu ruta">' + moduleLinks() + '</nav><a class="routine-shortcut" data-view="rutina" href="' + esc(url({ vista: 'rutina' })) + '">' + icon('weight') + '<span>Mi rutina · ' + member.frequency + ' días</span>' + icon('arrow') + '</a><p class="sidebar-foot">' + watched + ' lecciones marcadas como vistas.<br>Avanza a tu ritmo.</p></aside><section class="content"><div class="module-mobile"><label for="mobile-module">EXPLORAR TU RUTA</label><select id="mobile-module">' + D.modules.map((m, i) => '<option value="' + m.id + '"' + (i === moduleIndex ? ' selected' : '') + '>' + (i + 1) + '. ' + m.short + '</option>').join('') + '</select></div><header class="content-header"><p class="eyebrow">MÓDULO ' + String(moduleIndex + 1).padStart(2, '0') + ' / 05 · HOMBRES · ' + D.ageLabels[member.age] + '</p><h1>' + module.title + '</h1><p class="lede">' + module.description + '</p></header>' + (selected ? renderLesson(selected) : '<div class="empty-module"><span class="status missing">Contenido por crear</span><h2>Este paso está en preparación.</h2><p>Cuando el video de cardio y actividad esté listo, aparecerá aquí.</p></div>') + (module.lessons.length ? '<div class="lesson-list-head"><h2>En este módulo</h2><span class="small muted">' + module.lessons.length + (module.lessons.length === 1 ? ' lección' : ' lecciones') + '</span></div><div class="lesson-list">' + module.lessons.map((l, i) => '<button class="lesson-row" type="button" data-lesson="' + l.id + '"' + (!l.youtubeId ? ' disabled' : '') + (selected?.id === l.id ? ' aria-current="true"' : '') + '><span class="row-number">' + (store.lessons[lessonKey(l.id)] ? '✓' : String(i + 1).padStart(2, '0')) + '</span><span class="row-title">' + esc(titleOf(l)) + '</span>' + statusOf(l) + '</button>').join('') + '</div>' : '') + (next ? '<a class="next-module" data-module="' + next.id + '" href="' + esc(url({ vista: 'ruta', modulo: next.id, leccion: null })) + '"><div><p class="eyebrow">SIGUIENTE MÓDULO</p><strong>' + next.title + '</strong></div>' + icon('arrow') + '</a>' : '<p class="demo-note">' + icon('info') + 'Puedes volver a cualquier módulo cuando lo necesites.</p>') + '</section></div>';
  }
  function renderLesson(lesson) {
    const done = !!store.lessons[lessonKey(lesson.id)];
    return '<div class="lesson-stage"><img src="https://i.ytimg.com/vi/' + lesson.youtubeId + '/hqdefault.jpg" width="640" height="360" alt="" fetchpriority="high"><span class="stage-label">' + (lesson.status === 'preview' ? 'VIDEO PROVISIONAL PARA PREVIEW' : 'RUTA TR4INER · HOMBRES') + '</span><button class="play-overlay" type="button" data-youtube="' + lesson.youtubeId + '" aria-label="Reproducir ' + esc(titleOf(lesson)) + '"><span class="play-circle">' + icon('play') + '</span><span>Ver video</span></button></div>' + (lesson.routine ? '<div class="routine-callout"><div><h3>Tu rutina de ' + member.frequency + ' días está aquí.</h3><p>Ejercicios, demostraciones y descansos, sesión por sesión.</p></div><a class="button yellow" data-view="rutina" href="' + esc(url({ vista: 'rutina' })) + '">Ver mi rutina ' + icon('arrow') + '</a></div>' : '') + '<div class="lesson-caption"><div><h2>' + esc(titleOf(lesson)) + '</h2>' + (lesson.status === 'preview' ? '<p class="small muted">Video temporal para revisar esta pantalla. El contenido definitivo está pendiente.</p>' : '') + '</div><button type="button" class="lesson-complete" data-complete-lesson="' + lesson.id + '" aria-pressed="' + done + '"><span class="check-icon" aria-hidden="true">' + (done ? '✓' : '') + '</span>' + (done ? 'Vista' : 'Marcar como vista') + '</button></div>';
  }
  function dayLinks(editor = false) {
    return getRoutine().map((day, i) => '<a class="day-tab" data-day="' + i + '" href="' + esc(url({ vista: editor ? 'editor' : 'rutina', dia: i })) + '"' + (i === dayIndex ? ' aria-current="page"' : '') + '><span>DÍA ' + (i + 1) + '</span><strong>' + day.name + '</strong></a>').join('');
  }
  function renderWorkout() {
    const days = getRoutine();
    const day = days[dayIndex];
    const count = day.exercises.filter(ex => store.completed[completionKey(ex.slot)]).length;
    main.innerHTML = '<section class="workout-page"><a class="breadcrumb" href="' + esc(url({ vista: 'ruta', modulo: 'pesas', leccion: 'rutina-intro' })) + '" data-training-back>' + icon('back') + 'Entrenamiento de pesas</a><header class="workout-heading"><div><p class="eyebrow">HOMBRES · ' + D.ageLabels[member.age] + '</p><h1>Tu rutina. A tu ritmo.</h1><p>Elige una sesión y concéntrate en un ejercicio a la vez.</p></div><div class="frequency-stamp"><b>' + member.frequency + '</b><span>días por<br>semana</span></div></header><p class="demo-note">' + icon('info') + 'Rutina de ejemplo para revisar el diseño. Series y ejercicios pendientes de validación.</p><nav class="day-tabs" aria-label="Días de entrenamiento">' + dayLinks() + '</nav><div class="session-summary"><div><h2>' + day.name + '</h2><p>Día ' + (dayIndex + 1) + ' · ' + day.exercises.length + ' ejercicios</p></div><div class="session-progress"><span id="session-count">' + count + ' de ' + day.exercises.length + ' completados</span><div class="progress-track" aria-hidden="true"><i id="session-fill" style="width:' + count / day.exercises.length * 100 + '%"></i></div></div></div><div id="exercise-list">' + day.exercises.map((ex, i) => renderExercise(ex, i)).join('') + '</div><section class="session-finish" id="session-finish"' + (count < day.exercises.length ? ' hidden' : '') + '><div><h3>Sesión completada.</h3><p>Tu avance queda guardado en este navegador.</p></div><button type="button" class="button" id="reset-session">Comenzar otra sesión</button></section></section>';
  }
  function renderExercise(ex, i) {
    const done = !!store.completed[completionKey(ex.slot)];
    const video = bunnyUrl(ex);
    return '<details class="exercise-card' + (done ? ' exercise-done' : '') + '" data-slot="' + ex.slot + '"' + (i === 0 ? ' open' : '') + '><summary><span class="exercise-index">' + (done ? '✓' : String(i + 1).padStart(2, '0')) + '</span><span class="exercise-heading"><strong>' + esc(ex.name) + '</strong><small>' + esc(ex.area) + ' · ' + ex.sets + ' series × ' + esc(ex.reps) + ' rep.</small></span><span class="summary-prescription">' + ex.rest + ' s descanso</span><span class="chevron">' + icon('down') + '</span></summary><div class="exercise-body"><div class="exercise-video">' + (video ? portraitButton(ex) : '<div class="video-unavailable">' + icon('video') + '<strong>Demostración pendiente</strong><span>VIDEO VERTICAL<br>DE ESTE EJERCICIO</span></div>') + '</div><div class="exercise-data"><p class="eyebrow">TU OBJETIVO</p><dl class="prescription"><div><dt>Series</dt><dd>' + ex.sets + '</dd></div><div><dt>Repeticiones</dt><dd>' + esc(ex.reps) + '</dd></div><div><dt>Descanso</dt><dd>' + ex.rest + '<small> s</small></dd></div></dl><button class="rest-button" type="button" data-rest="' + ex.rest + '">' + icon('clock') + 'Iniciar descanso</button><button class="text-button replace-button" type="button" data-replace="' + ex.slot + '">Buscar un reemplazo</button>' + (ex.original ? '<span class="replacement-tag">Reemplaza: ' + esc(ex.original.name) + '</span>' : '') + '<button class="button dark complete-button" type="button" data-complete="' + ex.slot + '" aria-pressed="' + done + '">' + (done ? 'Completado' : 'Completar ejercicio') + '</button></div></div></details>';
  }
  function portraitButton(ex) {
    const poster = ex.sampleVideo ? '<img src="https://vz-0ff68443-2a0.b-cdn.net/71554740-2a7e-4bb6-9e92-3a1778871360/thumbnail.jpg" width="360" height="640" loading="lazy" alt="">' : '';
    return '<button class="portrait-play" type="button" data-bunny="' + ex.slot + '" aria-label="Ver demostración de ' + esc(ex.name) + '">' + poster + '<span class="play-circle">' + icon('play') + '</span><strong>Ver demostración</strong><span class="small">' + (ex.sampleVideo ? 'Clip de prueba compartido por ti' : 'Video de este ejercicio') + '</span></button>';
  }
  function bunnyUrl(ex) {
    if (!/^\d+$/.test(ex.libraryId) || !/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(ex.videoId)) return null;
    return 'https://iframe.mediadelivery.net/embed/' + ex.libraryId + '/' + ex.videoId + '?autoplay=false&loop=false&muted=false&preload=false&responsive=true';
  }
  function memberOptions() { return Object.keys(D.members).map(id => '<option value="' + id + '"' + (memberId === id ? ' selected' : '') + '>' + D.members[id].name + ' · miembro ficticio</option>').join(''); }
  function renderRegistration() {
    main.innerHTML = '<section class="registration"><p class="eyebrow">REGISTRO · PROPUESTA DE PERSONALIZACIÓN</p><h1>Una ruta que encaje contigo.</h1><p class="intro">Estas preguntas se incorporarán al registro. Aquí puedes probar cómo cambian tu ruta y tus días de entrenamiento.</p><form id="register-form"><label class="member-field">Perfil para probar<select name="miembro" id="register-member">' + memberOptions() + '</select></label><fieldset><legend>¿En qué rango de edad estás?</legend><div class="age-options">' + [['18-25', '18 a 25'], ['26-35', '26 a 35'], ['36+', '36 a más']].map(([value, label]) => '<label class="choice"><input type="radio" name="edad" value="' + value + '" required' + (member.age === value ? ' checked' : '') + '><span>' + label + '</span></label>').join('') + '</div></fieldset><fieldset><legend>¿Cuántas veces a la semana puedes entrenar?</legend><div class="frequency-options">' + [3, 4, 5].map(value => '<label class="choice"><input type="radio" name="frecuencia" value="' + value + '" required' + (member.frequency === value ? ' checked' : '') + '><span class="choice-copy"><strong>' + value + ' veces por semana</strong><small>Tu rutina tendrá ' + value + ' días de entrenamiento.</small></span></label>').join('') + '</div></fieldset><button class="button yellow" type="submit">Ver mi Ruta TR4INER ' + icon('arrow') + '</button><p class="small muted">Preview: tus respuestas se guardan solo en este navegador. No se crea un registro real ni se envían correos.</p></form></section>';
  }
  function renderEditor() {
    const day = getRoutine()[dayIndex];
    main.innerHTML = '<section class="editor-page"><header class="content-header"><p class="eyebrow">PROPUESTA PARA CRM · /ADMIN/GENESIS</p><h1>Una rutina para cada miembro.</h1><p class="lede">Edita su sesión y abre la vista del miembro para comprobar el resultado.</p></header><div class="editor-toolbar"><label>Miembro<select id="editor-member" name="miembro">' + memberOptions() + '</select></label><label>Sesión<select id="editor-day" name="dia">' + getRoutine().map((d, i) => '<option value="' + i + '"' + (i === dayIndex ? ' selected' : '') + '>Día ' + (i + 1) + ' · ' + d.name + '</option>').join('') + '</select></label></div><p class="editor-scope"><strong>' + member.name + ' · ' + D.ageLabels[member.age] + ' · ' + member.frequency + ' días/semana.</strong><br>Los cambios de este preview afectan solo a su rutina de ' + member.frequency + ' días, dentro de este navegador.</p><form id="editor-form"><div class="editor-list">' + day.exercises.map((ex, i) => '<fieldset class="editor-exercise" data-edit-slot="' + ex.slot + '"><legend>Ejercicio ' + (i + 1) + '</legend><div class="editor-grid"><label class="full">Nombre del ejercicio<input name="name" value="' + esc(ex.name) + '" required maxlength="120" autocomplete="off"></label><label class="third">Series<input type="number" inputmode="numeric" name="sets" min="1" max="12" step="1" required value="' + ex.sets + '"></label><label class="third">Repeticiones<input name="reps" required maxlength="24" value="' + esc(ex.reps) + '" autocomplete="off"></label><label class="third">Descanso (s)<input type="number" inputmode="numeric" name="rest" min="10" max="600" step="1" required value="' + ex.rest + '"></label><label class="half">Bunny · Library ID<input name="libraryId" inputmode="numeric" pattern="[0-9]+" value="' + esc(ex.libraryId) + '" autocomplete="off" spellcheck="false"></label><label class="half">Bunny · Video ID<input name="videoId" value="' + esc(ex.videoId) + '" autocomplete="off" spellcheck="false"><span class="small">Vacía ambos IDs para dejar la demostración pendiente.</span></label></div></fieldset>').join('') + '</div><p class="form-error" id="editor-error" role="alert" tabindex="-1"></p><footer class="editor-footer"><button class="button yellow" type="submit">Guardar cambios de ' + member.name + '</button><a class="button" data-view="rutina" href="' + esc(url({ vista: 'rutina' })) + '">Ver como ' + member.name + ' ' + icon('arrow') + '</a><p class="small muted" id="editor-save-status">Demo local. La conexión y persistencia en el CRM real están pendientes.</p></footer></form><details class="catalog-note"><summary>Estado del contenido para hombres</summary><div class="catalog-status-list"><span class="status ready">Disponible</span><span class="status pending">Pendiente</span><span class="status missing">Por crear</span></div><p>Los 3 pilares: enlace pendiente. «Como saludable pero no bajo de peso»: pendiente. «Cuántas veces comer y ayuno intermitente»: por crear a partir de los dos videos fuente. Cardio / actividad: por crear.</p><p>Fuentes de ayuno: <a href="https://youtu.be/pQKyl2X7bNE" target="_blank" rel="noopener noreferrer">Comidas</a> · <a href="https://youtu.be/sY3z2CGhGLY" target="_blank" rel="noopener noreferrer">Ayuno</a>. Los enlaces de Drive recortados en la captura no se han inventado.</p></details></section>';
  }
  function render() {
    readState(); topNavigation();
    if (view === 'registro') renderRegistration();
    else if (view === 'rutina') renderWorkout();
    else if (view === 'editor') renderEditor();
    else renderRoute();
    if (!storageAvailable) announce('No se pudo acceder al almacenamiento local. Los cambios se conservarán solo mientras esta pestaña permanezca abierta.');
  }
  function openDialog(id, trigger) { returnFocus = trigger; document.getElementById(id).showModal(); }
  document.querySelectorAll('dialog').forEach(dialog => {
    dialog.addEventListener('close', () => { if (returnFocus?.isConnected) returnFocus.focus({ preventScroll: true }); });
  });
  function exerciseBySlot(slot) { return getRoutine()[dayIndex].exercises.find(ex => ex.slot === slot); }
  function openReplacement(slot, trigger) {
    const ex = exerciseBySlot(slot); if (!ex) return;
    replaceSlot = slot;
    document.getElementById('replace-description').textContent = ex.name + ' · ' + ex.sets + ' series × ' + ex.reps + ' repeticiones. En este ejemplo se conserva el volumen y el descanso.';
    document.getElementById('replace-options').innerHTML = ex.alternatives.map((name, i) => '<button type="button" data-alternative="' + i + '"><span>' + esc(name) + '</span>' + icon('arrow') + '</button>').join('') + (ex.original ? '<button type="button" data-restore-exercise><span>Volver a ' + esc(ex.original.name) + '</span>' + icon('back') + '</button>' : '');
    openDialog('replace-dialog', trigger);
  }
  function applyReplacement(index, restore) {
    const ex = exerciseBySlot(replaceSlot); if (!ex) return;
    if (restore && ex.original) { Object.assign(ex, ex.original); delete ex.original; }
    else {
      const name = ex.alternatives[index]; if (!name) return;
      if (!ex.original) ex.original = { name: ex.name, libraryId: ex.libraryId, videoId: ex.videoId, sampleVideo: ex.sampleVideo };
      // Un reemplazo no hereda el video del ejercicio anterior: la demostración debe ser propia.
      Object.assign(ex, { name, libraryId: '', videoId: '', sampleVideo: false });
    }
    delete store.completed[completionKey(replaceSlot)];
    const persisted = save();
    document.getElementById('replace-dialog').close();
    renderWorkout();
    const card = document.querySelector('[data-slot="' + replaceSlot + '"]');
    document.querySelectorAll('.exercise-card').forEach(c => { c.open = c === card; });
    card.querySelector('summary').focus({ preventScroll: true });
    toast(persisted ? 'Ejercicio actualizado solo para ' + member.name + '.' : 'Cambio temporal: el navegador no permite guardarlo.');
  }
  function toggleComplete(button) {
    const slot = button.dataset.complete;
    const key = completionKey(slot);
    store.completed[key] = !store.completed[key];
    const persisted = save();
    const card = button.closest('.exercise-card');
    const done = !!store.completed[key];
    card.classList.toggle('exercise-done', done);
    card.querySelector('.exercise-index').textContent = done ? '✓' : String(getRoutine()[dayIndex].exercises.findIndex(ex => ex.slot === slot) + 1).padStart(2, '0');
    button.setAttribute('aria-pressed', String(done));
    button.textContent = done ? 'Completado' : 'Completar ejercicio';
    const exercises = getRoutine()[dayIndex].exercises;
    const count = exercises.filter(ex => store.completed[completionKey(ex.slot)]).length;
    document.getElementById('session-count').textContent = count + ' de ' + exercises.length + ' completados';
    document.getElementById('session-fill').style.width = count / exercises.length * 100 + '%';
    document.getElementById('session-finish').hidden = count !== exercises.length;
    announce(persisted ? (done ? 'Ejercicio completado. ' : 'Ejercicio pendiente. ') + count + ' de ' + exercises.length + '.' : 'Avance temporal: no se pudo guardar en este navegador.');
  }
  function frame(src, title) {
    const el = document.createElement('iframe');
    el.src = src; el.title = title; el.allow = 'autoplay; fullscreen; picture-in-picture; encrypted-media'; el.allowFullscreen = true;
    return el;
  }
  document.addEventListener('click', event => {
    const target = event.target.closest('a,button'); if (!target) return;
    if (target.tagName === 'A' && (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0)) return;
    if (target.dataset.view) { event.preventDefault(); navigate({ vista: target.dataset.view }); }
    else if (target.dataset.module) { event.preventDefault(); navigate({ vista: 'ruta', modulo: target.dataset.module, leccion: null }); }
    else if (target.hasAttribute('data-training-back')) { event.preventDefault(); navigate({ vista: 'ruta', modulo: 'pesas', leccion: 'rutina-intro' }); }
    else if (target.hasAttribute('data-day')) { event.preventDefault(); stopTimer(false); navigate({ dia: target.dataset.day }); }
    else if (target.dataset.lesson) { navigate({ leccion: target.dataset.lesson }); }
    else if (target.dataset.youtube) {
      const container = target.closest('.lesson-stage');
      const player = frame('https://www.youtube-nocookie.com/embed/' + target.dataset.youtube + '?autoplay=1&rel=0&playsinline=1', target.getAttribute('aria-label'));
      container.replaceChildren(player); player.focus();
    } else if (target.dataset.completeLesson) {
      const key = lessonKey(target.dataset.completeLesson); store.lessons[key] = !store.lessons[key];
      const persisted = save(); renderRoute();
      document.querySelector('[data-complete-lesson="' + target.dataset.completeLesson + '"]').focus({ preventScroll: true });
      announce(persisted ? 'Avance guardado en este navegador.' : 'No se pudo guardar el avance.');
    } else if (target.dataset.bunny) {
      const ex = exerciseBySlot(target.dataset.bunny); const src = bunnyUrl(ex); if (!src) return;
      const player = frame(src, 'Demostración de ' + ex.name + (ex.sampleVideo ? ' · clip de prueba' : ''));
      target.parentElement.replaceChildren(player); player.focus();
    } else if (target.dataset.complete) toggleComplete(target);
    else if (target.dataset.replace) openReplacement(target.dataset.replace, target);
    else if (target.dataset.rest) startTimer(Number(target.dataset.rest), target);
    else if (target.hasAttribute('data-alternative')) applyReplacement(Number(target.dataset.alternative), false);
    else if (target.hasAttribute('data-restore-exercise')) applyReplacement(0, true);
    else if (target.dataset.close) document.getElementById(target.dataset.close).close();
    else if (target.id === 'profile-button') {
      document.getElementById('profile-details').innerHTML = '<dl><div><dt>Miembro ficticio</dt><dd>' + member.name + '</dd></div><div><dt>Rango de edad</dt><dd>' + D.ageLabels[member.age] + '</dd></div><div><dt>Entrenamiento</dt><dd>' + member.frequency + ' días por semana</dd></div></dl>';
      document.querySelector('#profile-dialog a').href = url({ vista: 'registro' });
      openDialog('profile-dialog', target);
    } else if (target.id === 'reset-session') {
      if (!window.confirm('¿Comenzar una nueva sesión y desmarcar los ejercicios de este día?')) return;
      getRoutine()[dayIndex].exercises.forEach(ex => { delete store.completed[completionKey(ex.slot)]; });
      const persisted = save(); renderWorkout(); main.focus({ preventScroll: true });
      toast(persisted ? 'Sesión lista para comenzar.' : 'Sesión reiniciada solo en esta pestaña.');
    }
    if (target.dataset.view && target.closest('dialog')) target.closest('dialog').close();
  });
  document.addEventListener('change', event => {
    const el = event.target;
    if (el.id === 'mobile-module') navigate({ vista: 'ruta', modulo: el.value, leccion: null });
    else if (el.id === 'register-member' || el.id === 'editor-member') { const previous = memberId; navigate({ miembro: el.value, dia: 0 }); if (dirty) el.value = previous; }
    else if (el.id === 'editor-day') { const previous = dayIndex; navigate({ dia: el.value }); if (dirty) el.value = previous; }
  });
  document.addEventListener('input', event => {
    if (event.target.closest('#editor-form')) { dirty = true; document.getElementById('editor-save-status').textContent = 'Cambios sin guardar.'; }
  });
  document.addEventListener('submit', event => {
    if (event.target.id === 'register-form') {
      event.preventDefault();
      const data = new FormData(event.target); const age = data.get('edad'); const frequency = Number(data.get('frecuencia'));
      if (!Object.hasOwn(D.ageLabels, age) || ![3, 4, 5].includes(frequency)) return;
      Object.assign(store.members[memberId], { age, frequency }); const persisted = save(); stopTimer(false);
      navigate({ vista: 'ruta', modulo: 'empieza', leccion: null, dia: 0 });
      toast(persisted ? 'Ruta de ejemplo preparada para ' + member.name + '.' : 'Ruta preparada sin almacenamiento local.');
    } else if (event.target.id === 'editor-form') {
      event.preventDefault();
      const updated = []; let invalid = null;
      for (const fieldset of event.target.querySelectorAll('[data-edit-slot]')) {
        const value = name => fieldset.querySelector('[name="' + name + '"]').value.trim();
        const ex = exerciseBySlot(fieldset.dataset.editSlot);
        const draft = { ...ex, name: value('name'), sets: Number(value('sets')), reps: value('reps'), rest: Number(value('rest')), libraryId: value('libraryId'), videoId: value('videoId') };
        if (!draft.name || !draft.reps || !Number.isInteger(draft.sets) || draft.sets < 1 || draft.sets > 12 || !Number.isInteger(draft.rest) || draft.rest < 10 || draft.rest > 600) { invalid = { fieldset, message: 'Revisa nombre, series (1–12), repeticiones y descanso (10–600 segundos).' }; break; }
        if ((draft.libraryId || draft.videoId) && !bunnyUrl(draft)) { invalid = { fieldset, message: 'Introduce un Library ID numérico y un Video ID válido de Bunny, o deja ambos vacíos.' }; break; }
        draft.sampleVideo = draft.libraryId === SAMPLE.libraryId && draft.videoId === SAMPLE.videoId;
        updated.push(draft);
      }
      const error = document.getElementById('editor-error');
      if (invalid) { error.textContent = invalid.message; error.focus(); return; }
      getRoutine()[dayIndex].exercises = updated;
      const persisted = save(); dirty = false; error.textContent = '';
      document.getElementById('editor-save-status').textContent = persisted ? 'Guardado solo para ' + member.name + ', en este navegador. La conexión al CRM sigue pendiente.' : 'Cambio aplicado solo en esta pestaña. No se pudo guardar en el navegador.';
      toast(persisted ? 'Rutina de ' + member.name + ' guardada en el preview.' : 'No se pudo guardar de forma persistente.');
    }
  });
  document.addEventListener('toggle', event => {
    if (!event.target.matches('.exercise-card')) return;
    const card = event.target;
    if (card.open) document.querySelectorAll('.exercise-card[open]').forEach(other => { if (other !== card) other.open = false; });
    else {
      const player = card.querySelector('iframe');
      if (player) {
        // Se destruye el reproductor al cerrar: no queda audio oculto ni carga de varios videos.
        const ex = exerciseBySlot(card.dataset.slot);
        player.parentElement.innerHTML = portraitButton(ex);
      }
    }
  }, true);
  function timerSeconds() { return timer.paused ? timer.remaining : Math.max(0, Math.ceil((timer.end - Date.now()) / 1000)); }
  function paintTimer() {
    const seconds = timerSeconds();
    document.getElementById('timer-value').textContent = String(Math.floor(seconds / 60)).padStart(2, '0') + ':' + String(seconds % 60).padStart(2, '0');
    if (!seconds && !timer.paused) { clearInterval(timer.interval); timer.paused = true; timer.remaining = 0; document.getElementById('timer-pause').textContent = 'Reiniciar'; announce('Terminó el descanso. Puedes continuar cuando estés listo.'); }
  }
  function startTimer(seconds, trigger) {
    clearInterval(timer.interval); Object.assign(timer, { remaining: seconds, end: Date.now() + seconds * 1000, paused: false, trigger });
    document.getElementById('rest-timer').hidden = false; document.getElementById('timer-pause').textContent = 'Pausar';
    paintTimer(); timer.interval = setInterval(paintTimer, 250); announce('Descanso de ' + seconds + ' segundos iniciado.');
  }
  function stopTimer(restoreFocus) {
    clearInterval(timer.interval); document.getElementById('rest-timer').hidden = true;
    if (restoreFocus && timer.trigger?.isConnected) timer.trigger.focus({ preventScroll: true });
  }
  document.getElementById('timer-close').onclick = () => stopTimer(true);
  document.getElementById('timer-add').onclick = () => { if (timer.paused) timer.remaining += 30; else timer.end += 30000; paintTimer(); announce('Se añadieron 30 segundos al descanso.'); };
  document.getElementById('timer-pause').onclick = () => {
    if (timer.paused) { timer.end = Date.now() + (timer.remaining || 60) * 1000; timer.paused = false; clearInterval(timer.interval); timer.interval = setInterval(paintTimer, 250); }
    else { timer.remaining = timerSeconds(); timer.paused = true; }
    document.getElementById('timer-pause').textContent = timer.paused ? 'Continuar' : 'Pausar'; paintTimer();
  };
  window.addEventListener('beforeunload', event => { if (dirty) { event.preventDefault(); event.returnValue = ''; } });
  window.addEventListener('popstate', () => { if (dirty && !guardChanges()) { history.pushState({}, '', location.pathname + '?' + params.toString()); return; } dirty = false; render(); });
  window.addEventListener('storage', event => {
    if (event.key !== KEY || dirty) return;
    try { const next = JSON.parse(event.newValue); if (next?.members?.[memberId] && next.routines && next.completed && next.lessons) { store = next; render(); announce('Preview actualizado desde otra pestaña.'); } } catch (_) { /* Otra pestaña puede estar limpiando los datos. */ }
  });
  render();
})();
