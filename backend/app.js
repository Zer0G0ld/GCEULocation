const express = require('express');
const cors = require('cors');
const { query } = require('./config/database');
const app = express();
const port = 3000;

app.use(express.json());  // Habilita o parsing de JSON no body das requisições

app.use(cors({
  origin: '*'  // Altere para a URL do seu frontend, se necessário
}));

// Função para buscar os GCEUs no banco de dados
const getGCEUs = async (req, res) => {
  try {
    const result = await query("SELECT * FROM gceus");
    res.json(result.rows); // Envia os GCEUs como resposta JSON
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao buscar GCEUs.");
  }
};

// Função para adicionar um novo GCEU
const adicionarGCEU = async (req, res) => {
  const { nome, endereco, local, descricao, dataInicio } = req.body;

  if (!nome || !endereco || !local || !descricao || !dataInicio) {
    return res.status(400).send("Todos os campos são obrigatórios.");
  }

  try {
    const queryText = `
      INSERT INTO gceus (name, local, endereco, descricao, data_inicio)
      VALUES ($1, $2, $3, $4, $5) RETURNING *;
    `;
    const values = [nome, local, endereco, descricao, dataInicio];
    const result = await query(queryText, values);

    res.status(201).json(result.rows[0]); // Retorna o GCEU criado
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao adicionar GCEU.");
  }
};

// Rota para obter os GCEUs
app.get('/gceus', getGCEUs);

// Rota para adicionar um novo GCEU
app.post('/gceus', adicionarGCEU);

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
