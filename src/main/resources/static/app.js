const state = {
    token: localStorage.getItem("coxastats_token"),
    perfil: localStorage.getItem("coxastats_perfil"),
    locale: localStorage.getItem("coxastats_locale") || "pt-BR",
    jogadores: [],
    times: [],
    partidas: [],
    gols: []
};

const messages = {
    "pt-BR": {
        title: "Gestao de elenco e desempenho", loginTitle: "Entrar", loginHelp: "Use admin/senha123 para editar ou torcedor/senha123 para consultar.",
        loginButton: "Acessar", players: "Jogadores", teams: "Times", matches: "Partidas", dashboard: "Dashboard",
        playerForm: "Cadastro de jogador", teamForm: "Cadastro de time", matchForm: "Resultado da partida", goalForm: "Lancamento de gol",
        name: "Nome", position: "Posicao", shirt: "Camisa", team: "Time", photo: "Foto", coach: "Tecnico", city: "Cidade", badge: "Escudo URL",
        homeTeam: "Mandante", awayTeam: "Visitante", date: "Data", competition: "Competicao", stadium: "Estadio", homeGoals: "Gols mandante",
        awayGoals: "Gols visitante", match: "Partida", player: "Jogador", minute: "Minuto", type: "Tipo", addGoal: "Adicionar gol",
        save: "Salvar", new: "Novo", totalPlayers: "Jogadores", totalTeams: "Times", avgGoals: "Media de gols",
        registeredGoals: "Gols registrados", winsCoach: "Vitorias por tecnico", matchesTeam: "Partidas por time", goalsPlayer: "Gols por jogador",
        saved: "Registro salvo.", removed: "Registro removido.", loginError: "Usuario ou senha invalidos.", readonly: "Perfil torcedor pode apenas consultar.",
        logout: "Sair"
    },
    "en-US": {
        title: "Roster and performance management", loginTitle: "Sign in", loginHelp: "Use admin/senha123 to edit or torcedor/senha123 to view.",
        loginButton: "Enter", players: "Players", teams: "Teams", matches: "Matches", dashboard: "Dashboard",
        playerForm: "Player form", teamForm: "Team form", matchForm: "Match result", goalForm: "Goal entry",
        name: "Name", position: "Position", shirt: "Shirt", team: "Team", photo: "Photo", coach: "Coach", city: "City", badge: "Badge URL",
        homeTeam: "Home", awayTeam: "Away", date: "Date", competition: "Competition", stadium: "Stadium", homeGoals: "Home goals",
        awayGoals: "Away goals", match: "Match", player: "Player", minute: "Minute", type: "Type", addGoal: "Add goal",
        save: "Save", new: "New", totalPlayers: "Players", totalTeams: "Teams", avgGoals: "Avg goals",
        registeredGoals: "Registered goals", winsCoach: "Wins by coach", matchesTeam: "Matches by team", goalsPlayer: "Goals by player",
        saved: "Record saved.", removed: "Record removed.", loginError: "Invalid user or password.", readonly: "Fan profile can only read.",
        logout: "Logout"
    }
};

const $ = (id) => document.getElementById(id);
const t = (key) => messages[state.locale][key] || key;
const isAdmin = () => state.perfil === "ADMIN";

function setStatus(message, ok = false) {
    $("status").textContent = message;
    $("status").style.color = ok ? "var(--accent)" : "var(--accent-2)";
}

async function api(path, options = {}) {
    const headers = { ...(options.headers || {}) };
    if (!(options.body instanceof FormData)) headers["Content-Type"] = "application/json";
    if (state.token) headers.Authorization = `Bearer ${state.token}`;

    const response = await fetch(path, { ...options, headers });
    if (!response.ok) {
        const body = await response.text();
        throw new Error(body || `HTTP ${response.status}`);
    }
    const type = response.headers.get("content-type") || "";
    return type.includes("application/json") ? response.json() : response.text();
}

function applyI18n() {
    document.documentElement.lang = state.locale;
    document.querySelectorAll("[data-i18n]").forEach((el) => el.textContent = t(el.dataset.i18n));
    $("languageSelect").value = state.locale;
}

async function login(event) {
    event.preventDefault();
    try {
        const data = await api("/api/login", {
            method: "POST",
            body: JSON.stringify({ usuario: $("usuario").value, senha: $("senha").value })
        });
        state.token = data.token;
        state.perfil = data.perfil;
        localStorage.setItem("coxastats_token", state.token);
        localStorage.setItem("coxastats_perfil", state.perfil);
        await bootApp();
    } catch {
        $("loginPanel").classList.remove("hidden");
        setStatus(t("loginError"));
    }
}

async function bootApp() {
    $("loginPanel").classList.add("hidden");
    $("appPanel").classList.remove("hidden");
    $("logoutButton").classList.remove("hidden");
    setAdminControls();
    if (!isAdmin()) setStatus(t("readonly"), true);
    await refreshAll();
}

function setAdminControls() {
    document.querySelectorAll("form input, form select, form button").forEach((el) => {
        if (!el.closest("#loginForm")) el.disabled = !isAdmin();
    });
    document.querySelectorAll(".row-actions button").forEach((el) => el.disabled = !isAdmin());
}

async function refreshAll() {
    await carregarTimes();
    await carregarJogadores();
    await carregarPartidas();
    await carregarGols();
    await carregarDashboard();
    setAdminControls();
}

function logout() {
    localStorage.removeItem("coxastats_token");
    localStorage.removeItem("coxastats_perfil");
    Object.assign(state, { token: null, perfil: null, jogadores: [], times: [], partidas: [], gols: [] });
    $("appPanel").classList.add("hidden");
    $("logoutButton").classList.add("hidden");
    $("loginPanel").classList.remove("hidden");
    $("loginForm").reset();
    setStatus("", true);
}

function optionTimes(selectedId = "") {
    return `<option value="">-</option>` + state.times.map(time => `<option value="${time.id}" ${String(time.id) === String(selectedId) ? "selected" : ""}>${time.nome}</option>`).join("");
}

function optionPartidas(selectedId = "") {
    return `<option value="">-</option>` + state.partidas.map(p => {
        const label = `${p.timeCasa?.nome || "-"} ${p.golsCasa ?? "-"} x ${p.golsVisitante ?? "-"} ${p.timeVisitante?.nome || "-"}`;
        return `<option value="${p.id}" ${String(p.id) === String(selectedId) ? "selected" : ""}>${label}</option>`;
    }).join("");
}

function optionJogadores(selectedId = "") {
    return `<option value="">-</option>` + state.jogadores.map(j => `<option value="${j.id}" ${String(j.id) === String(selectedId) ? "selected" : ""}>${j.nome}</option>`).join("");
}

async function carregarJogadores() {
    state.jogadores = await api("/api/jogadores");
    $("timeId").innerHTML = optionTimes($("timeId").value);
    $("golJogadorId").innerHTML = optionJogadores($("golJogadorId").value);
    $("jogadoresLista").innerHTML = state.jogadores.map(j => `
        <article class="player-card">
            <div class="avatar">${j.fotoUrl ? `<img src="${j.fotoUrl}" alt="">` : (j.nome || "?").slice(0, 1)}</div>
            <div>
                <strong>${j.nome}</strong>
                <div class="muted">${j.posicao || ""} - #${j.numeroCamisa || "-"} - ${j.time?.nome || "-"}</div>
            </div>
            <div class="row-actions">
                <button class="secondary" onclick="editarJogador(${j.id})">Editar</button>
                <button class="secondary danger" onclick="deletarJogador(${j.id})">Excluir</button>
            </div>
        </article>
    `).join("");
}

async function salvarJogador(event) {
    event.preventDefault();
    try {
        let fotoUrl = state.jogadores.find(j => String(j.id) === $("jogadorId").value)?.fotoUrl || null;
        if ($("foto").files[0]) {
            const formData = new FormData();
            formData.append("file", $("foto").files[0]);
            fotoUrl = await api("/api/upload/jogador", { method: "POST", body: formData });
        }
        const payload = {
            nome: $("nome").value,
            posicao: $("posicao").value,
            numeroCamisa: Number($("numeroCamisa").value || 0),
            fotoUrl,
            time: $("timeId").value ? { id: Number($("timeId").value) } : null
        };
        const id = $("jogadorId").value;
        await api(id ? `/api/jogadores/${id}` : "/api/jogadores", { method: id ? "PUT" : "POST", body: JSON.stringify(payload) });
        limparJogadorForm();
        await refreshAll();
        setStatus(t("saved"), true);
    } catch (error) {
        setStatus(error.message);
    }
}

function editarJogador(id) {
    const jogador = state.jogadores.find(j => j.id === id);
    if (!jogador) return;
    $("jogadorId").value = jogador.id;
    $("nome").value = jogador.nome || "";
    $("posicao").value = jogador.posicao || "";
    $("numeroCamisa").value = jogador.numeroCamisa || "";
    $("timeId").value = jogador.time?.id || "";
}

async function deletarJogador(id) {
    try {
        await api(`/api/jogadores/${id}`, { method: "DELETE" });
        await refreshAll();
        setStatus(t("removed"), true);
    } catch (error) {
        setStatus(error.message);
    }
}

function limparJogadorForm() {
    $("jogadorForm").reset();
    $("jogadorId").value = "";
}

async function carregarTimes() {
    state.times = await api("/api/times");
    $("timeId").innerHTML = optionTimes($("timeId").value);
    $("timeCasaId").innerHTML = optionTimes($("timeCasaId").value);
    $("timeVisitanteId").innerHTML = optionTimes($("timeVisitanteId").value);
    $("timesLista").innerHTML = state.times.map(time => `
        <article class="data-card">
            <div><strong>${time.nome}</strong><div class="muted">${time.tecnico || "-"} - ${time.cidade || "-"}</div></div>
            <div class="row-actions">
                <button class="secondary" onclick="editarTime(${time.id})">Editar</button>
                <button class="secondary danger" onclick="deletarTime(${time.id})">Excluir</button>
            </div>
        </article>
    `).join("");
}

async function salvarTime(event) {
    event.preventDefault();
    try {
        const payload = {
            nome: $("timeNome").value,
            tecnico: $("timeTecnico").value,
            cidade: $("timeCidade").value,
            escudoUrl: $("timeEscudoUrl").value
        };
        const id = $("timeEditId").value;
        await api(id ? `/api/times/${id}` : "/api/times", { method: id ? "PUT" : "POST", body: JSON.stringify(payload) });
        limparTimeForm();
        await refreshAll();
        setStatus(t("saved"), true);
    } catch (error) {
        setStatus(error.message);
    }
}

function editarTime(id) {
    const time = state.times.find(t => t.id === id);
    if (!time) return;
    $("timeEditId").value = time.id;
    $("timeNome").value = time.nome || "";
    $("timeTecnico").value = time.tecnico || "";
    $("timeCidade").value = time.cidade || "";
    $("timeEscudoUrl").value = time.escudoUrl || "";
}

async function deletarTime(id) {
    try {
        await api(`/api/times/${id}`, { method: "DELETE" });
        await refreshAll();
        setStatus(t("removed"), true);
    } catch (error) {
        setStatus(error.message);
    }
}

function limparTimeForm() {
    $("timeForm").reset();
    $("timeEditId").value = "";
}

async function carregarPartidas() {
    state.partidas = await api("/api/partidas");
    $("golPartidaId").innerHTML = optionPartidas($("golPartidaId").value);
    const fmt = new Intl.DateTimeFormat(state.locale, { dateStyle: "short", timeStyle: "short" });
    $("partidasLista").innerHTML = state.partidas.map(p => `
        <article class="data-card">
            <div><strong>${p.timeCasa?.nome || "-"} ${p.golsCasa ?? "-"} x ${p.golsVisitante ?? "-"} ${p.timeVisitante?.nome || "-"}</strong>
            <div class="muted">${p.competicao || "-"} - ${p.dataHora ? fmt.format(new Date(p.dataHora)) : "-"}</div></div>
            <div class="row-actions">
                <button class="secondary" onclick="editarPartida(${p.id})">Editar</button>
                <button class="secondary danger" onclick="deletarPartida(${p.id})">Excluir</button>
            </div>
        </article>
    `).join("");
}

async function salvarPartida(event) {
    event.preventDefault();
    try {
        const payload = {
            timeCasa: { id: Number($("timeCasaId").value) },
            timeVisitante: { id: Number($("timeVisitanteId").value) },
            dataHora: $("dataHora").value,
            competicao: $("competicao").value,
            estadio: $("estadio").value,
            golsCasa: Number($("golsCasa").value || 0),
            golsVisitante: Number($("golsVisitante").value || 0)
        };
        const id = $("partidaId").value;
        await api(id ? `/api/partidas/${id}` : "/api/partidas", { method: id ? "PUT" : "POST", body: JSON.stringify(payload) });
        limparPartidaForm();
        await refreshAll();
        setStatus(t("saved"), true);
    } catch (error) {
        setStatus(error.message);
    }
}

function editarPartida(id) {
    const partida = state.partidas.find(p => p.id === id);
    if (!partida) return;
    $("partidaId").value = partida.id;
    $("timeCasaId").value = partida.timeCasa?.id || "";
    $("timeVisitanteId").value = partida.timeVisitante?.id || "";
    $("dataHora").value = partida.dataHora ? partida.dataHora.slice(0, 16) : "";
    $("competicao").value = partida.competicao || "";
    $("estadio").value = partida.estadio || "";
    $("golsCasa").value = partida.golsCasa ?? "";
    $("golsVisitante").value = partida.golsVisitante ?? "";
    $("golPartidaId").value = partida.id;
}

async function deletarPartida(id) {
    try {
        await api(`/api/partidas/${id}`, { method: "DELETE" });
        await refreshAll();
        setStatus(t("removed"), true);
    } catch (error) {
        setStatus(error.message);
    }
}

function limparPartidaForm() {
    $("partidaForm").reset();
    $("partidaId").value = "";
}

async function carregarGols() {
    state.gols = await api("/api/gols");
    $("golsLista").innerHTML = state.gols.map(gol => `
        <article class="data-card">
            <div><strong>${gol.jogador?.nome || "-"} (${gol.minuto || "-"}')</strong>
            <div class="muted">${gol.partida?.timeCasa?.nome || "-"} x ${gol.partida?.timeVisitante?.nome || "-"} - ${gol.tipo || "normal"}</div></div>
            <div class="row-actions"><button class="secondary danger" onclick="deletarGol(${gol.id})">Excluir</button></div>
        </article>
    `).join("");
}

async function salvarGol(event) {
    event.preventDefault();
    try {
        const payload = {
            partida: { id: Number($("golPartidaId").value) },
            jogador: { id: Number($("golJogadorId").value) },
            minuto: Number($("golMinuto").value || 0),
            tipo: $("golTipo").value || "normal"
        };
        await api("/api/gols", { method: "POST", body: JSON.stringify(payload) });
        $("golForm").reset();
        await refreshAll();
        setStatus(t("saved"), true);
    } catch (error) {
        setStatus(error.message);
    }
}

async function deletarGol(id) {
    try {
        await api(`/api/gols/${id}`, { method: "DELETE" });
        await refreshAll();
        setStatus(t("removed"), true);
    } catch (error) {
        setStatus(error.message);
    }
}

async function carregarDashboard() {
    const data = await api("/api/dashboard");
    $("metricJogadores").textContent = new Intl.NumberFormat(state.locale).format(data.totalJogadores);
    $("metricTimes").textContent = new Intl.NumberFormat(state.locale).format(data.totalTimes);
    $("metricGols").textContent = new Intl.NumberFormat(state.locale, { maximumFractionDigits: 2 }).format(data.mediaGols);
    $("metricGolsRegistrados").textContent = new Intl.NumberFormat(state.locale).format(data.totalGolsRegistrados);
    drawBars($("chartGolsJogador"), data.golsPorJogador);
    drawBars($("chartTecnicos"), data.vitoriasPorTecnico);
    drawBars($("chartTimes"), data.partidasPorTime);
}

function drawBars(canvas, data = []) {
    const ctx = canvas.getContext("2d");
    const styles = getComputedStyle(document.body);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = styles.getPropertyValue("--text");
    ctx.font = "14px Segoe UI";
    if (!data.length) {
        ctx.fillText("-", 18, 40);
        return;
    }
    const max = Math.max(1, ...data.map(d => Number(d.valor)));
    data.slice(0, 5).forEach((item, index) => {
        const y = 34 + index * 42;
        const width = (Number(item.valor) / max) * (canvas.width - 190);
        ctx.fillStyle = styles.getPropertyValue("--text");
        ctx.fillText(String(item.label).slice(0, 16), 18, y + 18);
        ctx.fillStyle = styles.getPropertyValue("--accent");
        ctx.fillRect(150, y, width, 26);
        ctx.fillStyle = styles.getPropertyValue("--text");
        ctx.fillText(item.valor, 160 + width, y + 18);
    });
}

document.querySelectorAll(".tab").forEach(button => {
    button.addEventListener("click", () => {
        document.querySelectorAll(".tab").forEach(tab => tab.classList.remove("active"));
        document.querySelectorAll(".tab-view").forEach(view => view.classList.add("hidden"));
        button.classList.add("active");
        $(`${button.dataset.tab}Tab`).classList.remove("hidden");
        if (button.dataset.tab === "dashboard") carregarDashboard().catch(err => setStatus(err.message));
    });
});

$("loginForm").addEventListener("submit", login);
$("jogadorForm").addEventListener("submit", salvarJogador);
$("timeForm").addEventListener("submit", salvarTime);
$("partidaForm").addEventListener("submit", salvarPartida);
$("golForm").addEventListener("submit", salvarGol);
$("novoJogador").addEventListener("click", limparJogadorForm);
$("novoTime").addEventListener("click", limparTimeForm);
$("novaPartida").addEventListener("click", limparPartidaForm);
$("themeToggle").addEventListener("click", () => {
    document.body.classList.toggle("dark");
    localStorage.setItem("coxastats_dark", document.body.classList.contains("dark"));
    carregarDashboard().catch(() => {});
});
$("logoutButton").addEventListener("click", logout);
$("languageSelect").addEventListener("change", (event) => {
    state.locale = event.target.value;
    localStorage.setItem("coxastats_locale", state.locale);
    applyI18n();
    carregarPartidas().catch(() => {});
    carregarDashboard().catch(() => {});
});

if (localStorage.getItem("coxastats_dark") === "true") document.body.classList.add("dark");
applyI18n();
if (state.token) bootApp().catch(() => localStorage.clear());
