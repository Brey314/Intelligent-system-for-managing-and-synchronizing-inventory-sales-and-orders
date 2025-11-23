const express = require('express');
const router = express.Router();
const Producto = require('../models/Producto');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;

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

// Obtener un producto específico
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const producto = await Producto.findById(id);
    if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(producto);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener producto' });
  }
});

// PUT
router.put('/admin/:id', async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ error: "No autorizado. Falta token." });
    }
    const decoded = jwt.verify(token, JWT_SECRET);
    const rolUser = decoded.rol;
    if(rolUser!=="Admin") return res.status(401).json({error:"No autorizado"});
    //console.log(' Datos recibidos en PUT:', req.body);
    const { id } = req.params;
    const updatedData = req.body;

    const updatedProduct = await Producto.findByIdAndUpdate(id, updatedData, { new: true });

    if (!updatedProduct) return res.status(404).json({ error: 'Producto no encontrado' });
    console.log("Producto actualizado",updatedProduct);
    res.json(updatedProduct);
  } catch (err) {
    console.error('Error al actualizar producto:', err);
    res.status(500).json({ error: 'Error al actualizar producto' });
  }
});

// Actualizar admin
router.post('/', async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ error: "No autorizado. Falta token." });
    }
    const decoded = jwt.verify(token, JWT_SECRET);
    const rolUser = decoded.rol;
    if(rolUser!=="Admin") return res.status(401).json({error:"No autorizado"});
    //console.log(' Datos recibidos en POST:', req.body);
    const { title, description ,price,image, category, stock } = req.body;
    if (!title || !description||!price||!image || !category || !stock ) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }
    const nuevoProducto = new Producto({ title, description ,price,image, category, stock });
    const productoGuardado = await nuevoProducto.save();
    console.log("Producto agregado",productoGuardado);
    res.status(201).json(productoGuardado);
  } catch (err) {
    console.error('Error al crear producto:', err);
    res.status(500).json({ error: 'Error al crear producto' });
  }
});

router.delete('/:_id', async (req,res)=>{
  try{
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ error: "No autorizado. Falta token." });
    }
    const decoded = jwt.verify(token, JWT_SECRET);
    const rolUser = decoded.rol;
    if(rolUser!=="Admin") return res.status(401).json({error:"No autorizado"});
    
    const {_id}=req.params;
    console.log("Producto eliminado con ide ",_id);
    productos=await Producto.findByIdAndDelete((_id))
    res.status(201).json({ message: `Producto con id ${_id} eliminado` });
  }catch(err){
    console.error('Error al eliminar producto:', err);
    res.status(500).json({ error: 'Error al eliminar producto' });

  }
});

//Actualizar por pagos
router.put('/:id/stock', async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    const product = await Producto.findById(id);
    if (!product) return res.status(404).json({ error: 'Producto no encontrado' });
    if (product.stock < quantity) return res.status(400).json({ error: 'Stock insuficiente' });
    product.stock -= quantity;
    await product.save();
    res.json({ message: 'Stock actualizado', stock: product.stock });
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar stock' });
  }
});

module.exports = router;
