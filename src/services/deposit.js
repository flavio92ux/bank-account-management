const depositModel = require('../models/deposit');
const { insufficientFunds, sameAccount } = require('../utils/errMessages');
const getByCpf = require('../models/getAccountByCPF');

const checkBalance = (myAmount, amountTo) => {
  if (myAmount < amountTo) throw insufficientFunds;
};

module.exports = async (myId, mybalance, cpfTo, quantityToTransfer) => {
  checkBalance(mybalance, quantityToTransfer);
  const { _id: idRecipient, amount: balanceRecipient } = await getByCpf(cpfTo);

  if (myId === idRecipient) throw sameAccount;

  const myAccountNewBalance = mybalance - quantityToTransfer;
  const recipientNewBalance = balanceRecipient + quantityToTransfer;
  
  await depositModel(myId, myAccountNewBalance);
  await depositModel(idRecipient, recipientNewBalance);
};