const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const productosRoutes = require('./routes/productos');
const usuariosRoutes = require('./routes/usuarios');
const carritoRoutes= require('./routes/carrito');
const cookieParser = require('cookie-parser');

const app = express();

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
mongoose.connect('mongodb://localhost:27017/tienda-electronicos', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log(' Conectado a MongoDB');
  app.listen(5000, () => console.log(' Servidor corriendo en http://localhost:5000'));
})
.catch(err => console.error(' Error en MongoDB:', err));