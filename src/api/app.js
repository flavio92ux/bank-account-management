const express = require('express');
const rescue = require('express-rescue');
const bodyParser = require('body-parser');
const controller = require('../controllers');
const checkAccountFields = require('../middlewares/checkAccountFields');
const checkBalanceFields = require('../middlewares/checkBalanceFields');
const checkDepositFields = require('../middlewares/checkDepositFields');
const auth = require('../middlewares/auth');

require('dotenv').config();

const app = express();

app.use(bodyParser.json());

app.get('/', controller.getAllAccounts);
app.get('/:cpf', rescue(controller.getDataByCpf));
app.post('/createAccount', checkAccountFields, rescue(controller.createAccount));
app.patch('/transfer', auth, checkBalanceFields, rescue(controller.transfer));
app.patch('/deposit', checkDepositFields, rescue(controller.deposit));

app.use((error, _req, res, _next) => {
  res.status(error.status).json({ message: error.message });
});

module.exports = app;
