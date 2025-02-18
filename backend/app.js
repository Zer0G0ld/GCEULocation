require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

// Configuração do middleware
app.use(cors());
app.use(express.json());

// Conectar ao MongoDB
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("✅ Conectado ao MongoDB"))
  .catch(err => console.error("❌ Erro ao conectar ao MongoDB:", err));

// Definição do modelo do GCEU
const GCEUSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  descricao: { type: String },
});

const GCEU = mongoose.model("GCEU", GCEUSchema);

// Rotas da API
app.get("/", (req, res) => {
  res.send("API do GCEULocation está rodando!");
});

// Criar um novo GCEU
app.post("/gceu", async (req, res) => {
  try {
    const { nome, latitude, longitude, descricao } = req.body;

    if (!nome || latitude == null || longitude == null) {
      return res.status(400).json({ error: "Nome, latitude e longitude são obrigatórios!" });
    }

    const novoGCEU = new GCEU({ nome, latitude, longitude, descricao });
    await novoGCEU.save();
    res.status(201).json(novoGCEU);
  } catch (error) {
    res.status(500).json({ error: "Erro ao salvar o GCEU" });
  }
});

// Buscar todos os GCEUs
app.get("/gceu", async (req, res) => {
  try {
    const gceus = await GCEU.find();
    res.json(gceus);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar os GCEUs" });
  }
});

// Buscar um GCEU por ID
app.get("/gceu/:id", async (req, res) => {
  try {
    const gceu = await GCEU.findById(req.params.id);
    if (!gceu) {
      return res.status(404).json({ error: "GCEU não encontrado" });
    }
    res.json(gceu);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar o GCEU" });
  }
});

// Atualizar um GCEU por ID
app.put("/gceu/:id", async (req, res) => {
  try {
    const gceuAtualizado = await GCEU.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!gceuAtualizado) {
      return res.status(404).json({ error: "GCEU não encontrado" });
    }
    res.json(gceuAtualizado);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar o GCEU" });
  }
});

// Deletar um GCEU por ID
app.delete("/gceu/:id", async (req, res) => {
  try {
    const gceuRemovido = await GCEU.findByIdAndDelete(req.params.id);
    if (!gceuRemovido) {
      return res.status(404).json({ error: "GCEU não encontrado" });
    }
    res.json({ message: "GCEU removido com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao remover o GCEU" });
  }
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
