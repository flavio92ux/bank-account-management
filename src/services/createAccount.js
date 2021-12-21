const createAccountModel = require('../models/createAccount');

module.exports = async (object) => {
  const id = await createAccountModel(object);
  return id;
};