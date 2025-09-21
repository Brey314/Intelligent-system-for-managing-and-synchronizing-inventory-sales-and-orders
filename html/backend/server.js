const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// Carrito simulado en memoria (se reinicia si reinicias el servidor)
let carrito = [];

// Obtener productos del carrito
app.get("/api/cart", (req, res) => {
  res.json(carrito);
});

// Agregar producto al carrito
app.post("/api/cart", (req, res) => {
  const { id, title, price, image, category } = req.body;
  const producto = { id, title, price, image, category };
  carrito.push(producto);
  res.json({ message: "Producto agregado", producto });
});

// Eliminar producto por id
app.delete("/api/cart/:id", (req, res) => {
  const { id } = req.params;
  carrito = carrito.filter(p => p.id != id);
  res.json({ message: `Producto con id ${id} eliminado` });
});

app.listen(PORT, () => {
  console.log(`Servidor backend en http://localhost:${PORT}`);
});
