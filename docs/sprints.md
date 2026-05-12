# Registro de Sprints

## Sprint 1 - Backend

- CRUDs de jogador, time e partida.
- Persistencia em banco H2 com JPA.
- Swagger/OpenAPI para endpoints principais.
- JWT com perfis `ADMIN` e `TORCEDOR`.

## Sprint 2 - Frontend e Integracao

- Interface responsiva para CRUD de jogadores.
- Dark mode e mensagens de erro.
- Integracao via `fetch` com JSON assincrono.
- Validacao de permissao no frontend e backend.

## Sprint 3 - Engenharia e DevOps

- Requisitos BDD em `docs/requirements.feature`.
- Diagramas UML em `docs/uml.md`.
- Pipeline CI em `.github/workflows/ci.yml`.
- Upload de imagens pelo endpoint `/api/upload/jogador`.

## Sprint 4 - Dashboard e Global

- Dashboard gerencial com graficos em canvas.
- Consultas gerenciais no repository de partidas.
- Indices SQL em `schema.sql`.
- Internacionalizacao PT/EN no front-end.
