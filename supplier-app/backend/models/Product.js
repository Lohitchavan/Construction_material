const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  supplierId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  description: String,
  price: Number,
  stock: Number,
  imageUrl: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);
