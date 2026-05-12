create index if not exists idx_jogadores_time on jogadores(time_id);
create index if not exists idx_partidas_data on partidas(data_hora);
create index if not exists idx_partidas_times on partidas(time_casa_id, time_visitante_id);
create index if not exists idx_gols_partida on gols(partida_id);
create index if not exists idx_gols_jogador on gols(jogador_id);
