# Registro de Sprints

## Sprint 1 - Backend

### Objetivo

Entregar a base transacional do sistema com persistencia, API REST e seguranca inicial.

### Backlog

- Criar entidades `Jogador`, `Time` e `Partida`.
- Implementar CRUD completo com JPA.
- Expor endpoints REST com verbos HTTP corretos.
- Configurar autenticacao JWT com perfis `ADMIN` e `TORCEDOR`.
- Documentar endpoints no Swagger.

### Historias atendidas

- Cadastro, listagem, edicao e exclusao de jogadores.
- Cadastro, listagem, edicao e exclusao de times.
- Cadastro, listagem, edicao e exclusao de partidas.
- Login com controle de permissao por perfil.

### Revisao da sprint

- CRUDs entregues com persistencia em H2.
- Swagger disponivel para validacao dos endpoints.
- Perfis separados entre operacao administrativa e consulta.

## Sprint 2 - Frontend e Integracao

### Objetivo

Entregar uma interface utilizavel e conectada ao backend de forma assincrona.

### Backlog

- Criar tela de login e navegacao principal.
- Implementar formulario e listagem de jogadores.
- Aplicar dark mode.
- Integrar frontend e backend com `fetch` e JSON.
- Exibir mensagens de sucesso e erro.

### Historias atendidas

- Administrador gerencia cadastros pela interface.
- Torcedor consulta dados sem permissao de escrita.
- Usuario recebe feedback visual claro em falhas e sucesso.

### Revisao da sprint

- Frontend responsivo entregue com abas principais.
- Validacao de permissao refletida tanto no backend quanto na interface.
- Tratamento de erro de login e operacoes CRUD incorporado.

## Sprint 3 - Engenharia e DevOps

### Objetivo

Formalizar o processo de engenharia e automatizar a verificacao basica do projeto.

### Backlog

- Registrar requisitos funcionais em BDD.
- Produzir diagramas UML de apoio.
- Criar pipeline CI.
- Implementar upload de fotos de jogadores.

### Historias atendidas

- A equipe usa documentacao formal para orientar a implementacao.
- O administrador envia fotos dos jogadores.
- O repositorio executa validacao automatica em push e pull request.

### Revisao da sprint

- Requisitos BDD em `docs/requirements.feature`.
- Diagramas em `docs/uml.md`.
- Pipeline CI em `.github/workflows/ci.yml`.
- Upload de imagens em `/api/upload/jogador`.

## Sprint 4 - Dashboard e Global

### Objetivo

Adicionar camada gerencial com analise visual e melhorar a experiencia global da aplicacao.

### Backlog

- Construir dashboard com indicadores e graficos.
- Exibir gols por jogador, vitorias por tecnico e partidas por time.
- Adicionar internacionalizacao PT/EN.
- Otimizar consultas SQL do dashboard.
- Implementar stored procedure para consulta gerencial.

### Historias atendidas

- Gestor analisa desempenho por graficos.
- Torcedor consulta painel com indicadores resumidos.
- Usuario alterna idioma entre portugues e ingles.

### Revisao da sprint

- Dashboard entregue com metricas e graficos em canvas.
- Indices SQL em `src/main/resources/schema.sql`.
- Stored procedure `VITORIAS_POR_TECNICO_PROC` ligada ao dashboard.
- i18n PT/EN ativo no frontend.

## Sprint 5 - Qualidade e Final

### Objetivo

Fechar a entrega com testes, cobertura, monitoramento e refinamento documental.

### Backlog

- Ampliar testes backend.
- Adicionar testes frontend para regras centrais da interface.
- Gerar relatorios de cobertura.
- Expor health checks e metricas.
- Consolidar README e fechamento final.

### Historias atendidas

- Equipe reduz regressao com testes automatizados.
- Avaliador recebe evidencias de cobertura e monitoramento.
- Operacao ganha validacoes finais para partidas, gols e upload.

### Revisao da sprint

- Suite backend com testes unitarios, integrados e de repositorio.
- Testes frontend em `src/test/frontend/app-core.test.mjs`.
- Relatorios em `target/site/jacoco/` e `target/frontend-coverage.txt`.
- Monitoramento via Actuator com `health`, `info` e `metrics`.
- Fechamento consolidado em `docs/fechamento-entrega.md`.
