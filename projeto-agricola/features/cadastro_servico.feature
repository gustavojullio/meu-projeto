# language: pt
Funcionalidade: Cadastro de Serviços
  Para manter um registro das atividades da propriedade,
  um produtor logado deve poder cadastrar novos serviços.

  Cenário: Produtor cadastra um novo serviço com sucesso
    Dado que existe um produtor de teste cadastrado
    E eu estou logado
    Quando eu vou para a página de "Adicionar Serviço"
    E eu preencho o formulário de serviço com dados válidos
    E eu clico no botão "Salvar"
    Então eu devo ser redirecionado para a página de serviços
    E eu devo ver o serviço "Roçada" na lista