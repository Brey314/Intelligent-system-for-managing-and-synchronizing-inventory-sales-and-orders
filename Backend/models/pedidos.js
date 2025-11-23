const mongoose = require('mongoose');

const pedidosSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    idProd:String,
    idAddress:String,
    cuantity:Number,
    status: String,
    total: Number,
    creation_date: {
        type: Date,
        default: Date.now
    }
}, {
    versionKey: false
});
module.exports = mongoose.model('Pedidos', pedidosSchema);