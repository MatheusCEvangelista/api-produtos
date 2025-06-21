const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  nome: { type: String, required: true },
  descricao: String,
  cor: String,
  peso: Number,
  tipo: String,
  preco: { type: Number, required: true },
  dataCadastro: { type: Date, default: Date.now }
});

module.exports = () => {
  // Se o modelo já está registrado, usa o existente
  return mongoose.models.Produto || mongoose.model('Produto', schema, 'itens');
};
