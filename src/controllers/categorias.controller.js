const Categoria = require('../models/categoria.model');

async function getCategorias(req, res, next) {
    try {
        res.json(await Categoria.obtenerCategorias());
    } catch (error) {
        next(error);
    }    
}

async function createCategoria(req, res, next) {
    try {
       if(!req.body.nombre) {
            return res.status(400).json({ mensaje: 'El campo nombre es obligatorio' });
        }
       const categoria = await Categoria.createCategoria(req.body);
       res.status(201).json({ mensaje: 'Categoria creada correctamente', categoria });
    } catch (error) {
        next(error);
    }
}
module.exports = { getCategorias, createCategoria };    