const Joi = require('joi');
const { invalidFields } = require('../utils/errMessages');
const cpfTest = require('../utils/cpfTest');

const rangeCharacters = /^[a-zA-Z]{3,12}$/;
const regexCpf = /^\d{11}$/;

const schema = Joi.object({
  cpf: Joi.alternatives(Joi.string().regex(regexCpf), Joi.number()).required(),
  firstName: Joi.string().regex(rangeCharacters).required(),
  lastName: Joi.string().regex(rangeCharacters).required(),
  middleName: Joi.string().regex(rangeCharacters),
});

const checkCpf = (cpf, next) => {
  if (!cpfTest(cpf)) next(invalidFields);
};

module.exports = (req, _res, next) => {
  const result = schema.validate(req.body);
  const { cpf } = req.body;
  checkCpf(cpf, next);

  if (result.error) next(invalidFields);

  next();
};