// module.exports = {
//   testEnvironment: 'node',
//   // Aponta para os nossos novos scripts globais
//   globalSetup: './tests/globalSetup.js',
//   globalTeardown: './tests/globalTeardown.js',
//   // O setupFilesAfterEnv ainda é útil para limpar os mocks
//   setupFilesAfterEnv: ['./jest.setup.js'],
//   testTimeout: 20000, // Aumenta o timeout global
// };

module.exports = {
  testEnvironment: 'node',
  // Arquivo que inicia o banco ANTES de tudo
  globalSetup: './tests/globalSetup.js',
  // Arquivo que desliga o banco DEPOIS de tudo
  globalTeardown: './tests/globalTeardown.js',
  // Arquivo que conecta e limpa o banco para os testes
  setupFilesAfterEnv: ['./jest.setup.js'],
  testTimeout: 30000, // Aumenta o tempo limite global para evitar timeouts
};