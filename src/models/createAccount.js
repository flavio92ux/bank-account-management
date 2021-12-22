const mongoConnection = require('./connection');

module.exports = async (object) => {
    const db = await mongoConnection.getConnection();
    const result = await db.collection('accounts').insertOne({ ...object, amount: 0 });
    return result.insertedId;
  };