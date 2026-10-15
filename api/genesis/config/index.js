const { isPreview, previewConfigured, privateHeaders } = require('../../../lib/genesis-team');

module.exports = function genesisConfig(request, response) {
  privateHeaders(response);
  if (request.method !== 'GET') return response.status(405).json({ error: 'Método no permitido' });
  var preview = isPreview();
  var production = process.env.VERCEL_ENV === 'production';
  var payload = {
    ready: production || (preview && previewConfigured()),
    teamPreview: preview && previewConfigured(),
    analyticsEnabled: production,
    automationEnabled: production
  };
  var url = new URL(request.url, 'https://config.invalid');
  if (url.searchParams.get('format') === 'js') {
    response.setHeader('Content-Type', 'application/javascript; charset=utf-8');
    response.setHeader('X-Content-Type-Options', 'nosniff');
    return response.status(200).send('window.TR4_RUNTIME = ' + JSON.stringify(payload) + ';');
  }
  return response.status(200).json(payload);
};
