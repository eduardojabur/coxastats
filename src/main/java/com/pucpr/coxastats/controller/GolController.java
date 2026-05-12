package com.pucpr.coxastats.controller;

import com.pucpr.coxastats.model.Gol;
import com.pucpr.coxastats.repository.GolRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/gols")
@Tag(name = "Gols", description = "Registro de gols por partida e jogador")
public class GolController {

    private final GolRepository repository;

    public GolController(GolRepository repository) {
        this.repository = repository;
    }

    @Operation(summary = "Lista gols", description = "Opcionalmente filtre por partida usando ?partidaId=1.")
    @GetMapping
    public ResponseEntity<List<Gol>> listar(@RequestParam(required = false) Long partidaId) {
        if (partidaId != null) {
            return ResponseEntity.ok(repository.findByPartidaId(partidaId));
        }
        return ResponseEntity.ok(repository.findAll());
    }

    @Operation(summary = "Cadastra gol", description = "Exemplo: {\"partida\":{\"id\":1},\"jogador\":{\"id\":1},\"minuto\":32,\"tipo\":\"normal\"}")
    @ApiResponse(responseCode = "201", description = "Gol criado")
    @PostMapping
    public ResponseEntity<Gol> cadastrar(@RequestBody Gol gol) {
        return ResponseEntity.status(HttpStatus.CREATED).body(repository.save(gol));
    }

    @Operation(summary = "Remove gol")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        if (!repository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        repository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
