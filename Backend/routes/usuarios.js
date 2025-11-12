const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuarios');
const bcrypt = require('bcryptjs');
const verificarToken = require('../middleware/auth');
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;

router.post('/login', async (req, res) => {
  try {
    const { user,pass } = req.body;
    if (!user || !pass) return res.status(400).json({ error: 'Faltan credenciales' });
    const usuario = await Usuario.findOne({ user });
    if (!usuario) return res.status(401).json({ error: 'Usuario no encontrado' });
    const coincide = await usuario.compararPassword(pass);
    if (!coincide) return res.status(401).json({ error: 'Contraseña incorrecta' });

    const token = jwt.sign(
      { id: usuario._id, user: usuario.user, rol: usuario.rol },
      JWT_SECRET,
      { expiresIn: '2h' }
    );
    res.cookie('token', token, {
      httpOnly: true,
      secure: true, //en caso de https
      sameSite: 'Lax',
      maxAge: 2 * 60 * 60 * 1000, // 2 horas
    });
    res.json({
      message: 'Login exitoso',
      token,
      usuario: { id: usuario._id, user: usuario.user, rol: usuario.rol }
    });
    console.log("Inicio de sesión exitoso",token);
  } catch (err) {
    console.error('Error en login:', err);
    res.status(500).json({ error: 'Error en autenticación' });
  }
});

router.post('/register', async (req, res) => {
  try {

    const { name, email ,user,pass, rol } = req.body;

    if (!name || !email||!user||!pass || !rol) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }
    const existente = await Usuario.findOne({ user });
    if (existente) {
      return res.status(400).json({ error: 'El usuario ya existe' });
    }
    const nuevoUsuario = new Usuario({ name, email ,user,pass, rol });
    await nuevoUsuario.save();
    console.log("nuevo usuario creado",nuevoUsuario);
    res.status(201).json({ message: 'Usuario creado correctamente' });
  } catch (err) {
    console.error('Error al crear usuario:', err);
    res.status(500).json({ error: 'Error al crear usuario' });
  }
});

router.get('/perfil', verificarToken, async (req, res) => {
  const usuario = await Usuario.findById(req.usuario.id).select('-pass');
  console.log("Verificacion de usuario",usuario);

  res.json(usuario);
});

router.post('/logout', (req, res) => {
  res.clearCookie('token');
  console.log("Salida de sesión");
  res.json({ message: 'Sesión cerrada correctamente' });
});

router.get("/check", verificarToken, async (req, res) => {
  const usuario = await Usuario.findById(req.usuario.id).select("user rol email");
  console.log("Verificacion de usuario",usuario);
  res.json({ usuario });
});

module.exports = router;