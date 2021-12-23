const mongoConnection = require('./connection');

module.exports = async () => {
  const db = await mongoConnection.getConnection();
  const result = await db.collection('accounts').find({}).toArray();
  return result;
};