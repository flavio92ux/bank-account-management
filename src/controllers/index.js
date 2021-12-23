const createAccount = require('./createAccount');
const transfer = require('./transfer');
const deposit = require('./deposit');
const getAllAccounts = require('./getAllAccounts');
const getDataByCpf = require('./getByCpf');

module.exports = {
  createAccount,
  transfer,
  deposit,
  getAllAccounts,
  getDataByCpf,
};