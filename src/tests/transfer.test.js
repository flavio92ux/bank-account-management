/* eslint-disable sonarjs/no-duplicate-string */
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

  describe('Verifica que não é possivel transferir uma quantidade maior que o saldo disponivel', function () {
    let response;
    before(async function () {
      const { body: { token } } = responseBill;
      response = await chai.request(app)
        .patch('/transfer')
        .set({ Authorization: token })
        .send({ cpfTo: 35548165070, quantityToTransfer: 2000 });
    });

    it('Verifica se foi recebido um status 400', async function () {
      expect(response).to.have.status(400);
    });

    it('retorna um objeto', function () {
      expect(response.body).to.be.an('object');
    });

    it('Espera que o objeto contenha a key message', function () {
      expect(response.body).to.have.a.property('message');
    });

    it('a mensagem contida no objeto está correta', function () {
      expect(response.body.message).to.be.equal('insufficient funds');
    });
  });

  describe('Verifica que não é possivel transferir saldo para conta inexistente', function () {
    let response;
    describe('Com CPF inválido', function () {
      before(async function () {
        const { body: { token } } = responseBill;
        response = await chai.request(app)
          .patch('/transfer')
          .set({ Authorization: token })
          .send({ cpfTo: 35548165071, quantityToTransfer: 2000 });
      });
  
      it('Verifica se foi recebido um status 400', async function () {
        expect(response).to.have.status(400);
      });
  
      it('retorna um objeto', function () {
        expect(response.body).to.be.an('object');
      });
  
      it('Espera que o objeto contenha a key message', function () {
        expect(response.body).to.have.a.property('message');
      });
  
      it('a mensagem contida no objeto está correta', function () {
        expect(response.body.message).to.be.equal('Cpf Inválido');
      });
    });

    describe('Para um CPF Válido mas sem conta', function () {
      before(async function () {
        const { body: { token } } = responseBill;
        response = await chai.request(app)
          .patch('/transfer')
          .set({ Authorization: token })
          .send({ cpfTo: 84449834038, quantityToTransfer: 200 });
      });
  
      it('Verifica se foi recebido um status 404', async function () {
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

    describe('Fazer a transferencia para a mesma conta', function () {
      before(async function () {
        const { body: { token } } = responseBill;
        response = await chai.request(app)
          .patch('/transfer')
          .set({ Authorization: token })
          .send({ cpfTo: 36212043000, quantityToTransfer: 200 });
      });
  
      it('Verifica se foi recebido um status 409', async function () {
        expect(response).to.have.status(409);
      });
  
      it('retorna um objeto', function () {
        expect(response.body).to.be.an('object');
      });
  
      it('Espera que o objeto contenha a key message', function () {
        expect(response.body).to.have.a.property('message');
      });
  
      it('a mensagem contida no objeto está correta', function () {
        expect(response.body.message).to.be.equal('it is not possible to transfer to the same account.');
      });
    });

    describe('Fazer a transferencia com token invalido ou inexistente', function () {
      describe('Com token inválido', function () {
        before(async function () {
          response = await chai.request(app)
            .patch('/transfer')
            .set({ Authorization: 'xxx' })
            .send({ cpfTo: 36212043000, quantityToTransfer: 200 });
        });
    
        it('Verifica se foi recebido um status 400', async function () {
          expect(response).to.have.status(400);
        });
    
        it('retorna um objeto', function () {
          expect(response.body).to.be.an('object');
        });
    
        it('Espera que o objeto contenha a key message', function () {
          expect(response.body).to.have.a.property('message');
        });
    
        it('a mensagem contida no objeto está correta', function () {
          expect(response.body.message).to.be.equal('JWT Malformed');
        });
      });

      describe('Com token inexistente', function () {
        before(async function () {
          response = await chai.request(app)
            .patch('/transfer')
            .send({ cpfTo: 36212043000, quantityToTransfer: 200 });
        });
    
        it('Verifica se foi recebido um status 401', async function () {
          expect(response).to.have.status(401);
        });
    
        it('retorna um objeto', function () {
          expect(response.body).to.be.an('object');
        });
    
        it('Espera que o objeto contenha a key message', function () {
          expect(response.body).to.have.a.property('message');
        });
    
        it('a mensagem contida no objeto está correta', function () {
          expect(response.body.message).to.be.equal('missing auth token');
        });
      });
    });
  });
});
