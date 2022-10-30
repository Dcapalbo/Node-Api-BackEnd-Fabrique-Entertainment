const path = require('path'); 
const fs = require('fs'); 
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session'); 
const MongoDBStore = require('connect-mongodb-session')(session); 
const csrf = require('csurf');
const flash = require('connect-flash'); 
const multer = require('multer');
const helmet = require('helmet'); 
const compression = require('compression'); 
const morgan = require('morgan'); 

// Take the mongodb Uri 
const MONGODB_URI =
  `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@fabrique-db.nmev1.mongodb.net/${process.env.MONGO_DEFAULT_DATABASE}`;

// inizialize express 
const app = express();
// Store the sessions collection
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
});

// Inizialize csrf protection
const csrfProtection = csrf();

// Building file Storage for images 
// diskStorage implementation
const fileStorage = multer.diskStorage({
  // destination 
  destination: (req, file, cb) => {
    // callback, first argument the error the second is the destinations 
    cb(null, 'images');
  },
  // filename 
  filename: (req, file, cb) => {
    // callback, first argument the error the second is the filename
    cb(null, new Date().toISOString() + '-' + file.originalname);
  }
});
// make the filter variable 
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

app.use(bodyParser.urlencoded({ extended: false }));
// Inizialize multer 
app.use(
  // returning the storage and the filefilter 
  multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
);

app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(
  session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store
  })
);

// Inizialize csrf and flash 
app.use(csrfProtection);
app.use(flash());

// Getting response for the authentication and the csrf token 
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

// Inizialise the routes 

// Inizialise the server 
mongoose
  .connect(MONGODB_URI)
  .then(result => {
    app.listen(process.env.PORT || 5000);
  })
  .catch(err => {
    console.log(err);
  });
