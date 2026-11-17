const Cliente = require('../models/cliente.model');

async function getClientes(req, res,next) {
    try {
        res.json(await Cliente.obtenerClientes());

    }catch (error) {
        next(error);
    }
}        
async function getCliente(req, res,next) {
     try {
        const cliente = await Cliente.obtenerClientePorId(req.params.id);
        if (!cliente) {
            return res.status(404).json({ mensaje: 'Cliente no encontrado' });
        }
        res.json(cliente);
    }catch (error) {
        next(error);
    }
}
async function createCliente(req,res,next) {
    try {
        const { nombre, apellido, correo } = req.body;
        if (!nombre || !apellido || !correo) {
            return res.status(400).json({ mensaje: 'nombre, apellido y correo son obligatorios' });
        }
        const cliente = await Cliente.crearCliente(req.body);
        res.status(201).json({mensaje: 'cliente registrado', cliente});
    } catch (error) {
        next(error);
    }
}
async function updateCliente(req, res,next) {

    try {
        const cliente = await Cliente.actualizarCliente(req.params.id, req.body);
        if (!cliente) {
            return res.status(404).json({ mensaje: 'Cliente no encontrado.' });
        }
        res.json({ mensaje: 'Cliente actualizado', cliente });

        
    } catch (error) {
        next(error);
    }
}
 async function deleteCliente(req, res,next) {
        try {
            const eliminado = await Cliente.eliminarCliente(req.params.id);
            if (!eliminado) {
                return res.status(404).json({ mensaje: 'Cliente no encontrado.' });
            }
            res.json({ mensaje: 'Cliente eliminado', cliente: eliminado });
        } catch (error) {
            next(error);
        }
}

module.exports = {
    getClientes,
    getCliente,
    createCliente,
    updateCliente,
    deleteCliente                           
};  
