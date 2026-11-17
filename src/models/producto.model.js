// modelar la vista la tabla   productos   

const pool =require('../config/db');

// la comilla ``  izquierda sirve para sql
//funcion que busca todos los productos de la base de datos
async function obtenerProductos() {
    const [rows] = await pool.execute
    (`SELECT
         p.id_producto,
         p.nombre,
         p.precio,
         p.stock,
         p.id_categoria,
         c.nombre AS categoria
    FROM productos p 
    INNER JOIN categorias c 
    ON p.id_categoria = c.id_categoria
    ORDER BY p.id_producto DESC
    `);
    return rows;
}

// solo producto por id 
// obtiene todo los productos por id de la base de datoss
async function obtenerProductoPorId(id) {
    const [rows] = await pool.execute(
        `SELECT
             p.id_producto,
             p.nombre,
             p.precio,
             p.stock,
             p.id_categoria,
             c.nombre AS categoria
        from productos p 
        INNER JOIN categorias c 
        ON p.id_categoria = c.id_categoria
        WHERE p.id_producto = ?
        `, [id]);

    return rows[0];
}

// insertar un producto nuevo en la base de datos
async function crearProducto({nombre, precio, stock, id_categoria}){
    const [result] = await pool.execute(
        `INSERT INTO productos (nombre, precio, stock, id_categoria)
         VALUES (?, ?, ?, ?)`, [nombre, precio, stock, id_categoria]
    );
       
    return obtenerProductoPorId(result.insertId); // Devuelve el producto recién creado
}

// actualizar un producto existente en la base de datos
async function actualizarProducto(id, {nombre, precio, stock, id_categoria}) {
    const [result] = await pool.execute(
        `UPDATE productos 
        SET nombre = ?, precio = ?, stock = ?, id_categoria = ?
         WHERE id_producto= ?`, [nombre, precio, stock, id_categoria, id]
       
    );
    if(result.affectedRows === 0) return null; // No se encontró el producto para actualizar
    return obtenerProductoPorId(id); // Devuelve el producto actualizado
}

async function eliminarProducto(id) {
    const [result] = await pool.execute(
        `DELETE FROM productos WHERE id_producto = ?`, [id]
    );
    return result.affectedRows > 0; // Devuelve true si se eliminó el producto, false si no se encontró
}

//exportar las funciones para que puedan ser utilizadas en otros archivos
module.exports = { 
    obtenerProductos, 
    obtenerProductoPorId,
    crearProducto,
    actualizarProducto,
    eliminarProducto  
}; 
