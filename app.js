const path = require('path'); 
const fs = require('fs'); 
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session'); 
const MongoDBStore = require('connect-mongodb-session')(session); 
const flash = require('connect-flash'); 
const multer = require('multer');
const helmet = require('helmet'); 
const compression = require('compression'); 
const morgan = require('morgan'); 
const cors = require('cors');

// Take the mongodb Uri 
const MONGODB_URI =
  `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@fabrique-db.mfubcus.mongodb.net/${process.env.MONGO_DEFAULT_DATABASE}`;

// inizialize express 
const app = express();
// Store the sessions collection
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
});
// Building file Storage for images using multer
// diskStorage implementation
const fileStorage = multer.diskStorage({
  // destination method
  destination: (req, file, cb) => {
    // callback, the first argument it is the error the second one it is the folder destination
    cb(null, 'images');
  },
  // filename method
  filename: (req, file, cb) => {
    // callback, the first argument it is the error the second one it is the filename
    cb(null, new Date().toISOString() + '-' + file.originalname);
  }
});
// make the filter media variable
const fileFilter = (req, file, cb) => {
  // if the format are this kind 
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    // insert it inside the storage 
    cb(null, true);
  } else {
    // don't insert it 
    cb(null, false);
  }
};

// Importing the routes 
const filmRoutes = require('./routes/films');
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, 'access.log'),
  {
    flags: 'a'
  }
)
// inizialize helmet 
app.use(helmet());
// inizialize compression
app.use(compression());
// inizialize morgan
app.use(morgan('combined', {
  stream: accessLogStream
})); 

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.urlencoded({ extended: false }));
// Inizialize multer 
app.use(
  // returning the storage and the filefilter 
  multer({ storage: fileStorage, fileFilter: fileFilter }).single('file')
);

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use(
  session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store
  })
);

app.use(flash());
app.use(cors());

// Inizialise the routes 
app.use(filmRoutes);
// Inizialise the server 
mongoose
  .connect(MONGODB_URI)
  .then(result => {
    console.log("connection with the database complete")
    app.listen(process.env.PORT || 5000);
  })
  .catch(err => {
    console.log("connection error", err.name);
  });
