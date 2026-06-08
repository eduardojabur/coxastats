package com.pucpr.coxastats.security;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class TokenServiceTests {

    private final TokenService tokenService = new TokenService();

    @Test
    void shouldGenerateTokenWithSubjectAndRole() {
        String token = tokenService.gerarToken("admin", "ADMIN");

        assertThat(token).isNotBlank();
        assertThat(tokenService.getSubject(token)).isEqualTo("admin");
        assertThat(tokenService.getRole(token)).isEqualTo("ADMIN");
    }
}
