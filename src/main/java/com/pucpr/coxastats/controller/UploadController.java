package com.pucpr.coxastats.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.util.UUID;

@RestController
@RequestMapping("/api/upload")
@Tag(name = "Upload de Imagens", description = "Upload de fotos de jogadores e escudos")
public class UploadController {

    private static final Path UPLOAD_DIR = Path.of("uploads", "jogadores");

    @Operation(summary = "Faz upload de imagem", description = "Recebe MultipartFile e retorna uma URL publica local.")
    @PostMapping("/jogador")
    public ResponseEntity<String> uploadFotoJogador(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("Nenhum arquivo enviado.");
        }
        if (file.getContentType() != null && !file.getContentType().startsWith("image/")) {
            return ResponseEntity.badRequest().body("Apenas arquivos de imagem sao aceitos.");
        }

        try {
            Files.createDirectories(UPLOAD_DIR);
            String original = file.getOriginalFilename() == null ? "imagem" : file.getOriginalFilename().replaceAll("[^a-zA-Z0-9._-]", "_");
            String nomeArquivo = UUID.randomUUID() + "_" + original;
            Path destino = UPLOAD_DIR.resolve(nomeArquivo);
            file.transferTo(destino);
            return ResponseEntity.ok("/uploads/jogadores/" + nomeArquivo);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Falha ao fazer upload da imagem.");
        }
    }
}
