const Joi = require('joi');
const { invalidFields, invalidCpf } = require('../utils/errMessages');
const cpfTest = require('../utils/cpfTest');

const regexCpf = /^\d{11}$/;

const schema = Joi.object({
  cpfTo: Joi.alternatives(Joi.string().regex(regexCpf), Joi.number()).required(),
  quantityToTransfer: Joi.number().min(1).max(2000).required(),
});

const checkCpf = (cpf, next) => {
  if (!cpfTest(cpf)) next(invalidCpf);
};

module.exports = (req, _res, next) => {
  const result = schema.validate(req.body);
  const { cpfTo } = req.body;
  checkCpf(cpfTo, next);

  if (result.error) next(invalidFields);

  next();
};