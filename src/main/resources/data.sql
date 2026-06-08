update times set tecnico = 'Fernando Seabra' where id = 1;
update times set tecnico = 'Odair Hellmann' where id = 2;

insert into times (id, nome, tecnico, cidade, escudo_url)
select 1, 'Coritiba', 'Fernando Seabra', 'Curitiba', null
where not exists (select 1 from times where id = 1);

insert into times (id, nome, tecnico, cidade, escudo_url)
select 2, 'Athletico', 'Odair Hellmann', 'Curitiba', null
where not exists (select 1 from times where id = 2);

update jogadores
set nome = 'Pedro Rocha', posicao = 'Atacante', numero_camisa = 11, time_id = 1
where id = 1;

update jogadores
set nome = 'Josue', posicao = 'Meia', numero_camisa = 10, time_id = 1
where id = 2;

insert into jogadores (id, nome, posicao, numero_camisa, foto_url, time_id)
select 1, 'Pedro Rocha', 'Atacante', 11, null, 1
where not exists (select 1 from jogadores where id = 1);

insert into jogadores (id, nome, posicao, numero_camisa, foto_url, time_id)
select 2, 'Josue', 'Meia', 10, null, 1
where not exists (select 1 from jogadores where id = 2);

insert into jogadores (id, nome, posicao, numero_camisa, foto_url, time_id)
select 3, 'Kevin Viveros', 'Atacante', 9, null, 2
where not exists (select 1 from jogadores where id = 3);

insert into jogadores (id, nome, posicao, numero_camisa, foto_url, time_id)
select 4, 'Bruno Zapelli', 'Meia', 10, null, 2
where not exists (select 1 from jogadores where id = 4);

insert into jogadores (id, nome, posicao, numero_camisa, foto_url, time_id)
select 5, 'Kevin Viveros', 'Atacante', 9, null, 2
where not exists (select 1 from jogadores where id = 5);

insert into partidas (id, time_casa_id, time_visitante_id, data_hora, competicao, estadio, gols_casa, gols_visitante)
select 1, 1, 2, timestamp '2026-05-05 20:30:00', 'Paranaense', 'Couto Pereira', 2, 1
where not exists (select 1 from partidas where id = 1);

insert into partidas (id, time_casa_id, time_visitante_id, data_hora, competicao, estadio, gols_casa, gols_visitante)
select 2, 2, 1, timestamp '2026-05-12 19:00:00', 'Copa Sul', 'Ligga Arena', 1, 1
where not exists (select 1 from partidas where id = 2);

update gols set jogador_id = 1 where id = 1;
update gols set jogador_id = 2 where id = 2;
update gols set jogador_id = 3 where id = 3;

insert into gols (id, partida_id, jogador_id, minuto, tipo)
select 1, 1, 1, 18, 'normal'
where not exists (select 1 from gols where id = 1);

insert into gols (id, partida_id, jogador_id, minuto, tipo)
select 2, 1, 2, 64, 'normal'
where not exists (select 1 from gols where id = 2);

insert into gols (id, partida_id, jogador_id, minuto, tipo)
select 3, 2, 1, 51, 'penalti'
where not exists (select 1 from gols where id = 3);

alter table times alter column id restart with 100;
alter table jogadores alter column id restart with 100;
alter table partidas alter column id restart with 100;
alter table gols alter column id restart with 100;
