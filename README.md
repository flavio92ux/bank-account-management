OVERVIEW

Projeto de **backend** criado com um **API REST** com algumas **funções essenciais relacionadas** ao **gerenciamento de contas bancárias** em linguagem **Node.js**

REQUISITOS

- Bash (Unix);
- NodeJs versão 13 ou superior;
- Mongodb;

PASSO A PASSO PARA EXECUÇÃO DO PROJETO

- Clone o repositório e entre no diretorio raiz
- execute **npm install** no terminal para instalar as dependências;
- execute **npm start** para inicializar o projeto;
- execute **npm test** para rodar os testes automatizados;
- Rotas GET, POST E PATCH estão encontradas no arquivo src/api/app.js;

CAMADAS DO PROJETO

Esse projeto segue a metodologias de camadas MSC (model, service e controller).
   - A camada de model contem os arquivos responsáveis para fazer a conexão com o banco de dados, que no nosso caso é o mongoDB.
   - A camada service é a responsável de tratar as regras de negócio da aplicação, como por exemplo verificar se um ID existe no banco de dados. Normalmente essas regras de negócio estão vinculadas ao banco de dados.
   - A camada de controller filtra a entrada e saida de dados da nossa aplicação, sendo esses dados recebidos enviados ao service, que por sua ve envia ao model.

ROTAS DO PROJETO


- Rota tipo GET de endereço http://localhost:3001/ que retorna todos os usuários cadastrados no banco de dados
- Rota tipo GET de endereço http://localhost:3001/:id que retorna dados do usuário <:id> no banco de dados
- Rota tipo POST de endereço http://localhost:3001/createAccount que recebe no body os parametros { cpf, firstName, lastName, middleName } retorna o token de acesso do usuário.
- Rota tipo PATCH de endereço http://localhost:3001/deposit que recebe no body os parametros { cpf, amount } é responsável para depositar um valor monetario em uma conta especifica, que no caso é o cpf de destino (parametro recebido no body).
- Rota do tipo PATCH de endereço http://localhost:3001/transfer que recebe no body como parametros { cpfTo, quantityToTransfer } e no header { Authorization: token } transfere valor monetário de uma conta para outra, sendo a conta de origem a conta do token e a conta destino o cpf informado no body.

**Os detalhes das condições dos parâmetros estão deralhados no histórico de testes da aplicação**
    
