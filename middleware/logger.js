const winston = require("winston");
const fs = require("fs");
const { format } = winston;
const { combine, timestamp, printf, colorize } = format;

// Configure colorization options
winston.addColors({
  error: "red",
  warn: "yellow",
  info: "cyan",
  debug: "blue",
});

const logsDirectory = process.env.LOGS_DIRECTORY || "logs";
if (!fs.existsSync(logsDirectory)) {
  fs.mkdirSync(logsDirectory);
}

const logFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});

const logger = winston.createLogger({
  level: "info",
  format: combine(
    colorize({ all: true }), // Colorize all log levels
    timestamp({ format: "YYYY-MM-DD hh:mm:ss.SSS A" }), // Custom timestamp format
    logFormat
  ),
  transports: [
    new winston.transports.File({
      filename: `${logsDirectory}/error.log`,
      level: "error",
    }),
    new winston.transports.File({ filename: `${logsDirectory}/combined.log` }),
    new winston.transports.Console(),
  ],
});

module.exports = logger;
