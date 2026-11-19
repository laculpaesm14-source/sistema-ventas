const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario.model');

async function iniciarSesion(req, res, next) {
  try {
    const { correo, contrasena } = req.body;
    if (!correo || !contrasena) {
      return res.status(400).json({ mensaje: 'Correo y contraseña son obligatorios.' });
    }
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ mensaje: 'Configura JWT_SECRET en el archivo .env.' });
    }

    const usuario = await Usuario.obtenerPorCorreo(correo.trim());
    const contrasenaValida = usuario
      ? await bcrypt.compare(contrasena, usuario.contrasena)
      : false;

    if (!usuario || !usuario.activo || !contrasenaValida) {
      return res.status(401).json({ mensaje: 'Correo o contraseña incorrectos.' });
    }

    const token = jwt.sign(
      { sub: usuario.id_usuario },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES || '8h' }
    );

    res.json({
      token,
      usuario: {
        id_usuario: usuario.id_usuario,
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: usuario.rol
      }
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { iniciarSesion };