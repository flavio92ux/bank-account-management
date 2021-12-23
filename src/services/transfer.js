const { ObjectId } = require('bson');
const transferModel = require('../models/depositAndTransfer');
const { insufficientFunds, sameAccount, accountDoesNotExist } = require('../utils/errMessages');
const getByCpf = require('../models/getAccountByCPF');

const checkBalance = (myAmount, amountTo) => {
  if (myAmount < amountTo) throw insufficientFunds;
};

module.exports = async (myId, mybalance, cpfTo, quantityToTransfer) => {
  checkBalance(mybalance, quantityToTransfer);
  const recipientData = await getByCpf(cpfTo);
  if (!recipientData) throw accountDoesNotExist;

  const { _id: idRecipient, amount: balanceRecipient } = recipientData;

  if (myId.toString() === idRecipient.toString()) throw sameAccount;

  const myAccountNewBalance = mybalance - quantityToTransfer;
  const recipientNewBalance = balanceRecipient + quantityToTransfer;
  
  await transferModel(ObjectId(myId), myAccountNewBalance);
  await transferModel(ObjectId(idRecipient), recipientNewBalance);
};