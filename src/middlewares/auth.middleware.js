const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario.model');

async function autenticar(req, res, next) {
  const cabecera = req.headers.authorization || '';
  const partes = cabecera.split(' ');
  const [tipo, token] = partes;

  if (partes.length !== 2 || tipo !== 'Bearer' || !token) {
    return res.status(401).json({ mensaje: 'Inicia sesión para continuar.' });
  }

  if (!process.env.JWT_SECRET) {
    return next(new Error('Falta configurar JWT_SECRET en el archivo .env.'));
  }

  try {
    const datos = jwt.verify(token, process.env.JWT_SECRET);
    const usuario = await Usuario.obtenerPorId(datos.sub);

    if (!usuario || !usuario.activo) {
      return res.status(401).json({ mensaje: 'La cuenta no existe o está inactiva.' });
    }

    req.usuario = usuario;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({ mensaje: 'La sesión venció. Inicia sesión nuevamente.' });
    }
    next(error);
  }
}

function autorizar(...rolesPermitidos) {
  return (req, res, next) => {
    if (!req.usuario || !rolesPermitidos.includes(req.usuario.rol)) {
      return res.status(403).json({ mensaje: 'No tienes permiso para realizar esta acción.' });
    }
    next();
  };
}

module.exports = { autenticar, autorizar };