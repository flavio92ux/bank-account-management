const Joi = require('joi');
const { invalidFields, invalidCpf } = require('../utils/errMessages');
const cpfTest = require('../utils/cpfTest');

const regexCpf = /^\d{11}$/;

const schema = Joi.object({
  cpfTo: Joi.alternatives(Joi.string().regex(regexCpf), Joi.number()).required(),
  quantityToTransfer: Joi.number().min(1).required(),
});

const checkCpf = (cpf, next) => {
  if (!cpfTest(cpf)) next(invalidCpf);
};

module.exports = (req, _res, next) => {
  const result = schema.validate(req.body);
  if (result.error) {
    next(invalidFields);
  } else {
    const { cpfTo } = req.body;
    checkCpf(cpfTo, next);
  }

  next();
};