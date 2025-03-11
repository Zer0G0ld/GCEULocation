require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ ERRO: MONGO_URI não definido no arquivo .env");
  process.exit(1);
}

// Middleware
//app.use(cors({ origin: ["http://localhost:3000", "http://localhost:5500"], methods: ["GET", "POST", "PUT", "DELETE"] }));
//app.use(cors({ origin: ["*"], methods: ["GET", "POST", "PUT", "DELETE"] }));
app.use(cors());
app.use(express.json());

// Conectar ao MongoDB
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("✅ Conectado ao MongoDB"))
  .catch(err => {
    console.error("❌ Erro ao conectar ao MongoDB:", err);
    process.exit(1);
  });

// Modelo do GCEU
const GCEUSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  descricao: { type: String, required: true },
  endereco: { type: String, required: true },
  hora: { type: String, required: true },
  diaSemana: { 
    type: String, 
    required: true, 
    enum: ["domingo", "segunda", "terca", "quarta", "quinta", "sexta", "sabado"] 
  },
  lider: { type: String, required: true },
});

const GCEU = mongoose.model("GCEU", GCEUSchema, "gceus");

// Rota principal
app.get("/", (req, res) => {
  res.send("✅ API do GCEULocation está rodando!");
});

// Criar um novo GCEU
app.post("/gceus", async (req, res) => {
  try {
    const { nome, latitude, longitude, descricao, endereco, hora, diaSemana, lider } = req.body;

    if (!nome || latitude == null || longitude == null || !descricao || !endereco || !hora || !diaSemana || !lider) {
      return res.status(400).json({ error: "Todos os campos são obrigatórios!" });
    }

    const novoGCEU = new GCEU({ nome, latitude, longitude, descricao, endereco, hora, diaSemana, lider });
    await novoGCEU.save();
    res.status(201).json(novoGCEU);
  } catch (error) {
    console.error("❌ Erro ao salvar o GCEU:", error);
    res.status(500).json({ error: "Erro ao salvar o GCEU" });
  }
});

// Buscar todos os GCEUs
app.get("/gceus", async (req, res) => {
  try {
    const gceus = await GCEU.find();
    res.json(gceus);
  } catch (error) {
    console.error("❌ Erro ao buscar GCEUs:", error);
    res.status(500).json({ error: "Erro ao buscar os GCEUs" });
  }
});

// Buscar um GCEU por ID
app.get("/gceus/:id", async (req, res) => {
  try {
    const gceu = await GCEU.findById(req.params.id);
    if (!gceu) {
      return res.status(404).json({ error: "GCEU não encontrado" });
    }
    res.json(gceu);
  } catch (error) {
    console.error("❌ Erro ao buscar o GCEU:", error);
    res.status(500).json({ error: "Erro ao buscar o GCEU" });
  }
});

// Atualizar um GCEU por ID
app.put("/gceus/:id", async (req, res) => {
  try {
    const gceuAtualizado = await GCEU.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!gceuAtualizado) {
      return res.status(404).json({ error: "GCEU não encontrado" });
    }
    res.json(gceuAtualizado);
  } catch (error) {
    console.error("❌ Erro ao atualizar o GCEU:", error);
    res.status(500).json({ error: "Erro ao atualizar o GCEU" });
  }
});

// Deletar um GCEU por ID
app.delete("/gceus/:id", async (req, res) => {
  try {
    const gceuRemovido = await GCEU.findByIdAndDelete(req.params.id);
    if (!gceuRemovido) {
      return res.status(404).json({ error: "GCEU não encontrado" });
    }
    res.json({ message: "✅ GCEU removido com sucesso" });
  } catch (error) {
    console.error("❌ Erro ao remover o GCEU:", error);
    res.status(500).json({ error: "Erro ao remover o GCEU" });
  }
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
