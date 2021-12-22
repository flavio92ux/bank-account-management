const transferModel = require('../models/depositAndTransfer');
const getIdByCpf = require('../models/getAccountByCPF');
const { accountDoesNotExist } = require('../utils/errMessages');

module.exports = async (cpf, amount) => {
  const data = await getIdByCpf(cpf);
  if (!data) throw accountDoesNotExist;
  const { _id: id, amount: currentAmount } = data;

  const newAmount = currentAmount + amount;

  await transferModel(id, newAmount);

  return { status: 200, message: 'Transfer Completed' };
};