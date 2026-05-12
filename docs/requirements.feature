Feature: Gerenciamento esportivo CoxaStats
  Como administrador do sistema
  Quero cadastrar jogadores, times, partidas e resultados
  Para acompanhar o desempenho do grupo esportivo

  Scenario: Administrador cadastra jogador
    Given que estou autenticado como "ADMIN"
    And existe um time chamado "Coritiba"
    When cadastro um jogador com nome "Alef Manga", posicao "Atacante" e camisa 11
    Then o jogador deve aparecer na lista de jogadores
    And a API deve retornar status 201

  Scenario: Torcedor consulta dashboard
    Given que estou autenticado como "TORCEDOR"
    And existem partidas com placar cadastrado
    When acesso o dashboard
    Then devo ver total de jogadores, total de times e media de gols
    And a API deve retornar status 200

  Scenario: Torcedor tenta editar jogador
    Given que estou autenticado como "TORCEDOR"
    When tento alterar um jogador existente
    Then a API deve bloquear a operacao
    And a API deve retornar status 403

Feature: Experiencia do front-end
  Como usuario do CoxaStats
  Quero uma interface responsiva, com modo escuro e mensagens claras
  Para usar o sistema no computador ou celular

  Scenario: Interface trata erro de login
    Given que informei credenciais invalidas
    When envio o formulario de login
    Then devo ver uma mensagem de erro clara

  Scenario: Usuario troca idioma
    Given que estou na tela principal
    When altero o idioma para ingles
    Then os textos estaticos da interface devem ser exibidos em ingles

  Scenario: Dashboard renderiza graficos
    Given que existem dados gerenciais cadastrados
    When abro a aba "Dashboard"
    Then devo ver graficos de vitorias por tecnico e partidas por time
