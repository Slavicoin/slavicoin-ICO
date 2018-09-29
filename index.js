/* eslint-disable global-require */
const environment = require('app/common/environment/environment.service').environment;
const logger = require('app/common/log/logger.service.js');
const chokidar = require('chokidar');
const chokidarConf = require('./chokidar.json');

const { Nuxt, Builder } = require('nuxt');
const options = require('./nuxt.config.js');

const nuxt = new Nuxt(options);

let SlavicoinICO;

let firstRun = true;
let timer = null;
let server;
let watcher;

function emptyMemory() {
  Object.keys(require.cache).forEach(function (key) {
    if(key.indexOf('node_modules') === -1) {
      const mod = require.cache[key];

      if(mod.parent) {
        for (let i = 0; i < mod.parent.children.length; i++) {
          if (mod.parent.children[i] === mod) {
            mod.parent.children.splice(i, 1);
            break;
          }
        }
      }

      delete require.cache[key];
    }
  });
  require.main.children.forEach(function (child, index) {
    if(child.id.indexOf('slavicoin-ICO/app/SlavicoinICO.js') > -1) {
      require.main.children.splice(index, 1);
    }
  });
}

async function updateServer() {
  async function serverStopped(stoppingError) {
    if(stoppingError) {
      logger.error('Error');
      logger.error(stoppingError);
    }
    logger.info('Server stopped. Restarting');

    SlavicoinICO = null;

    emptyMemory();

    SlavicoinICO = require('app/SlavicoinICO');
    server = new SlavicoinICO();

    try {
      timer = null;
      await server.initializeServer(nuxt);
      server.startServer();
    } catch(error) {
      console.log(error);
      logger.error('ERROR!');
      logger.error(error);
    }
  }

  if(server) {
    server.stopServer(serverStopped);
  } else if(firstRun) {
    firstRun = false;

    logger.info('First time starting');

    SlavicoinICO = require('app/SlavicoinICO');
    server = new SlavicoinICO();

    try {
      await server.initializeServer(nuxt);
      server.startServer();
    } catch(error) {
      logger.error(error);
    }
  }
}

async function start() {

  if(environment === 'development') {
    watcher = chokidar.watch('app/',
      chokidarConf
    ).on('ready', function () {
      watcher.on('all', function () {
        if(timer) {
          clearTimeout(timer);
        } else {
          timer = setTimeout(updateServer, 100);
        }
      });
    });

    logger.info('Building front end');

    try {
      await new Builder(nuxt).build();
    } catch(error) {
      logger.error('Error building front end');
      logger.error(error);
      process.exit(-1);
    }

    process.on('unhandledRejection', function (reason) {
      console.log(reason);
      logger.error('Server Failed');
      logger.error('Unhandled Rejection at:', reason.stack || reason);
    });
    updateServer();

  }

}

start();