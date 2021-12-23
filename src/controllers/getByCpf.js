const getDataByCpfService = require('../services/getByCpf');

module.exports = async (req, res) => {
  const { cpf } = req.params;
  const data = await getDataByCpfService(cpf);
  res.status(200).json(data);
};