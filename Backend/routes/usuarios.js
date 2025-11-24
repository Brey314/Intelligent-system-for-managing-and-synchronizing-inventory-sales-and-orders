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
      sameSite: 'None',
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

router.put('/perfil', verificarToken, async (req, res) => {
  try {
    const token=req.cookies.token;
    if (!token) {
      return res.status(401).json({ error: "No autorizado. Falta token." });
    }
    const { name, email, user } = req.body;

    const usuario = await Usuario.findByIdAndUpdate(
      req.usuario.id,
      { name, email, user },
      { new: true }
    ).select("-pass");

    res.json({ message: "Perfil actualizado", usuario });
  } catch (err) {
    console.error("Error actualizando perfil:", err);
    res.status(500).json({ error: "Error actualizando" });
  }
});

router.post('/logout', (req, res) => {
  console.log("Logout: Clearing cookie, token before:", req.cookies.token);
  res.clearCookie('token', { httpOnly: true, secure: true, sameSite: 'None' });
  console.log("Logout: Cookie cleared, sending response");
  res.json({ message: 'Sesión cerrada correctamente' });
});

router.get("/check", verificarToken, async (req, res) => {
  console.log("Check: Token verified, user ID:", req.usuario.id);
  const usuario = await Usuario.findById(req.usuario.id).select("name email user rol ");
  console.log("Check: Usuario found:", usuario ? usuario.user : "null");
  res.json({ usuario: { id: usuario._id, user: usuario.user, rol: usuario.rol, name: usuario.name, email: usuario.email } });
});

// Obtener usuarios (buscar por email)
router.get("/", async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ error: "No autorizado. Falta token." });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const roll = decoded.rol;
    if(roll!=="Admin"){
      return res.status(401).json({ error: "No autorizado." });
    }
    const { email, _id} = req.query;

    if (_id) {
      try {
        const user = await Usuario.findById(_id).select("-pass");
        if (!user) return res.json([]);
        return res.json([user]); // para que coincida con la respuesta tipo array
      } catch (e) {
        return res.status(400).json({ error: "ID inválido" });
      }
    }
    if (email) {
      const users = await Usuario.find({ email: { $regex: email, $options: "i" } })
        .select("-pass");
      return res.json(users);
    }

    const users = await Usuario.find().select("-pass");
    res.json(users);

  } catch (err) {
    console.error("Error listando usuarios:", err);
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
});

// Editar usuario por ID
router.put("/:id", async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ error: "No autorizado. Falta token." });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const roll = decoded.rol;
    if(roll!=="Admin"){
      return res.status(401).json({ error: "No autorizado." });
    }
    const { name, email, user, rol } = req.body;

    const editado = await Usuario.findByIdAndUpdate(
      req.params.id,
      { name, email, user, rol },
      { new: true }
    ).select("-pass");

    res.json({ message: "Usuario actualizado", editado });
  } catch (err) {
    res.status(500).json({ error: "Error al editar usuario" });
  }
});

// Eliminar usuario
router.delete("/:id", async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ error: "No autorizado. Falta token." });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const roll = decoded.rol;
    if(roll!=="Admin"){
      return res.status(401).json({ error: "No autorizado." });
    }
    await Usuario.findByIdAndDelete(req.params.id);
    res.json({ message: "Usuario eliminado" });
  } catch (err) {
    res.status(500).json({ error: "Error al eliminar usuario" });
  }
});


module.exports = router;