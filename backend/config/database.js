const { Pool } = require("pg");
require('dotenv').config();  // Para carregar as variáveis de ambiente do .env

console.log(process.env.DB_PASSWORD);
console.log(process.env.DB_PASSWORD);

// Crie um pool de conexões com o banco de dados
const pool = new Pool({
  user: process.env.DB_USER,        // Usuário do banco de dados
  host: process.env.DB_HOST,        // Endereço do banco de dados
  database: process.env.DB_DATABASE,// Nome do banco de dados
  password: process.env.DB_PASSWORD,// Senha do banco
  port: process.env.DB_PORT,        // Porta padrão do PostgreSQL
});

// Função para realizar a consulta
const query = (text, params) => pool.query(text, params);

module.exports = { query };
