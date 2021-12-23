const getAllAccountsModel = require('../models/getAllAccounts');
const { createToken } = require('../utils/tokenGenerate');

module.exports = async () => {
  const data = await getAllAccountsModel();
  const newData = data.map((account) => {
    const { _id: id } = account;
    const token = createToken({ id });
    return { ...account, token };
  });
  return newData;
};