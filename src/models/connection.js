const { MongoClient } = require('mongodb');

const MONGODB_URL = 'mongodb://localhost:27017';
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