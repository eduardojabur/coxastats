package com.pucpr.coxastats.controller;

import com.pucpr.coxastats.repository.JogadorRepository;
import com.pucpr.coxastats.repository.GolRepository;
import com.pucpr.coxastats.repository.PartidaRepository;
import com.pucpr.coxastats.repository.TimeRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@Tag(name = "Dashboard", description = "Relatorios gerenciais para analise de desempenho")
public class DashboardController {

    private final JogadorRepository jogadorRepository;
    private final TimeRepository timeRepository;
    private final PartidaRepository partidaRepository;
    private final GolRepository golRepository;

    public DashboardController(JogadorRepository jogadorRepository, TimeRepository timeRepository, PartidaRepository partidaRepository, GolRepository golRepository) {
        this.jogadorRepository = jogadorRepository;
        this.timeRepository = timeRepository;
        this.partidaRepository = partidaRepository;
        this.golRepository = golRepository;
    }

    @Operation(summary = "Retorna indicadores e series do dashboard")
    @GetMapping
    public ResponseEntity<Map<String, Object>> resumo() {
        return ResponseEntity.ok(Map.of(
                "totalJogadores", jogadorRepository.count(),
                "totalTimes", timeRepository.count(),
                "totalPartidas", partidaRepository.count(),
                "totalGolsRegistrados", golRepository.count(),
                "mediaGols", partidaRepository.mediaGolsPorPartida(),
                "golsPorJogador", normalizar(golRepository.golsPorJogador()),
                "vitoriasPorTecnico", normalizar(partidaRepository.vitoriasPorTecnicoMandante()),
                "partidasPorTime", normalizar(partidaRepository.partidasComoMandantePorTime())
        ));
    }

    private List<Map<String, Object>> normalizar(List<Object[]> dados) {
        return dados.stream()
                .map(item -> Map.of("label", item[0], "valor", item[1]))
                .toList();
    }
}
