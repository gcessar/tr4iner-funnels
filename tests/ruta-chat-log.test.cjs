const test=require('node:test'),assert=require('node:assert/strict');

// El chat pide la memoria al CRM, se la pasa al agente y guarda el turno que vio la persona.
process.env.GENESIS_CRM_API_URL='https://crm.test';
process.env.GENESIS_INTERNAL_SECRET='interno';
process.env.RUTA_CHAT_SECRET='agente';
delete process.env.VERCEL_ENV;
delete process.env.RUTA_CHAT_AGENDA_REAL;
const chat=require('../api/genesis/chat');

const LIBRES=[{inicio:'2026-10-20T16:00:00Z'},{inicio:'2026-10-21T19:00:00Z'}];
const OFRECIDOS=[
 {id:'h1',inicio:'2026-10-20T16:00:00.000Z',etiqueta:'Mar 20 · 11:00',larga:'martes, 20 de octubre, 11:00'},
 {id:'h2',inicio:'2026-10-21T19:00:00.000Z',etiqueta:'Mié 21 · 14:00',larga:'miércoles, 21 de octubre, 14:00'}
];

function simular({agente,historial=[{rol:'persona',texto:'hola'},{rol:'equipo',texto:'Hola, Ana.'}],horarios=LIBRES,reserva={ok:true,prueba:true}}){
 const llamadas={historial:0,agente:null,turnos:[],horarios:0,agendar:[]};
 global.fetch=async(url,init={})=>{
  const responder=(status,body)=>({ok:status<400,status,text:async()=>JSON.stringify(body),json:async()=>body});
  if(url==='https://crm.test/api/genesis/session')return responder(200,{member:{email:'ana@x.com',nombre:'Ana Pérez',sexo:'Mujer'},progress:[],attribution:{utm_source:'YOUTUBE-AN',utm_campaign:'RUTA'}});
  if(url.startsWith('https://crm.test/api/genesis/chat-log?')){llamadas.historial++;return responder(200,{historial});}
  if(url==='https://crm.test/api/genesis/chat-log'){llamadas.turnos.push(JSON.parse(init.body));return responder(200,{ok:true});}
  if(url.endsWith('/webhook/ruta-chat-horarios')){llamadas.horarios++;return responder(200,{horarios});}
  if(url.endsWith('/webhook/ruta-chat-agendar')){llamadas.agendar.push(JSON.parse(init.body));return responder(200,reserva);}
  if(url.endsWith('/webhook/ruta-chat')){llamadas.agente=JSON.parse(init.body);if(agente instanceof Error)throw agente;return responder(200,agente);}
  throw new Error('URL inesperada '+url);
 };
 return llamadas;
}
function pedir(mensaje='¿cuánto cuesta?',extra={}){
 const res={code:0,body:null,headers:{},status(c){this.code=c;return this;},json(b){this.body=b;return this;},setHeader(k,v){this.headers[k]=v;}};
 const req={method:'POST',body:Object.assign({mensaje,conversacion:'principal',zona:'America/Lima'},extra),headers:{cookie:'tr4_genesis_session=abc'}};
 return {req,res};
}

test('el agente recibe la memoria del CRM y el turno se guarda con lo que vio la persona',async()=>{
 const llamadas=simular({agente:{mensaje:'Te muestro el plan.',opciones:['¿Qué incluye?'],accion:'ofrecer_esencial',metodo_pago:'hotmart',calificacion:{nivel:'tibio'}}});
 const {req,res}=pedir();
 await chat(req,res);
 assert.equal(res.code,200);
 assert.equal(llamadas.historial,1);
 assert.deepEqual(llamadas.agente.historial,[{rol:'persona',texto:'hola'},{rol:'equipo',texto:'Hola, Ana.'}]);
 assert.match(llamadas.agente.sistema,/MATERIAL QUE PUEDES MOSTRAR/);
 assert.equal(llamadas.turnos.length,1);
 const turno=llamadas.turnos[0];
 assert.equal(turno.mensajeUsuario,'¿cuánto cuesta?');
 assert.equal(turno.mensajeEquipo,res.body.mensaje);
 assert.equal(turno.tarjeta&&turno.tarjeta.escalon,'esencial-hotmart');
 assert.equal(turno.tarjeta.precio,77);
 assert.match(turno.tarjeta.url,/^https:\/\/pay\.hotmart\.com\/M84590773F\?off=x65af12s&src=ruta-chat&sck=rutachat-principal/);
 assert.match(turno.tarjeta.alterna.url,/^https:\/\/buy\.stripe\.com\/.+client_reference_id=rutachat-principal/);
 assert.equal(turno.escalonPedido,'esencial-hotmart');
 assert.equal(turno.agente.mensaje,'Te muestro el plan.');
 assert.match(turno.promptVersion,/^[0-9a-f]{10}$/);
 assert.equal(turno.error,undefined);
});

test('si el agente falla, el turno queda marcado como error y la persona igual recibe respuesta',async()=>{
 const llamadas=simular({agente:new Error('timeout')});
 const {req,res}=pedir();
 await chat(req,res);
 assert.equal(res.code,200);
 assert.match(res.body.mensaje,/Se nos cortó/);
 assert.equal(llamadas.turnos.length,1);
 assert.equal(llamadas.turnos[0].error,true);
 assert.equal(llamadas.turnos[0].tarjeta.tipo,'whatsapp');
});

test('si el CRM no da el historial, el chat sigue sin memoria',async()=>{
 const llamadas=simular({agente:{mensaje:'Hola.',accion:'ninguna'}});
 const original=global.fetch;
 global.fetch=async(url,init)=>url.startsWith('https://crm.test/api/genesis/chat-log?')?Promise.reject(new Error('caído')):original(url,init);
 const {req,res}=pedir();
 await chat(req,res);
 assert.equal(res.code,200);
 assert.deepEqual(llamadas.agente.historial,[]);
});

test('los horarios libres de Calendly llegan como respuestas rápidas en la hora de la persona',async()=>{
 const llamadas=simular({agente:{mensaje:'¿Cuál te queda mejor?',accion:'proponer_horarios',calificacion:{nivel:'caliente',potencial:'alto'}}});
 const {req,res}=pedir('Quiero las videollamadas');
 await chat(req,res);
 assert.equal(llamadas.horarios,1);
 assert.equal(llamadas.agendar.length,0);
 assert.deepEqual(res.body.opciones,['Mar 20 · 11:00','Mié 21 · 14:00']);
 assert.deepEqual(res.body.eco.horarios.map(h=>h.id),['h1','h2']);
 assert.equal(res.body.tarjeta,null);
 assert.match(res.body.ajuste,/h1 = martes, 20 de octubre, 11:00/);
});

test('si el agente escribe horas antes de ver la agenda, el texto se reemplaza',async()=>{
 simular({agente:{mensaje:'Tenemos el jueves a las 19:00.',accion:'proponer_horarios'}});
 const {req,res}=pedir('¿Qué horarios hay?');
 await chat(req,res);
 assert.doesNotMatch(res.body.mensaje,/19:00/);
 assert.equal(res.body.opciones.length,2);
});

test('al tocar un horario sin WhatsApp, se lo pide y no reserva todavía',async()=>{
 const llamadas=simular({agente:{mensaje:'Perfecto.',accion:'agendar',horario:'h1'}});
 const {req,res}=pedir('Mar 20 · 11:00',{eco:{horarios:OFRECIDOS}});
 await chat(req,res);
 assert.equal(llamadas.agendar.length,0);
 assert.match(res.body.mensaje,/WhatsApp/);
 assert.equal(res.body.eco.horario_elegido,'h1');
});

test('con horario y WhatsApp, el agente agenda la sesión por la API (en modo prueba)',async()=>{
 const llamadas=simular({agente:{mensaje:'Listo.',accion:'agendar',horario:'h1',whatsapp:'+51 999 888 777',resumen_caso:'Quiero bajar 8 kg y entreno en casa.',calificacion:{pais_iso:'PE'}}});
 const {req,res}=pedir('+51 999 888 777',{eco:{horarios:OFRECIDOS,horario_elegido:'h1'}});
 await chat(req,res);
 assert.equal(llamadas.agendar.length,1);
 const r=llamadas.agendar[0];
 assert.equal(r.prueba,true);
 assert.equal(r.start_time,'2026-10-20T16:00:00.000Z');
 assert.equal(r.whatsapp,'+51999888777');
 assert.equal(r.email,'ana@x.com');
 assert.equal(r.nombre,'Ana Pérez');
 assert.equal(r.situacion,'Quiero bajar 8 kg y entreno en casa.');
 assert.equal(r.tracking.salesforce_uuid,'ruta-chat-principal');
 assert.equal(r.tracking.utm_source,'YOUTUBE-AN');
 assert.equal(res.body.tarjeta.tipo,'agenda');
 assert.equal(res.body.tarjeta.escalon,'agendo');
 assert.equal(res.body.tarjeta.prueba,true);
 assert.match(res.body.mensaje,/Te agendé una sesión con un asesor para el martes, 20 de octubre, 11:00/);
 assert.equal(llamadas.turnos[0].accion,'agendo');
});

test('el WhatsApp escrito sin código de país se completa con el país de la persona',async()=>{
 const llamadas=simular({agente:{mensaje:'Listo.',accion:'agendar',horario:'h2',calificacion:{pais_iso:'MX'}}});
 const {req,res}=pedir('Es el 55 1234 5678',{eco:{horarios:OFRECIDOS}});
 await chat(req,res);
 assert.equal(llamadas.agendar[0].whatsapp,'+525512345678');
});

test('si el horario elegido se ocupó, ofrece los que siguen libres y no reserva',async()=>{
 const llamadas=simular({agente:{mensaje:'Listo.',accion:'agendar',horario:'h1',whatsapp:'+51999888777'},horarios:[{inicio:'2026-10-21T19:00:00Z'},{inicio:'2026-10-22T14:00:00Z'}]});
 const {req,res}=pedir('+51999888777',{eco:{horarios:OFRECIDOS,horario_elegido:'h1'}});
 await chat(req,res);
 assert.equal(llamadas.agendar.length,0);
 assert.match(res.body.mensaje,/se acaba de ocupar/);
 assert.deepEqual(res.body.opciones,['Mié 21 · 14:00','Jue 22 · 09:00']);
});

test('si Calendly rechaza la reserva, sale el calendario del equipo',async()=>{
 simular({agente:{mensaje:'Listo.',accion:'agendar',horario:'h1',whatsapp:'+51999888777'},reserva:{ok:false,motivo:'error_calendly'}});
 const {req,res}=pedir('+51999888777',{eco:{horarios:OFRECIDOS,horario_elegido:'h1'}});
 await chat(req,res);
 assert.equal(res.body.tarjeta.destino,'calendly');
 assert.match(res.body.tarjeta.url,/salesforce_uuid=ruta-chat-principal/);
 assert.doesNotMatch(res.body.mensaje,/Te agendé/);
});

test('el agente muestra un testimonio de R2 y no lo repite',async()=>{
 simular({agente:{mensaje:'Te dejo el caso de Ana 👇',accion:'mostrar_video',video:'ana-briones'}});
 let {req,res}=pedir('Soy enfermera y no tengo tiempo');
 await chat(req,res);
 assert.equal(res.body.tarjeta.tipo,'video');
 assert.equal(res.body.tarjeta.escalon,'video:ana-briones');
 assert.equal(res.body.tarjeta.base,'https://video.mediatr4iner.com/testimonios/ana-briones-856509800/');
 simular({agente:{mensaje:'Mira este 👇',accion:'mostrar_video',video:'ana-briones'}});
 ({req,res}=pedir('¿otro?',{mostrados:['video:ana-briones','inventado']}));
 await chat(req,res);
 assert.equal(res.body.tarjeta,null);
});

test('un video que no existe no se muestra',async()=>{
 simular({agente:{mensaje:'Mira 👇',accion:'mostrar_video',video:'flor-zevallos'}});
 const {req,res}=pedir('¿resultados?');
 await chat(req,res);
 assert.equal(res.body.tarjeta,null);
 assert.match(res.body.ajuste,/no existe/);
});

test('en el primer mensaje no se da el precio: primero se pregunta qué quiere lograr',async()=>{
 simular({agente:{mensaje:'El Esencial cuesta US$77 al mes.',accion:'ninguna'},historial:[]});
 const {req,res}=pedir('¿Cuánto cuesta?');
 await chat(req,res);
 assert.doesNotMatch(res.body.mensaje,/77/);
 assert.match(res.body.mensaje,/qué te gustaría lograr/i);
});

test('un monto inventado (precio del Premium) no llega a la persona',async()=>{
 simular({agente:{mensaje:'El Premium cuesta US$197 al mes.',accion:'ninguna'}});
 const {req,res}=pedir('¿y el premium?');
 await chat(req,res);
 assert.doesNotMatch(res.body.mensaje,/197/);
});

test('ya agendada, no se ofrecen ni reservan más sesiones',async()=>{
 const llamadas=simular({agente:{mensaje:'Te muestro horarios.',accion:'proponer_horarios'}});
 const {req,res}=pedir('quiero otra',{mostrados:['agendo']});
 await chat(req,res);
 assert.equal(llamadas.horarios,0);
 assert.match(res.body.ajuste,/ya tiene la sesión agendada/);
});
