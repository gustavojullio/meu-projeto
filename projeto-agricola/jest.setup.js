const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

// Antes de TODOS os testes, inicia o banco em memória e conecta o Mongoose a ele
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

// Depois de TODOS os testes, desconecta e para o banco
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

// Antes de CADA teste individual, limpa todas as coleções do banco
beforeEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

// DEPOIS de CADA teste individual, restaura todos os mocks
// ESTA É A LINHA MAIS IMPORTANTE QUE FALTAVA
afterEach(() => {
  jest.restoreAllMocks();
});