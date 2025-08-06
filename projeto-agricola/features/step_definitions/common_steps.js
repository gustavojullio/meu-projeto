const { Given } = require('@cucumber/cucumber');
const { By, until } = require('selenium-webdriver');

// Este passo assume que um usuário foi criado por um passo anterior
// A opção de timeout agora é passada como um segundo argumento, aumentando para 15 segundos
Given('eu estou logado', {timeout: 15 * 1000}, async function () {
  await this.driver.get('http://localhost:3000/login');
  
  await this.driver.findElement(By.name('email')).sendKeys(this.testUser.username);
  await this.driver.findElement(By.name('senha')).sendKeys(this.testUser.password);
  
  const button = await this.driver.findElement(By.xpath("//button[contains(text(),'Iniciar Sessão')]"));
  await button.submit();
  
  // A espera pela URL continua a mesma, mas agora tem mais tempo para ser concluída
  await this.driver.wait(until.urlContains('/servicos'), 10000); // Espera até 10s pelo redirect
});