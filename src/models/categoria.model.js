const pool = require('../config/db');

async function obtenerCategorias() {
    const [rows] = await pool.execute(
        `SELECT * FROM categorias order by nombre`
    );

    return rows;
}

async function createCategoria({nombre, descripcion}) {
    const [result] = await pool.execute(
       `INSERT INTO categorias (nombre, descripcion)VALUES (?, ?)`,
        [nombre, descripcion || null ]
    );
    const [rows] = await pool.execute(
        `SELECT * FROM categorias WHERE id_categoria = ?`,
        [result.insertId]
    );

    return rows[0];
}
module.exports = {obtenerCategorias, createCategoria};