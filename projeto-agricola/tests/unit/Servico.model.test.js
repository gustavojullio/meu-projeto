const mongoose = require('mongoose');
const Servico = require('../../models/Servico');

// O setup do banco agora é global e foi removido daqui.

beforeEach(async () => {
  await Servico.deleteMany({});
});

describe('Modelo de Serviço (Testes Unitários)', () => {

  describe('Validações do Schema', () => {
    // Função auxiliar para criar um serviço válido com todos os campos obrigatórios
    const criarServicoValido = () => ({
      proprietario: new mongoose.Types.ObjectId(),
      data: new Date(),
      talhao: 'Talhão Teste',
      servico_tipo: ['teste'],
      valor_servico: 100,
      trabalhadores: [{ nome: 'João' }]
    });

    it('Deve salvar um serviço com todos os campos obrigatórios', async () => {
      const servicoValido = new Servico(criarServicoValido());
      await expect(servicoValido.save()).resolves.toBeDefined();
    });

    it('Deve falhar se o campo "proprietario" não for fornecido', async () => {
      const dados = criarServicoValido();
      delete dados.proprietario;
      const servicoInvalido = new Servico(dados);
      await expect(servicoInvalido.save()).rejects.toThrow(mongoose.Error.ValidationError);
    });
    
    it('Deve falhar se o campo "talhao" não for fornecido', async () => {
      const dados = criarServicoValido();
      delete dados.talhao;
      const servicoInvalido = new Servico(dados);
      await expect(servicoInvalido.save()).rejects.toThrow(mongoose.Error.ValidationError);
    });

    it('Deve falhar se o array "servico_tipo" estiver vazio', async () => {
      const dados = criarServicoValido();
      dados.servico_tipo = [];
      const servicoInvalido = new Servico(dados);
      await expect(servicoInvalido.save()).rejects.toThrow(mongoose.Error.ValidationError);
    });

    it('Deve falhar se o campo "valor_servico" não for fornecido', async () => {
      const dados = criarServicoValido();
      delete dados.valor_servico;
      const servicoInvalido = new Servico(dados);
      await expect(servicoInvalido.save()).rejects.toThrow(mongoose.Error.ValidationError);
    });
    
    it('Deve falhar se o array "trabalhadores" estiver vazio', async () => {
      const dados = criarServicoValido();
      dados.trabalhadores = [];
      const servicoInvalido = new Servico(dados);
      await expect(servicoInvalido.save()).rejects.toThrow(mongoose.Error.ValidationError);
    });
  });
});