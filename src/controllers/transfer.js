const depositService = require('../services/transfer');

module.exports = async (req, res) => {
  const { _id: myId, amount: mybalance } = req.account;
  const { cpfTo, quantityToTransfer } = req.body;

  await depositService(myId, mybalance, cpfTo, quantityToTransfer);
  res.status(200).json({ message: 'Transfer completed' });
};