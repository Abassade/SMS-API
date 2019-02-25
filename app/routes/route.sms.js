const config = require('../config/settings');

const routes = function routes(server, serviceLocator) {
const SmsController = serviceLocator.get('SmsController');

  server.get({
    path: '/',
    name: 'home',
    version: '1.0.0'
  }, (req, res) => res.send(`Welcome to ${config.appName} API`));

  server.post({
    path: '/sms/single',
    name: 'Send SMS to a single number',
    version: '1.0.0'
  }, (req, res) => SmsController.sendSingleSMS(req, res));

  server.post({
    path: '/sms/bulk',
    name: 'Send SMS in bulk',
    version: '1.0.0'
  }, (req, res) => SmsController.sendBulkSMS(req, res));

};

module.exports = routes;
