/* eslint-disable func-names */
const requireDir = require('require-dir');

const mocker = function (req, res, next) {
  try {
    if (process.env.ENABLE_MOCKER === 'true') {
      if (req.path.includes('service')) {
        const data = requireDir('../mocks/', { recurse: true });
        const urlParams = req.path.replace('/service/m/', '').split('/').filter(Boolean);
        const response = data[urlParams[0]];
        const resultKey = Object.keys(response).filter(dbKey => urlParams[1] === dbKey);
        const finalData = response[resultKey] || response;

        res.setHeader('Content-Type', 'application/json');
        res.json(finalData);
      } else {
        next();
      }
    } else {
      next();
    }
  } catch (e) {
    console.log(e);
  }
};

module.exports = mocker;
