package com.pucpr.coxastats.repository;

import com.pucpr.coxastats.model.Partida;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PartidaRepository extends JpaRepository<Partida, Long> {

    @Query("""
            select coalesce(avg(p.golsCasa + p.golsVisitante), 0)
            from Partida p
            where p.golsCasa is not null and p.golsVisitante is not null
            """)
    Double mediaGolsPorPartida();

    @Query("""
            select t.tecnico, count(p)
            from Partida p join p.timeCasa t
            where p.golsCasa > p.golsVisitante and t.tecnico is not null
            group by t.tecnico
            order by count(p) desc
            """)
    List<Object[]> vitoriasPorTecnicoMandante();

    @Query("""
            select t.nome, count(p)
            from Partida p join p.timeCasa t
            group by t.nome
            order by count(p) desc
            """)
    List<Object[]> partidasComoMandantePorTime();
}
