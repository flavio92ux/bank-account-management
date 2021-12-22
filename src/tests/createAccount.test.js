const chai = require('chai');
const sinon = require('sinon');
const chaiHttp = require('chai-http');
const { MongoClient } = require('mongodb');
const app = require('../api/app');

const { getConnection } = require('./connectionMock');

chai.use(chaiHttp);

const { expect } = chai;

describe('POST /createAccount', function () {
  describe('Quando os campos cpf, firstName ou lastName não são informados:', function () {
    let response;

    before(async function () {
      response = await chai.request(app).post('/createAccount').send({});
    });

    it('retorna o código de status 400', function () {
      expect(response).to.have.status(400);
    });

    it('retorna um objeto no body', function () {
      expect(response.body).to.be.an('object');
    });

    it('o objeto de resposta tem a proproedade "message"', function () {
      expect(response.body).to.have.a.property('message');
    });

    it('a propriedade "message" possui a mensagem de erro adequada', function () {
      expect(response.body.message).to.be.equal('Dados inválidos');
    });
  });

  describe('Quando o usuário tenta cadastrar um CPF que já existe no banco', function () {
    let connectionMock;
    let response;

    before(async function () {
      connectionMock = await getConnection();
      sinon.stub(MongoClient, 'connect')
        .resolves(connectionMock);

      await connectionMock.db('BankAccount').collection('accounts')
        .insertOne({ cpf: 14645594818, firstName: 'William', middleName: 'H.', lastName: 'Gates' });

      response = await chai.request(app)
        .post('/createAccount')
        .send({ cpf: 14645594818, firstName: 'William', middleName: 'H.', lastName: 'Gates' });
    });

    after(async function () {
      MongoClient.connect.restore();
      await connectionMock.db('BankAccount').collection('accounts')
        .deleteOne({ cpf: 14645594818 });
    });

    it('retorna o código de status 409', function () {
      expect(response).to.have.status(409);
    });

    it('retorna um objeto no body', function () {
      expect(response.body).to.be.an('object');
    });

    it('o objeto de resposta tem a proproedade "message"', function () {
      expect(response.body).to.have.a.property('message');
    });

    it('a propriedade "message" possui a msg de erro adequada', function () {
      expect(response.body.message).to.be.equal('CPF already exist');
    });
  });

  describe('Quando o usuário é cadastrado com sucesso', function () {
    let connectionMock;
    let response;

    before(async function () {
      connectionMock = await getConnection();
      sinon.stub(MongoClient, 'connect')
        .resolves(connectionMock);

      response = await chai.request(app)
        .post('/createAccount')
        .send({ cpf: 14645594818, firstName: 'William', middleName: 'H.', lastName: 'Gates' });
    });

    after(function () {
      MongoClient.connect.restore();
    });

    it('retorna o código de status 201', function () {
      expect(response).to.have.status(201);
    });

    it('retorna um objeto no body', function () {
      expect(response.body).to.be.an('object');
    });

    it('o objeto de resposta tem a propriedade "token"', function () {
      expect(response.body).to.have.a.property('token');
    });
  });

  describe('Quando for inserido um numero invalido de CPF', function () {
    let connectionMock;
    let response;

    before(async function () {
      connectionMock = await getConnection();
      sinon.stub(MongoClient, 'connect')
        .resolves(connectionMock);

      response = await chai.request(app)
        .post('/createAccount')
        .send({ cpf: 17162437626, firstName: 'William', middleName: 'H.', lastName: 'Gates' });
    });

    after(function () {
      MongoClient.connect.restore();
    });

    it('retorna o código de status 400', function () {
      expect(response).to.have.status(400);
    });

    it('retorna um objeto no body', function () {
      expect(response.body).to.be.an('object');
    });

    it('o objeto de resposta tem a propriedade "message"', function () {
      expect(response.body).to.have.a.property('message');
    });

    it('a propriedade "message" possui a msg de erro adequada', function () {
      expect(response.body.message).to.be.equal('Cpf Inválido');
    });
  });
});
