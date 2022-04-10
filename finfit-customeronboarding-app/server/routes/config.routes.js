const express = require('express');

const dataSet = require('../data/dataset');

const configRouter = express.Router();

configRouter.post('/db/:id?/:childNode?', (req, res) => {
  try {
    const { id, childNode } = req.params;
    const db = dataSet()[id];
    const resultKey = Object.keys(db).filter(dbKey => childNode === dbKey);
    const data = db[resultKey] || db;

    res.json(data);
  } catch (e) {
    console.log(e);
  }
});

module.exports = configRouter;
