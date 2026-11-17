const pool = require('../config/db');

async function obtenerClientes(){ 
    const[rows] = await pool.execute(
       `SELECT * FROM clientes ORDER BY id_cliente DESC`
    );
    return rows; 
}
async function obtenerClientePorId(id){ 
    const[rows] = await pool.execute(
       `SELECT * FROM clientes WHERE id_cliente = ?`,[id]
    );
    return rows[0];
}
async function crearCliente({nombre,apellido,correo,telefono}) { 
    const[result] = await pool.execute(
       `INSERT INTO clientes (nombre,apellido,correo,telefono)
        VALUES  (?,?,?,?)`,
        [nombre,apellido,correo,telefono || null]
    );
    return obtenerClientePorId(result.insertId);
}
async function actualizarCliente(id,{nombre,apellido,correo,telefono}) {
    const [result] = await pool.execute(
        `UPDATE clientes
        SET nombre = ?, apellido = ?, correo = ?, telefono = ?
        WHERE id_cliente = ?`,
        [nombre,apellido,correo,telefono || null, id]
    );
    if (result.affectedRows === 0) return null;
    return obtenerClientePorId(id);
}
async function eliminarCliente(id) {
    const [result] = await pool.execute(
        `DELETE FROM clientes WHERE id_cliente = ?`, [id]
    );
    return result.affectedRows > 0;
}

module.exports = {
    obtenerClientes,
    obtenerClientePorId,
    crearCliente,
    actualizarCliente,
    eliminarCliente

};