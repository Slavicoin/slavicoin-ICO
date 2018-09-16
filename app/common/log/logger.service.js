'use strict';

const environment = require('app/common/environment/environment.service').environment;
const  dailyRotate = require('winston-daily-rotate-file');
const transportsArray = [];


const { createLogger, format, transports } = require('winston');
const { combine, timestamp, prettyPrint, printf, colorize, json } = format;

let logger;

transports.DailyRotateFile = dailyRotate;

const fileFormatter = printf(message => {
  if(typeof message.message === 'object') {
    message.message = JSON.stringify(message.message);
  }
  return `
************************************************************************************************************************
${message.level.toUpperCase()} \t ${message.message}`;
});

const consoleLogFormatter = printf(message => {
  if(typeof message.message === 'object') {
    message.message = JSON.stringify(message.message);
  }
  return `${message.level}: ${message.message}`;
});

function createTransports() {
  const productionTransport = new transports.DailyRotateFile({
      name: 'production-log',
      datePattern: 'YYYY-MM-DD',
      prepend: true,
      level: 'warn',
      filename: __dirname + '/logs/%DATE%.log.txt',
      handleExceptions: true,
      format: combine(
        timestamp(),
        prettyPrint(),
        fileFormatter
      ),
      maxsize: 5242880,
    }),
    testingTransport = new transports.DailyRotateFile({
      name: 'testing-log',
      datePattern: 'YYYY-MM-DD',
      prepend: true,
      level: 'info',
      filename: __dirname + '/logs/%DATE%.log.txt',
      handleExceptions: true,
      timestamp: function () {
        return new Date();
      },
      format: combine(
        json(),
        timestamp(),
        prettyPrint(),
        fileFormatter
      ),
      json: false,
      prettyPrint: true,
      maxsize: 5242880,
      colorize: false
    }),
    consoleTransport = new transports.Console({
      level: 'debug',
      handleExceptions: true,
      format: combine(
        json(),
        colorize(),
        timestamp(),
        consoleLogFormatter
      )
    });

  if (environment === 'development') {
    transportsArray.push(testingTransport);
    transportsArray.push(consoleTransport);
  } else if (environment === 'testing') {
    transportsArray.push(testingTransport);
  } else if (environment === 'production') {
    transportsArray.push(productionTransport);
  } else {
    transportsArray.push(testingTransport);
    transportsArray.push(consoleTransport);
  }
}

function getInstance() {
  if (!logger) {
    createTransports();
    logger = createLogger({
      transports: transportsArray,
      exitOnError: false
    });
  }

  return logger;
}

module.exports = getInstance();
