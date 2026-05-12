package com.pucpr.coxastats.model;

import jakarta.persistence.*;

@Entity
@Table(name = "jogadores")
public class Jogador {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false)
    private String posicao;

    private Integer numeroCamisa;
    private String fotoUrl;

    @ManyToOne
    @JoinColumn(name = "time_id")
    private Time time;

    // Construtor vazio exigido pelo JPA
    public Jogador() {}

    public Jogador(String nome, String posicao, Integer numeroCamisa) {
        this.nome = nome;
        this.posicao = posicao;
        this.numeroCamisa = numeroCamisa;
    }

    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getPosicao() { return posicao; }
    public void setPosicao(String posicao) { this.posicao = posicao; }

    public Integer getNumeroCamisa() { return numeroCamisa; }
    public void setNumeroCamisa(Integer numeroCamisa) { this.numeroCamisa = numeroCamisa; }

    public String getFotoUrl() { return fotoUrl; }
    public void setFotoUrl(String fotoUrl) { this.fotoUrl = fotoUrl; }

    public Time getTime() { return time; }
    public void setTime(Time time) { this.time = time; }
}
