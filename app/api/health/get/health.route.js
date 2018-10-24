const databaseService = require('app/database/database.service');

async function healthRoute(req, res) {
  const { database } = databaseService.get();

  try {
    await database.raw('SELECT 1;');

    res.status(200).json({
      health: {
        api: true,
        memory: true
      }
    });

  } catch(error) {
    res.status(500).json(error);
  }

}

module.exports = function (app) {
  app.get('/api/health', healthRoute);
};