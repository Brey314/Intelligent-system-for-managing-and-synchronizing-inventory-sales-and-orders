const express = require('express');
const router = express.Router();
const Pedidos = require('../models/pedidos');
const jwt = require("jsonwebtoken");
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;

// Obtener todos los pedidos del usuario
router.get("/", async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ error: "No autorizado. Falta token." });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.id;

    const pedidos = await Pedidos.find({ userId });
    res.json(pedidos);
  } catch (err) {
    console.error("Error al obtener pedidos:", err);
    res.status(500).json({ error: "Error al obtener pedidos" });
  }
});


router.post("/", async(req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ error: "No autorizado. Falta token." });
    }
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.id;

    const nuevoPedido = new Pedidos({
        userId,
        ...req.body
    });
    const PedidoGuardado = await nuevoPedido.save();
    console.log(PedidoGuardado);
    res.status(201).json({ message: "Pedido creado", PedidoGuardado });
  } catch (err) {
    console.error('Error al crear pedido:', err);
    res.status(500).json({ error: 'Error al crear pedido' });
  }
  });

module.exports = router;