const appRoot = require('app-root-path');
const winston = require('winston');

const options = {
  file: {
    level: 'info',
    filename: `${appRoot}/logs/app.log`,
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: false,
  },
  console: {
    level: 'debug',
    handleExceptions: true,
    json: false,
    colorize: true,
  },
};

const winstonLogger = winston.createLogger({
  transports: [
    new winston.transports.File(options.file),
  ],
  exitOnError: false, // do not exit on handled exceptions
});
winstonLogger.stream = {
  write(message, encoding) {
    winstonLogger.info(message);
  },
};

module.exports = winstonLogger;
