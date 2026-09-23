/* Sin caché de páginas privadas ni de respuestas autenticadas. */
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',event=>event.waitUntil(self.clients.claim()));
self.addEventListener('push',event=>{
  let data={};try{data=event.data.json();}catch(_){}
  let target=new URL('/biblioteca/ruta/?vista=rutina',self.location.origin);
  try{const url=new URL(data.url,self.location.origin);if(url.origin===self.location.origin&&url.pathname.startsWith('/biblioteca/'))target=url;}catch(_){}
  event.waitUntil(self.registration.showNotification(data.title||'Terminó tu descanso',{
    body:data.body||'Puedes continuar con tu siguiente serie.',
    icon:'/biblioteca/icons/icon-192.png',badge:'/biblioteca/icons/badge.png',
    tag:data.tag||'ruta-descanso',renotify:true,vibrate:[200,100,200],
    timestamp:data.deadlineAt?Date.parse(data.deadlineAt):Date.now(),data:{url:target.href},
  }));
});
self.addEventListener('notificationclick',event=>{
  event.notification.close();
  const target=new URL(event.notification.data?.url||'/biblioteca/ruta/',self.location.origin);
  if(target.origin!==self.location.origin)return;
  event.waitUntil((async()=>{
    const windows=await self.clients.matchAll({type:'window',includeUncontrolled:true});
    for(const client of windows){
      const url=new URL(client.url);
      if(!url.pathname.startsWith('/biblioteca/'))continue;
      // Primero el foco, mientras dura el permiso del toque. Si ya está en la rutina
      // no se recarga: el miembro perdería la ficha del ejercicio que tenía abierta.
      const focused=await client.focus().catch(()=>client);
      if(url.pathname+url.search!==target.pathname+target.search){try{await focused.navigate(target.href);}catch(_){}}
      return;
    }
    return self.clients.openWindow(target.href);
  })());
});
