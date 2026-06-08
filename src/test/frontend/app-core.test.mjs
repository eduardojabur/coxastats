import test from "node:test";
import assert from "node:assert/strict";
import {
    buildBarLayout,
    buildGolPayload,
    buildJogadorOptions,
    buildPartidaOptions,
    buildPartidaPayload,
    buildTimeOptions,
    createInitialState,
    formatPartidaLabel,
    isAdminProfile,
    messages,
    translate,
    validateGolInput,
    validatePartidaInput
} from "../../main/resources/static/app-core.js";

function fakeStorage(seed = {}) {
    const values = new Map(Object.entries(seed));
    return {
        getItem(key) {
            return values.has(key) ? values.get(key) : null;
        }
    };
}

test("createInitialState reads persisted values", () => {
    const state = createInitialState(fakeStorage({
        coxastats_token: "jwt-123",
        coxastats_perfil: "ADMIN",
        coxastats_locale: "en-US"
    }));

    assert.equal(state.token, "jwt-123");
    assert.equal(state.perfil, "ADMIN");
    assert.equal(state.locale, "en-US");
    assert.deepEqual(state.jogadores, []);
});

test("createInitialState uses default locale when storage is empty", () => {
    const state = createInitialState(fakeStorage());

    assert.equal(state.token, null);
    assert.equal(state.perfil, null);
    assert.equal(state.locale, "pt-BR");
});

test("translate falls back to key and admin detection is explicit", () => {
    assert.equal(translate("pt-BR", "logout"), "Sair");
    assert.equal(translate("en-US", "players"), "Players");
    assert.equal(translate("pt-BR", "missingKey"), "missingKey");
    assert.equal(messages["en-US"].loginTitle, "Sign in");
    assert.equal(isAdminProfile("ADMIN"), true);
    assert.equal(isAdminProfile("TORCEDOR"), false);
});

test("option builders and labels reflect current data", () => {
    const timesHtml = buildTimeOptions([{ id: 1, nome: "Coritiba" }], 1);
    const partida = {
        id: 9,
        timeCasa: { nome: "Coritiba" },
        golsCasa: 2,
        golsVisitante: 1,
        timeVisitante: { nome: "Londrina" }
    };
    const jogadoresHtml = buildJogadorOptions([{ id: 7, nome: "Robson" }], 7);

    assert.match(timesHtml, /selected/);
    assert.equal(formatPartidaLabel(partida), "Coritiba 2 x 1 Londrina");
    assert.match(buildPartidaOptions([partida], 9), /Coritiba 2 x 1 Londrina/);
    assert.match(jogadoresHtml, /Robson/);
    assert.equal(formatPartidaLabel({}), "- - x - -");
    assert.equal(buildTimeOptions([], ""), '<option value="">-</option>');
});

test("buildPartidaPayload validates business rules", () => {
    const payload = buildPartidaPayload({
        timeCasaId: "1",
        timeVisitanteId: "2",
        dataHora: "2026-06-08T19:30",
        competicao: "Paranaense",
        estadio: "Couto Pereira",
        golsCasa: "3",
        golsVisitante: "1"
    });

    assert.equal(payload.timeCasa.id, 1);
    assert.equal(payload.golsCasa, 3);

    assert.throws(() => validatePartidaInput({
        timeCasaId: "1",
        timeVisitanteId: "1",
        golsCasa: "0",
        golsVisitante: "0"
    }), /mesmo time/);

    assert.throws(() => buildPartidaPayload({
        timeCasaId: "",
        timeVisitanteId: "2",
        golsCasa: "0",
        golsVisitante: "0"
    }), /Selecione mandante/);

    assert.throws(() => buildPartidaPayload({
        timeCasaId: "1",
        timeVisitanteId: "2",
        golsCasa: "-1",
        golsVisitante: "0"
    }), /gols negativos/);
});

test("buildGolPayload validates selected entities and minute", () => {
    const payload = buildGolPayload({
        partidaId: "4",
        jogadorId: "11",
        minuto: "87",
        tipo: ""
    });

    assert.equal(payload.partida.id, 4);
    assert.equal(payload.jogador.id, 11);
    assert.equal(payload.tipo, "normal");

    assert.throws(() => validateGolInput({ partidaId: "", jogadorId: "9", minuto: "1" }), /partida e o jogador/);
    assert.throws(() => buildGolPayload({ partidaId: "5", jogadorId: "9", minuto: "-2", tipo: "normal" }), /nao pode ser negativo/);
    assert.equal(buildGolPayload({ partidaId: "5", jogadorId: "9", minuto: "", tipo: "penalti" }).minuto, 0);
});

test("buildBarLayout limits items and scales widths", () => {
    const layout = buildBarLayout([
        { label: "Robson", valor: 6 },
        { label: "Lucas Ronier", valor: 4 },
        { label: "Josue", valor: 2 },
        { label: "Sebastian Gomez", valor: 1 },
        { label: "Fransergio", valor: 1 },
        { label: "Outro", valor: 1 }
    ], 520);

    assert.equal(layout.length, 5);
    assert.equal(layout[0].label, "Robson");
    assert.equal(layout[0].width, 330);
    assert.ok(layout[1].width < layout[0].width);
    assert.deepEqual(buildBarLayout([], 520), []);
});
