# CoxaStats

Sistema web para gerenciar estatisticas de jogos, elenco, partidas, gols e indicadores gerenciais.

## Escopo entregue ate a Sprint 5

- CRUD de jogadores, times e partidas com persistencia em H2.
- Registro de gols por jogador vinculado a partidas.
- Autenticacao JWT com dois perfis: `ADMIN` e `TORCEDOR`.
- Swagger/OpenAPI em `/swagger-ui.html`.
- Front-end responsivo com dark mode, i18n PT/EN e comunicacao JSON assincrona.
- Upload de fotos de jogadores em `/api/upload/jogador`.
- Dashboard com media de gols, gols por jogador, vitorias por tecnico e partidas por time.
- Indices SQL para consultas gerenciais.
- Monitoramento com `/api/health` e `/actuator/health`.
- Documentacao UML e requisitos BDD em `docs/`.
- Pipeline CI em `.github/workflows/ci.yml`.
- Suite de testes backend com controladores, seguranca, token e contexto Spring.
- Suite de testes frontend para regras centrais da interface em `src/test/frontend/app-core.test.mjs`.
- Fechamento final da entrega em `docs/fechamento-entrega.md`.

## Como executar

Requisitos:

- JDK 21 ou superior instalado.
- Node 22 ou superior para rodar os testes de frontend localmente.
- Internet na primeira execucao para o Maven baixar dependencias.
- Porta `8080` livre.

```bash
./mvnw spring-boot:run
```

No Windows:

```powershell
mvnw.cmd spring-boot:run
```

Depois acesse:

- Aplicacao: `http://localhost:8080`
- Swagger: `http://localhost:8080/swagger-ui.html`
- H2 Console: `http://localhost:8080/h2-console`
- Actuator health: `http://localhost:8080/actuator/health`

## Como executar em outro computador

1. Extraia o zip do projeto.
2. Abra o PowerShell na pasta do projeto.
3. Execute:

```powershell
.\mvnw.cmd spring-boot:run
```

4. Mantenha essa janela aberta.
5. Abra o navegador em:

```text
http://localhost:8080
```

Nao e necessario usar XAMPP. O projeto usa banco H2 local e cria os dados iniciais automaticamente.

## Testes e cobertura

Para rodar os testes localmente:

```powershell
.\mvnw.cmd test
```

Para rodar os testes de frontend com cobertura:

```powershell
node scripts/run-frontend-tests.mjs
```

Para rodar a cobertura no CI:

```bash
./mvnw test -Pcoverage
npm run test:frontend
```

O profile `coverage` fica na pipeline do GitHub Actions porque a maquina local atual usa um JDK mais novo que o JaCoCo nao instrumenta bem.

Relatorios gerados:

- Backend: `target/site/jacoco/index.html`
- Frontend: `target/frontend-coverage.txt`

## Como parar o servidor

Se o servidor estiver rodando na janela do terminal, pressione:

```text
Ctrl + C
```

Se o servidor estiver rodando em background, encontre o processo da porta `8080`:

```powershell
netstat -ano | Select-String ':8080'
```

Procure a linha com `LISTENING`. O ultimo numero da linha e o PID. Exemplo:

```text
TCP    0.0.0.0:8080    0.0.0.0:0    LISTENING    8184
```

Para parar:

```powershell
Stop-Process -Id 8184 -Force
```

Troque `8184` pelo PID que apareceu no seu computador.

Para confirmar que parou:

```powershell
netstat -ano | Select-String ':8080'
```

Se nao aparecer nenhuma linha com `LISTENING`, o servidor foi encerrado.

## Usuarios de teste

- Admin: `admin` / `senha123`
- Torcedor: `torcedor` / `senha123`

O admin pode cadastrar, editar, remover e fazer upload. O torcedor pode consultar dados e visualizar o dashboard.

## Documentacao de entrega

- Registro formal das sprints: `docs/sprints.md`
- Historias de usuario: `docs/user-stories.md`
- BDD/Cucumber: `docs/requirements.feature`
- UML: `docs/uml.md`
- Fechamento final: `docs/fechamento-entrega.md`
