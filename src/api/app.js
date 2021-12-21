const express = require('express');
const bodyParser = require('body-parser');
const controller = require('../controllers');
const checkFields = require('../middlewares/checkFields');

require('dotenv').config();

const app = express();

app.use(bodyParser.json());

app.post('/createAccount', checkFields, controller.createAccount);

app.use((error, _req, res, _next) => {
  res.status(error.status).json(error.message);
});

module.exports = app;
