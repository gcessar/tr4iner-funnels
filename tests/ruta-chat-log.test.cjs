const test=require('node:test'),assert=require('node:assert/strict');

// El chat pide la memoria al CRM, se la pasa al agente y guarda el turno que vio la persona.
process.env.GENESIS_CRM_API_URL='https://crm.test';
process.env.GENESIS_INTERNAL_SECRET='interno';
process.env.RUTA_CHAT_SECRET='agente';
delete process.env.VERCEL_ENV;
const chat=require('../api/genesis/chat');

function simular({agente}){
 const llamadas={historial:0,agente:null,turnos:[]};
 global.fetch=async(url,init={})=>{
  const responder=(status,body)=>({ok:status<400,status,text:async()=>JSON.stringify(body),json:async()=>body});
  if(url==='https://crm.test/api/genesis/session')return responder(200,{member:{email:'ana@x.com',nombre:'Ana Pérez',sexo:'Mujer'},progress:[]});
  if(url.startsWith('https://crm.test/api/genesis/chat-log?')){llamadas.historial++;return responder(200,{historial:[{rol:'persona',texto:'hola'},{rol:'equipo',texto:'Hola, Ana.'}]});}
  if(url==='https://crm.test/api/genesis/chat-log'){llamadas.turnos.push(JSON.parse(init.body));return responder(200,{ok:true});}
  if(url.includes('/webhook/ruta-chat')){llamadas.agente=JSON.parse(init.body);if(agente instanceof Error)throw agente;return responder(200,agente);}
  throw new Error('URL inesperada '+url);
 };
 return llamadas;
}
function pedir(){
 const res={code:0,body:null,headers:{},status(c){this.code=c;return this;},json(b){this.body=b;return this;},setHeader(k,v){this.headers[k]=v;}};
 const req={method:'POST',body:{mensaje:'¿cuánto cuesta?',conversacion:'principal'},headers:{cookie:'tr4_genesis_session=abc'}};
 return {req,res};
}

test('el agente recibe la memoria del CRM y el turno se guarda con lo que vio la persona',async()=>{
 const llamadas=simular({agente:{mensaje:'Te muestro el plan.',opciones:['¿Qué incluye?'],accion:'ofrecer_plan',escalon:'apertura',calificacion:{nivel:'tibio'}}});
 const {req,res}=pedir();
 await chat(req,res);
 assert.equal(res.code,200);
 assert.equal(llamadas.historial,1);
 assert.deepEqual(llamadas.agente.historial,[{rol:'persona',texto:'hola'},{rol:'equipo',texto:'Hola, Ana.'}]);
 assert.equal(llamadas.turnos.length,1);
 const turno=llamadas.turnos[0];
 assert.equal(turno.mensajeUsuario,'¿cuánto cuesta?');
 assert.equal(turno.mensajeEquipo,res.body.mensaje);
 assert.equal(turno.tarjeta&&turno.tarjeta.escalon,'apertura');
 assert.equal(turno.escalonPedido,'apertura');
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
