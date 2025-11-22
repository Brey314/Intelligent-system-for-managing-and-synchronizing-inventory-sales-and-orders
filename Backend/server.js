const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const productosRoutes = require('./routes/productos');
const usuariosRoutes = require('./routes/usuarios');
const carritoRoutes= require('./routes/carrito');
const addressRoutes = require('./routes/address');
const paymentsRouter = require('./routes/pagos');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();

const PORT = process.env.PORT;
const JWT_SECRET = process.env.JWT_SECRET; 
const MONGO_URI = process.env.MONGO_URI;
// Middlewares
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

// Para todas las rutas normales usar JSON
app.use((req, res, next) => {
  // Si la ruta es /api/webhook, saltar el json parser
  if (req.originalUrl === '/api/webhook') return next();
  express.json()(req, res, next);
});

// Rutas
app.use('/api/productos', productosRoutes);
app.use('/api/usuarios',usuariosRoutes)
app.use('/api/carrito',carritoRoutes)
app.use("/api/addresses", addressRoutes);
app.use('/api', paymentsRouter);

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