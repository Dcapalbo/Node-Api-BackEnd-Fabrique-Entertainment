const mongoose = require('mongoose');
// creating the Mongoose db Schema
const Schema = mongoose.Schema;
// products Schema 
const filmSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  }
//   userId: {
//      // grabbing the id using mongoose
//     type: Schema.Types.ObjectId,
//     // junction with ref, the Product and the User
//     ref: 'User',
//     required: true
//   }
});

// / exporting the model and the Schema
module.exports = mongoose.model('Film', filmSchema);
