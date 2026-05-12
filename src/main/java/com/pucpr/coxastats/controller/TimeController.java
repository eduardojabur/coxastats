package com.pucpr.coxastats.controller;

import com.pucpr.coxastats.model.Time;
import com.pucpr.coxastats.repository.TimeRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/times")
@Tag(name = "Times", description = "CRUD de clubes, tecnicos e escudos")
public class TimeController {

    private final TimeRepository repository;

    public TimeController(TimeRepository repository) {
        this.repository = repository;
    }

    @Operation(summary = "Lista times")
    @GetMapping
    public ResponseEntity<List<Time>> listarTodos() {
        return ResponseEntity.ok(repository.findAll());
    }

    @Operation(summary = "Busca time por ID")
    @GetMapping("/{id}")
    public ResponseEntity<Time> buscarPorId(@PathVariable Long id) {
        return repository.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @Operation(summary = "Cadastra time", description = "Exemplo: {\"nome\":\"Coritiba\",\"tecnico\":\"Mozart\",\"cidade\":\"Curitiba\"}")
    @ApiResponse(responseCode = "201", description = "Time criado")
    @PostMapping
    public ResponseEntity<Time> cadastrar(@RequestBody Time time) {
        return ResponseEntity.status(HttpStatus.CREATED).body(repository.save(time));
    }

    @Operation(summary = "Atualiza time")
    @PutMapping("/{id}")
    public ResponseEntity<Time> atualizar(@PathVariable Long id, @RequestBody Time time) {
        if (!repository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        time.setId(id);
        return ResponseEntity.ok(repository.save(time));
    }

    @Operation(summary = "Remove time")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        if (!repository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        repository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
