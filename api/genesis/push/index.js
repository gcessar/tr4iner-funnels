const { forward } = require('../../../lib/genesis-proxy');
module.exports = async function (request, response) {
  if (!["GET", "POST", "DELETE"].includes(request.method)) return response.status(405).json({error:'Método no permitido'});
  const query = new URL(request.url, 'https://local.invalid').search;
  return forward(request, response, 'push' + query);
};
