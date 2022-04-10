const https = require('https');
const http = require('http');
const express = require('express');
const expressRateLimit = require('express-rate-limit');
const history = require('connect-history-api-fallback');
const bodyParser = require('body-parser');
const compression = require('compression');
const fs = require('fs');
const cors = require('cors');
const path = require('path');

const {
  logger,
  mocker,
  auth,
} = require('./middleware');
const {
  apiRoute,
  configRoute,
  localeRoute,
} = require('./routes');

const app = express();
const rateLimit = expressRateLimit({
  windowMs: 24 * 60 * 60 * 1000,
  max: process.env.MAX_REQUESTS,
  message: 'You have exceeded the 1000 requests in 24 hrs limit!',
  headers: true,
});
const staticFileMiddleware = express.static(path.join(__dirname, process.env.STATIC_DIR));
const key = fs.readFileSync(process.env.PRIVATEKEY_SSL);
const cert = fs.readFileSync(process.env.CERT_SSL);
const certPayload = {
  key,
  cert,
};
const staticFileOptions = {
  dotfiles: 'ignore',
  etag: false,
  extensions: ['htm', 'html'],
  fallthrough: true,
  index: false,
  maxAge: '1d',
  redirect: false,
  setHeaders(res, path, stat) {
    res.set('Accept', 'text/html');
    res.set('x-timestamp', Date.now());
  },
};

/** Middlewares */
app.use(cors());
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(mocker);
app.use(rateLimit);
// app.use(auth);
app.use(logger);

/** Route Handlers * */
app.use('/api', configRoute);
app.use(apiRoute);
app.use(localeRoute);

app.use(`/${process.env.PUBLIC_PATH}`, express.static(path.join(__dirname, process.env.STATIC_DIR), staticFileOptions));
app.use(history({
  disableDotRule: true,
  verbose: false,
}));
app.use(staticFileMiddleware);

if (process.env.ENABLE_SSL === 'true') {
  server = https.createServer(certPayload, app);
} else {
  server = http.createServer(app);
}

server.listen(process.env.PORT, () => {
  console.log('Server Started at port', process.env.PORT);
});
