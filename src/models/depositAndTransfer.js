const mongoConnection = require('./connection');

module.exports = async (id, amount) => {
  const db = await mongoConnection.getConnection();
  await db.collection('accounts').updateOne(
    { _id: id },
    { $set: { amount } },
  );
};