const pool = require('../config/db');

async function obtenerUsuarioPorCorreo(correo) {
  const [usuarios] = await pool.execute(`
    SELECT u.id_usuario, u.nombre, u.correo, u.contrasena, u.activo,
           r.nombre AS rol
    FROM usuarios u
    INNER JOIN roles r ON u.id_rol = r.id_rol
    WHERE u.correo = ?
  `, [correo]);

  return usuarios[0];
}

async function obtenerUsuarios() {
  const [usuarios] = await pool.execute(`
    SELECT u.id_usuario, u.nombre, u.correo, u.activo,
           r.nombre AS rol
    FROM usuarios u
    INNER JOIN roles r ON u.id_rol = r.id_rol
    ORDER BY u.id_usuario DESC
  `);
  return usuarios;
}

async function crearUsuario({ nombre, correo, contrasenaHash, rol }) {
  const [roles] = await pool.execute(
    'SELECT id_rol FROM roles WHERE nombre = ?',
    [rol]
  );

  if (!roles[0]) throw new Error('El rol seleccionado no existe.');

  const [resultado] = await pool.execute(`
    INSERT INTO usuarios (nombre, correo, contrasena, id_rol)
    VALUES (?, ?, ?, ?)
  `, [nombre, correo, contrasenaHash, roles[0].id_rol]);

  return obtenerUsuarioPorId(resultado.insertId);
}

async function obtenerUsuarioPorId(id) {
  const [usuarios] = await pool.execute(`
    SELECT u.id_usuario, u.nombre, u.correo, u.activo,
           r.nombre AS rol
    FROM usuarios u
    INNER JOIN roles r ON u.id_rol = r.id_rol
    WHERE u.id_usuario = ?
  `, [id]);

  return usuarios[0];
}

async function actualizarUsuario(id, { nombre, correo, rol, activo }) {
  const [roles] = await pool.execute(
    'SELECT id_rol FROM roles WHERE nombre = ?',
    [rol]
  );

  if (!roles[0]) throw new Error('El rol seleccionado no existe.');

  const [resultado] = await pool.execute(`
    UPDATE usuarios
    SET nombre = ?, correo = ?, id_rol = ?, activo = ?
    WHERE id_usuario = ?
  `, [nombre, correo, roles[0].id_rol, activo ? 1 : 0, id]);

  if (resultado.affectedRows === 0) return null;
  return obtenerUsuarioPorId(id);
}

module.exports = {
  obtenerUsuarioPorCorreo,
  obtenerUsuarios,
  crearUsuario,
  obtenerUsuarioPorId,
  actualizarUsuario
};
