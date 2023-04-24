const { readImageData, getContentType } = require("../util/functions");
const Contact = require("../model/contact");
const mongoose = require("mongoose");
require("dotenv").config();

// Define the contacts to seed
const contacts = [
  {
    name: "John",
    surname: "Doe",
    role: "Developer",
    bio: "Testing my bio",
    email: "johndoe@example.com",
    phoneNumber: 1234567890,
    slug: "john-doe",
    imageUrl: {
      data: readImageData("../images/image_1.jpg"),
      contentType: getContentType(".jpg"),
    },
  },
  {
    name: "Jane",
    surname: "Doe",
    role: "Designer",
    bio: "Seeding my biography",
    email: "janedoe@example.com",
    phoneNumber: 3426453231,
    slug: "jane-doe",
    imageUrl: {
      data: readImageData("../images/image_2.jpg"),
      contentType: getContentType(".jpg"),
    },
  },
];

// Define the seeder function
const seedContacts = async () => {
  try {
    // Connect to the database
    mongoose.connect(
      `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@fabrique-db.mfubcus.mongodb.net/${process.env.MONGO_DEFAULT_DATABASE}`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );

    // Drop the existing contacts collection
    await Contact.collection.drop();

    // Insert the contacts into the database
    await Contact.insertMany(contacts);

    // Log success message
    console.log("Contacts seeded successfully!");
  } catch (err) {
    // Log error message
    console.error(err.message);
  } finally {
    // Close the database connection
    mongoose.connection.close();
  }
};

// Call the seeder function
seedContacts();
