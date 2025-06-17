const mongoose = require("mongoose");
const adminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  Username: { type: String, required: true },
  id: { type: String, required: true } 
});
module.exports = mongoose.model('admin', adminSchema);