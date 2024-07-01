const winston = require('winston');
const fs = require('fs');
const { format } = winston;
const { combine, timestamp, printf, colorize } = format;

// Configure colorization options
winston.addColors({
  error: 'red',
  http: 'cyan',
  info: 'green',
});

// Define log directory and create it if it doesn't exist
const logsDirectory = process.env.LOGS_DIRECTORY || 'logs';
if (!fs.existsSync(logsDirectory)) {
  fs.mkdirSync(logsDirectory);
}

// Define a format for file logs
const logFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});

const consoleLogFormat = printf(({ level, message, timestamp, url, method, ip }) => {
  return `${timestamp} ${level}: ${url ? `URL: ${url}` : ''} ${method ? `Method: ${method}` : ''} ${
    ip ? `IP: ${ip}` : ''
  } ${message}`;
});

// Create the logger
const logger = winston.createLogger({
  level: 'info', // Default level for logging
  format: combine(
    timestamp({ format: 'YYYY-MM-DD hh:mm:ss.SSS A' }), // Custom timestamp format
    logFormat
  ),
  transports: [
    // File transport for error logs
    new winston.transports.File({
      filename: `${logsDirectory}/error.log`,
      level: 'error', // Log only errors to error.log
    }),
    // File transport for info logs
    new winston.transports.File({
      filename: `${logsDirectory}/info.log`,
      level: 'info', // Log info level and above to info.log
    }),
    // File transport for HTTP logs
    new winston.transports.File({
      filename: `${logsDirectory}/http.log`,
      level: 'http', // Log HTTP level and above to http.log
    }),
    // Console transport specifically for HTTP logs
    new winston.transports.Console({
      level: 'http', // Log HTTP level and above to console
      format: combine(
        colorize({ all: true }), // Add color to console logs
        timestamp({ format: 'YYYY-MM-DD hh:mm:ss.SSS A' }), // Custom timestamp format
        consoleLogFormat // Custom format for detailed console logging without stack trace
      ),
    }),
  ],
});

module.exports = logger;
