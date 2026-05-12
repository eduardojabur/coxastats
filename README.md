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

Requisitos:

- JDK 21 ou superior instalado.
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
