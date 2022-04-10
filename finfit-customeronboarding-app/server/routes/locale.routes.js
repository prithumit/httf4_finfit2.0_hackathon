const express = require('express');

const dataSet = require('../data/dataset');

const localeRouter = express.Router();

localeRouter.get('/locale/:lang?', (req, res) => {
  const { lang } = req.params;

  res.json({
    [lang]: dataSet().locale[lang],
  });
  res.end();
});

module.exports = localeRouter;
