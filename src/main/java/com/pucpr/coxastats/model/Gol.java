package com.pucpr.coxastats.model;

import jakarta.persistence.*;

@Entity
@Table(name = "gols")
public class Gol {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "partida_id")
    private Partida partida;

    @ManyToOne(optional = false)
    @JoinColumn(name = "jogador_id")
    private Jogador jogador;

    private Integer minuto;
    private String tipo;

    public Gol() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Partida getPartida() { return partida; }
    public void setPartida(Partida partida) { this.partida = partida; }

    public Jogador getJogador() { return jogador; }
    public void setJogador(Jogador jogador) { this.jogador = jogador; }

    public Integer getMinuto() { return minuto; }
    public void setMinuto(Integer minuto) { this.minuto = minuto; }

    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }
}
