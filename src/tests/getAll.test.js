/* eslint-disable max-len */
const chai = require('chai');
const sinon = require('sinon');
const chaiHttp = require('chai-http');
const { MongoClient } = require('mongodb');
const app = require('../api/app');

const { getConnection } = require('./connectionMock');

chai.use(chaiHttp);

const { expect } = chai;

describe('GET /getall', function () {
  describe('Verifica se retorna um array de objetos com as propriedades corretas', function () {
    let connectionMock;
    let response;

    before(async function () {
      connectionMock = await getConnection();
      sinon.stub(MongoClient, 'connect')
        .resolves(connectionMock);

      await connectionMock.db('BankAccount').collection('accounts')
        .insertOne({ cpf: 14645594818, firstName: 'William', middleName: 'H.', lastName: 'Gates' });

      response = await chai.request(app)
        .get('/getAll');
    });

    after(async function () {
      MongoClient.connect.restore();
      await connectionMock.db('BankAccount').collection('accounts')
        .deleteOne({ cpf: 14645594818 });
    });

    it('retorna o código de status 200', function () {
      expect(response).to.have.status(200);
    });

    it('retorna um array', function () {
      expect(response.body).to.be.an('array');
    });

    it('O objeto contido no array contem _id, cpf, firstName, middleName, lastName, amount, token', function () {
      expect(response.body[0]).to.have.all.keys('_id', 'cpf', 'firstName', 'middleName', 'lastName', 'token');
    });
  });
});
