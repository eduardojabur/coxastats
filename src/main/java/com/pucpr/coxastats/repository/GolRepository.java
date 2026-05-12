package com.pucpr.coxastats.repository;

import com.pucpr.coxastats.model.Gol;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GolRepository extends JpaRepository<Gol, Long> {

    List<Gol> findByPartidaId(Long partidaId);

    @Query("""
            select j.nome, count(g)
            from Gol g join g.jogador j
            group by j.nome
            order by count(g) desc
            """)
    List<Object[]> golsPorJogador();
}
