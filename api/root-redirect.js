module.exports = function rootRedirect(request, response) {
  // El redirect declarativo de Vercel descarta la query; acá preservamos cualquier
  // parámetro actual o futuro para que entrar por / no rompa la atribución.
  var search = new URL(request.url, 'http://localhost').search;
  response.statusCode = 308;
  response.setHeader('Location', '/casos-de-estudio' + search);
  response.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
  response.end();
};
