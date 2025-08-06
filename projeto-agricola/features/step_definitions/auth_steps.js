const { Given, When, Then } = require('@cucumber/cucumber');
const { By, until } = require('selenium-webdriver');
const { expect } = require('chai');
const Usuario = require('../../models/Usuario');

// Passos "Dado" (Given) e "Quando" (When) não mudam
Given('que existe um produtor de teste cadastrado', async function () {
  const user = new Usuario({ username: this.testUser.username, password: this.testUser.password });
  await user.save();
});

Given('eu estou na página de login', async function () {
  await this.driver.get('http://localhost:3000/login');
});

When('eu preencho o campo {string} com {string}', async function (fieldName, value) {
  const input = await this.driver.findElement(By.name(fieldName));
  await input.sendKeys(value);
});

When('eu clico no botão {string}', async function (buttonText) {
  const button = await this.driver.findElement(By.xpath(`//button[contains(text(),'${buttonText}')]`));
  await button.submit();
});

// Passos "Então" (Then) - O último foi aprimorado
Then('eu devo ser redirecionado para a página de serviços', async function () {
  await this.driver.wait(until.urlContains('/servicos'), 5000);
  const currentUrl = await this.driver.getCurrentUrl();
  expect(currentUrl).to.include('/servicos');
});

Then('eu devo ver o texto {string} na página', async function (text) {
  const body = await this.driver.findElement(By.tagName('body'));
  await this.driver.wait(until.elementTextContains(body, text), 5000);
  const pageSource = await body.getText();
  expect(pageSource).to.include(text);
});

Then('eu devo continuar na página de login', async function () {
  await this.driver.wait(until.urlContains('/login'), 5000);
  const currentUrl = await this.driver.getCurrentUrl();
  expect(currentUrl).to.include('/login');
});

// ======================= ESTE PASSO FOI CORRIGIDO =======================
Then('eu devo ver a mensagem de erro {string}', async function (errorMessage) {
  // 1. Define o seletor para encontrar a mensagem de erro
  const errorSelector = By.css('.error-message');
  
  // 2. Espera explicitamente até que o elemento com a mensagem esteja visível na página
  await this.driver.wait(until.elementIsVisible(this.driver.findElement(errorSelector)), 5000);
  
  // 3. Pega o texto e o compara
  const errorElement = await this.driver.findElement(errorSelector);
  const text = await errorElement.getText();
  expect(text).to.equal(errorMessage);
});
// ======================================================================