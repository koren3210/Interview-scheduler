const logger = require('./logger');
const handleSequelizeUniqueConstraintError = require('../utils/errorHandlers');

function errorHandler(err, req, res, next) {
  let errStatus = err.statusCode || 500;
  let errMsg = err.message || 'Something went wrong';

  // Handle Sequelize unique constraint errors
  const uniqueError = handleSequelizeUniqueConstraintError(err);
  if (uniqueError) {
    errStatus = uniqueError.status;
    errMsg = uniqueError.message;
  }

  // Log error
  logger.error(`${errStatus} - ${errMsg} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

  // Respond with the error
  res.status(errStatus).json({
    success: false,
    status: errStatus,
    message: errMsg,
    stack: process.env.NODE_ENV === 'development' ? err.stack : {},
  });
}

module.exports = errorHandler;
