(function () {
  'use strict';
  const D = window.RutaPreviewData;
  const KEY = 'tr4_member_unused';
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
  let store = window.RutaMember.store;
  let params, memberId, member, view, moduleIndex, lessonId, dayIndex, weekIndex;
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
  function save() { return false; }
  async function changeWorkout(body, after) {
    try { await window.RutaMember.mutate({ week: weekIndex, ...body }); store = window.RutaMember.store; if (after) after(); else render(); announce('Cambios guardados en tu ruta.'); }
    catch (error) { toast(error.message); }
  }
  function readState() {
    params = new URLSearchParams(location.search);
    memberId = window.RutaMember.id;
    member = store.members[memberId];
    weekIndex = member.sex === 'MEN' && member.frequency > 3 ? Math.max(0, Math.min(2, (Number(params.get('semana')) || 1) - 1)) : 0;
    view = ['ruta', 'rutina'].includes(params.get('vista')) ? params.get('vista') : 'ruta';
    moduleIndex = Math.max(0, D.modules.findIndex(m => m.id === params.get('modulo')));
    lessonId = params.get('leccion');
    dayIndex = Math.max(0, Math.min(member.frequency - 1, Number.parseInt(params.get('dia'), 10) || 0));
  }
  function url(updates) {
    const query = new URLSearchParams(location.search);
    Object.entries(updates).forEach(([key, value]) => value == null ? query.delete(key) : query.set(key, value));
    return location.pathname + '?' + query.toString();
  }
  function routineKey() { return memberId + ':' + member.sex + ':' + member.frequency + ':w' + weekIndex; }
  function getRoutine() {
    const key = routineKey();
    const saved = store.routines[key];
    if (!Array.isArray(saved) || saved.length !== member.frequency || !saved.every(day => typeof day.weekday === 'string' && Array.isArray(day.exercises) && day.exercises.length && day.exercises.every(ex => ex.id && ex.slot && typeof ex.name === 'string' && ex.sets > 0 && ex.rest > 0 && Array.isArray(ex.alternatives) && Array.isArray(ex.alternativeIds)))) {
      store.routines[key] = D.makeRoutine(member.frequency, member.sex, weekIndex).map(day => ({ ...day, exercises: day.exercises.map(ex => ({ ...ex, ...SAMPLE, sampleVideo: true })) }));
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
    if (updates.miembro && updates.miembro !== memberId) stopTimer(false);
    history.pushState({}, '', url(updates)); render();
    if (focus) { main.focus({ preventScroll: true }); window.scrollTo(0, 0); }
  }
  function topNavigation() {
    document.querySelector('.brand').href = url({ vista: 'ruta' });
    document.getElementById('profile-name').textContent = member.name;
    document.querySelector('.avatar').textContent = member.name[0];
  }
  function moduleLinks() {
    return D.modules.map((m, i) => '<a class="module-link" href="' + esc(url({ vista: 'ruta', modulo: m.id, leccion: null })) + '" data-module="' + m.id + '"' + (i === moduleIndex ? ' aria-current="step"' : '') + '><span class="step-number">' + String(i + 1).padStart(2, '0') + '</span><strong>' + esc(m.short) + (moduleLocked(m) ? ' · 🔒' : '') + '</strong></a>').join('');
  }
  function renderRoute() {
    if (member.sex === 'WOMEN' && !D.modules.length) {
      main.innerHTML = '<section class="registration"><p class="eyebrow">RUTA DE MUJERES</p><h1>Tu rutina ya está preparada.</h1><p class="intro">El temario de los módulos de mujeres está pendiente. Puedes revisar la propuesta de entrenamiento con prioridad en piernas y glúteos.</p><a class="button yellow" data-view="rutina" href="' + esc(url({ vista: 'rutina' })) + '">Ver mi rutina ' + icon('arrow') + '</a></section>';
      return;
    }
    const module = D.modules[moduleIndex];
    const locked = moduleLocked(module);
    const playable = (locked ? [] : module.lessons).filter(l => l.youtubeId);
    const selected = playable.find(l => l.id === lessonId) || playable[0];
    const next = D.modules[moduleIndex + 1];
    const watched = Object.keys(store.lessons).filter(key => key.startsWith(memberId + ':') && store.lessons[key]).length;
    main.innerHTML = '<div class="shell"><aside class="sidebar"><div class="sidebar-intro"><p class="eyebrow">TU RUTA, PASO A PASO</p><strong>Vamos, ' + esc(member.name) + '.</strong><p>' + (member.sex === 'MEN' ? 'Hombres' : 'Mujeres') + ' · ' + D.ageLabels[member.age] + '</p></div><nav class="module-nav" aria-label="Módulos de tu ruta">' + moduleLinks() + '</nav><a class="routine-shortcut" data-view="rutina" href="' + esc(url({ vista: 'rutina' })) + '">' + icon('weight') + '<span>Mi rutina · ' + member.frequency + ' días</span>' + icon('arrow') + '</a><p class="sidebar-foot">' + watched + ' lecciones marcadas como vistas.<br>Avanza a tu ritmo.</p></aside><section class="content"><div class="module-mobile"><label for="mobile-module">EXPLORAR TU RUTA</label><select id="mobile-module">' + D.modules.map((m, i) => '<option value="' + m.id + '"' + (i === moduleIndex ? ' selected' : '') + '>' + (i + 1) + '. ' + esc(m.short) + '</option>').join('') + '</select></div><header class="content-header"><p class="eyebrow">MÓDULO ' + String(moduleIndex + 1).padStart(2, '0') + ' / ' + D.modules.length + ' · ' + (member.sex === 'MEN' ? 'HOMBRES' : 'MUJERES') + ' · ' + D.ageLabels[member.age] + '</p><h1>' + esc(module.title) + '</h1><p class="lede">' + esc(module.description) + '</p></header>' + (locked ? '<div class="empty-module"><span class="status pending">Se abre después</span><h2>Disponible a los ' + module.unlockAfterDays + ' días de confirmar tu registro.</h2><p>Tu rutina de pesas sigue disponible. Vuelve a este módulo cuando llegue su fecha.</p></div>' : selected ? renderLesson(selected) : '<div class="empty-module"><span class="status missing">Contenido por crear</span><h2>Este paso está en preparación.</h2><p>Cuando el video de cardio y actividad esté listo, aparecerá aquí.</p></div>') + (!locked && module.lessons.length ? '<div class="lesson-list-head"><h2>En este módulo</h2><span class="small muted">' + module.lessons.length + (module.lessons.length === 1 ? ' lección' : ' lecciones') + '</span></div><div class="lesson-list">' + module.lessons.map((l, i) => '<button class="lesson-row" type="button" data-lesson="' + l.id + '"' + (!l.youtubeId ? ' disabled' : '') + (selected?.id === l.id ? ' aria-current="true"' : '') + '><span class="row-number">' + (store.lessons[lessonKey(l.id)] ? '✓' : String(i + 1).padStart(2, '0')) + '</span><span class="row-title">' + esc(titleOf(l)) + '</span>' + statusOf(l) + '</button>').join('') + '</div>' : '') + (next ? '<a class="next-module" data-module="' + next.id + '" href="' + esc(url({ vista: 'ruta', modulo: next.id, leccion: null })) + '"><div><p class="eyebrow">SIGUIENTE MÓDULO</p><strong>' + esc(next.title) + '</strong></div>' + icon('arrow') + '</a>' : '<p class="demo-note">' + icon('info') + 'Puedes volver a cualquier módulo cuando lo necesites.</p>') + '</section></div>';
  }
  function renderLesson(lesson) {
    const done = !!store.lessons[lessonKey(lesson.id)];
    return '<div class="lesson-stage"><img src="https://i.ytimg.com/vi/' + lesson.youtubeId + '/hqdefault.jpg" width="640" height="360" alt="" fetchpriority="high"><span class="stage-label">' + (lesson.status === 'preview' ? 'VIDEO PROVISIONAL PARA PREVIEW' : 'RUTA TR4INER') + '</span><button class="play-overlay" type="button" data-youtube="' + lesson.youtubeId + '" aria-label="Reproducir ' + esc(titleOf(lesson)) + '"><span class="play-circle">' + icon('play') + '</span><span>Ver video</span></button></div>' + (lesson.routine ? '<div class="routine-callout"><div><h3>Tu rutina de ' + member.frequency + ' días está aquí.</h3><p>Ejercicios, demostraciones y descansos, sesión por sesión.</p></div><a class="button yellow" data-view="rutina" href="' + esc(url({ vista: 'rutina' })) + '">Ver mi rutina ' + icon('arrow') + '</a></div>' : '') + '<div class="lesson-caption"><div><h2>' + esc(titleOf(lesson)) + '</h2>' + (lesson.status === 'preview' ? '<p class="small muted">Video temporal para revisar esta pantalla. El contenido definitivo está pendiente.</p>' : '') + '</div><button type="button" class="lesson-complete" data-complete-lesson="' + lesson.id + '" aria-pressed="' + done + '"><span class="check-icon" aria-hidden="true">' + (done ? '✓' : '') + '</span>' + (done ? 'Vista' : 'Marcar como vista') + '</button></div>';
  }
  function dayLinks(editor = false) {
    return getRoutine().map((day, i) => '<a class="day-tab" data-day="' + i + '" href="' + esc(url({ vista: editor ? 'editor' : 'rutina', dia: i })) + '"' + (i === dayIndex ? ' aria-current="page"' : '') + '><span>DÍA ' + (i + 1) + '</span><strong>' + day.name + '</strong></a>').join('');
  }
  function renderWorkout() {
    const days = getRoutine();
    const day = days[dayIndex];
    const count = day.exercises.filter(ex => store.completed[completionKey(ex.slot)]).length;
    main.innerHTML = '<section class="workout-page"><a class="breadcrumb" href="' + esc(url({ vista: 'ruta', modulo: 'pesas', leccion: 'rutina-intro' })) + '" data-training-back>' + icon('back') + 'Entrenamiento de pesas</a><header class="workout-heading"><div><p class="eyebrow">' + (member.sex === 'WOMEN' ? 'MUJERES' : 'HOMBRES') + ' · ' + D.ageLabels[member.age] + '</p><h1>Tu rutina. A tu ritmo.</h1><p>Elige una sesión y concéntrate en un ejercicio a la vez.</p></div><div class="frequency-stamp"><b>' + member.frequency + '</b><span>días por<br>semana</span></div></header><p class="demo-note">' + icon('info') + 'Rutina del entrenador · Duración por validar con el equipo.</p><details class="training-guide"><summary>Cómo empezar y progresar</summary><p>' + window.RutaPrograms.adaptation + '</p><p>' + window.RutaPrograms.warmup + '</p><p>' + window.RutaPrograms.intensity + '</p><p>' + window.RutaPrograms.progression + '</p><p>' + window.RutaPrograms.recovery + '</p><p>' + window.RutaPrograms.boundary + '</p></details>' + weekControl() + '<nav class="day-tabs" aria-label="Días de entrenamiento">' + dayLinks() + '</nav><div class="session-summary"><div><h2>' + day.name + '</h2><p>Día ' + (dayIndex + 1) + ' · ' + day.exercises.length + ' ejercicios · ' + day.weekday + ' sugerido</p></div><div class="session-progress"><span id="session-count">' + count + ' de ' + day.exercises.length + ' completados</span><div class="progress-track" aria-hidden="true"><i id="session-fill" style="width:' + count / day.exercises.length * 100 + '%"></i></div></div></div><div id="exercise-list">' + day.exercises.map((ex, i) => renderExercise(ex, i)).join('') + '</div><section class="session-finish" id="session-finish"' + (count < day.exercises.length ? ' hidden' : '') + '><div><h3>Sesión completada.</h3><p>Tu avance queda guardado en este navegador.</p></div><button type="button" class="button" id="reset-session">Comenzar otra sesión</button></section></section>';
  }
  function renderExercise(ex, i) {
    const done = !!store.completed[completionKey(ex.slot)];
    const video = bunnyUrl(ex);
    return '<details class="exercise-card' + (done ? ' exercise-done' : '') + '" data-slot="' + ex.slot + '"' + (i === 0 ? ' open' : '') + '><summary><span class="exercise-index">' + (done ? '✓' : String(i + 1).padStart(2, '0')) + '</span><span class="exercise-heading"><strong>' + esc(ex.name) + '</strong><small>' + esc(ex.area) + ' · ' + ex.sets + ' series × ' + esc(ex.reps) + ' rep.</small></span><span class="summary-prescription">' + ex.rest + ' s descanso</span><span class="chevron">' + icon('down') + '</span></summary><div class="exercise-body"><div class="exercise-video">' + (video ? portraitButton(ex) : '<div class="video-unavailable">' + icon('video') + '<strong>Demostración pendiente</strong><span>VIDEO VERTICAL<br>DE ESTE EJERCICIO</span></div>') + '</div><div class="exercise-data"><p class="eyebrow">TU OBJETIVO</p><dl class="prescription"><div><dt>Series</dt><dd>' + ex.sets + '</dd></div><div><dt>Repeticiones</dt><dd>' + esc(ex.reps) + '</dd></div><div><dt>Descanso</dt><dd>' + ex.rest + '<small> s</small></dd></div></dl><button class="rest-button" type="button" data-rest="' + ex.rest + '">' + icon('clock') + 'Iniciar descanso</button><button class="text-button replace-button" type="button" data-replace="' + ex.slot + '">Buscar un reemplazo</button>' + (ex.replacementIndex !== null ? '<span class="replacement-tag">Reemplaza: ' + 'ejercicio original' + '</span>' : '') + '<button class="button dark complete-button" type="button" data-complete="' + ex.slot + '" aria-pressed="' + done + '">' + (done ? 'Completado' : 'Completar ejercicio') + '</button></div></div></details>';
  }
  function portraitButton(ex) {
    const poster = ''; // La miniatura del clip de prueba devuelve 403.
    return '<button class="portrait-play" type="button" data-bunny="' + ex.slot + '" aria-label="Ver demostración de ' + esc(ex.name) + '">' + poster + '<span class="play-circle">' + icon('play') + '</span><strong>Ver demostración</strong><span class="small">' + (ex.sampleVideo ? 'Clip de prueba compartido por ti' : 'Video de este ejercicio') + '</span></button>';
  }
  function bunnyUrl(ex) {
    if (!/^\d+$/.test(ex.libraryId) || !/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(ex.videoId)) return null;
    // Mismo reproductor vigente que usa Biblioteca; el endpoint legacy devuelve 403 en el embed.
    return 'https://player.mediadelivery.net/embed/' + ex.libraryId + '/' + ex.videoId + '?autoplay=false&loop=false&muted=false&preload=false&playsinline=true';
  }
  function weekControl() {
    const rotating = member.sex === 'MEN' && member.frequency > 3;
    return '<div class="week-control">' + (rotating ? '<label>Semana del ciclo<select id="routine-week">' + [1,2,3].map(w => '<option value="' + w + '"' + (weekIndex === w - 1 ? ' selected' : '') + '>Semana ' + w + '</option>').join('') + '</select></label><p>Empuje → Jalón → Piernas. Al acabar las 3 semanas, el ciclo vuelve a empezar. Si faltas, retoma la sesión pendiente.</p>' : '') + '</div>';
  }
  function moduleLocked(module) { return module.locked === true; }
  function render() {
    readState(); topNavigation();
    if (view === 'rutina') renderWorkout(); else renderRoute();
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
    document.getElementById('replace-description').textContent = ex.name + ' · ' + ex.sets + ' series × ' + ex.reps + ' repeticiones. Se conservan series, repeticiones y descanso; elige de nuevo la carga. Si es unilateral, completa las repeticiones por cada lado.';
    document.getElementById('replace-options').innerHTML = ex.alternatives.map((name, i) => '<button type="button" data-alternative="' + i + '"><span>' + esc(name) + '</span>' + icon('arrow') + '</button>').join('') + (ex.replacementIndex !== null ? '<button type="button" data-restore-exercise><span>Volver a ' + 'ejercicio original' + '</span>' + icon('back') + '</button>' : '');
    openDialog('replace-dialog', trigger);
  }
  function applyReplacement(index, restore) {
    changeWorkout({action: restore ? 'restore' : 'replace',slot:replaceSlot,...(restore?{}:{alternativeIndex:index})}, () => {
      document.getElementById('replace-dialog').close(); renderWorkout(); toast('Ejercicio actualizado en tu rutina.');
    });
  }
  function toggleComplete(button) {
    button.disabled = true;
    changeWorkout({action:'complete',slot:button.dataset.complete,completed:!store.completed[completionKey(button.dataset.complete)]}, renderWorkout).finally(() => { button.disabled = false; });
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
      changeWorkout({action:'lesson',contentId:target.dataset.completeLesson,completed:!store.lessons[lessonKey(target.dataset.completeLesson)]}, renderRoute);
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
      document.getElementById('profile-details').innerHTML = '<dl><div><dt>Nombre</dt><dd>' + esc(member.name) + '</dd></div><div><dt>Rango de edad</dt><dd>' + D.ageLabels[member.age] + '</dd></div><div><dt>Entrenamiento</dt><dd>' + member.frequency + ' días por semana</dd></div></dl>';
      openDialog('profile-dialog', target);
    } else if (target.id === 'reset-session') {
      if (!window.confirm('¿Comenzar una nueva sesión de este día?')) return;
      (async () => { for (const ex of getRoutine()[dayIndex].exercises) {
        if (store.completed[completionKey(ex.slot)]) await window.RutaMember.mutate({week:weekIndex,action:'complete',slot:ex.slot,completed:false});
      } store=window.RutaMember.store; renderWorkout(); })().catch(error=>toast(error.message));
    }
    if (target.dataset.view && target.closest('dialog')) target.closest('dialog').close();
  });
  document.addEventListener('change', event => {
    if (event.target.id === 'mobile-module') navigate({modulo:event.target.value, leccion:null});
    if (event.target.id === 'routine-week') { stopTimer(false); navigate({semana:event.target.value,dia:0}); }
  });
  function startTimer(seconds, trigger) { window.RutaPush.start(seconds, trigger); }
  function stopTimer() { window.RutaPush.cancel(); }
  window.addEventListener('beforeunload', event => { if (dirty) { event.preventDefault(); event.returnValue = ''; } });
  window.addEventListener('popstate', () => { if (dirty && !guardChanges()) { history.pushState({}, '', location.pathname + '?' + params.toString()); return; } dirty = false; render(); });
  document.getElementById('logout').onclick = async () => {
    try { await window.RutaPush.disable(); } catch (_) { /* Un aviso sin cancelar no debe impedir cerrar la sesión. */ }
    try { await fetch('/api/genesis/logout',{method:'POST'}); location.href='/biblioteca/inicio/'; }
    catch (_) { toast('Sin conexión. Revisa tu internet para cerrar sesión.'); }
  };
  render();
})();
