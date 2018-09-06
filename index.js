const environment = require('app/common/environment/environment.service').environment;
const SlavicoinICO = require('app/SlavicoinICO');

async function start() {
  const server = new SlavicoinICO();
  await server.initializeServer();

  if(environment === 'development') {
    server.startServer();
  }

}

start();