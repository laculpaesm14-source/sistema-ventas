const express = require('express');
const controller = require('../controllers/categorias.controller');

const router = express.Router();

router.get('/', controller.getCategorias);
router.post('/', controller.createCategoria);

module.exports = router;