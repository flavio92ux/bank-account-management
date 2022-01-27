const { MongoClient } = require('mongodb');
require('dotenv').config();

const MONGODB_HOST = process.env.MONGODB_HOST || 'db';

const MONGODB_URL = `mongodb://${MONGODB_HOST}:27017`;
const DB_NAME = 'BankAccount';

const getConnection = () => MongoClient
  .connect(MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((conn) => conn.db(DB_NAME))
  .catch((err) => {
    console.error(err);
    process.exit();
  });

module.exports = { getConnection };