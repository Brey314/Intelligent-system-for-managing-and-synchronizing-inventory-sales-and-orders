const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  image: String,
  category: String,
  stock: Number,
  creation_date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Producto', productoSchema);
