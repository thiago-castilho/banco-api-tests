const request = require('supertest');
const { expect } = require('chai');
require('dotenv').config();

describe('Transferências', () => {
  describe('POST /transferencias', () => {
    it('Deve retornar sucesso com 201 quando o valor da transferência for igual ou acima de R$ 10,00', async () => {
      const respostaLogin = await request(process.env.BASE_URL)
        .post('/login')
        .set('Content-Type', 'application/json')
        .send({
          'username': 'julio.lima',
          'senha': 123456
        });

      const resposta = await request(process.env.BASE_URL)
        .post('/transferencias')
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + respostaLogin.body.token)
        .send({
          contaOrigem: 1,
          contaDestino: 2,
          valor: 10,
          token: ""
        });

      expect(resposta.status).to.equal(201);
      expect(resposta.body.message).to.equal('Transferência realizada com sucesso.');
    });

    it('Deve retornar falha com 422 quando o valor da transferência for abaixo de R$ 10,00', async () => {
      const respostaLogin = await request('http://localhost:3000')
        .post('/login')
        .set('Content-Type', 'application/json')
        .send({
          'username': 'julio.lima',
          'senha': 123456
        });

      const resposta = await request('http://localhost:3000')
        .post('/transferencias')
        .set('Authorization', 'Bearer ' + respostaLogin.body.token)
        .set('Content-Type', 'application/json')
        .send({
          "contaOrigem": 2,
          "contaDestino": 1,
          "valor": 9,
          "token": ""
        });
      expect(resposta.status).to.equal(422);
      expect(resposta.body.error).to.equal('O valor da transferência deve ser maior ou igual a R$10,00.');
    });
  });
});
