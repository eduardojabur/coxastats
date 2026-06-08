package com.pucpr.coxastats.repository;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.test.context.TestPropertySource;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@TestPropertySource(locations = "classpath:application.properties")
class PartidaRepositoryIntegrationTests {

    @Autowired
    private PartidaRepository partidaRepository;

    @Test
    void shouldReturnCoachWinsFromStoredProcedure() {
        assertThat(partidaRepository.vitoriasPorTecnicoProcedure()).isNotEmpty();
        assertThat(partidaRepository.vitoriasPorTecnicoProcedure().getFirst()[0]).isNotNull();
        assertThat(partidaRepository.vitoriasPorTecnicoProcedure().getFirst()[1]).isNotNull();
    }
}
