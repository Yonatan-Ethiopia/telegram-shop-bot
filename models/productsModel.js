const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
  name: { type: String, required: true},
  price: { type: String, required: true},
  category: { type: String, required: true},
  status: { type: String, enum: ['Available', 'Unavailable'], default: 'Available'},
  stock: { type: Number, default: 1},
  image: { type : String, required : true},
  createdAt: { type: Date, default: Date.now, timestamps: true }
});
module.exports = mongoose.model('product', productSchema);