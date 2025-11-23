const express = require('express');
const router = express.Router();
const Carrito = require('../models/Carrito');
const jwt = require("jsonwebtoken");
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;

// Obtener productos del carrito
router.get("/", async(req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ error: "No autorizado. Falta token." });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const idUser = decoded.id;

    const carrito = await Carrito.find({ idUser });
    console.log("Accede usuario al carrito con token",token);

    res.json(carrito);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
});

// Agregar producto al carrito
router.post("/", async(req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ error: "No autorizado. Falta token." });
    }
    const decoded = jwt.verify(token, JWT_SECRET);
    const idUser = decoded.id;
    //console.log(idUser);
    const { idProd,title, description,price, image, category,stock,cuantity } = req.body;
    const nuevoProducto = new Carrito({ 
      idProd,
      idUser,
      title, 
      description,
      price, 
      image, 
      category,
      stock,
      cuantity
    });
    const CarritoGuardado = await nuevoProducto.save();
    console.log("Producto agregado con token=",token);
    console.log(nuevoProducto);
    res.status(201).json({ message: "Producto agregado", CarritoGuardado });
  } catch (err) {
    console.error('Error al crear usuario:', err);
    res.status(500).json({ error: 'Error al crear usuario' });
  }
});

// Eliminar producto por id
router.delete("/:_id", async(req, res) => {
  try{
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ error: "No autorizado. Falta token." });
    }
    const decoded = jwt.verify(token, JWT_SECRET);
    const idUser = decoded.id;
    const { _id } = req.params;
    //console.log(_id);
    await Carrito.findByIdAndDelete((_id));
    console.log("Producto eliminado con token=",token);
    res.status(201).json({ message: `Producto con id ${_id} eliminado` });
  }catch (err) {
    console.error('Error al actualizar carrito:', err);
    res.status(500).json({ error: 'Error al actualizar producto' });
  }
});

// Eliminar producto por id al comprar
router.delete("/payed/:_id", async(req, res) => {
  try{
    const { _id } = req.params;
    //console.log(_id);
    await Carrito.findByIdAndDelete((_id));
    console.log("Producto comprado del carrito y eliminado");
    res.status(201).json({ message: `Producto con id ${_id} eliminado` });
  }catch (err) {
    console.error('Error al actualizar carrito:', err);
    res.status(500).json({ error: 'Error al actualizar producto' });
  }
});

router.put("/:_id", async(req, res) => {
  try{
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ error: "No autorizado. Falta token." });
    }
    const decoded = jwt.verify(token, JWT_SECRET);

    //console.log(' Datos recibidos en PUT:', req.body);

    const {_id}=req.params;
    const updatedData = req.body;
    let producto=null;
    // Buscar el producto por _id
    producto = await Carrito.findByIdAndUpdate(_id, updatedData, { new: true });
    if (!producto) {
      return res.status(404).json({ message: `Producto con id ${_id} no encontrado en el carrito` });
    }

    res.json({ message: "Cantidad actualizada", producto });
    console.log("Producto actualizado con token=",token);
    console.log("Cantidad del producto actualizada",producto);
  }catch (err) {
    console.error('Error al actualizar carrito:', err);
    res.status(500).json({ error: 'Error al actualizar producto' });
  }

});

module.exports = router;