const mongoose = require("mongoose");
const pageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true },
  id: { type: String, required: true }
});
