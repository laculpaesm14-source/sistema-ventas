const jwt = require('jsonwebtoken');

function autenticar(req, res, next) {
  const encabezado = req.headers.authorization;

  if (!encabezado || !encabezado.startsWith('Bearer ')) {
    return res.status(401).json({ mensaje: 'Debe iniciar sesión.' });
  }

  const token = encabezado.slice(7);

  try {
    const usuario = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = usuario;
    next();
  } catch (error) {
    return res.status(401).json({ mensaje: 'La sesión no es válida o venció.' });
  }
}

function autorizar(rolesPermitidos) {
  return (req, res, next) => {
    if (!rolesPermitidos.includes(req.usuario.rol)) {
      return res.status(403).json({
        mensaje: 'No tiene permiso para realizar esta acción.'
      });
    }
    next();
  };
}

module.exports = { autenticar, autorizar };
