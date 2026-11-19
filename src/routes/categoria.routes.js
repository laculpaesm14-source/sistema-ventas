const express = require('express');
const controller = require('../controllers/categorias.controller');
const { autenticar, autorizar } = require('../middlewares/auth.middleware');

const router = express.Router();

router.get('/', autenticar, controller.getCategorias);
router.post('/', autenticar, autorizar('dueño', 'administrador'), controller.createCategoria);

module.exports = router;