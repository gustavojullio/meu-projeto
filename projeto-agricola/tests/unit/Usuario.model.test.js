const mongoose = require('mongoose');
const Usuario = require('../../models/Usuario');
const bcrypt = require('bcrypt');

// O setup do banco agora é global (em jest.setup.js) e foi removido daqui.

// Limpa os dados ANTES de cada teste individual para garantir isolamento.
beforeEach(async () => {
  await Usuario.deleteMany({});
});

describe('Modelo de Usuário (Testes Unitários)', () => {

  describe('Criptografia de Senha', () => {
    it('Deve criptografar a senha antes de salvar um novo usuário', async () => {
      const senhaOriginal = 'password123';
      const user = new Usuario({ username: 'test@example.com', password: senhaOriginal });
      await user.save();
      expect(user.password).not.toBe(senhaOriginal);
    });
  });

  describe('Método comparePassword', () => {
    it('Deve retornar TRUE para a senha correta', async () => {
      const senhaCorreta = 'senhaForte123';
      const user = new Usuario({ username: 'compare_true@example.com', password: senhaCorreta });
      await user.save();
      const isMatch = await user.comparePassword(senhaCorreta);
      expect(isMatch).toBe(true);
    });

    it('Deve retornar FALSE para a senha incorreta', async () => {
      const user = new Usuario({ username: 'compare_false@example.com', password: 'senhaCorreta' });
      await user.save();
      const isMatch = await user.comparePassword('senhaErrada');
      expect(isMatch).toBe(false);
    });
  });

  describe('Validações do Schema', () => {
    it('Deve falhar se o username não for fornecido', async () => {
      const user = new Usuario({ password: '123' });
      await expect(user.save()).rejects.toThrow(mongoose.Error.ValidationError);
    });

    it('Deve falhar se a senha não for fornecida', async () => {
      const user = new Usuario({ username: 'sem_senha@email.com' });
      await expect(user.save()).rejects.toThrow(mongoose.Error.ValidationError);
    });
    
    it('Deve falhar ao tentar criar usuário com username duplicado', async () => {
      const user1 = new Usuario({ username: 'duplicate@test.com', password: '123' });
      await user1.save();
      const user2 = new Usuario({ username: 'duplicate@test.com', password: '456' });
      await expect(user2.save()).rejects.toThrow(mongoose.Error.MongoServerError);
    });
  });

  describe('Hooks do Schema (Atualização e Erros)', () => {
    it('Não deve criptografar a senha novamente se ela não for modificada', async () => {
      const user = new Usuario({ username: 'test@example.com', password: 'password123' });
      await user.save();
      const passwordHash1 = user.password;
      user.username = 'test_modificado@example.com';
      await user.save();
      const passwordHash2 = user.password;
      expect(passwordHash1).toBe(passwordHash2);
    });

    it('Deve propagar o erro quando a criptografia falhar', async () => {
      jest.spyOn(bcrypt, 'genSalt').mockRejectedValueOnce(new Error('Falha na geração do salt'));
      const user = new Usuario({ username: 'error_test@example.com', password: 'password123' });
      await expect(user.save()).rejects.toThrow('Falha na geração do salt');
      bcrypt.genSalt.mockRestore();
    });
  });
});