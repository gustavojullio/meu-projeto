// const { setWorldConstructor, Before, After } = require('@cucumber/cucumber');
// const { Builder } = require('selenium-webdriver');
// const chrome = require('selenium-webdriver/chrome');
// const mongoose = require('mongoose');
// const Usuario = require('../../models/Usuario');

// class CustomWorld {
//   constructor() {
//     // REMOVEMOS A OPÇÃO '--headless'
//     // Agora uma janela do Chrome irá abrir quando você rodar 'npm test'
//     this.driver = new Builder()
//       .forBrowser('chrome')
//       .build();
      
//     this.testUser = {
//       username: 'produtor_teste@email.com',
//       password: 'senha123'
//     };
//   }
// }

// setWorldConstructor(CustomWorld);

// Before(async function () {
//   if (mongoose.connection.readyState === 0) {
//     // Opções de conexão atualizadas para remover warnings
//     await mongoose.connect('mongodb://localhost:27017/agricola_teste');
//   }
//   await Usuario.deleteOne({ username: this.testUser.username });
// });

// After(async function () {
//   await Usuario.deleteOne({ username: this.testUser.username });
//   await this.driver.quit();
// });

const { setWorldConstructor, Before, After } = require('@cucumber/cucumber');
const { Builder } = require('selenium-webdriver');
const mongoose = require('mongoose');
const Usuario = require('../../models/Usuario');

class CustomWorld {
  constructor() {
    // CORREÇÃO: Removidas as opções de headless.
    // Agora uma janela do Chrome irá abrir.
    this.driver = new Builder()
      .forBrowser('chrome')
      .build();
      
    this.testUser = {
      username: 'produtor_teste@email.com',
      password: 'senha123'
    };
  }
}

setWorldConstructor(CustomWorld);

Before(async function () {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect('mongodb://localhost:27017/agricola_teste');
  }
  await Usuario.deleteOne({ username: this.testUser.username });
});

After(async function () {
  await Usuario.deleteOne({ username: this.testUser.username });
  await this.driver.quit();
});