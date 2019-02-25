/**
 * Created by Abass Makinde on 22/02/2019.
 */
const winston = require('winston');

const config = require('./settings');
const serviceLocator = require('../lib/serviceLocator');

const SmsService = require('../services/service.sms');
const SmsController = require('../controllers/controller.sms');
/**
 * Returns an instance of logger for the App
 */
serviceLocator.register('logger', () => {
  const consoleTransport = new (winston.transports.Console)({
    datePattern: 'yyyy-MM-dd.',
    prepend: true,
    json: false,
    colorize: true,
    level: process.env.ENV === 'development' ? 'debug' : 'info',
  });
  const transports = [consoleTransport];
  return winston.createLogger({
    transports,
  });
});


// Servive instance
serviceLocator.register('SmsService', () => {
  const logger = serviceLocator.get('logger');
  return new SmsService(logger);
});

// Controller instance
serviceLocator.register('SmsController', (serviceLocator) => {
  const logger = serviceLocator.get('logger');
  const service = serviceLocator.get('SmsService');
  return new SmsController(logger, service);
});

module.exports = serviceLocator;
