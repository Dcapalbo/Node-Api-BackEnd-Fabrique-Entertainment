const mongoose = require("mongoose");
// creating the Mongoose db Schema
const Schema = mongoose.Schema;
// products Schema
const filmSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  production: {
    type: String,
    required: true,
  },
  screenwriter: {
    type: String,
    required: true,
  },
  directorOfPhotography: {
    type: String,
    required: true,
  },
  synopsis: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
  },
  imageUrl: {
    data: Buffer,
    contentType: String,
  },
});

// / exporting the model and the Schema
module.exports = mongoose.model("Film", filmSchema);
