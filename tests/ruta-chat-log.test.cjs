const test=require('node:test'),assert=require('node:assert/strict');

// El chat pide la memoria al CRM, se la pasa al agente y guarda el turno que vio la persona.
process.env.GENESIS_CRM_API_URL='https://crm.test';
process.env.GENESIS_INTERNAL_SECRET='interno';
process.env.RUTA_CHAT_SECRET='agente';
delete process.env.VERCEL_ENV;
const chat=require('../api/genesis/chat');
const chatEvento=require('../api/genesis/chat-evento');

function simular({agente,historial=[{rol:'persona',texto:'hola'},{rol:'equipo',texto:'Hola, Ana.'}],horarios=[]}){
 const llamadas={historial:0,agente:null,turnos:[],horarios:0};
 global.fetch=async(url,init={})=>{
  const responder=(status,body)=>({ok:status<400,status,text:async()=>JSON.stringify(body),json:async()=>body});
  if(url==='https://crm.test/api/genesis/session')return responder(200,{member:{email:'ana@x.com',nombre:'Ana Pérez',sexo:'Mujer'},progress:[]});
  if(url.startsWith('https://crm.test/api/genesis/chat-log?')){llamadas.historial++;return responder(200,{historial});}
  if(url==='https://crm.test/api/genesis/chat-log'){llamadas.turnos.push(JSON.parse(init.body));return responder(200,{ok:true});}
  if(url.includes('/webhook/ruta-chat-horarios')){llamadas.horarios++;return responder(200,{horarios});}
  if(url.includes('/webhook/ruta-chat')){llamadas.agente=JSON.parse(init.body);if(agente instanceof Error)throw agente;return responder(200,agente);}
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

test('la sesión sale con los horarios libres de Calendly en la hora de la persona',async()=>{
 const llamadas=simular({agente:{mensaje:'Te dejamos los horarios aquí abajo.',accion:'ofrecer_sesion',calificacion:{nivel:'caliente',potencial:'alto'}},
  horarios:[{inicio:'2026-10-20T16:00:00Z',url:'https://calendly.com/d/ck4v-8jc-pv6/asesoria-tr4iner/2026-10-20T16:00:00Z'},{inicio:'2026-10-21T19:00:00Z',url:'https://calendly.com/d/ck4v-8jc-pv6/asesoria-tr4iner/2026-10-21T19:00:00Z'}]});
 const {req,res}=pedir('Necesito que me guíen de cerca');
 await chat(req,res);
 assert.equal(llamadas.horarios,1);
 const t=res.body.tarjeta;
 assert.equal(t.tipo,'sesion');
 assert.deepEqual(t.horarios.map(h=>h.hora),['11:00','14:00']);
 assert.match(t.horarios[0].url,/email=ana%40x\.com/);
 assert.match(t.horarios[0].url,/salesforce_uuid=ruta-chat-principal/);
 assert.match(res.body.ajuste,/Vio estos horarios/);
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

test('la agenda confirmada queda guardada como un turno del chat',async()=>{
 const llamadas=simular({agente:{}});
 const res={code:0,body:null,headers:{},status(c){this.code=c;return this;},json(b){this.body=b;return this;},setHeader(k,v){this.headers[k]=v;}};
 await chatEvento({method:'POST',body:{tipo:'agenda',conversacion:'principal',inicio:'2026-10-20T16:00:00Z',zona:'America/Lima'},headers:{cookie:'tr4_genesis_session=abc'}},res);
 assert.equal(res.code,200);
 assert.match(res.body.mensaje,/agendada para el martes, 20 de octubre, 11:00/);
 assert.equal(llamadas.turnos.length,1);
 assert.equal(llamadas.turnos[0].accion,'agendo');
});
