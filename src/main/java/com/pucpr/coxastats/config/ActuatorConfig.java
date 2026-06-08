package com.pucpr.coxastats.config;

import org.springframework.boot.actuate.info.InfoContributor;
import org.springframework.boot.health.contributor.Health;
import org.springframework.boot.health.contributor.HealthIndicator;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.nio.file.Files;
import java.nio.file.Path;

@Configuration
public class ActuatorConfig {

    @Bean
    public HealthIndicator uploadsHealthIndicator() {
        return () -> {
            Path uploads = Path.of("uploads");
            if (Files.exists(uploads) && Files.isDirectory(uploads)) {
                return Health.up().withDetail("uploadsDir", uploads.toAbsolutePath().toString()).build();
            }
            return Health.up().withDetail("uploadsDir", "not-created-yet").build();
        };
    }

    @Bean
    public InfoContributor projectInfoContributor() {
        return builder -> builder
                .withDetail("frontend", "static-webmvc")
                .withDetail("auth", "jwt")
                .withDetail("database", "h2");
    }
}
