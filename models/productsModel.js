const mongoose = require('mongoose');
const imageSchema = new mongoose.Schema({
  imgID: { type: string, required: true}
})
const productSchema = new mongoose.Schema({
  name: { type: string, required: true},
  price: { type: Number, required: true},
  status: { type: string, enum: ['available', 'unavailable'], default: 'available'},
  image: [imageSchema]
});
module.exports = mongoose.model('product', productSchema);