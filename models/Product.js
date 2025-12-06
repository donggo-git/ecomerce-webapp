const mongoose = require('mongoose')

const productSchema = mongoose.Schema({
    name: { type: String, require: true, unique: true },
    brand: { type: String, require: true },
    type: { type: String, require: true },
    description: { type: String, require: true },
    price: { type: Number, require: true }
})

module.exports = mongoose.model('Product', productSchema);