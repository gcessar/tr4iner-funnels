/* La identidad y los cambios de rutina siempre los decide la sesión del servidor. */
(async function () {
  'use strict';
  const main = document.getElementById('main');
  let version = 0, pending = Promise.resolve();
  const state = { members: {}, routines: {}, completed: {}, lessons: {} };
  async function api(path, options) {
    const response = await fetch('/api/genesis/' + path, {credentials:'same-origin',cache:'no-store',...options});
    const data = await response.json();
    if (response.status === 401) { location.replace('/biblioteca/acceso/'); throw new Error('Vuelve a entrar a tu ruta.'); }
    if (!response.ok) { const error = new Error(data.error || 'No se pudo guardar. Inténtalo de nuevo.'); error.status=response.status; throw error; }
    return data;
  }
  function accept(data) {
    const m = data.member;
    state.members[m.id] = {name:m.name || 'Miembro',sex:m.sex,age:m.ageRange,frequency:m.frequency};
    const key = m.id + ':' + m.sex + ':' + m.frequency + ':w' + data.week;
    state.routines[key] = data.routine;
    data.routine.forEach(day=>day.exercises.forEach(ex=>{ state.completed[key+':'+ex.slot] = ex.completed; }));
    state.lessons = Object.fromEntries(data.completedLessons.map(id=>[m.id+':'+id,true]));
    version = data.version;
    window.RutaMember.id = m.id;
  }
  window.RutaMember = {id:null,store:state,api,mutate(body) {
    const task = pending.then(async()=>{
      try { const data = await api('workout',{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({...body,version})}); accept(data); return data; }
      catch(error) { if(error.status===409) { accept(await api('workout?week='+body.week)); error.message='Tu rutina cambió en otra pestaña. Repite la acción para guardar sobre la versión actual.'; } throw error; }
    }); pending=task.catch(()=>{}); return task;
  }};
  window.RutaPrograms = {
    adaptation:'Empieza con una carga que te permita controlar cada repetición.',
    warmup:'Prepara los movimientos antes de las series de trabajo y sigue las indicaciones de tu entrenador.',
    intensity:'Consulta con el entrenador la carga y el esfuerzo adecuados para empezar o retomar.',
    progression:'Cuando completes las repeticiones con buena técnica, revisa con el entrenador el siguiente aumento de carga.',
    recovery:'Sigue el orden de las sesiones. Si faltas, retoma la sesión pendiente.',
    boundary:'Si un ejercicio produce dolor, detente y pide al equipo que revise tu rutina.'
  };
  try {
    const [first,catalog] = await Promise.all([api('workout?week=0'),api('catalog')]);
    accept(first);
    for (const week of [1,2]) accept(await api('workout?week='+week));
    window.RutaPreviewData = {
      members:state.members,ageLabels:{'18-25':'18 a 25 años','26-35':'26 a 35 años','36+':'36 años en adelante'},
      makeRoutine(){throw new Error('La rutina asignada no está disponible.');},
      modules:catalog.modules.map(m=>({id:m.slug.replace(/^ruta-/,''),title:m.title,short:m.title,description:m.description||'',locked:m.locked,unlockAt:m.unlockAt,unlockAfterDays:m.unlockAfterDays,
        lessons:m.contents.map(c=>({id:c.id,title:c.title,youtubeId:c.youtubeId,status:c.description?.includes('provisional')?'preview':'ready',routine:c.slug==='ruta-rutina-intro'}))}))
    };
    async function script(src) { return new Promise((resolve,reject)=>{const el=document.createElement('script');el.src=src;el.onload=resolve;el.onerror=()=>reject(new Error('No se pudo cargar la ruta. Recarga la página.'));document.head.append(el);}); }
    await script('/biblioteca/ruta/push.js?v=20260922-stage1');
    await window.RutaPush.ready;
    await script('/biblioteca/ruta/app.js?v=20260922-stage1');
  } catch(error) {
    const p=document.createElement('p');p.className='member-loading';p.textContent=error.message;main.replaceChildren(p);
    const link=document.createElement('a');link.href='/biblioteca/inicio/';link.className='button dark';link.textContent='Volver al inicio';main.append(link);
  }
})();
