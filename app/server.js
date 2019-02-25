const dotenv = require('dotenv');

dotenv.config();

const restify = require('restify');
const config = require('./config/settings');
const routes = require('./routes/route.sms');

// service locator via dependency injection
const serviceLocator = require('./config/di');

const logger = serviceLocator.get('logger');


const server = restify.createServer({
  name: config.appName,
  versions: ['1.0.0'],
});

// set API versioning and allow trailing slashes
server.pre(restify.pre.sanitizePath());


// set request handling and parsing
server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());


// setup Routing and Error Event Handling
routes(server, serviceLocator);


server.listen(config.port, () => {
  logger.info(`${server.name} listening at ${server.url}`);
});

