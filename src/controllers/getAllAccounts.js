const getAllAccountsService = require('../services/getAllAccounts');

module.exports = async (_req, res) => {
  const data = await getAllAccountsService();
  res.status(200).json(data);
};