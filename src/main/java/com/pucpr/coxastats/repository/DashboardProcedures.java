package com.pucpr.coxastats.repository;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public final class DashboardProcedures {

    private DashboardProcedures() {
    }

    public static ResultSet vitoriasPorTecnico(Connection connection) throws SQLException {
        PreparedStatement statement = connection.prepareStatement("""
                select coalesce(t.tecnico, 'Sem tecnico') as label, count(p.id) as valor
                from partidas p
                join times t on t.id = p.time_casa_id
                where p.gols_casa > p.gols_visitante
                group by t.tecnico
                order by valor desc
                """);
        return statement.executeQuery();
    }
}
