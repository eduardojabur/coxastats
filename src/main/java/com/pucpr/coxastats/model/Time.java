package com.pucpr.coxastats.model;

import jakarta.persistence.*;

@Entity
@Table(name = "times")
public class Time {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    private String tecnico;
    private String cidade;
    private String escudoUrl;

    public Time() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getTecnico() { return tecnico; }
    public void setTecnico(String tecnico) { this.tecnico = tecnico; }

    public String getCidade() { return cidade; }
    public void setCidade(String cidade) { this.cidade = cidade; }

    public String getEscudoUrl() { return escudoUrl; }
    public void setEscudoUrl(String escudoUrl) { this.escudoUrl = escudoUrl; }
}
