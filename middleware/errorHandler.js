const logger = require('./logger');
const handleSequelizeUniqueConstraintError = require('../utils/errorHandlers');

function errorHandler(err, req, res, next) {
  let errStatus = err.statusCode || 500;
  let errMsg = err.message || 'Internal server Error';

  // Handle Sequelize unique constraint errors
  const uniqueError = handleSequelizeUniqueConstraintError(err);
  if (uniqueError) {
    errStatus = uniqueError.status;
    errMsg = uniqueError.message;
  }
  // Log error details
  logger.error({
    status: errStatus,
    message: errMsg,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
  });

  // Respond with the error
  res.status(errStatus).json({
    success: false,
    status: errStatus,
    message: errMsg,
    stack: process.env.NODE_ENV === 'development' ? err.stack : {},
  });
}

module.exports = errorHandler;
