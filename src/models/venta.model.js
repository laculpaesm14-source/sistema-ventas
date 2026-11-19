const pool = require('../config/db');

async function obtenerVentas(idUsuario = null) {
  const filtroUsuario = idUsuario ? 'WHERE v.id_usuario = ?' : '';
  const parametros = idUsuario ? [idUsuario] : [];
  const [rows] = await pool.execute(`
        SELECT v.id_venta, v.fecha, v.total, v.id_cliente, v.id_usuario,
        CONCAT(c.nombre, ' ', c.apellido) AS cliente
        FROM ventas v
        INNER JOIN clientes c
        ON v.id_cliente = c.id_cliente
        ${filtroUsuario}
        ORDER BY v.id_venta DESC
      `, parametros);
  return rows;
}

async function obtenerVentaPorid(id, idUsuario = null) {
  const filtroUsuario = idUsuario ? 'AND v.id_usuario = ?' : '';
  const parametros = idUsuario ? [id, idUsuario] : [id];
  const [ventas] = await pool.execute(`
        SELECT v.id_venta, v.fecha, v.total, v.id_cliente, v.id_usuario,
        CONCAT(c.nombre, ' ', c.apellido) AS cliente
        FROM ventas v
        INNER JOIN clientes c
        ON v.id_cliente = c.id_cliente
        WHERE v.id_venta = ?
        ${filtroUsuario}
      `, parametros);
    if (!ventas [0]) return null;  

    const [detalles] = await pool.execute(`
        SELECT d.id_detalle, d.id_producto, p.nombre AS producto,
               d.cantidad, d.precio_unitario, d.subtotal
        FROM detalle_ventas d
        INNER JOIN productos p
        ON d.id_producto = p.id_producto
        WHERE d.id_venta = ?
        `, [id]);
    return { ...ventas[0], detalles };
}

async function crearVenta({ id_cliente, detalles, id_usuario }) {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    let total = 0;
    const calculados = [];

    for (const item of detalles){
        const [productos] = await connection.execute(`
            SELECT id_producto, nombre, precio, stock
            FROM productos
            WHERE id_producto = ? FOR UPDATE
        `, [item.id_producto]
      );
      const producto = productos[0];
      if(!producto) throw new Error('producto inexistente.');

      const cantidad = Number(item.cantidad);
      if(!Number.isInteger(cantidad) || cantidad <= 0){
        throw new Error('Cantidad invalida.');
      }
      if(producto.stock < cantidad){
        throw new Error(`Stock insuficiente para ${producto.nombre}.`);
      }
      const precio = Number(producto.precio);
      const subtotal = precio * cantidad;
      total += subtotal;
      // total= total + subtotal
      calculados.push({
        id_producto: producto.id_producto,
        cantidad,
        precio_unitario: precio,
        subtotal
      });
    }
    const fecha = new Date().toISOString().slice(0,10);

    const[venta] = await connection.execute(`
      INSERT INTO ventas (fecha, total, id_cliente, id_usuario) VALUES(?,?,?,?)
      `,[fecha, total, id_cliente, id_usuario]
    );  
    for(const item of calculados){
      await connection.execute(`
        INSERT INTO detalle_ventas
        (id_venta, id_producto, cantidad, precio_unitario, subtotal)
        VALUES(?,?,?,?,?)
        `,[venta.insertId,item.id_producto,item.cantidad,item.precio_unitario,
          item.subtotal]
      );
      await connection.execute(`
        UPDATE productos SET stock = stock - ?
        WHERE id_producto = ?
        `,[item.cantidad,item.id_producto]
      );
    }
    await connection.commit();
    return obtenerVentaPorid(venta.insertId)
  }catch (error) {
    await connection.rollback();
    throw error;
  }finally{
     connection.release();
  }
}

module.exports = { obtenerVentas, obtenerVentaPorid, crearVenta };