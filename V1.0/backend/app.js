const express = require('express');
const cors = require('cors');
const GCEU = require('./models/gceu'); // Importa o modelo do GCEU
const { body, validationResult } = require('express-validator'); // Importa express-validator para validação
const app = express();
const port = 3000;

app.use(express.json());  // Habilita o parsing de JSON no body das requisições
app.use(cors({
  origin: '*'  // Altere para a URL do seu frontend, se necessário
}));

// Middleware de validação para a criação de GCEUs
const validateGCEU = [
  body('nome').isLength({ min: 3 }).withMessage('Nome deve ter pelo menos 3 caracteres'),
  body('endereco').isLength({ min: 5 }).withMessage('Endereço deve ter pelo menos 5 caracteres'),
  body('descricao').isLength({ max: 500 }).withMessage('Descrição não pode ter mais de 500 caracteres'),
  body('dataInicio').isISO8601().withMessage('Data de início inválida').toDate(),
];

// Função para buscar os GCEUs no MongoDB
const getGCEUs = async (req, res) => {
  try {
    const gceus = await GCEU.find(); // Encontra todos os GCEUs no MongoDB
    res.json(gceus); // Envia os GCEUs como resposta JSON
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao buscar GCEUs.");
  }
};

// Função para adicionar um novo GCEU
const adicionarGCEU = async (req, res) => {
  // Valida os campos da requisição
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() }); // Retorna erros de validação
  }

  const { nome, endereco, descricao, dataInicio } = req.body;

  try {
    const novoGCEU = new GCEU({
      nome,
      endereco,
      descricao,
      data_inicio: dataInicio, // Já convertido pelo express-validator
    });

    await novoGCEU.save(); // Salva o GCEU no MongoDB

    res.status(201).json(novoGCEU); // Retorna o GCEU criado
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao adicionar GCEU.");
  }
};

// Rota para obter os GCEUs
app.get('/gceus', getGCEUs);

// Rota para adicionar um novo GCEU com validação
app.post('/gceus', validateGCEU, adicionarGCEU);

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
