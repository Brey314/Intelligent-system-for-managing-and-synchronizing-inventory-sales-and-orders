const express = require('express');
const router = express.Router();
const Carrito = require('../models/Carrito');

// Obtener productos del carrito
router.get("/", async(req, res) => {
  try {
    const { idUser } = req.query;
    let carrito;
    carrito = await Carrito.find({ idUser: new RegExp(idUser, 'i') });
    res.json(carrito);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
});

// Agregar producto al carrito
router.post("/", async(req, res) => {
  try {
    const { _id, idUser,title, description,price, image, category,stock,cuantity,creation_date } = req.body;
    const nuevoProducto = new Carrito({ _id, idUser,title, description,price, image, category,stock,cuantity,creation_date });
    const CarritoGuardado = await nuevoProducto.save();
    res.status(201).json({ message: "Producto agregado", CarritoGuardado });
  } catch (err) {
    console.error('Error al crear usuario:', err);
    res.status(500).json({ error: 'Error al crear usuario' });
  }
});

// Eliminar producto por id
router.delete("/:id", async(req, res) => {
  try{
    const { id } = req.params;
    carrito = await Carrito.findByIdAndDelete(id);
    res.status(201).json({ message: `Producto con id ${id} eliminado` });
  }catch (err) {
    console.error('Error al actualizar carrito:', err);
    res.status(500).json({ error: 'Error al actualizar producto' });
  }
});

router.put("/:id", async(req, res) => {
  try{
    console.log(' Datos recibidos en PUT:', req.body);
    const { id } = req.params;
    const updatedData = req.body;

    // Buscar el producto por _id
    const producto = await Carrito.findByIdAndUpdate(id, updatedData, { new: true });

    if (!producto) {
      return res.status(404).json({ message: `Producto con id ${id} no encontrado en el carrito` });
    }

    // Actualizar cantidad
    producto.cuantity = updatedData;

    res.json({ message: "Cantidad actualizada", producto });
  }catch (err) {
    console.error('Error al actualizar carrito:', err);
    res.status(500).json({ error: 'Error al actualizar producto' });
  }

});

module.exports = router;