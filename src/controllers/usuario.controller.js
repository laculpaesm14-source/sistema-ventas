const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario.model');

async function getUsuarios(req, res, next) {
  try {
    res.json(await Usuario.obtenerUsuarios());
  } catch (error) {
    next(error);
  }
}

async function createUsuario(req, res, next) {
  try {
    const { nombre, correo, contrasena, rol } = req.body;

    if (!nombre || !correo || !contrasena || !rol) {
      return res.status(400).json({
        mensaje: 'Nombre, correo, contraseña y rol son obligatorios.'
      });
    }

    if (!['dueño', 'administrador', 'trabajador'].includes(rol)) {
      return res.status(400).json({ mensaje: 'El rol no es válido.' });
    }

    if (contrasena.length < 8) {
      return res.status(400).json({
        mensaje: 'La contraseña debe tener al menos 8 caracteres.'
      });
    }

    const contrasenaHash = await bcrypt.hash(contrasena, 10);
    const usuario = await Usuario.crearUsuario({
      nombre,
      correo,
      contrasenaHash,
      rol
    });

    res.status(201).json({
      mensaje: 'Usuario registrado correctamente.',
      usuario
    });
  } catch (error) {
    next(error);
  }
}

async function updateUsuario(req, res, next) {
  try {
    const { nombre, correo, rol, activo } = req.body;

    if (!nombre || !correo || !rol) {
      return res.status(400).json({
        mensaje: 'Nombre, correo y rol son obligatorios.'
      });
    }

    const usuario = await Usuario.actualizarUsuario(req.params.id, {
      nombre,
      correo,
      rol,
      activo
    });

    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado.' });
    }

    res.json({
      mensaje: 'Usuario actualizado correctamente.',
      usuario
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { getUsuarios, createUsuario, updateUsuario };
