module.exports = function manifest(request, response) {
  if(process.env.VERCEL_ENV !== 'preview' || process.env.GENESIS_TEAM_PREVIEW !== '1') return response.status(404).end();
  const share=process.env.GENESIS_PREVIEW_SHARE || '';
  response.setHeader('Content-Type','application/manifest+json');
  response.setHeader('Cache-Control','private, no-store');
  return response.status(200).json({id:'/biblioteca/',name:'Ruta TR4INER · Equipo',short_name:'Ruta TR4INER',lang:'es',display:'standalone',background_color:'#ffffff',theme_color:'#ffffff',scope:'/biblioteca/',start_url:'/biblioteca/inicio/'+(share?'?_vercel_share='+encodeURIComponent(share):''),icons:[{src:'/biblioteca/icons/icon-192.png',sizes:'192x192',type:'image/png',purpose:'any maskable'},{src:'/biblioteca/icons/icon-512.png',sizes:'512x512',type:'image/png',purpose:'any maskable'}]});
};
