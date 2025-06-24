const mongoose = require("mongoose");
const ownerSchema = new mongoose.Schema({
  id: { type: String, required: true},
  name: { type: String, required: true },
  username: { type: String, required: true },
  /*password: { type: String, required: true}*/
});
module.exports = mongoose.model('owner', ownerSchema);