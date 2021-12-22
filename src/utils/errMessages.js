const invalidFields = {
  status: 400,
  message: 'Dados inválidos',
};

const invalidCpf = {
  status: 400,
  message: 'Cpf Inválido',
};

const cpfAlreadyExist = {
  status: 409,
  message: 'CPF already exist',
};

const jwtMalformed = {
  status: 400,
  message: 'JWT Malformed',
};

const missingAuthToken = {
  status: 401,
  message: 'missing auth token',
};

const insufficientFunds = {
  status: 400,
  message: 'insufficient funds',
};

const sameAccount = {
  status: 409,
  message: 'it is not possible to transfer to the same account.',
};

module.exports = {
  invalidFields,
  invalidCpf,
  cpfAlreadyExist,
  jwtMalformed,
  missingAuthToken,
  insufficientFunds,
  sameAccount,
};