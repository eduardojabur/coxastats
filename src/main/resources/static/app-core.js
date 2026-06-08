export const messages = {
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
        logout: "Sair", emptyChart: "-"
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
        logout: "Logout", emptyChart: "-"
    }
};

export function createInitialState(storage) {
    return {
        token: storage.getItem("coxastats_token"),
        perfil: storage.getItem("coxastats_perfil"),
        locale: storage.getItem("coxastats_locale") || "pt-BR",
        jogadores: [],
        times: [],
        partidas: [],
        gols: []
    };
}

export function translate(locale, key) {
    return messages[locale]?.[key] || key;
}

export function isAdminProfile(perfil) {
    return perfil === "ADMIN";
}

export function buildTimeOptions(times, selectedId = "") {
    return `<option value="">-</option>` + times.map((time) =>
        `<option value="${time.id}" ${String(time.id) === String(selectedId) ? "selected" : ""}>${time.nome}</option>`
    ).join("");
}

export function formatPartidaLabel(partida) {
    return `${partida.timeCasa?.nome || "-"} ${partida.golsCasa ?? "-"} x ${partida.golsVisitante ?? "-"} ${partida.timeVisitante?.nome || "-"}`;
}

export function buildPartidaOptions(partidas, selectedId = "") {
    return `<option value="">-</option>` + partidas.map((partida) =>
        `<option value="${partida.id}" ${String(partida.id) === String(selectedId) ? "selected" : ""}>${formatPartidaLabel(partida)}</option>`
    ).join("");
}

export function buildJogadorOptions(jogadores, selectedId = "") {
    return `<option value="">-</option>` + jogadores.map((jogador) =>
        `<option value="${jogador.id}" ${String(jogador.id) === String(selectedId) ? "selected" : ""}>${jogador.nome}</option>`
    ).join("");
}

export function validatePartidaInput(values) {
    if (!values.timeCasaId || !values.timeVisitanteId) {
        throw new Error("Selecione mandante e visitante.");
    }
    if (String(values.timeCasaId) === String(values.timeVisitanteId)) {
        throw new Error("Mandante e visitante nao podem ser o mesmo time.");
    }
    if (Number(values.golsCasa || 0) < 0 || Number(values.golsVisitante || 0) < 0) {
        throw new Error("O placar nao pode ter gols negativos.");
    }
}

export function buildPartidaPayload(values) {
    validatePartidaInput(values);
    return {
        timeCasa: { id: Number(values.timeCasaId) },
        timeVisitante: { id: Number(values.timeVisitanteId) },
        dataHora: values.dataHora,
        competicao: values.competicao,
        estadio: values.estadio,
        golsCasa: Number(values.golsCasa || 0),
        golsVisitante: Number(values.golsVisitante || 0)
    };
}

export function validateGolInput(values) {
    if (!values.partidaId || !values.jogadorId) {
        throw new Error("Selecione a partida e o jogador do gol.");
    }
    if (Number(values.minuto || 0) < 0) {
        throw new Error("O minuto do gol nao pode ser negativo.");
    }
}

export function buildGolPayload(values) {
    validateGolInput(values);
    return {
        partida: { id: Number(values.partidaId) },
        jogador: { id: Number(values.jogadorId) },
        minuto: Number(values.minuto || 0),
        tipo: values.tipo || "normal"
    };
}

export function buildBarLayout(data = [], canvasWidth = 520) {
    const max = Math.max(1, ...data.map((item) => Number(item.valor)));
    return data.slice(0, 5).map((item, index) => ({
        label: String(item.label).slice(0, 16),
        value: String(item.valor),
        width: (Number(item.valor) / max) * (canvasWidth - 190),
        y: 34 + index * 42
    }));
}
