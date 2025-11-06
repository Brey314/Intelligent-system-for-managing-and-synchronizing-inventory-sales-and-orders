const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema({
  name: String,
  email: String,
  user: String,
  pass: String,
  rol: String,
  creation_date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Usuario', productoSchema);