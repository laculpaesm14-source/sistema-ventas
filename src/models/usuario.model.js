const pool = require('../config/db');

async function obtenerPorCorreo(correo) {
  const [rows] = await pool.execute(`
    SELECT id_usuario, nombre, correo, contrasena, activo, rol
    FROM usuarios
    WHERE correo = ?
  `, [correo]);
  return rows[0] || null;
}

async function obtenerPorId(id) {
  const [rows] = await pool.execute(`
    SELECT id_usuario, nombre, correo, activo, rol
    FROM usuarios
    WHERE id_usuario = ?
  `, [id]);
  return rows[0] || null;
}

async function listar() {
  const [rows] = await pool.execute(`
    SELECT id_usuario, nombre, correo, activo, rol
    FROM usuarios
    ORDER BY id_usuario DESC
  `);
  return rows;
}

async function crear({ nombre, correo, contrasena, rol }) {
  const [result] = await pool.execute(`
    INSERT INTO usuarios (nombre, correo, contrasena, rol)
    VALUES (?, ?, ?, ?)
  `, [nombre, correo, contrasena, rol]);

  return obtenerPorId(result.insertId);
}

module.exports = { obtenerPorCorreo, obtenerPorId, listar, crear };