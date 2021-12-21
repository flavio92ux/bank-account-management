const { readFileSync } = require('fs');
const jwt = require('jsonwebtoken');

const SECRET = './jwt.evaluation.key';
const RESULT_SECRET = readFileSync(SECRET, 'utf-8').replace('\n', '');

const createToken = (email) => jwt.sign(email, RESULT_SECRET);

const checkToken = (myToken) => jwt.verify(myToken, RESULT_SECRET);

module.exports = {
    createToken,
    checkToken,
};