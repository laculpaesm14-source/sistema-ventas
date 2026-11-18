const express = require('express');
const controller = require('../controllers/cliente.controller');
const router = express.Router();

router.get('/', controller.getClientes);
router.get('/:id', controller.getCliente);
router.post('/', controller.createCliente);
router.put('/:id', controller.updateCliente);
router.delete('/:id', controller.deleteCliente);

module.exports = router;