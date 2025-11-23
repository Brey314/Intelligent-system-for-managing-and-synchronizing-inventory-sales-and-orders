const express = require("express");
const router = express.Router();
const Address = require("../models/address"); 
const verificarToken = require("../middleware/auth");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET;

// Obtener todas las direcciones del usuario
router.get("/:userId", verificarToken, async (req, res) => {
  try {
    const { userId } = req.params;

    // Evitar que un usuario lea direcciones de otro
    if (req.usuario.id !== userId)
      return res.status(403).json({ error: "Acceso no autorizado" });

    const addresses = await Address.find({ userId });
    res.json(addresses);
  } catch (err) {
    console.error("Error al obtener direcciones:", err);
    res.status(500).json({ error: "Error al obtener direcciones" });
  }
});

// Obtener una dirección específica
router.get("/:addressId", async (req, res) => {
  try {
    const { addressId } = req.params;
    const address = await Address.findById(addressId);

    if (!address) return res.status(404).json({ error: "Dirección no encontrada" });

    // For internal calls (like webhooks), skip ownership check if no token
    const token = req.cookies.token;
    if (token) {
      const decoded = jwt.verify(token, JWT_SECRET);
      if (address.userId.toString() !== decoded.id)
        return res.status(403).json({ error: "Acceso no autorizado" });
    }

    res.json(address);
  } catch (err) {
    console.error("Error al obtener dirección:", err);
    res.status(500).json({ error: "Error al obtener la dirección" });
  }
});

// Crear una nueva dirección
router.post("/", verificarToken, async (req, res) => {
  try {
    const token = req.cookies.token;
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.id;
    // Solo el propio usuario puede crear sus direcciones
    if (req.usuario.id !== userId)
      return res.status(403).json({ error: "Acceso no autorizado" });

    const nueva = new Address({
      ...req.body,
      userId
    });

    await nueva.save();
    res.status(201).json(nueva);
  } catch (err) {
    console.error("Error al crear dirección:", err);
    res.status(500).json({ error: "Error al crear dirección" });
  }
});

// Actualizar una dirección
router.put("/:_id", verificarToken, async (req, res) => {
  try {
    const { _id } = req.params;
    console.log("PUT request for address ID:", _id);
    console.log("Request body:", req.body);
    console.log("Usuario from token:", req.usuario);

    // First, find the address to check ownership
    const address = await Address.findById(_id);
    if (!address) {
      console.log("Address not found");
      return res.status(404).json({ error: "Dirección no encontrada" });
    }

    if (address.userId.toString() !== req.usuario.id) {
      console.log("Unauthorized access attempt");
      return res.status(403).json({ error: "Acceso no autorizado" });
    }

    const updated = await Address.findByIdAndUpdate(_id, req.body, {
      new: true
    });
    console.log("Updated address:", updated);
    res.json(updated);
  } catch (err) {
    console.error("Error al actualizar dirección:", err);
    res.status(500).json({ error: "Error al actualizar dirección" });
  }
});

// Eliminar dirección
router.delete("/:_id", verificarToken, async (req, res) => {
  try {
    const { _id } = req.params;  // Change from addressId to _id
    const address = await Address.findById(_id);  // Use _id instead of addressId

    if (!address) return res.status(404).json({ error: "Dirección no encontrada" });

    if (address.userId.toString() !== req.usuario.id)
      return res.status(403).json({ error: "Acceso no autorizado" });

    await Address.findByIdAndDelete(_id);  // Use _id instead of addressId

    res.json({ message: "Dirección eliminada correctamente" });
  } catch (err) {
    console.error("Error al eliminar dirección:", err);
    res.status(500).json({ error: "Error al eliminar dirección" });
  }
});


module.exports = router;
