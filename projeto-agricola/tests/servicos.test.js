const request = require('supertest');
const app = require('../app');
const Usuario = require('../models/Usuario');
const Servico = require('../models/Servico');
const mongoose = require('mongoose');

// =======================================================
// Bloco 1: Testes com usuário AUTENTICADO (Caminho Feliz)
// =======================================================
describe('Rotas de Serviços (Autenticado)', () => {
  let agent, testUser, testService;

  beforeEach(async () => {
    testUser = new Usuario({ username: 'produtor_logado@email.com', password: 'senha123' });
    await testUser.save();
    testService = new Servico({ proprietario: testUser._id, data: new Date(), talhao: 'Talhão Principal', servico_tipo: ['poda'], valor_servico: 150, trabalhadores: [{ nome: 'Funcionario A' }] });
    await testService.save();
    agent = request.agent(app);
    await agent.post('/login').send({ email: 'produtor_logado@email.com', senha: 'senha123' });
  });

  test('GET /servicos - Deve retornar a lista de serviços', async () => {
    const response = await agent.get('/servicos');
    expect(response.statusCode).toBe(200);
    expect(response.text).toContain('Talhão Principal');
  });
  
  test('GET /adicionar-servico - Deve renderizar a página de adicionar serviço', async () => {
    const response = await agent.get('/adicionar-servico');
    expect(response.statusCode).toBe(200);
    expect(response.text).toContain('Adicionar Novos Serviços');
  });
  
  test('POST /adicionar-servico - Deve criar um novo serviço com todos os dados', async () => {
    const servicoData = { servicos: [{ data: '2025-08-15', talhao: 'Talhão Novo', servico_tipo: ['rocada'], valor_servico: 200, produtos: [{ nome: 'Produto Teste' }], trabalhadores: [{ nome: 'Trabalhador Teste' }] }]};
    const response = await agent.post('/adicionar-servico').send(servicoData);
    expect(response.statusCode).toBe(302);
    expect(response.headers.location).toBe('/servicos');
  });

  test('POST /adicionar-servico - Deve criar um serviço SEM a chave produtos', async () => {
    const servicoData = { servicos: [{ data: '2025-08-16', talhao: 'Talhão Vazio', servico_tipo: ['limpeza'], valor_servico: 50, trabalhadores: [{ nome: 'Trabalhador B' }] }]};
    const response = await agent.post('/adicionar-servico').send(servicoData);
    expect(response.statusCode).toBe(302);
    const servicoCriado = await Servico.findOne({ talhao: 'Talhão Vazio' });
    expect(servicoCriado).not.toBeNull();
  });

  test('GET /detalhes/:id - Deve mostrar detalhes de um serviço', async () => {
    const response = await agent.get(`/detalhes/${testService._id}`);
    expect(response.statusCode).toBe(200);
    expect(response.text).toContain('Talhão Principal');
  });

  test('GET /editar/:id - Deve mostrar a página de edição', async () => {
    const response = await agent.get(`/editar/${testService._id}`);
    expect(response.statusCode).toBe(200);
    expect(response.text).toContain('Editar Serviço');
  });

  test('POST /editar/:id - Deve atualizar um serviço', async () => {
    const dadosAtualizados = { servicos: [{ ...testService.toObject(), talhao: 'Talhão Editado' }] };
    const response = await agent.post(`/editar/${testService._id}`).send(dadosAtualizados);
    expect(response.statusCode).toBe(302);
    expect(response.headers.location).toBe(`/detalhes/${testService._id}`);
  });
  
  test('POST /editar/:id - Deve atualizar com múltiplos nomes de trabalhadores', async () => {
    const dadosAtualizados = { 
      servicos: [{ 
        ...testService.toObject(), 
        trabalhadores: [{ nome: ['João', 'Maria'] }] 
      }] 
    };
    const response = await agent.post(`/editar/${testService._id}`).send(dadosAtualizados);
    expect(response.statusCode).toBe(302);
    const servicoAtualizado = await Servico.findById(testService._id);
    expect(servicoAtualizado.trabalhadores.length).toBe(2);
  });

  test('POST /editar/:id - Deve atualizar um serviço removendo produtos', async () => {
    const dadosAtualizados = { servicos: [{ ...testService.toObject(), produtos: null }] };
    const response = await agent.post(`/editar/${testService._id}`).send(dadosAtualizados);
    expect(response.statusCode).toBe(302);
  });

  test('POST /excluir/:id - Deve excluir um serviço', async () => {
    const response = await agent.post(`/excluir/${testService._id}`);
    expect(response.statusCode).toBe(302);
    expect(response.headers.location).toBe('/servicos');
  });
});

// =======================================================
// Bloco 2: Testes sem autenticação (Segurança)
// =======================================================
describe('Rotas de Serviços (Não Autenticado)', () => {
  test('GET /servicos - Deve redirecionar para /login', async () => {
    const response = await request(app).get('/servicos');
    expect(response.statusCode).toBe(302);
    expect(response.headers.location).toBe('/login');
  });
  test('GET /adicionar-servico - Deve redirecionar para /login', async () => {
    const response = await request(app).get('/adicionar-servico');
    expect(response.statusCode).toBe(302);
    expect(response.headers.location).toBe('/login');
  });
});

// =======================================================
// Bloco 3: Testes para cenários de erro e cobertura final
// =======================================================
describe('Rotas de Serviços (Cenários de Erro e Cobertura)', () => {
  let agent, testUser;
  
  let originalConsoleError;
  beforeAll(() => { originalConsoleError = console.error; console.error = jest.fn(); });
  afterAll(() => { console.error = originalConsoleError; });

  beforeEach(async () => {
    testUser = new Usuario({ username: 'produtor_logado@email.com', password: 'senha123' });
    await testUser.save();
    agent = request.agent(app);
    await agent.post('/login').send({ email: 'produtor_logado@email.com', senha: 'senha123' });
  });

  test('GET /detalhes/:id - Deve redirecionar se o serviço não for encontrado', async () => {
    const idInexistente = new mongoose.Types.ObjectId();
    const response = await agent.get(`/detalhes/${idInexistente}`);
    expect(response.statusCode).toBe(302);
  });

  test('GET /detalhes/:id - Deve lidar com erro de banco', async () => {
    jest.spyOn(Servico, 'findOne').mockRejectedValue(new Error('Erro de banco'));
    const response = await agent.get(`/detalhes/qualquerId`);
    expect(response.statusCode).toBe(500);
  });

  test('GET /servicos - Deve lidar com erro de banco', async () => {
    jest.spyOn(Servico, 'find').mockReturnValue({
      sort: jest.fn().mockRejectedValue(new Error('Erro de banco'))
    });
    const response = await agent.get('/servicos');
    expect(response.statusCode).toBe(500);
  });
  
  test('POST /adicionar-servico - Deve redirecionar se o corpo for vazio', async () => {
    const response = await agent.post('/adicionar-servico').send({});
    expect(response.statusCode).toBe(302);
  });
  
  test('POST /adicionar-servico - Deve lidar com erro de banco', async () => {
    jest.spyOn(Servico.prototype, 'save').mockRejectedValue(new Error('Erro de banco'));
    const servicoData = { servicos: [{ data: '2025-08-15', talhao: 'Talhão Novo', servico_tipo: ['rocada'], valor_servico: 1, trabalhadores: [{nome: 'a'}] }]};
    const response = await agent.post('/adicionar-servico').send(servicoData);
    expect(response.statusCode).toBe(302);
    expect(response.headers.location).toBe('/adicionar-servico?error=true');
  });
  
  test('GET /editar/:id - Deve redirecionar se o serviço não for encontrado', async () => {
    const idInexistente = new mongoose.Types.ObjectId();
    const response = await agent.get(`/editar/${idInexistente}`);
    expect(response.statusCode).toBe(302);
  });

  test('GET /editar/:id - Deve lidar com erro de banco', async () => {
    jest.spyOn(Servico, 'findOne').mockRejectedValue(new Error('Erro de banco'));
    const response = await agent.get(`/editar/qualquerId`);
    expect(response.statusCode).toBe(500);
  });

  test('POST /editar/:id - Deve retornar 404 se o serviço não for encontrado', async () => {
    const idInexistente = new mongoose.Types.ObjectId();
    // Envia um corpo de requisição completo e válido para não falhar na validação
    const dadosValidos = { 
      servicos: [{ 
        data: new Date(),
        talhao: 'Inexistente',
        servico_tipo: ['inexistente'],
        valor_servico: 1,
        trabalhadores: [{ nome: 'Inexistente' }]
      }]
    };
    const response = await agent.post(`/editar/${idInexistente}`).send(dadosValidos);
    expect(response.statusCode).toBe(404);
  });
  
  test('POST /editar/:id - Deve lidar com erro de banco', async () => {
    const service = new Servico({ proprietario: testUser._id, data: new Date(), talhao: 'Qualquer', servico_tipo: ['a'], valor_servico: 1, trabalhadores: [{nome: 'a'}] });
    await service.save();
    jest.spyOn(Servico, 'findOneAndUpdate').mockRejectedValue(new Error('Erro de banco'));
    const response = await agent.post(`/editar/${service._id}`).send({ servicos: [{ talhao: 'Editado' }] });
    expect(response.statusCode).toBe(302);
    expect(response.headers.location).toBe(`/editar/${service._id}?error=true`);
  });

  test('POST /excluir/:id - Deve redirecionar se o serviço não for encontrado', async () => {
    const idInexistente = new mongoose.Types.ObjectId();
    const response = await agent.post(`/excluir/${idInexistente}`);
    expect(response.statusCode).toBe(302);
  });

  test('POST /excluir/:id - Deve lidar com erro de banco', async () => {
    const service = new Servico({ proprietario: testUser._id, data: new Date(), talhao: 'Qualquer', servico_tipo: ['a'], valor_servico: 1, trabalhadores: [{nome: 'a'}] });
    await service.save();
    jest.spyOn(Servico, 'findOneAndDelete').mockRejectedValue(new Error('Erro de banco'));
    const response = await agent.post(`/excluir/${service._id}`);
    expect(response.statusCode).toBe(500);
  });

});