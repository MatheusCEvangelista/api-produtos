const mongoose = require('mongoose');

const ProdutoSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  descricao: { type: String },
  cor: { type: String },
  peso: { type: Number },
  tipo: { type: String },
  preco: { type: Number, required: true },
  dataCadastro: { type: Date, default: Date.now }
});

module.exports = () => {
  return mongoose.models.Produto || mongoose.model('Produto', ProdutoSchema, 'itens');
};
