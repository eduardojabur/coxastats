# CoxaStats

Sistema web para gerenciar estatisticas de jogos, elenco e resultados.

## Escopo entregue ate a Sprint 4

- CRUD de jogadores, times e partidas com persistencia em H2.
- Autenticacao JWT com dois perfis: `ADMIN` e `TORCEDOR`.
- Swagger/OpenAPI em `/swagger-ui.html`.
- Front-end responsivo com dark mode, i18n PT/EN e comunicacao JSON assincrona.
- Upload de fotos de jogadores em `/api/upload/jogador`.
- Dashboard com media de gols, vitorias por tecnico e partidas por time.
- Indices SQL para consultas gerenciais.
- Health check em `/api/health`.
- Documentacao UML e requisitos BDD em `docs/`.
- Pipeline CI em `.github/workflows/ci.yml`.

## Como executar

```bash
./mvnw spring-boot:run
```

No Windows:

```bash
mvnw.cmd spring-boot:run
```

Depois acesse:

- Aplicacao: `http://localhost:8080`
- Swagger: `http://localhost:8080/swagger-ui.html`
- H2 Console: `http://localhost:8080/h2-console`

## Usuarios de teste

- Admin: `admin` / `senha123`
- Torcedor: `torcedor` / `senha123`

O admin pode cadastrar, editar, remover e fazer upload. O torcedor pode consultar dados e visualizar o dashboard.
