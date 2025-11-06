const express = require('express');
const router = express.Router();
const Usuario = require('../models/Users');

router.get('/', async (req, res) => {
  try {
    const { name } = req.query;
    let usuarios;
    if (name) {
      usuarios = await Usuario.find({ name: new RegExp(name, 'i') });
    } else {
      usuarios = await Usuario.find();
    }
    res.json(usuarios);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
});

router.post('/', async (req, res) => {
  try {
    console.log(' Datos recibidos en POST:', req.body);
    const { name, email ,user,pass, rol } = req.body;
    if (!name || !email||!user||!pass || !rol) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }
    const nuevoUsuario = new Usuario({ name, email ,user,pass, rol });
    const UsuarioGuardado = await nuevoUsuario.save();
    res.status(201).json(UsuarioGuardado);
  } catch (err) {
    console.error('Error al crear usuario:', err);
    res.status(500).json({ error: 'Error al crear usuario' });
  }
});

module.exports = router;