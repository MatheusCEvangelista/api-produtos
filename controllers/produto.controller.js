const getProdutoModel = require('../models/produto.loader');

exports.listarTodos = async (req, res) => {
  const Produto = getProdutoModel();
  try {
    const produtos = await Produto.find();
    res.json(produtos);
  } catch (err) {
    res.status(500).json({ mensagem: 'Erro ao buscar produtos' });
  }
};

exports.listarPorId = async (req, res) => {
  const Produto = getProdutoModel();
  try {
    const produto = await Produto.findById(req.params.id);
    if (!produto) return res.status(404).json({ mensagem: 'Produto não encontrado' });
    res.json(produto);
  } catch (err) {
    res.status(500).json({ mensagem: 'Erro ao buscar produto' });
  }
};

exports.listarPorNome = async (req, res) => {
  const Produto = getProdutoModel();
  try {
    const produtos = await Produto.find({
      nome: { $regex: req.params.nome, $options: 'i' },
    });
    res.json(produtos);
  } catch (err) {
    res.status(500).json({ mensagem: 'Erro ao buscar por nome' });
  }
};

exports.criar = async (req, res) => {
  const Produto = getProdutoModel();
  try {
    const novoProduto = new Produto(req.body);
    await novoProduto.save();
    res.status(201).json(novoProduto);
  } catch (err) {
    res.status(400).json({ mensagem: 'Erro ao criar produto' });
  }
};

exports.atualizar = async (req, res) => {
  const Produto = getProdutoModel();
  try {
    const atualizado = await Produto.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!atualizado) return res.status(404).json({ mensagem: 'Produto não encontrado' });
    res.json(atualizado);
  } catch (err) {
    res.status(400).json({ mensagem: 'Erro ao atualizar produto' });
  }
};

exports.deletar = async (req, res) => {
  const Produto = getProdutoModel();
  try {
    const deletado = await Produto.findByIdAndDelete(req.params.id);
    if (!deletado) return res.status(404).json({ mensagem: 'Produto não encontrado' });
    res.json({ mensagem: 'Produto deletado com sucesso' });
  } catch (err) {
    res.status(400).json({ mensagem: 'Erro ao deletar produto' });
  }
};
