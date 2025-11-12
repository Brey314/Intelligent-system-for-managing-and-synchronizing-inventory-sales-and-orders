const express = require('express');
const router = express.Router();
const Producto = require('../models/Producto');

// Obtener todos los productos
// GET - obtener todos los productos o buscar por título
router.get('/', async (req, res) => {
  try {
    const { title } = req.query;
    let productos;
    if (title) {
      productos = await Producto.find({ title: new RegExp(title, 'i') });
    } else {
      productos = await Producto.find();
    }
    res.json(productos);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

// PUT
router.put('/:id', async (req, res) => {
  try {
    //console.log(' Datos recibidos en PUT:', req.body);
    const { id } = req.params;
    const updatedData = req.body;

    const updatedProduct = await Producto.findByIdAndUpdate(id, updatedData, { new: true });

    if (!updatedProduct) return res.status(404).json({ error: 'Producto no encontrado' });

    res.json(updatedProduct);
  } catch (err) {
    console.error('Error al actualizar producto:', err);
    res.status(500).json({ error: 'Error al actualizar producto' });
  }
});

// POST
router.post('/', async (req, res) => {
  try {
    //console.log(' Datos recibidos en POST:', req.body);
    const { title, description ,price,image, category, stock } = req.body;
    if (!title || !description||!price||!image || !category || !stock ) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }
    const nuevoProducto = new Producto({ title, description ,price,image, category, stock });
    const productoGuardado = await nuevoProducto.save();
    res.status(201).json(productoGuardado);
  } catch (err) {
    console.error('Error al crear producto:', err);
    res.status(500).json({ error: 'Error al crear producto' });
  }
});


module.exports = router;
