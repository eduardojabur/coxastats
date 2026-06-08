package com.pucpr.coxastats.controller;

import com.pucpr.coxastats.model.Gol;
import com.pucpr.coxastats.model.Jogador;
import com.pucpr.coxastats.model.Partida;
import com.pucpr.coxastats.model.Time;
import com.pucpr.coxastats.repository.GolRepository;
import com.pucpr.coxastats.repository.JogadorRepository;
import com.pucpr.coxastats.repository.PartidaRepository;
import com.pucpr.coxastats.repository.TimeRepository;
import com.pucpr.coxastats.security.TokenService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.mock.web.MockMultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ControllerUnitTests {

    @Mock private JogadorRepository jogadorRepository;
    @Mock private TimeRepository timeRepository;
    @Mock private PartidaRepository partidaRepository;
    @Mock private GolRepository golRepository;
    @Mock private TokenService tokenService;

    @InjectMocks private JogadorController jogadorController;
    @InjectMocks private TimeController timeController;
    @InjectMocks private PartidaController partidaController;
    @InjectMocks private GolController golController;
    @InjectMocks private DashboardController dashboardController;

    @Test
    void shouldListAndManageJogadores() {
        Jogador jogador = jogador("Robson");
        when(jogadorRepository.findAll()).thenReturn(List.of(jogador));
        when(jogadorRepository.findById(1L)).thenReturn(Optional.of(jogador));
        when(jogadorRepository.save(jogador)).thenReturn(jogador);
        when(jogadorRepository.existsById(1L)).thenReturn(true);

        assertThat(jogadorController.listarTodos().getBody()).hasSize(1);
        assertThat(jogadorController.buscarPorId(1L).getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(jogadorController.buscarPorId(2L).getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
        assertThat(jogadorController.cadastrar(jogador).getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(jogadorController.atualizar(1L, jogador).getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(jogadorController.deletar(1L).getStatusCode()).isEqualTo(HttpStatus.NO_CONTENT);
        verify(jogadorRepository).deleteById(1L);
    }

    @Test
    void shouldHandleTimeCrud() {
        Time time = time("Coritiba", 1L);
        when(timeRepository.findAll()).thenReturn(List.of(time));
        when(timeRepository.findById(1L)).thenReturn(Optional.of(time));
        when(timeRepository.save(time)).thenReturn(time);
        when(timeRepository.existsById(1L)).thenReturn(true);

        assertThat(timeController.listarTodos().getBody()).hasSize(1);
        assertThat(timeController.buscarPorId(1L).getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(timeController.buscarPorId(99L).getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
        assertThat(timeController.cadastrar(time).getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(timeController.atualizar(1L, time).getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(timeController.deletar(1L).getStatusCode()).isEqualTo(HttpStatus.NO_CONTENT);
    }

    @Test
    void shouldValidatePartidaBeforeSave() {
        Time casa = time("Coritiba", 1L);
        Time visitante = time("Athletico", 2L);
        Partida partida = partida(casa, visitante);
        when(partidaRepository.findAll()).thenReturn(List.of(partida));
        when(partidaRepository.findById(1L)).thenReturn(Optional.of(partida));
        when(partidaRepository.save(partida)).thenReturn(partida);
        when(partidaRepository.existsById(1L)).thenReturn(true);

        assertThat(partidaController.listarTodos().getBody()).hasSize(1);
        assertThat(partidaController.buscarPorId(1L).getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(partidaController.cadastrar(partida).getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(partidaController.atualizar(1L, partida).getStatusCode()).isEqualTo(HttpStatus.OK);

        Partida invalida = partida(casa, casa);
        assertThatThrownBy(() -> partidaController.cadastrar(invalida))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("mesmo time");
    }

    @Test
    void shouldListFilterAndDeleteGols() {
        Gol gol = gol(1L, 1L);
        when(golRepository.findAll()).thenReturn(List.of(gol));
        when(golRepository.findByPartidaId(1L)).thenReturn(List.of(gol));
        when(golRepository.save(gol)).thenReturn(gol);
        when(golRepository.existsById(1L)).thenReturn(true);

        assertThat(golController.listar(null).getBody()).hasSize(1);
        assertThat(golController.listar(1L).getBody()).hasSize(1);
        assertThat(golController.cadastrar(gol).getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(golController.deletar(1L).getStatusCode()).isEqualTo(HttpStatus.NO_CONTENT);

        Gol invalido = new Gol();
        assertThatThrownBy(() -> golController.cadastrar(invalido))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("partida e jogador");
    }

    @Test
    void shouldBuildDashboardPayload() {
        when(jogadorRepository.count()).thenReturn(5L);
        when(timeRepository.count()).thenReturn(2L);
        when(partidaRepository.count()).thenReturn(3L);
        when(golRepository.count()).thenReturn(8L);
        when(partidaRepository.mediaGolsPorPartida()).thenReturn(2.5);
        when(golRepository.golsPorJogador()).thenReturn(List.<Object[]>of(new Object[]{"Robson", 4L}));
        when(partidaRepository.vitoriasPorTecnicoProcedure()).thenReturn(List.<Object[]>of(new Object[]{"Mozart", 2L}));
        when(partidaRepository.partidasComoMandantePorTime()).thenReturn(List.<Object[]>of(new Object[]{"Coritiba", 3L}));

        Map<String, Object> body = dashboardController.resumo().getBody();

        assertThat(body).containsEntry("totalJogadores", 5L);
        assertThat(body).containsEntry("totalGolsRegistrados", 8L);
        assertThat((List<?>) body.get("golsPorJogador")).hasSize(1);
    }

    @Test
    void shouldHandleAuthAndHealth() {
        when(tokenService.gerarToken("admin", "ADMIN")).thenReturn("token-admin");
        when(tokenService.gerarToken("torcedor", "TORCEDOR")).thenReturn("token-torcedor");

        AuthController authController = new AuthController(tokenService);
        DadosLogin admin = new DadosLogin();
        admin.setUsuario("admin");
        admin.setSenha("senha123");
        DadosLogin fan = new DadosLogin();
        fan.setUsuario("torcedor");
        fan.setSenha("senha123");
        DadosLogin invalid = new DadosLogin();
        invalid.setUsuario("x");
        invalid.setSenha("y");

        assertThat(authController.login(admin).getBody().getPerfil()).isEqualTo("ADMIN");
        assertThat(authController.login(fan).getBody().getPerfil()).isEqualTo("TORCEDOR");
        assertThat(authController.login(invalid).getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);

        HealthController healthController = new HealthController();
        assertThat(healthController.health().getBody()).containsEntry("status", "UP");
    }

    @Test
    void shouldValidateUploads() {
        UploadController uploadController = new UploadController();
        MockMultipartFile empty = new MockMultipartFile("file", new byte[0]);
        MockMultipartFile text = new MockMultipartFile("file", "teste.txt", "text/plain", "abc".getBytes());
        MockMultipartFile image = new MockMultipartFile("file", "foto.png", "image/png", "png".getBytes());

        assertThat(uploadController.uploadFotoJogador(empty).getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(uploadController.uploadFotoJogador(text).getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(uploadController.uploadFotoJogador(image).getStatusCode()).isEqualTo(HttpStatus.OK);
    }

    private Jogador jogador(String nome) {
        Jogador jogador = new Jogador();
        jogador.setId(1L);
        jogador.setNome(nome);
        jogador.setPosicao("Atacante");
        jogador.setNumeroCamisa(9);
        return jogador;
    }

    private Time time(String nome, Long id) {
        Time time = new Time();
        time.setId(id);
        time.setNome(nome);
        time.setTecnico("Mozart");
        return time;
    }

    private Partida partida(Time casa, Time visitante) {
        Partida partida = new Partida();
        partida.setId(1L);
        partida.setTimeCasa(casa);
        partida.setTimeVisitante(visitante);
        partida.setDataHora(LocalDateTime.now());
        partida.setGolsCasa(2);
        partida.setGolsVisitante(1);
        return partida;
    }

    private Gol gol(Long partidaId, Long jogadorId) {
        Gol gol = new Gol();
        Partida partida = new Partida();
        partida.setId(partidaId);
        Time casa = time("Coritiba", 1L);
        Time visitante = time("Athletico", 2L);
        partida.setTimeCasa(casa);
        partida.setTimeVisitante(visitante);
        Jogador jogador = jogador("Robson");
        jogador.setId(jogadorId);
        gol.setId(1L);
        gol.setPartida(partida);
        gol.setJogador(jogador);
        gol.setMinuto(32);
        gol.setTipo("normal");
        return gol;
    }
}
