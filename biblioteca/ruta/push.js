(function () {
  'use strict';
  const api=window.RutaMember.api, $=id=>document.getElementById(id);
  const key='tr4_rest_member_'+window.RutaMember.id;
  let config, registration, subscriptionId=null, remote=null, local=null, queue=Promise.resolve(), offset=0, trigger;
  const standalone=()=>matchMedia('(display-mode: standalone)').matches || navigator.standalone===true;
  const ios=()=>/iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform==='MacIntel' && navigator.maxTouchPoints>1);
  const supported=()=>('serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window);
  const status=text=>{$('push-status').textContent=text;};
  function enqueue(fn) { const task=queue.then(fn);queue=task.catch(error=>{status(error.message || 'No se pudo programar el aviso. Mantén la ruta abierta.');});return task; }
  function remaining() { if (!local) return 0;return local.paused?local.remaining:Math.max(0,Math.ceil((local.end-Date.now())/1000)); }
  function persist() { try {if(local) sessionStorage.setItem(key,JSON.stringify(local));else sessionStorage.removeItem(key);}catch(_){} }
  function paint() {
    $('rest-timer').hidden=!local;
    if(!local)return;
    const left=remaining();$('timer-value').textContent=String(Math.floor(left/60)).padStart(2,'0')+':'+String(left%60).padStart(2,'0');
    $('timer-pause').textContent=left?(local.paused?'Continuar':'Pausar'):'Reiniciar';
    if(!left&&!local.paused) {local.paused=true;local.remaining=0;persist();$('announcer').textContent='Terminó el descanso.';}
  }
  function accept(data) {
    if(data.serverNow)offset=Date.parse(data.serverNow)-Date.now();
    remote=data.timer;
    if(remote && ['SCHEDULED','PAUSED'].includes(remote.status)) {
      local={end:Date.parse(remote.deadlineAt)-offset,paused:remote.status==='PAUSED',remaining:Math.ceil(remote.remainingMs/1000)};
    } else if(remote) { local={end:Date.now(),paused:true,remaining:0}; }
    persist();paint();
  }
  function refreshButton() {
    $('timer-alert').textContent=subscriptionId?'Avisos activos':'Activar avisos';
    $('timer-alert').setAttribute('aria-pressed',String(Boolean(subscriptionId)));
  }
  function bytes(value) { const raw=atob(value.replace(/-/g,'+').replace(/_/g,'/'));return Uint8Array.from(raw,c=>c.charCodeAt(0)); }
  async function linkSubscription(sub) {
    const data=await api('push',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({subscription:sub.toJSON()})});subscriptionId=data.subscriptionId;refreshButton();
  }
  async function startRemote(seconds) {
    const data=await api('rest-timer',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({subscriptionId,clientId:crypto.randomUUID(),seconds,label:'Terminó tu descanso. Puedes continuar con tu siguiente serie.',path:location.pathname+location.search})});
    accept(data);status('Aviso programado. Puedes bloquear la pantalla.');
  }
  async function updateRemote(action,seconds) {
    if(!remote || !['SCHEDULED','PAUSED'].includes(remote.status))return;
    try {
      const data=await api('rest-timer',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:remote.id,revision:remote.revision,action,...(seconds?{seconds}:{})})});
      accept(data);status(action==='pause'?'Descanso pausado.':action==='cancel'?'Aviso cancelado.':'Aviso actualizado.');
    } catch(error) {
      if(error.status===409) {accept(await api('rest-timer?subscriptionId='+encodeURIComponent(subscriptionId)));throw new Error('El descanso cambió. Comprueba el tiempo y repite la acción.');}throw error;
    }
  }
  function showHelp() {
    let message;
    if(ios()&&!standalone()) message='En iPhone, abre esta página en Safari, pulsa Compartir y «Añadir a pantalla de inicio». Entra desde ese icono y activa aquí las notificaciones. Necesitas iOS 16.4 o posterior.';
    else if(!supported())message='Este navegador no permite Web Push. Prueba Chrome en Android o la Ruta instalada en la pantalla de inicio del iPhone.';
    else if(Notification.permission==='denied')message='Las notificaciones están bloqueadas. Actívalas en los ajustes de este sitio o de la app Ruta TR4INER y vuelve aquí.';
    else message='Recibe un aviso al terminar el descanso aunque bloquees la pantalla. El sonido y la vibración dependen de los ajustes del teléfono; el modo Silencio o Concentración puede silenciarlos.';
    $('push-help-text').textContent=message;
    $('push-enable').hidden=Boolean(subscriptionId)||!supported()||(ios()&&!standalone())||Notification.permission==='denied';
    $('push-disable').hidden=!subscriptionId;
    $('push-help').showModal();
  }
  async function disable() {
    if(remote)await updateRemote('cancel');
    if(subscriptionId)await api('push',{method:'DELETE',headers:{'Content-Type':'application/json'},body:JSON.stringify({subscriptionId})});
    const sub=await registration?.pushManager.getSubscription();if(sub)await sub.unsubscribe();subscriptionId=null;remote=null;refreshButton();status('Notificaciones desactivadas en este dispositivo.');
  }
  $('timer-alert').onclick=showHelp;
  $('push-enable').onclick=async()=>{
    // El permiso se pide directamente desde el gesto del usuario, también en iOS.
    if(!supported()||!registration||!config?.enabled){status('Los avisos no están disponibles. Recarga la ruta e inténtalo de nuevo.');return;}
    const permission=await Notification.requestPermission();
    if(permission!=='granted'){showHelp();return;}
    $('push-enable').disabled=true;
    try {
      const sub=await registration.pushManager.getSubscription() || await registration.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:bytes(config.publicKey)});
      await linkSubscription(sub);$('push-help').close();status('Notificaciones activadas en este dispositivo.');
      if(local&&!local.paused&&remaining()>0)await enqueue(()=>startRemote(remaining()));
    }catch(error){status(error.message || 'No se pudo activar Web Push.');}finally{$('push-enable').disabled=false;}
  };
  $('push-disable').onclick=()=>enqueue(async()=>{await disable();$('push-help').close();});
  $('timer-close').onclick=()=>window.RutaPush.cancel();
  $('timer-add').onclick=()=>enqueue(async()=>{
    if(!local)return;
    if(subscriptionId&&!remaining()){await startRemote(30);return;}
    if(subscriptionId&&remote)await updateRemote('extend',30);
    else {if(local.paused)local.remaining=Math.min(600,local.remaining+30);else local.end=Math.min(Date.now()+600000,local.end+30000);persist();paint();}
  });
  $('timer-pause').onclick=()=>enqueue(async()=>{
    if(!local)return;
    if(!remaining()){if(subscriptionId)await startRemote(60);else{local={end:Date.now()+60000,remaining:60,paused:false};persist();paint();}return;}
    if(subscriptionId&&remote)await updateRemote(local.paused?'resume':'pause');
    else {if(local.paused){local.end=Date.now()+local.remaining*1000;local.paused=false;}else{local.remaining=remaining();local.paused=true;}persist();paint();}
  });
  const ready=(async()=>{
    try {const saved=JSON.parse(sessionStorage.getItem(key));if(saved&&Number.isFinite(saved.end)&&Number.isFinite(saved.remaining)&&typeof saved.paused==='boolean')local=saved;}catch(_){}
    paint();
    try {
      config=await api('push');
      if(!config.enabled || !supported())return;
      registration=await navigator.serviceWorker.register('/biblioteca/sw.js',{scope:'/biblioteca/'});
      await navigator.serviceWorker.ready;
      if(Notification.permission==='granted') {
        const sub=await registration.pushManager.getSubscription();
        if(sub){await linkSubscription(sub);const data=await api('rest-timer?subscriptionId='+encodeURIComponent(subscriptionId));if(data.timer)accept(data);}
      }
    } catch(error) {status('Los avisos no están disponibles por ahora. El reloj sigue funcionando con la ruta abierta.');}
  })();
  window.RutaPush={ready,start(seconds,button){return enqueue(async()=>{
    trigger=button;
    if(subscriptionId){status('Programando aviso…');await startRemote(seconds);}
    else{remote=null;local={end:Date.now()+seconds*1000,remaining:seconds,paused:false};persist();paint();status('Activa los avisos para recibir la notificación con la pantalla bloqueada.');}
  });},cancel(){return enqueue(async()=>{if(remote)await updateRemote('cancel');remote=null;local=null;persist();paint();if(trigger?.isConnected)trigger.focus({preventScroll:true});});},disable};
  setInterval(paint,250);
  document.addEventListener('visibilitychange',()=>{if(!document.hidden){paint();if(subscriptionId)enqueue(async()=>{const data=await api('rest-timer?subscriptionId='+encodeURIComponent(subscriptionId));if(data.timer)accept(data);});}});
})();
