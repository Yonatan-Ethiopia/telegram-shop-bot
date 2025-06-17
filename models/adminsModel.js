const mongoose = require("mongoose");
const adminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  Username: { type: String, required: true },
  id: { type: String, required: true },
  password: { type: String, required: true},
  page: { type: mongoose.Schema.Types.ObjectId, ref:'page', required: true}
});
module.exports = mongoose.model('admin', adminSchema);