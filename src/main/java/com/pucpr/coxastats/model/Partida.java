package com.pucpr.coxastats.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "partidas")
public class Partida {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "time_casa_id")
    private Time timeCasa;

    @ManyToOne(optional = false)
    @JoinColumn(name = "time_visitante_id")
    private Time timeVisitante;

    @Column(nullable = false)
    private LocalDateTime dataHora;

    private String competicao;
    private String estadio;
    private Integer golsCasa;
    private Integer golsVisitante;

    public Partida() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Time getTimeCasa() { return timeCasa; }
    public void setTimeCasa(Time timeCasa) { this.timeCasa = timeCasa; }

    public Time getTimeVisitante() { return timeVisitante; }
    public void setTimeVisitante(Time timeVisitante) { this.timeVisitante = timeVisitante; }

    public LocalDateTime getDataHora() { return dataHora; }
    public void setDataHora(LocalDateTime dataHora) { this.dataHora = dataHora; }

    public String getCompeticao() { return competicao; }
    public void setCompeticao(String competicao) { this.competicao = competicao; }

    public String getEstadio() { return estadio; }
    public void setEstadio(String estadio) { this.estadio = estadio; }

    public Integer getGolsCasa() { return golsCasa; }
    public void setGolsCasa(Integer golsCasa) { this.golsCasa = golsCasa; }

    public Integer getGolsVisitante() { return golsVisitante; }
    public void setGolsVisitante(Integer golsVisitante) { this.golsVisitante = golsVisitante; }
}
