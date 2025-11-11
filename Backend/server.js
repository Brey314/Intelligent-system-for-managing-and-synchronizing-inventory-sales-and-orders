const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const productosRoutes = require('./routes/productos');
const usuariosRoutes = require('./routes/usuarios');
const carritoRoutes= require('./routes/carrito');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();

const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET; // 👈 ya viene del .env
const MONGO_URI = process.env.MONGO_URI;
// Middlewares
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

// Rutas
app.use('/api/productos', productosRoutes);
app.use('/api/usuarios',usuariosRoutes)
app.use('/api/carrito',carritoRoutes)

// Conexión MongoDB
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log(' Conectado a MongoDB');
  app.listen(PORT, () => console.log(` Servidor corriendo en http://localhost:${PORT}`));
})
.catch(err => console.error(' Error en MongoDB:', err));