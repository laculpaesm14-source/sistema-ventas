const express = require('express');
const controller = require('../controllers/auth.controller');
const { autenticar } = require('../middlewares/auth.middleware');

const router = express.Router();

router.post('/login', controller.iniciarSesion);
router.get('/me', autenticar, (req, res) => res.json(req.usuario));

module.exports = router;