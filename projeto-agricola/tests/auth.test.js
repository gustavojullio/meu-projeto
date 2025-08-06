const request = require('supertest');
const app = require('../app');
const Usuario = require('../models/Usuario');
const bcrypt = require('bcrypt');

describe('Rotas de Autenticação', () => {
  test('POST /registrar - Deve criar um novo usuário', async () => {
    const response = await request(app).post('/registrar').send({ username: 'novo_usuario@email.com', password: 'senha_forte' });
    expect(response.statusCode).toBe(302);
    expect(response.headers.location).toBe('/login');
  });

  test('POST /login - Deve autenticar com sucesso', async () => {
    const user = new Usuario({ username: 'usuario_existente@email.com', password: 'senha123' });
    await user.save();
    const response = await request(app).post('/login').send({ email: 'usuario_existente@email.com', senha: 'senha123' });
    expect(response.statusCode).toBe(302);
    expect(response.headers.location).toBe('/servicos');
  });

  test('POST /login - Deve falhar com senha incorreta', async () => {
    const user = new Usuario({ username: 'usuario_existente@email.com', password: 'senha123' });
    await user.save();
    const response = await request(app).post('/login').send({ email: 'usuario_existente@email.com', senha: 'senha_errada' });
    expect(response.statusCode).toBe(302);
    expect(response.headers.location).toBe('/login');
  });
  
  test('POST /login - Deve redirecionar se o usuário não existir', async () => {
    const response = await request(app).post('/login').send({ email: 'nao_existe@email.com', senha: '123' });
    expect(response.statusCode).toBe(302);
    expect(response.headers.location).toBe('/login');
  });

  test('POST /registrar - Deve redirecionar em caso de erro', async () => {
    jest.spyOn(Usuario.prototype, 'save').mockRejectedValue(new Error('Erro de banco'));
    const response = await request(app).post('/registrar').send({ username: 'usuario_com_erro@email.com', password: 'senha123' });
    expect(response.statusCode).toBe(302);
    expect(response.headers.location).toBe('/registrar?error=true');
  });

  test('POST /login - Deve lidar com erro de banco', async () => {
    jest.spyOn(Usuario, 'findOne').mockRejectedValue(new Error('Erro de banco'));
    const response = await request(app).post('/login').send({ email: 'qualquer@email.com', senha: '123' });
    expect(response.statusCode).toBe(302);
    expect(response.headers.location).toContain('/login');
  });

  test('Deve cobrir a linha "isModified" ao salvar sem alterar a senha', async () => {
    const user = new Usuario({ username: 'update_user@email.com', password: 'senha123' });
    await user.save();
    user.username = 'update_user_editado@email.com';
    await user.save();
    const updatedUser = await Usuario.findById(user._id);
    expect(updatedUser.username).toBe('update_user_editado@email.com');
  });
  
  // Teste para o 'catch' block do bcrypt no modelo Usuario
  test('Deve lidar com erro na criptografia da senha', async () => {
    jest.spyOn(bcrypt, 'hash').mockRejectedValue(new Error('Erro de criptografia'));

    await expect(new Usuario({ username: 'bcrypt_error@email.com', password: '123' }).save())
      .rejects.toThrow('Erro de criptografia');
  });
});