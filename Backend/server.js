const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const productosRoutes = require('./routes/productos');


const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/productos', productosRoutes);

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

