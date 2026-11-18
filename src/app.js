const express = require('express');
const cors = require('cors');
const productoRoutes = require('./routes/producto.routes');
const categoriaRoutes = require('./routes/categoria.routes');
const clienteRoutes = require('./routes/cliente.routes');
const ventaRoutes = require('./routes/venta.routes');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname,'..','public')));
app.use('/api/productos', productoRoutes);
app.use('/api/categorias', categoriaRoutes);
app.use('/api/clientes', clienteRoutes);
app.use('/api/ventas', ventaRoutes);
app.get('/api', (req, res) => {
    res.json({ message: 'API Sistema de Ventas funcionando' });
});

app.use((error, req, res, next) => {
    console.error(error);
    if(error.code === 'ER_DUP_ENTRY'){
        return res.status(409).json({
            mensaje: 'Ya existe un registro con dato que debe ser único.'
        });
    }

    if(error.code === 'ER_ROW_IS_REFERENCED_2'){
        return res.status(409).json({
            mensaje: 'No se puede eliminar el registro relacionado.'
        });
    }

    if(error.code === 'ER_NO_REFERENCED_ROW_2'){
        return res.status(409).json({
            mensaje: 'La clave foránea enviada no existe.'
        });
    }
    res.status(500).json({
        mensaje: error.message || 'Error interno del servidor' 
    });

});




module.exports = app;