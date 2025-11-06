const express = require('express');
const router = express.Router();
const Producto = require('../models/Producto');

// Obtener productos del carrito
router.get("/", (req, res) => {
  res.json(carrito);
});

// Agregar producto al carrito
router.post("/", (req, res) => {
  const { _id, title, description,price, image, category,stock,cuantity,creation_date } = req.body;
  const producto = { _id, title, description,price, image, category,stock,cuantity,creation_date };
  carrito.push(producto);
  res.json({ message: "Producto agregado", producto });
});

// Eliminar producto por id
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  carrito = carrito.filter(p => p._id != id);
  res.json({ message: `Producto con id ${id} eliminado` });
});

module.exports = router;