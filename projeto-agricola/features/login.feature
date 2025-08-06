# language: pt
Funcionalidade: Autenticação de Produtor
  Para garantir a segurança do sistema, apenas produtores registrados
  devem poder acessar a lista de serviços.

  Cenário: Produtor faz login com credenciais válidas
    Dado que existe um produtor de teste cadastrado
    E eu estou na página de login
    Quando eu preencho o campo "email" com "produtor_teste@email.com"
    E eu preencho o campo "senha" com "senha123"
    E eu clico no botão "Iniciar Sessão"
    Então eu devo ser redirecionado para a página de serviços
    E eu devo ver o texto "Filtrar" na página

  Cenário: Tentativa de login com senha inválida
    Dado que existe um produtor de teste cadastrado
    E eu estou na página de login
    Quando eu preencho o campo "email" com "produtor_teste@email.com"
    E eu preencho o campo "senha" com "senha_errada"
    E eu clico no botão "Iniciar Sessão"
    Então eu devo continuar na página de login
    E eu devo ver a mensagem de erro "E-mail ou senha inválidos."