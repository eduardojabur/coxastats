insert into times (id, nome, tecnico, cidade, escudo_url)
select 1, 'Coritiba', 'Mozart', 'Curitiba', null
where not exists (select 1 from times where id = 1);

insert into times (id, nome, tecnico, cidade, escudo_url)
select 2, 'Athletico', 'Cuca', 'Curitiba', null
where not exists (select 1 from times where id = 2);

insert into jogadores (id, nome, posicao, numero_camisa, foto_url, time_id)
select 1, 'Alef Manga', 'Atacante', 11, null, 1
where not exists (select 1 from jogadores where id = 1);

insert into jogadores (id, nome, posicao, numero_camisa, foto_url, time_id)
select 2, 'Gabriel', 'Meia', 8, null, 1
where not exists (select 1 from jogadores where id = 2);

insert into partidas (id, time_casa_id, time_visitante_id, data_hora, competicao, estadio, gols_casa, gols_visitante)
select 1, 1, 2, timestamp '2026-05-05 20:30:00', 'Paranaense', 'Couto Pereira', 2, 1
where not exists (select 1 from partidas where id = 1);

insert into partidas (id, time_casa_id, time_visitante_id, data_hora, competicao, estadio, gols_casa, gols_visitante)
select 2, 2, 1, timestamp '2026-05-12 19:00:00', 'Copa Sul', 'Ligga Arena', 1, 1
where not exists (select 1 from partidas where id = 2);

insert into gols (id, partida_id, jogador_id, minuto, tipo)
select 1, 1, 1, 18, 'normal'
where not exists (select 1 from gols where id = 1);

insert into gols (id, partida_id, jogador_id, minuto, tipo)
select 2, 1, 2, 64, 'normal'
where not exists (select 1 from gols where id = 2);

insert into gols (id, partida_id, jogador_id, minuto, tipo)
select 3, 2, 1, 51, 'penalti'
where not exists (select 1 from gols where id = 3);
