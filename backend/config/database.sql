CREATE TABLE IF NOT EXISTS  gceus (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  local VARCHAR(255),
  endereco VARCHAR(255),
  descricao TEXT,
  data_inicio DATE
);
