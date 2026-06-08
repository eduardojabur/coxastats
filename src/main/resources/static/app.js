import {
    buildBarLayout,
    buildGolPayload,
    buildJogadorOptions,
    buildPartidaOptions,
    buildPartidaPayload,
    buildTimeOptions,
    createInitialState,
    isAdminProfile,
    translate
} from "./app-core.js";

const state = createInitialState(localStorage);

const $ = (id) => document.getElementById(id);
const t = (key) => translate(state.locale, key);
const isAdmin = () => isAdminProfile(state.perfil);

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
    document.querySelectorAll(".row-actions button").forEach((el) => {
        el.disabled = !isAdmin();
    });
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

async function carregarJogadores() {
    state.jogadores = await api("/api/jogadores");
    $("timeId").innerHTML = buildTimeOptions(state.times, $("timeId").value);
    $("golJogadorId").innerHTML = buildJogadorOptions(state.jogadores, $("golJogadorId").value);
    $("jogadoresLista").innerHTML = state.jogadores.map((jogador) => `
        <article class="player-card">
            <div class="avatar">${jogador.fotoUrl ? `<img src="${jogador.fotoUrl}" alt="">` : (jogador.nome || "?").slice(0, 1)}</div>
            <div>
                <strong>${jogador.nome}</strong>
                <div class="muted">${jogador.posicao || ""} - #${jogador.numeroCamisa || "-"} - ${jogador.time?.nome || "-"}</div>
            </div>
            <div class="row-actions">
                <button class="secondary" onclick="editarJogador(${jogador.id})">Editar</button>
                <button class="secondary danger" onclick="deletarJogador(${jogador.id})">Excluir</button>
            </div>
        </article>
    `).join("");
}

async function salvarJogador(event) {
    event.preventDefault();
    try {
        let fotoUrl = state.jogadores.find((jogador) => String(jogador.id) === $("jogadorId").value)?.fotoUrl || null;
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
    const jogador = state.jogadores.find((item) => item.id === id);
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
    $("timeId").innerHTML = buildTimeOptions(state.times, $("timeId").value);
    $("timeCasaId").innerHTML = buildTimeOptions(state.times, $("timeCasaId").value);
    $("timeVisitanteId").innerHTML = buildTimeOptions(state.times, $("timeVisitanteId").value);
    $("timesLista").innerHTML = state.times.map((time) => `
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
    const time = state.times.find((item) => item.id === id);
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
    $("golPartidaId").innerHTML = buildPartidaOptions(state.partidas, $("golPartidaId").value);
    const formatter = new Intl.DateTimeFormat(state.locale, { dateStyle: "short", timeStyle: "short" });
    $("partidasLista").innerHTML = state.partidas.map((partida) => `
        <article class="data-card">
            <div><strong>${partida.timeCasa?.nome || "-"} ${partida.golsCasa ?? "-"} x ${partida.golsVisitante ?? "-"} ${partida.timeVisitante?.nome || "-"}</strong>
            <div class="muted">${partida.competicao || "-"} - ${partida.dataHora ? formatter.format(new Date(partida.dataHora)) : "-"}</div></div>
            <div class="row-actions">
                <button class="secondary" onclick="editarPartida(${partida.id})">Editar</button>
                <button class="secondary danger" onclick="deletarPartida(${partida.id})">Excluir</button>
            </div>
        </article>
    `).join("");
}

async function salvarPartida(event) {
    event.preventDefault();
    try {
        const payload = buildPartidaPayload({
            timeCasaId: $("timeCasaId").value,
            timeVisitanteId: $("timeVisitanteId").value,
            dataHora: $("dataHora").value,
            competicao: $("competicao").value,
            estadio: $("estadio").value,
            golsCasa: $("golsCasa").value,
            golsVisitante: $("golsVisitante").value
        });
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
    const partida = state.partidas.find((item) => item.id === id);
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
    $("golsLista").innerHTML = state.gols.map((gol) => `
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
        const payload = buildGolPayload({
            partidaId: $("golPartidaId").value,
            jogadorId: $("golJogadorId").value,
            minuto: $("golMinuto").value,
            tipo: $("golTipo").value
        });
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
        ctx.fillText(t("emptyChart"), 18, 40);
        return;
    }
    buildBarLayout(data, canvas.width).forEach((item) => {
        ctx.fillStyle = styles.getPropertyValue("--text");
        ctx.fillText(item.label, 18, item.y + 18);
        ctx.fillStyle = styles.getPropertyValue("--accent");
        ctx.fillRect(150, item.y, item.width, 26);
        ctx.fillStyle = styles.getPropertyValue("--text");
        ctx.fillText(item.value, 160 + item.width, item.y + 18);
    });
}

function bindEvents() {
    document.querySelectorAll(".tab").forEach((button) => {
        button.addEventListener("click", () => {
            document.querySelectorAll(".tab").forEach((tab) => tab.classList.remove("active"));
            document.querySelectorAll(".tab-view").forEach((view) => view.classList.add("hidden"));
            button.classList.add("active");
            $(`${button.dataset.tab}Tab`).classList.remove("hidden");
            if (button.dataset.tab === "dashboard") carregarDashboard().catch((error) => setStatus(error.message));
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
}

function init() {
    Object.assign(window, {
        editarJogador,
        deletarJogador,
        editarTime,
        deletarTime,
        editarPartida,
        deletarPartida,
        deletarGol
    });

    if (localStorage.getItem("coxastats_dark") === "true") document.body.classList.add("dark");
    applyI18n();
    bindEvents();
    if (state.token) bootApp().catch(() => localStorage.clear());
}

init();
