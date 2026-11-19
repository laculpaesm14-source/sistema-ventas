// 1. IMPORTACIONES
// Importamos Express, el framework que usamos para crear el servidor web.
const express = require('express');

// Importamos el controlador que escribimos antes.
// Ahora 'controller' tiene acceso a todas las funciones (getProductos, createProducto, etc.)
const controller = require('../controllers/producto.controller');
const { autenticar, autorizar } = require('../middlewares/auth.middleware');

// Creamos una instancia de Router. 
// Imagina que esto es un "mini-servidor" dedicado exclusivamente a manejar todo lo relacionado con 'productos'.
const router = express.Router();

// ---------------------------------------------------------
// 2. DEFINICIÓN DE RUTAS (El mapa de tráfico)
// ---------------------------------------------------------

// RUTA: GET /api/productos/
// Cuando alguien entra a esta dirección SIN un ID, ejecutamos getProductos.
router.get('/', autenticar, controller.getProductos); //obtener todos los productos

// RUTA: GET /api/productos/5
// Cuando alguien entra con un número (ID) al final, ejecutamos getProducto.
// El ':id' es un comodín; Express sabe que ahí va un valor variable.
router.get('/:id', autenticar, controller.getProducto); //obtener un producto por id

// RUTA: POST /api/productos/
// Cuando alguien envía datos nuevos (usualmente un formulario), ejecutamos createProducto.
router.post('/', autenticar, autorizar('dueño', 'administrador'), controller.createProducto);// crear un producto nuevo

// RUTA: PUT /api/productos/5
// Cuando alguien quiere modificar un producto existente (enviando su ID), ejecutamos updateProducto.
router.put('/:id', autenticar, autorizar('dueño', 'administrador'), controller.updateProducto); // actualizar un producto

// RUTA: DELETE /api/productos/5
// Cuando alguien quiere borrar un producto (enviando su ID), ejecutamos deleteProducto.
router.delete('/:id', autenticar, autorizar('dueño', 'administrador'), controller.deleteProducto); // eliminar un producto

// ---------------------------------------------------------
// 3. EXPORTACIÓN
// ---------------------------------------------------------
// Exportamos este router para que el archivo principal del servidor (app.js o index.js) 
// pueda "conectarlo" y hacerlo funcionar.
module.exports = router;