const express = require('express');
const controller = require('../controllers/venta.controller');
const { autenticar } = require('../middlewares/auth.middleware');

const router = express.Router();

router.get('/', autenticar, controller.getVentas);
router.get('/:id', autenticar, controller.getVenta);
router.post('/', autenticar, controller.createVenta);

module.exports = router;
