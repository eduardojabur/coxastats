package com.pucpr.coxastats.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final SecurityFilter securityFilter;

    public SecurityConfig(SecurityFilter securityFilter) {
        this.securityFilter = securityFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .csrf(csrf -> csrf.disable())
                .headers(headers -> headers.frameOptions(frame -> frame.sameOrigin()))
                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(req -> {
                    req.requestMatchers("/", "/index.html", "/app.js", "/styles.css", "/uploads/**").permitAll();
                    req.requestMatchers(HttpMethod.POST, "/api/login").permitAll();
                    req.requestMatchers("/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html", "/h2-console/**").permitAll();

                    req.requestMatchers(HttpMethod.GET, "/api/jogadores/**").hasAnyRole("ADMIN", "TORCEDOR");
                    req.requestMatchers(HttpMethod.GET, "/api/times/**").hasAnyRole("ADMIN", "TORCEDOR");
                    req.requestMatchers(HttpMethod.GET, "/api/partidas/**").hasAnyRole("ADMIN", "TORCEDOR");
                    req.requestMatchers(HttpMethod.GET, "/api/gols/**").hasAnyRole("ADMIN", "TORCEDOR");
                    req.requestMatchers(HttpMethod.GET, "/api/dashboard/**").hasAnyRole("ADMIN", "TORCEDOR");
                    req.requestMatchers(HttpMethod.GET, "/api/health").hasAnyRole("ADMIN", "TORCEDOR");

                    req.requestMatchers(HttpMethod.POST, "/api/jogadores/**").hasRole("ADMIN");
                    req.requestMatchers(HttpMethod.PUT, "/api/jogadores/**").hasRole("ADMIN");
                    req.requestMatchers(HttpMethod.DELETE, "/api/jogadores/**").hasRole("ADMIN");
                    req.requestMatchers(HttpMethod.POST, "/api/times/**").hasRole("ADMIN");
                    req.requestMatchers(HttpMethod.PUT, "/api/times/**").hasRole("ADMIN");
                    req.requestMatchers(HttpMethod.DELETE, "/api/times/**").hasRole("ADMIN");
                    req.requestMatchers(HttpMethod.POST, "/api/partidas/**").hasRole("ADMIN");
                    req.requestMatchers(HttpMethod.PUT, "/api/partidas/**").hasRole("ADMIN");
                    req.requestMatchers(HttpMethod.DELETE, "/api/partidas/**").hasRole("ADMIN");
                    req.requestMatchers(HttpMethod.POST, "/api/gols/**").hasRole("ADMIN");
                    req.requestMatchers(HttpMethod.DELETE, "/api/gols/**").hasRole("ADMIN");
                    req.requestMatchers(HttpMethod.POST, "/api/upload/**").hasRole("ADMIN");

                    req.anyRequest().authenticated();
                })
                .addFilterBefore(securityFilter, org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter.class)
                .build();
    }

    @Bean
    public UserDetailsService userDetailsService() {
        return username -> {
            throw new UsernameNotFoundException(username);
        };
    }
}
