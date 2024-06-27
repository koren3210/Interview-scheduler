const logger = require("./logger");

function errorHandler(err, req, res, next) {
  // Log the error with Winston
  logger.error(
    `${err.status || 500} - ${err.message} - ${req.originalUrl} - ${
      req.method
    } - ${req.ip}`
  );

  // Respond with the error
  res.status(err.status || 500);
  res.json({
    error: {
      message: err.message,
    },
  });
}

module.exports = errorHandler;
