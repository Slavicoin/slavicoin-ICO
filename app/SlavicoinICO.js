/* eslint-disable global-require */
const express = require('express');
const logger = require('app/common/log/logger.service');
const bodyParser = require('body-parser');
const glob = { glob: require('glob') };
const bluebird = require('bluebird');
const { Nuxt, Builder } = require('nuxt');
const options = require('../nuxt.config.js');

//const Ethereum = require('app/common/ethereum/Ethereum');

global.Promise = bluebird;
Promise.promisifyAll(glob);

class SlavicoinICO {
  constructor() {
    //const eth = new Ethereum();

    this.connections = [];
    this.app = express();

    this.connectionClose = this.connectionClose.bind(this);
    this.connectionEstablished = this.connectionEstablished.bind(this);
    this.startServer = this.startServer.bind(this);
    this.stopServer = this.stopServer.bind(this);
    this.initializeServer = this.initializeServer.bind(this);
    this.includeAPIRoutes = this.includeAPIRoutes.bind(this);
    this.includeMiddlewares = this.includeMiddlewares.bind(this);

  }

  initializeServer() {
    this.app.set('port', 3010);

    this.includeMiddlewares();

    //this.includeViewRoutes();
    return this.includeAPIRoutes();

  }
  includeMiddlewares() {
    logger.info('Including middlewares');

    this.app.use('/api/*', bodyParser.urlencoded({ extended: true, limit: '20kb' }));
    this.app.use('/api/*', bodyParser.json({ limit: '20kb' }));

  }
  async includeAPIRoutes() {
    logger.info('Including API routes');

    const routes = await glob.globAsync('**/api/**/*.route.js');
    routes.forEach((route) => {
      require(route.replace('node_modules/', ''))(this.app);
    });
  }
  includeViewRoutes() {
    const nuxt = new Nuxt(options);

    this.app.use(nuxt.render);

    new Builder(nuxt).build().then(() => {
      this.app.use(nuxt.render);
    }).catch(error => {
      logger.error(error);
      process.exit(-1);
    });
  }

  connectionClose(closed) {
    this.connections = this.connections.filter(function (current) {
      return (current !== closed);
    });
  }
  connectionEstablished(connection) {
    this.connections.push(connection);
    connection.on('close', this.connectionClose);
  }
  stopServer(callback) {
    logger.info('Stopping server');

    if(this.server) {
      this.server.close(callback);

    }
    this.connections.forEach(function (connection) {
      connection.end();
      connection.destroy();
    });

    if(!this.server){
      return callback();
    }

  }

  startServer() {
    logger.info('Starting server');
    this.server = this.app.listen(this.app.get('port'));

    this.server.on('connection', this.connectionEstablished);
    logger.info('Server started');
  }

}


module.exports = SlavicoinICO;