const createAccountModel = require('../models/createAccount');
const { createToken } = require('../utils/tokenGenerate');

module.exports = async (object) => {
  const token = await createAccountModel(object);

  return createToken({ token });
};