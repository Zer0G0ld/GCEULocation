const mongoose = require('mongoose');
const { Schema } = mongoose;

// Definição do Schema do GCEU
const gceuSchema = new Schema({
  nome: {
    type: String,
    required: [true, 'Nome é obrigatório'], // Mensagem personalizada de erro
    trim: true,  // Remove espaços em branco no início e no final
    minlength: [3, 'Nome deve ter no mínimo 3 caracteres'], // Validação de comprimento
    maxlength: [255, 'Nome deve ter no máximo 255 caracteres'], // Validação de comprimento
  },
  endereco: {
    type: String,
    required: [true, 'Endereço é obrigatório'],
    trim: true,
    minlength: [5, 'Endereço deve ter no mínimo 5 caracteres'],
    maxlength: [255, 'Endereço deve ter no máximo 255 caracteres'],
  },
  hora: {
    type: String,
    validate: {
      validator: function(v) {
        return /^([01]?[0-9]|2[0-3]):([0-5]?[0-9])$/.test(v); // Regex para validar o formato de hora (HH:MM)
      },
      message: props => `${props.value} não é uma hora válida!`,
    },
  },
  descricao: {
    type: String,
    maxlength: [500, 'Descrição não pode ter mais de 500 caracteres'], // Limitação de caracteres
  },
  data_inicio: {
    type: Date,
    required: [true, 'Data de início é obrigatória'],
    validate: {
      validator: function(v) {
        return v instanceof Date && !isNaN(v); // Valida se a data é válida
      },
      message: props => `${props.value} não é uma data válida!`,
    },
  },
}, {
  timestamps: true, // Adiciona createdAt e updatedAt automaticamente
});

// Indexação nos campos mais pesquisados para melhorar a performance
gceuSchema.index({ nome: 1, endereco: 1 });

// Modelo para o GCEU
const GCEU = mongoose.model('GCEU', gceuSchema);

module.exports = GCEU;
