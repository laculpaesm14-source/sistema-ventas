const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario.model');

const ROLES_ASIGNABLES = ['administrador', 'trabajador'];

async function listarUsuarios(req, res, next) {
  try {
    res.json(await Usuario.listar());
  } catch (error) {
    next(error);
  }
}

async function crearUsuario(req, res, next) {
  try {
    const { nombre, correo, contrasena, rol } = req.body;
    if (!nombre || !correo || !contrasena || !rol) {
      return res.status(400).json({
        mensaje: 'Nombre, correo, contraseña y rol son obligatorios.'
      });
    }
    if (!ROLES_ASIGNABLES.includes(rol)) {
      return res.status(400).json({
        mensaje: 'Solo se pueden crear cuentas de administrador o trabajador.'
      });
    }
    if (contrasena.length < 8) {
      return res.status(400).json({
        mensaje: 'La contraseña debe tener al menos 8 caracteres.'
      });
    }

    const contrasenaCifrada = await bcrypt.hash(contrasena, 10);
    const usuario = await Usuario.crear({
      nombre: nombre.trim(),
      correo: correo.trim(),
      contrasena: contrasenaCifrada,
      rol
    });
    res.status(201).json({ mensaje: 'Usuario creado correctamente.', usuario });
  } catch (error) {
    next(error);
  }
}

module.exports = { listarUsuarios, crearUsuario };