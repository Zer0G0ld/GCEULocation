CREATE TABLE IF NOT EXISTS  gceus (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    endereco VARCHAR(255) NOT NULL,
    hora TIME,
    descricao TEXT,
    data_inicio DATE
);