const { ObjectId } = require('bson');
const mongoConnection = require('./connection');

module.exports = async (id) => {
    const db = await mongoConnection.getConnection();
    const product = await db.collection('accounts').findOne({ _id: ObjectId(id) });
    return product;
  };