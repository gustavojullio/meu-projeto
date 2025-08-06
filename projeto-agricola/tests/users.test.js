const request = require('supertest');
const app = require('../app');

describe('Rotas de Usuários', () => {
  test('GET /users - Deve responder com uma mensagem padrão', async () => {
    const response = await request(app).get('/users');
    
    expect(response.statusCode).toBe(200);
    expect(response.text).toBe('respond with a resource');
  });
});