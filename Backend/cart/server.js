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
  const { _id, title, description,price, image, category,stock,cuantity,creation_date } = req.body;
  const producto = { _id, title, description,price, image, category,stock,cuantity,creation_date };
  carrito.push(producto);
  res.json({ message: "Producto agregado", producto });
});

// Eliminar producto por id
app.delete("/api/cart/:id", (req, res) => {
  const { id } = req.params;
  carrito = carrito.filter(p => p._id != id);
  res.json({ message: `Producto con id ${id} eliminado` });
});

app.listen(PORT, () => {
  console.log(`Servidor backend en http://localhost:${PORT}`);
});
// Actualizar cantidad de un producto en el carrito
app.put("/api/cart/:id", (req, res) => {
  const { id } = req.params;
  const { cuantity } = req.body;

  // Buscar el producto por _id
  const producto = carrito.find(p => p._id == id);

  if (!producto) {
    return res.status(404).json({ message: `Producto con id ${id} no encontrado en el carrito` });
  }

  // Actualizar cantidad
  producto.cuantity = cuantity;

  res.json({ message: "Cantidad actualizada", producto });
});
