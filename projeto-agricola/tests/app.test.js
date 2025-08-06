const request = require('supertest');
const app = require('../app');

describe('Testes do App Principal e Rotas Abertas', () => {
  test('GET / - Deve renderizar a página inicial', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
    expect(response.text).toContain('</html>');
  });

  test('GET /login - Deve renderizar a página de login', async () => {
    const response = await request(app).get('/login');
    expect(response.statusCode).toBe(200);
    expect(response.text).toContain('Conta');
  });
  
  test('GET /registrar - Deve renderizar a página de registro', async () => {
    const response = await request(app).get('/registrar');
    expect(response.statusCode).toBe(200);
    expect(response.text).toContain('Registrar Novo Produtor');
  });

  test('GET /rota-inexistente - Deve retornar 404', async () => {
    const response = await request(app).get('/uma-rota-que-nao-existe');
    expect(response.statusCode).toBe(404);
  });
});