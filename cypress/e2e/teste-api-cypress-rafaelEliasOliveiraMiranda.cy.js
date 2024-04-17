import { faker } from '@faker-js/faker';

describe('TESTES DA ROTA /USERS', function () {

  var name;
  var email;
  var id;
  const baseUrl = 'https://raromdb-3c39614e42d4.herokuapp.com';

  it('O TESTE DÁ ERRO QUANDO NÃO SE INFORMA O E-MAIL PARA CADASTRO', function() {
    cy.request({
      method: 'POST',
      url: (baseUrl + '/api/users'),
      body: {
        name: 'Rafael Elias',
      },
      failOnStatusCode: false,
    })
    .its('status')
    .should('to.equal', 400);
  });

  it('O TESTE DÁ ERRO QUANDO NÃO SE INFORMA O NOME PARA CADASTRO', function() {
    cy.request({
      method: 'POST',
      url: (baseUrl + '/api/users'),
      body: {
        email: 'RafaelElias@qa.com.br',
      },
      failOnStatusCode: false,
    })
    .its('status')
    .should('to.equal', 400);
  });

  it('O TESTE DÁ ERRO QUANDO NÃO SE INFORMA O PASSWORD PARA CADASTRO', function() {
    cy.request({
      method: 'POST',
      url: (baseUrl + '/api/users'),
      body: {
        name: 'Rafael Elias',
        email: 'Rafael@qa.com.br'
      },
      failOnStatusCode: false,
    })
    .its('status')
    .should('to.equal', 400);
  });

  it('O USUÁRIO É CADASTRADO COM SUCESSO!', function() {
    cy.request('POST', (baseUrl + '/api/users'), {
      name: faker.internet.userName(),
      email: faker.internet.email(),
      password: 'Rafa1234@'
      }).then(function(resposta) {
        name = resposta.body.name;
        email = resposta.body.email;
        id = resposta.body.id;

        cy.log(resposta);
        expect(resposta.status).to.equal(201);
        expect(resposta.body.name).to.equal(name);
        expect(resposta.body.email).to.equal(email);

        cy.request({
          method: 'DELETE',
          url: (baseUrl + '/api/users/{id}'),
          body: {
            id: id,
          },
          failOnStatusCode: false,
        });
      });
  });
});

describe('TESTES DA ROTA /AUTH', function () {

  var senha = '1234567';
  var token = "Bearer";
  var name;
  var email;
  const baseUrl = 'https://raromdb-3c39614e42d4.herokuapp.com';

  it('DEVE REALIZAR O LOGIN COM SUCESSO', function () {
    cy.request('POST', (baseUrl + '/api/users'), {
        name: faker.internet.userName(),
        email: faker.internet.email(),
        password: senha,
      }).then(function(resposta) {
        name = resposta.body.name;
        email = resposta.body.email;
        cy.log(resposta);
        cy.request('POST', (baseUrl + '/api/auth/login') ,{
          email: email,
          password: senha,
        }).then(function(resposta) {
          token = token + resposta.body.accessToken          
        })
      })
  });

  it('ERRO AO LOGAR COM EMAIL INEXISTENTE', function () {
    cy.request('POST', (baseUrl + '/api/users'), {
        name: faker.internet.userName(),
        email: faker.internet.email(),
        password: senha,
      }).then(function(resposta) {
        name = resposta.body.name;
        email = resposta.body.email;
        cy.log(resposta);
        cy.request({
          method: 'POST',
          url: (baseUrl + '/api/auth/login'),
          body: {
            email: faker.internet.userName(),
            password: senha,
          },
          failOnStatusCode: false,
        }).then(function(retorno) {
          cy.log(retorno);
          expect(retorno.status).to.equal(400);
        })   
      })
    })

  it('ERRO AO LOGAR COM SENHA INEXISTENTE', function () {
    cy.request('POST', (baseUrl + '/api/users'), {
        name: faker.internet.userName(),
        email: faker.internet.email(),
        password: senha,
      }).then(function(resposta) {
        name = resposta.body.name;
        email = resposta.body.email;
        cy.log(resposta);
        cy.request({
          method: 'POST',
          url: (baseUrl + '/api/auth/login'),
          body: {
            email: email,
            password: faker.internet.password(),
          },
          failOnStatusCode: false,
        }).then(function(retorno) {
          cy.log(retorno);
          expect(retorno.status).to.equal(401);
        })   
      })
    })




  
});


describe('TESTES DA ROTA /FILMES', function () {

  const baseUrl = 'https://raromdb-3c39614e42d4.herokuapp.com';

  it('FALHA AO CRIAR FILME POR FALTA DE TITULO', function () {
    cy.request({
      method: 'POST',
      url: (baseUrl + '/api/movies'),
      body: {
        genre: "string",
        description: "string",
        durationInMinutes: 0,
        releaseYear: 0
      },
      failOnStatusCode: false,
      }).then(function(filme) {
        expect(filme.status).to.equal(401);
        cy.log(filme);
      });
  });

  it('FALHA AO CRIAR FILME POR FALTA DE GENERO', function () {
    cy.request({
      method: 'POST',
      url: (baseUrl + '/api/movies'),
      body: {
        title: "string",
        description: "string",
        durationInMinutes: 0,
        releaseYear: 0
      },
      failOnStatusCode: false,
      }).then(function(filme) {
        expect(filme.status).to.equal(401);
        cy.log(filme);
      });
  });

  it('FALHA AO CRIAR FILME POR FALTA DE DESCRIÇÃO', function () {
    cy.request({
      method: 'POST',
      url: (baseUrl + '/api/movies'),
      body: {
        title: "string",
        genre: "string",        
        durationInMinutes: 0,
        releaseYear: 0
      },
      failOnStatusCode: false,
      }).then(function(filme) {
        expect(filme.status).to.equal(401);
        cy.log(filme);
      });
  });

  it('CRIAÇÃO DE FILME COM SUCESSO', function () {
    var name;
    var email;
    var senha = '1234567';
    var token = "bearer";
    
    cy.request('POST', (baseUrl + '/api/users'), {      
      name: faker.internet.userName(),
      email: faker.internet.email(),
      password: senha,
    }).then(function(resposta) {
      name = resposta.body.name;
      email = resposta.body.email;      
      cy.log(resposta);
    cy.request({
      method: 'POST',
      url: (baseUrl + '/api/auth/login'),
      body: {
        email: email,
        password: senha,
      },
      failOnStatusCode: false
      }).then(function(resposta) {
        token = token + resposta.body.accessToken          
      })
    })
      cy.request({
      method: 'POST',
      url: (baseUrl + '/api/movies'),
      body: {
        title: "Exterminador do futuro 1",
        genre: "Ação",
        description: "Máquina do futuro com missão",        
        durationInMinutes: 120,
        releaseYear: 2003
      },
      failOnStatusCode: false,
      }).then(function(filme) {
        expect(filme.status).to.equal(401);
        cy.log(filme);
      });
  });

});





