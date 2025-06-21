const express = require('express');
const router = express.Router();
const controller = require('../controllers/produto.controller');

router.get('/', controller.listarTodos);

router.get('/:id', controller.listarPorId);

router.get('/nome/:nome', controller.listarPorNome);

router.post('/', controller.criar);

router.put('/:id', controller.atualizar);

router.delete('/:id', controller.deletar);

module.exports = router;
