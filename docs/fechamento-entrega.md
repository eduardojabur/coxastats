# Fechamento Final de Entrega

## Status geral

O projeto **CoxaStats** esta funcional e apresentavel como entrega final, com backend, frontend, autenticacao, dashboard, documentacao tecnica, CI e monitoramento.

## Conferencia por sprint

### Sprint 1 - Back-end

- CRUD de `Jogador`, `Time` e `Partida`: **OK**
- Persistencia em banco de dados: **OK**
- Endpoints com verbos HTTP e codigos esperados: **OK**

### Sprint 1 - API & Auth

- Swagger/OpenAPI: **OK**
- JWT com perfis `ADMIN` e `TORCEDOR`: **OK**
- Validacao de permissao no backend: **OK**

### Sprint 2 - Front-end

- Interface de jogador: **OK**
- Responsividade: **OK**
- Dark mode: **OK**

### Sprint 2 - Integracao

- Comunicacao assincrona via JSON: **OK**
- Tratamento de erro na interface: **OK**

### Sprint 3 - Engenharia

- UML: **OK**
- BDD/Cucumber: **OK**
- Registro de sprints: **OK**
- Historias de usuario: **OK**

Observacao: a entrega agora inclui `docs/sprints.md`, `docs/user-stories.md`, `docs/requirements.feature` e `docs/uml.md`.

### Sprint 3 - DevOps

- CI/CD com GitHub Actions: **OK**
- Upload de fotos: **OK**

### Sprint 4 - Dashboard

- Dashboard com graficos dinamicos: **OK**
- Indicadores gerenciais: **OK**
- Gols por jogador: **OK**

### Sprint 4 - Global

- i18n PT/EN: **OK**
- Otimizacao SQL por indices: **OK**
- Stored Procedures: **OK**

Observacao: a stored procedure `VITORIAS_POR_TECNICO_PROC` foi registrada em `src/main/resources/schema.sql` e esta integrada ao `DashboardController` via repository.

### Sprint 5 - Qualidade

- Testes backend: **OK**
- Evidencia de cobertura backend: **OK**
- Testes frontend: **OK**

Observacao: o frontend possui relatorio em `target/frontend-coverage.txt`. O backend possui relatorio JaCoCo em `target/site/jacoco/index.html`. No ultimo ciclo validado localmente, o frontend ficou com `100%` de linhas e `85,11%` de branches no modulo central testado, e o backend exibiu `87%` de cobertura total no relatorio HTML.

### Sprint 5 - Final

- Health checks: **OK**
- Refino final de validacoes: **OK**
- README e documentacao de execucao: **OK**
