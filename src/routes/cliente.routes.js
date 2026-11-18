const express = require('express');
const controller = require('../controllers/cliente.controller');
const { autenticar, autorizar } = require('../middlewares/auth.middleware');
const router = express.Router();

router.get('/', autenticar, controller.getClientes);
router.get('/:id', autenticar, controller.getCliente);
router.post('/', autenticar, controller.createCliente);
router.put('/:id', autenticar, controller.updateCliente);
router.delete('/:id', autenticar, autorizar(['dueño', 'administrador']), controller.deleteCliente);

module.exports = router;