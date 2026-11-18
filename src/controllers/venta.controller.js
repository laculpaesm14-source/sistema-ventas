const Venta= require('../models/venta.model');

async function getVentas(req, res, next) {
    try{
        res.json(await Venta.obtenerVentas());
    }catch(error){
        next(error);
    }
}

async function getVenta(req, res, next) {
    try{
        const venta = await Venta.obtenerVentasPorid(req.params.id);
        if(!venta) return res.status(404).json({mensaje: 'venta no encontrada'});
        res.json(venta);
    }catch(error){
        next(error);
    }
}

async function createVenta(req, res, next) {
    try{
        const {id_cliente, detalles} = req.body;
        if (!id_cliente || !Array.isArray(detalles) || detalles.length === 0){
            return res.status(400).json({
                mensaje: 'seleccione un cliente y agregue al menos un producto a la venta.'
            });
        }
        const venta = await Venta.crearVenta({id_cliente, detalles});
        res.status(201).json({mensaje: 'venta creada correctamente', venta});
    }catch(error){
        next(error);
    }
}

module.exports = { getVentas, getVenta, createVenta };