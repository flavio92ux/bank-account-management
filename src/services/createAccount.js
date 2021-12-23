const createAccountModel = require('../models/createAccount');
const getAccountByCpf = require('../models/getAccountByCPF');
const { createToken } = require('../utils/tokenGenerate');
const { cpfAlreadyExist } = require('../utils/errMessages');

const checkAccount = async (cpf) => {
  const response = await getAccountByCpf(cpf);
  if (response) throw cpfAlreadyExist;
};

module.exports = async (object) => {
  const { cpf } = object;
  await checkAccount(cpf);
  const id = await createAccountModel(object);

  return createToken({ id });
};