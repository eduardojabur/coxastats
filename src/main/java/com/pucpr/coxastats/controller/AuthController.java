package com.pucpr.coxastats.controller;

import com.pucpr.coxastats.security.TokenService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@Tag(name = "Autenticacao", description = "Login JWT com perfis ADMIN e TORCEDOR")
public class AuthController {

    private final TokenService tokenService;

    public AuthController(TokenService tokenService) {
        this.tokenService = tokenService;
    }

    @Operation(summary = "Realiza login", description = "Use admin/senha123 para permissao total ou torcedor/senha123 para leitura.")
    @PostMapping("/login")
    public ResponseEntity<DadosToken> login(@RequestBody DadosLogin dados) {
        if ("admin".equals(dados.getUsuario()) && "senha123".equals(dados.getSenha())) {
            return ResponseEntity.ok(new DadosToken(tokenService.gerarToken("admin", "ADMIN"), "ADMIN"));
        }

        if ("torcedor".equals(dados.getUsuario()) && "senha123".equals(dados.getSenha())) {
            return ResponseEntity.ok(new DadosToken(tokenService.gerarToken("torcedor", "TORCEDOR"), "TORCEDOR"));
        }

        return ResponseEntity.status(401).build();
    }
}

class DadosLogin {
    private String usuario;
    private String senha;

    public String getUsuario() { return usuario; }
    public void setUsuario(String usuario) { this.usuario = usuario; }
    public String getSenha() { return senha; }
    public void setSenha(String senha) { this.senha = senha; }
}

class DadosToken {
    private String token;
    private String perfil;

    public DadosToken(String token, String perfil) {
        this.token = token;
        this.perfil = perfil;
    }

    public String getToken() { return token; }
    public String getPerfil() { return perfil; }
}
