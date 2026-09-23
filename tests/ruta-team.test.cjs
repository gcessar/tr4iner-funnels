const test=require('node:test'),assert=require('node:assert/strict');
const {issueTeamCookie,verifyTeamCookie,previewConfigured,previewCrmOrigin}=require('../lib/genesis-team');
const env={VERCEL_ENV:'preview',GENESIS_TEAM_PREVIEW:'1',GENESIS_PREVIEW_ACCESS_KEY:'x'.repeat(43),GENESIS_TEAM_SECRET:'y'.repeat(64),GENESIS_INTERNAL_SECRET:'z'.repeat(64),GENESIS_CRM_API_URL:'https://crm-staging.vercel.app'};
test('clave privada: cookie firmada expira y no acepta modificaciones',async()=>{
 const time=Date.now(),value=await issueTeamCookie(env,time),cookie='tr4_genesis_team_preview='+value;
 assert.equal(await verifyTeamCookie(cookie,env,time+1000),true);
 assert.equal(await verifyTeamCookie(cookie+'x',env,time),false);
 assert.equal(await verifyTeamCookie(cookie,env,time+31*86400000),false);
 assert.equal(await verifyTeamCookie(cookie,{...env,GENESIS_PREVIEW_ACCESS_KEY:'k'.repeat(43)},time),false);
});
test('configuración de preview incompleta o hacia producción queda cerrada',()=>{
 assert.equal(previewConfigured(env),true);
 for(const url of ['https://hub.tr4iner.com','https://crm-ventas-eosin.vercel.app','http://crm-staging.vercel.app','https://x:secret@crm-staging.vercel.app'])assert.equal(previewCrmOrigin({...env,GENESIS_CRM_API_URL:url}),null);
 assert.equal(previewConfigured({...env,GENESIS_PREVIEW_ACCESS_KEY:''}),false);
});
