function healthRoute(req, res) {
  res.status(200).json('OK');
}

module.exports = function (app) {
  app.get('/api/health', healthRoute);
};