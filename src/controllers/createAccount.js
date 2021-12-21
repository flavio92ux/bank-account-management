const createAccountService = require('../services/createAccount');

module.exports = async (req, res) => {
  const { cpf, firstName, middleName, lastName } = req.body;

  const object = { cpf, firstName, middleName, lastName };

  const id = await createAccountService(object);

  res.status(200).send(id);
};