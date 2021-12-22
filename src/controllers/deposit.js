const depositService = require('../services/deposit');

module.exports = async (req, res) => {
  const { cpf, amount } = req.body;

  const response = await depositService(cpf, amount);

  res.status(200).json(response);
};