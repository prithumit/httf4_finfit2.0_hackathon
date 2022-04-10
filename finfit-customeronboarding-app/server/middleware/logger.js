// const winstonLogger = require('./winstonLogger')
const logger = function (req, res, next) {
  console.log(`Time: ${Date.now()} | Request - ${req.url} | Response - ${res}`)
  next();
}

module.exports = logger
