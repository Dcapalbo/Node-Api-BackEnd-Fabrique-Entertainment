const mongoose = require("mongoose");
// creating the Mongoose db Schema
const Schema = mongoose.Schema;
// products Schema
const contactSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  surname: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phonenumber: {
    type: Number,
    required: true,
  },
  imageUrl: {
    data: Buffer,
    contentType: String,
  },
  //   userId: {
  //      // grabbing the id using mongoose
  //     type: Schema.Types.ObjectId,
  //     // junction with ref, the Product and the User
  //     ref: 'User',
  //     required: true
  //   }
});

// / exporting the model and the Schema
module.exports = mongoose.model("Contact", contactSchema);
