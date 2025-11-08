const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema({
  idUser:String,
  title: String,
  description: String,
  price: Number,
  image: String,
  category: String,
  stock: Number,
  cuantity: Number,
  creation_date: {
    type: Date,
    default: Date.now
  }
}, {
  versionKey: false
});

module.exports = mongoose.model('ProductoCarrito', productoSchema);
