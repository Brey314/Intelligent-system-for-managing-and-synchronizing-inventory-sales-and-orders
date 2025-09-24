const express = require('express');
const router = express.Router();
const Producto = require('../models/Producto');

// Obtener todos los productos
router.get('/', async (req, res) => {
  try {
    const { title } = req.query;
    let query = {};

    if (title) {
      // Buscar por coincidencia parcial en el título (case-insensitive)
      query.title = { $regex: title, $options: "i" };
    }

    const productos = await Producto.find(query);
    res.json(productos);
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al obtener productos' });
  }
});

// Crear un producto
router.post('/', async (req, res) => {
  try {
    const nuevoProducto = new Producto(req.body);
    await nuevoProducto.save();
    res.status(201).json(nuevoProducto);
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al crear producto' });
  }
});

module.exports = router;
