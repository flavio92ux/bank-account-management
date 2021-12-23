/* eslint-disable max-len */
const chai = require('chai');
const sinon = require('sinon');
const chaiHttp = require('chai-http');
const { MongoClient } = require('mongodb');
const app = require('../api/app');

const { getConnection } = require('./connectionMock');

chai.use(chaiHttp);

const { expect } = chai;

const CPF_WILLIAM = 14645594818;
const UNKNOWN_CPF = 14645594812;

describe('GET /getByCpf', function () {
  describe('Para o caso de encontrar um objeto com sucesso', function () {
    let connectionMock;
    let response;

    before(async function () {
      connectionMock = await getConnection();
      sinon.stub(MongoClient, 'connect')
        .resolves(connectionMock);

      await connectionMock.db('BankAccount').collection('accounts')
        .insertOne({ cpf: CPF_WILLIAM, firstName: 'William', middleName: 'H.', lastName: 'Gates' });
    });

    after(async function () {
      MongoClient.connect.restore();
      await connectionMock.db('BankAccount').collection('accounts')
        .deleteOne({ cpf: CPF_WILLIAM });
    });

    describe('Para o caso de encontrar um objeto com sucesso', function () {
      before(async function () {
        response = await chai.request(app)
        .get(`/${CPF_WILLIAM}`);
      });

      it('retorna o código de status 200', function () {
        expect(response).to.have.status(200);
      });
  
      it('retorna um objeto', function () {
        expect(response.body).to.be.an('object');
      });
  
      it('O objeto contem as chaves _id, cpf, firstName, middleName, lastName, amount', function () {
        expect(response.body).to.have.all.keys('_id', 'cpf', 'firstName', 'middleName', 'lastName');
      });
    });

    describe('Se não encontrar um objeto', function () {
      before(async function () {
        response = await chai.request(app)
        .get(`/${UNKNOWN_CPF}`);
      });

      it('retorna o código de status 404', function () {
        expect(response).to.have.status(404);
      });
  
      it('retorna um objeto', function () {
        expect(response.body).to.be.an('object');
      });
  
      it('Espera que o objeto contenha a key message', function () {
        expect(response.body).to.have.a.property('message');
      });

      it('a mensagem contida no objeto está correta', function () {
        expect(response.body.message).to.be.equal('Account does not exist');
      });
    });
  });
});
