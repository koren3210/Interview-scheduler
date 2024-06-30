const morgan = require('morgan');
const logger = require('./logger');

const morganFormat = ':method :url :status :res[content-length] - :response-time ms';

// Morgan middleware setup to use Winston for logging HTTP requests
const morganMiddleware = morgan(morganFormat, {
  stream: {
    write: (message) => {
      logger.http(message.trim());
    },
  },
});

module.exports = morganMiddleware;
