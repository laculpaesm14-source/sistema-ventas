const express = require('express');
const controller = require('../controllers/venta.controller');

const router = express.Router();

router.get('/', controller.getVentas);
router.get('/:id', controller.getVenta);
router.post('/', controller.createVenta);

module.exports = router;
