const mongoConnection = require('./connection');

module.exports = async (object) => {
    const db = await mongoConnection.getConnection();
    const result = await db.collection('users').insertOne(object);
    return result.insertedId;
  };