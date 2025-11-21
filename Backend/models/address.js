const mongoose = require('mongoose');

const AddressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: String,
  country: String,
  city: String,
  address: String,
  postalCode: String,
  phone: String
}, {
  versionKey: false
});
module.exports = mongoose.model('Direcciones', AddressSchema);