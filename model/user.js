const mongoose = require("mongoose");
// creating the Mongoose db Schema
const Schema = mongoose.Schema;
// users Schema
const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// / exporting the model and the Schema
module.exports = mongoose.model("user", userSchema);
