package com.pucpr.coxastats.controller;

import com.pucpr.coxastats.model.Jogador;
import com.pucpr.coxastats.repository.JogadorRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/jogadores")
@Tag(name = "Jogadores", description = "CRUD de gerenciamento do elenco")
public class JogadorController {

    @Autowired
    private JogadorRepository repository;

    @Operation(summary = "Lista todos os jogadores", description = "Retorna uma lista com todos os jogadores cadastrados no sistema.")
    @GetMapping
    public ResponseEntity<List<Jogador>> listarTodos() {
        return ResponseEntity.ok(repository.findAll());
    }

    @Operation(summary = "Busca jogador por ID", description = "Retorna os detalhes de um jogador específico.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Jogador encontrado"),
            @ApiResponse(responseCode = "404", description = "Jogador não encontrado")
    })
    @GetMapping("/{id}")
    public ResponseEntity<Jogador> buscarPorId(@PathVariable Long id) {
        Optional<Jogador> jogador = repository.findById(id);
        return jogador.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @Operation(summary = "Cadastra um novo jogador", description = "Adiciona um novo atleta ao elenco. Exemplo de payload: {\"nome\": \"Alef Manga\", \"posicao\": \"Atacante\", \"numeroCamisa\": 11}")
    @ApiResponse(responseCode = "201", description = "Jogador criado com sucesso")
    @PostMapping
    public ResponseEntity<Jogador> cadastrar(@RequestBody Jogador jogador) {
        Jogador novoJogador = repository.save(jogador);
        return ResponseEntity.status(HttpStatus.CREATED).body(novoJogador); // Retorna 201 Created
    }

    @Operation(summary = "Atualiza um jogador existente", description = "Atualiza os dados de um jogador pelo ID.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Jogador atualizado"),
            @ApiResponse(responseCode = "404", description = "Jogador não encontrado")
    })
    @PutMapping("/{id}")
    public ResponseEntity<Jogador> atualizar(@PathVariable Long id, @RequestBody Jogador jogadorAtualizado) {
        if (!repository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        jogadorAtualizado.setId(id); // Garante que o ID correto será atualizado
        return ResponseEntity.ok(repository.save(jogadorAtualizado));
    }

    @Operation(summary = "Remove um jogador", description = "Deleta um jogador do banco de dados pelo ID.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Jogador deletado com sucesso (Sem conteúdo)"),
            @ApiResponse(responseCode = "404", description = "Jogador não encontrado")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        if (!repository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        repository.deleteById(id);
        return ResponseEntity.noContent().build(); // Retorna 204 No Content
    }
}