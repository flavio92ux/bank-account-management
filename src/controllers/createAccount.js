const createAccountService = require('../services/createAccount');

module.exports = async (req, res) => {
  const { cpf, firstName, middleName, lastName } = req.body;

  const object = { cpf, firstName, middleName, lastName };

  const token = await createAccountService(object);

  res.status(201).json({ token });
};