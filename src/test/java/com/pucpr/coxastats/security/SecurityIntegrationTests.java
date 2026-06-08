package com.pucpr.coxastats.security;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class SecurityIntegrationTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private TokenService tokenService;

    @Test
    void shouldAllowPublicMonitoringEndpoints() throws Exception {
        mockMvc.perform(get("/actuator/health"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").exists());

        mockMvc.perform(post("/api/login").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"usuario\":\"admin\",\"senha\":\"senha123\"}"))
                .andExpect(status().isOk());
    }

    @Test
    void shouldProtectCrudEndpoints() throws Exception {
        mockMvc.perform(get("/api/jogadores"))
                .andExpect(status().isForbidden());

        String torcedorToken = tokenService.gerarToken("torcedor", "TORCEDOR");
        mockMvc.perform(get("/api/jogadores").header("Authorization", "Bearer " + torcedorToken))
                .andExpect(status().isOk());

        mockMvc.perform(post("/api/times")
                        .header("Authorization", "Bearer " + torcedorToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"nome\":\"Time Bloqueado\"}"))
                .andExpect(status().isForbidden());
    }

    @Test
    void shouldAllowAdminWriteOperationsAndLogin() throws Exception {
        mockMvc.perform(post("/api/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"usuario\":\"admin\",\"senha\":\"senha123\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.perfil").value("ADMIN"));

        String adminToken = tokenService.gerarToken("admin", "ADMIN");
        mockMvc.perform(post("/api/times")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"nome\":\"Time Teste\",\"tecnico\":\"Tecnico Teste\",\"cidade\":\"Curitiba\"}"))
                .andExpect(status().isCreated());
    }
}
