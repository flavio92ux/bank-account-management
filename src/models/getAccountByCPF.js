const mongoConnection = require('./connection');

module.exports = async (cpf) => {
  const db = await mongoConnection.getConnection();
  const result = await db.collection('accounts').findOne({ cpf });
  return result;
  };
