const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario.model');

async function login(req, res, next) {
  try {
    const correo = String(req.body.correo || '').trim();
    const contrasena = String(req.body.contrasena || '');

    if (!correo || !contrasena) {
      return res.status(400).json({
        mensaje: 'Correo y contraseña son obligatorios.'
      });
    }

    const usuario = await Usuario.obtenerUsuarioPorCorreo(correo);

    if (!usuario || !usuario.activo) {
      return res.status(401).json({
        mensaje: 'Correo o contraseña incorrectos.'
      });
    }

    const contrasenaCorrecta = await bcrypt.compare(
      contrasena,
      usuario.contrasena
    );

    if (!contrasenaCorrecta) {
      return res.status(401).json({
        mensaje: 'Correo o contraseña incorrectos.'
      });
    }

    const token = jwt.sign(
      {
        id_usuario: usuario.id_usuario,
        nombre: usuario.nombre,
        rol: usuario.rol
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES || '8h' }
    );

    res.json({
      token,
      usuario: {
        id_usuario: usuario.id_usuario,
        nombre: usuario.nombre,
        rol: usuario.rol
      }
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { login };
