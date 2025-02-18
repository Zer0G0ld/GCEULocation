const mongoose = require('mongoose');
require('dotenv').config();

let isAttemptingReconnect = false;

const connectToDatabase = async () => {
  if (isAttemptingReconnect) return; // Evita múltiplos tentativas simultâneas

  try {
    const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/gceulocation';
    if (!uri) {
      console.error('Erro: A variável de ambiente MONGO_URI não está definida.');
      process.exit(1);
    }

    isAttemptingReconnect = true;

    // Log adicional para debugar a URL de conexão
    console.log(`Tentando conectar ao MongoDB com a URL: ${uri}`);

    // Conexão com o banco de dados MongoDB
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
    });

    console.log('Conectado ao MongoDB com sucesso');
    isAttemptingReconnect = false;
  } catch (error) {
    console.error('Erro ao conectar ao MongoDB:', error.message);
    isAttemptingReconnect = false;
    console.log('Tentando reconectar em 5 segundos...');
    setTimeout(connectToDatabase, 5000); // Tenta reconectar após 5 segundos
  }
};

mongoose.connection.on('disconnected', () => {
  console.log('Conexão com o MongoDB perdida. Tentando reconectar...');
  if (!isAttemptingReconnect) {
    connectToDatabase(); // Inicia reconexão caso a conexão seja perdida
  }
});

mongoose.connection.on('error', (err) => {
  console.error('Erro de conexão com o MongoDB:', err);
});

connectToDatabase();

module.exports = mongoose;
