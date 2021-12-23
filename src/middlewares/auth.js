const { checkToken } = require('../utils/tokenGenerate');
const { missingAuthToken, jwtMalformed } = require('../utils/errMessages');
const getById = require('../models/getAccountById');

module.exports = async (req, _res, next) => {
  const token = req.headers.authorization;

  if (!token) next(missingAuthToken);

  try {
    const { id } = checkToken(token);
    const account = await getById(id);

    if (!account) next(jwtMalformed);

    req.account = account;
    next();
  } catch (_e) {
    next(jwtMalformed);
  }
};