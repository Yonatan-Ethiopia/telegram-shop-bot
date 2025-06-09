const mongoose = require('mongoose');
const imageSchema = new mongoose.Schema({
  imgID: { type: String, required: true}
})
const productSchema = new mongoose.Schema({
  name: { type: String, required: true},
  price: { type: Number, required: true},
  status: { type: String, enum: ['available', 'unavailable'], default: 'available'},
  image: [imageSchema]
});
module.exports = mongoose.model('product', productSchema);