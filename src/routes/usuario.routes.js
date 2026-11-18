const express = require('express');
const controller = require('../controllers/usuario.controller');
const { autenticar, autorizar } = require('../middlewares/auth.middleware');

const router = express.Router();

router.use(autenticar, autorizar(['dueño']));
router.get('/', controller.getUsuarios);
router.post('/', controller.createUsuario);
router.put('/:id', controller.updateUsuario);

module.exports = router;
