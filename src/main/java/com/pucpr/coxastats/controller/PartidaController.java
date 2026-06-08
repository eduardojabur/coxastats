package com.pucpr.coxastats.controller;

import com.pucpr.coxastats.model.Partida;
import com.pucpr.coxastats.repository.PartidaRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/partidas")
@Tag(name = "Partidas", description = "CRUD de jogos e resultados")
public class PartidaController {

    private final PartidaRepository repository;

    public PartidaController(PartidaRepository repository) {
        this.repository = repository;
    }

    @Operation(summary = "Lista partidas")
    @GetMapping
    public ResponseEntity<List<Partida>> listarTodos() {
        return ResponseEntity.ok(repository.findAll());
    }

    @Operation(summary = "Busca partida por ID")
    @GetMapping("/{id}")
    public ResponseEntity<Partida> buscarPorId(@PathVariable Long id) {
        return repository.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @Operation(summary = "Cadastra partida", description = "Envie timeCasa/timeVisitante com id, dataHora, competicao, estadio e placar.")
    @ApiResponse(responseCode = "201", description = "Partida criada")
    @PostMapping
    public ResponseEntity<Partida> cadastrar(@RequestBody Partida partida) {
        validarPartida(partida);
        return ResponseEntity.status(HttpStatus.CREATED).body(repository.save(partida));
    }

    @Operation(summary = "Atualiza partida")
    @PutMapping("/{id}")
    public ResponseEntity<Partida> atualizar(@PathVariable Long id, @RequestBody Partida partida) {
        if (!repository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        validarPartida(partida);
        partida.setId(id);
        return ResponseEntity.ok(repository.save(partida));
    }

    @Operation(summary = "Remove partida")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        if (!repository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        repository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    private void validarPartida(Partida partida) {
        if (partida.getTimeCasa() == null || partida.getTimeVisitante() == null) {
            throw new IllegalArgumentException("Partida precisa ter time mandante e visitante.");
        }
        if (partida.getTimeCasa().getId() != null && partida.getTimeCasa().getId().equals(partida.getTimeVisitante().getId())) {
            throw new IllegalArgumentException("Mandante e visitante nao podem ser o mesmo time.");
        }
        if (partida.getGolsCasa() != null && partida.getGolsCasa() < 0) {
            throw new IllegalArgumentException("Gols do mandante nao podem ser negativos.");
        }
        if (partida.getGolsVisitante() != null && partida.getGolsVisitante() < 0) {
            throw new IllegalArgumentException("Gols do visitante nao podem ser negativos.");
        }
    }
}
