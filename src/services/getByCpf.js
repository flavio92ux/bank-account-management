const getDataByCpfModel = require('../models/getAccountByCPF');
const { accountDoesNotExist } = require('../utils/errMessages');

module.exports = async (cpf) => {
  const data = await getDataByCpfModel(Number(cpf));

  if (!data) throw accountDoesNotExist;

  return data;
};