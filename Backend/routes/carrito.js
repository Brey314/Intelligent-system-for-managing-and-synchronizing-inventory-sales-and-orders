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
    console.log(idUser);
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
    console.log(_id);
    carrito = await Carrito.findByIdAndDelete((_id));
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
    const userid = decoded._id;

    console.log(' Datos recibidos en PUT:', req.body);
    
    const {_id,idProd}=req.params;
    const updatedData = req.body;
    let producto=null;
    if(_id==idProd){
      const findproducto = await Carrito.find({idProd:prodid, idUser:userid})
      const id=findproducto._id;
      producto = await Carrito.findByIdAndUpdate(id, updatedData, { new: true });
      if (!producto) {
        return res.status(404).json({ message: `Producto con id ${_id} no encontrado en el carrito` });
      }
    }else{
    // Buscar el producto por _id
    producto = await Carrito.findByIdAndUpdate(_id, updatedData, { new: true });
    if (!producto) {
      return res.status(404).json({ message: `Producto con id ${_id} no encontrado en el carrito` });
    }
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