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

  before(async function () {
    connectionMock = await getConnection();
      sinon.stub(MongoClient, 'connect')
        .resolves(connectionMock);
    
    responseBill = await chai.request(app)
      .post('/createAccount')
      .send({ cpf: 36212043000, firstName: 'Bill', lastName: 'Gates' });

    await chai.request(app)
      .patch('/deposit')
      .send({ cpf: 36212043000, amount: 1800 });

    await chai.request(app)
      .post('/createAccount')
      .send({ cpf: 35548165070, firstName: 'Mark', lastName: 'Zuckeberg' });
  });

  after(async function () {
    MongoClient.connect.restore();

    await connectionMock.db('BankAccount').collection('accounts')
      .deleteOne({ cpf: 36212043000 });

    await connectionMock.db('BankAccount').collection('accounts')
      .deleteOne({ cpf: 35548165070 });
  });

  describe('Verifica se é possivel fazer uma transferencia com sucesso', function () {
    before(async function () {
      const { body: { token } } = responseBill;
      await chai.request(app)
        .patch('/transfer')
        .set({ Authorization: token })
        .send({ cpfTo: 35548165070, quantityToTransfer: 300 });
    });

    it('Verifica se foi decrementado R$300 na conta de Bill', async function () {
      const { body: { amount } } = await chai.request(app)
        .get('/36212043000');

      expect(amount).to.be.equal(1500);
    });

    it('Verifica se foi aumentado em R$300 na conta de Mark', async function () {
      const { body: { amount } } = await chai.request(app)
        .get('/35548165070');

      expect(amount).to.be.equal(300);
    });
  });
});
