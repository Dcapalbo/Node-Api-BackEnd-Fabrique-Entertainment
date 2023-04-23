require("dotenv").config();
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const filmRoutes = require("./routes/films");
const contactRoutes = require("./routes/contacts");
const usersRoutes = require("./routes/users");
const multer = require("multer");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

// Database Connection
mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@fabrique-db.mfubcus.mongodb.net/${process.env.MONGO_DEFAULT_DATABASE}`
  )
  .then(() => {
    console.log("Database connected successfully");
    app.listen(PORT, () => console.log(`Server running on Port: ${PORT}`));
  })
  .catch((err) => {
    console.log("Connection error name: ", err.name);
  });

// Middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.urlencoded({ extended: false }));

// Multer Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(multer({ storage, fileFilter }).single("file"));
app.use("/images", express.static(path.join(__dirname, "images")));
app.use(cors());

// Routes
app.use(filmRoutes);
app.use(contactRoutes);
app.use(usersRoutes);
