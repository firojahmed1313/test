const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const approverSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  mobile: { type: Number, required: true },
  region: { type: String, required: true, enum: ["india", "switzerland"] }
});
module.exports = mongoose.model("Approver", approverSchema);
