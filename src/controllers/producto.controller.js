const Producto = require('../models/producto.model');

function validarProducto(body) {
  const { nombre, precio, stock, id_categoria } = body;

  if (!nombre || precio === undefined || stock === undefined || id_categoria === undefined) {
    return 'Nombre, precio, stock y categoria son obligatorios.';
  }

  if (Number(precio) < 0 || Number(stock) < 0) {
    return 'Precio y stock no pueden ser negativos.';
  }

  return null;
}

async function getProductos(req, res, next) {
  try {
    res.json(await Producto.obtenerProductos());
  } catch (error) {
    next(error);
  }
}

async function getProducto(req, res, next) {
  try {
    const producto = await Producto.obtenerProductoPorId(req.params.id);
    if (!producto) {
      return res.status(404).json({ mensaje: 'Producto no encontrado.' });
    }
    res.json(producto);
  } catch (error) {
    next(error);
  }
}

async function createProducto(req, res, next) {
  try {
    const errorValidacion = validarProducto(req.body);
    if (errorValidacion) {
      return res.status(400).json({ mensaje: errorValidacion });
    }

    const producto = await Producto.crearProducto(req.body);
    res.status(201).json({
      mensaje: 'Producto registrado correctamente.',
      producto
    });
  } catch (error) {
    next(error);
  }
}

async function updateProducto(req, res, next) {
  try {
    const errorValidacion = validarProducto(req.body);
    if (errorValidacion) {
      return res.status(400).json({ mensaje: errorValidacion });
    }

    const producto = await Producto.actualizarProducto(req.params.id, req.body);
    if (!producto) {
      return res.status(404).json({ mensaje: 'Producto no encontrado.' });
    }

    res.json({ mensaje: 'Producto actualizado correctamente.', producto });
  } catch (error) {
    next(error);
  }
}

async function deleteProducto(req, res, next) {
  try {
    const eliminado = await Producto.eliminarProducto(req.params.id);
    if (!eliminado) {
      return res.status(404).json({ mensaje: 'Producto no encontrado.' });
    }

    res.json({ mensaje: 'Producto eliminado correctamente.' });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getProductos,
  getProducto,
  createProducto,
  updateProducto,
  deleteProducto
};