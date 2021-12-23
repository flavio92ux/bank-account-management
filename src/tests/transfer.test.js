/* eslint-disable max-len */
const chai = require('chai');
const sinon = require('sinon');
const chaiHttp = require('chai-http');
const { MongoClient } = require('mongodb');
const app = require('../api/app');

const { getConnection } = require('./connectionMock');

chai.use(chaiHttp);

const { expect } = chai;

describe('PATCH /transfer', function () {
  let connectionMock;
  let responseBill;
  let responseMark;

  before(async function () {
    connectionMock = await getConnection();
      sinon.stub(MongoClient, 'connect')
        .resolves(connectionMock);
    
    responseBill = await chai.request(app)
      .post('/createAccount')
      .send({ cpf: 14645594818, firstName: 'Bill', lastName: 'Gates' });

    await chai.request(app)
      .patch('/deposit')
      .send({ cpf: 14645594818, amount: 1800 });

    responseMark = await chai.request(app)
      .post('/createAccount')
      .send({ cpf: 35548165070, firstName: 'Mark', lastName: 'Zuckeberg' });
  });

  after(async function () {
    MongoClient.connect.restore();

    await connectionMock.db('BankAccount').collection('accounts')
      .deleteOne({ cpf: 14645594818 });

    await connectionMock.db('BankAccount').collection('accounts')
      .deleteOne({ cpf: 35548165070 });
  });

  describe('Verifica se é possivel fazer uma transferencia com sucesso', function () {
    before(async function {
      const { token } = responseBill;
      await chai.request(app)
        .patch('/transfer')
        .set({ Authorization: token })
        .send({ cpfTo: 35548165070, quantityToTransfer: 300 });
    });

    it('Transfere R$300 de Bill para Mark', async function () {
      expect(response.body).to.be.an('object');
    });
  });
});
