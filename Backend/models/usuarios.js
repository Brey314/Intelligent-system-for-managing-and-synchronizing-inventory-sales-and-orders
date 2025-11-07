const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  user: { type: String, required: true, unique: true },
  pass: { type: String, required: true },
  rol: { type: String, default: "Consumer" },
  creation_date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Usuario', usuarioSchema);