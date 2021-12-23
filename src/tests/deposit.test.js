/* eslint-disable max-len */
const chai = require('chai');
const sinon = require('sinon');
const chaiHttp = require('chai-http');
const { MongoClient } = require('mongodb');
const app = require('../api/app');

const { getConnection } = require('./connectionMock');

chai.use(chaiHttp);

const { expect } = chai;

describe('PATCH /deposit', function () {
  describe('Verifica a inserção com cpf que nao contem no banco de dados', function () {
    let connectionMock;
    let response;

    before(async function () {
      connectionMock = await getConnection();
      sinon.stub(MongoClient, 'connect')
        .resolves(connectionMock);

      await connectionMock.db('BankAccount').collection('accounts')
        .insertOne({ cpf: 14645594818, firstName: 'William', middleName: 'H.', lastName: 'Gates' });

      response = await chai.request(app)
      .patch('/deposit')
      .send({ cpf: 43315699003, amount: 1800 });
    });

    after(async function () {
      MongoClient.connect.restore();
      await connectionMock.db('BankAccount').collection('accounts')
        .deleteOne({ cpf: 14645594818 });
    });

    it('retorna o código de status 404', function () {
      expect(response).to.have.status(404);
    });

    it('retorna um objeto', function () {
      expect(response.body).to.be.an('object');
    });

    it('O objeto contido no array contem o campo "message"', function () {
      expect(response.body).to.have.a.property('message');
    });

    it('a mensagem contida no objeto está correta', function () {
      expect(response.body.message).to.be.equal('Account does not exist');
    });
  });

  describe('Verifica a inserção com cpf invalido', function () {
    let response;

    before(async function () {
      response = await chai.request(app)
      .patch('/deposit')
      .send({ cpf: 43315693053, amount: 1800 });
    });

    it('retorna o código de status 400', function () {
      expect(response).to.have.status(400);
    });

    it('retorna um objeto', function () {
      expect(response.body).to.be.an('object');
    });

    it('O objeto contido no array contem o campo "message"', function () {
      expect(response.body).to.have.a.property('message');
    });

    it('a mensagem contida no objeto está correta', function () {
      expect(response.body.message).to.be.equal('Cpf Inválido');
    });
  });

  describe('Verifica a inserção de quandidade incorreta', function () {
    let connectionMock;
    let response;

    before(async function () {
      connectionMock = await getConnection();
      sinon.stub(MongoClient, 'connect')
        .resolves(connectionMock);

      await connectionMock.db('BankAccount').collection('accounts')
        .insertOne({ cpf: 25378106869, firstName: 'Jose', middleName: 'H.', lastName: 'Maria' });
    });

    after(async function () {
      MongoClient.connect.restore();
      await connectionMock.db('BankAccount').collection('accounts')
        .deleteOne({ cpf: 25378106869 });
    });

    describe('Inserindo valor não permitido acima de R$2000', function () {
      before(async function () {
        response = await chai.request(app)
          .patch('/deposit')
          .send({ cpf: 43315699003, amount: 3050 });
      });

      it('Verifica se recebe um objeto', async function () {
        expect(response.body).to.be.an('Object');       
      });

      it('O objeto tenha a chave "message"', function () {
        expect(response.body).to.have.a.property('message');
      });

      it('a propriedade "message" retorne a menssagem correta', function () {
        expect(response.body.message).to.equal('Dados inválidos');
      });
    });

    describe('Inserindo valor não permitido menor ou igual a zero', function () {
      before(async function () {
        response = await chai.request(app)
          .patch('/deposit')
          .send({ cpf: 43315699003, amount: 0 });
      });

      it('Verifica se recebe um objeto', async function () {
        expect(response.body).to.be.an('Object');       
      });

      it('O objeto tenha a chave "message"', function () {
        expect(response.body).to.have.a.property('message');
      });

      it('a propriedade "message" retorne a menssagem correta', function () {
        expect(response.body.message).to.equal('Dados inválidos');
      });
    });
  });
});
