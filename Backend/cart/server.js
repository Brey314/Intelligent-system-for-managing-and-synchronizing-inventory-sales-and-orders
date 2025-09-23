const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 1000;

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
  const { _id, title, descripcion,precio, image, category,stock,creation_date } = req.body;
  const producto = { _id, title, descripcion,precio, image, category,stock,creation_date };
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
