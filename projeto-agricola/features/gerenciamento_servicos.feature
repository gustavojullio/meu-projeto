# language: pt
Funcionalidade: Gerenciamento de Serviços
  Para gerenciar as atividades, um produtor deve poder
  visualizar, editar e excluir seus serviços cadastrados.

  Contexto:
    Dado que existe um produtor de teste cadastrado
    E que o produtor tem um serviço cadastrado com o tipo "Poda" no talhão "Talhão 1"
    E eu estou logado

  Cenário: Visualizar a lista de serviços
    Quando eu vou para a página de serviços
    Então eu devo ver o serviço "Poda" na lista

  Cenário: Visualizar detalhes de um serviço
    Quando eu vou para a página de serviços
    E eu clico no serviço "Poda"
    Então eu devo estar na página de detalhes do serviço
    E eu devo ver o talhão "Talhão 1"

  Cenário: Excluir um serviço
    Quando eu vou para a página de serviços
    E eu clico no serviço "Poda"
    E eu clico no botão de excluir
    E eu confirmo a exclusão
    Então eu devo ser redirecionado para a página de serviços
    E eu não devo ver o serviço "Poda" na lista