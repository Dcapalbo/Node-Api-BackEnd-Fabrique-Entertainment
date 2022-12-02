const fs = require("fs");
const Film = require("../model/film");
const { validationResult } = require("express-validator");

// GET => Getting all films
exports.getFilms = (req, res) => {
  Film.find()
    .then((films) => {
      // response from the server with the render method and passing an object
      res.send(films);
    })
    // catching errors
    .catch((err) => console.log(err));
};
// POST => Adding a Film
exports.postAddFilm = (req, res) => {
  // req.body it is a request which fly to the name of the views input and take the informations from there (look inside the view edit-product)
  const title = req.body.title;
  const duration = req.body.duration;
  const director = req.body.director;
  const description = req.body.description;
  const year = req.body.year;
  const type = req.body.type;
  const image = req.file;
  // if there is no image
  if (!image) {
    // then return the status and the route
    return (
      res.status(422),
      {
        film: {
          title,
          duration,
          director,
          description,
          year,
          type,
        },
        errorMessage: "Attached file is not an image.",
        validationErrors: [],
      }
    );
  }

  const errors = validationResult(req);

  // if there are errors
  if (!errors.isEmpty()) {
    console.log("POST adding film errors: ", errors.array());
    res.status(422).send("input invalid");
    // then return the status and the route
    return {
      //   hasError: true,
      film: {
        title,
        duration,
        director,
        description,
        year,
        type,
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
    };
  }

  const film = new Film({
    title,
    duration,
    director,
    description,
    year,
    type,
    imageUrl: {
      data: fs.readFileSync("images/" + req.file.filename),
      contentType: "image/png",
    },
  });
  // saving the data inside the db
  film.save((error) => {
    if (error) {
      console.log("something went wrong, here the error: ", error.name);
      res.status(400).send("error");
    } else {
      console.log("Film has been created");
      res.status(201).send("Film has been created");
    }
  });
};

// POST => Editing a product
exports.postEditFilm = (req, res, next) => {
  const updatedTitle = req.body.title;
  const updatedDuration = req.body.duration;
  const updatedDirector = req.body.director;
  const updatedDescription = req.body.description;
  const updatedYear = req.body.year;
  const updatedType = req.body.type;
  const filmId = req.body._id;
  const image = req.file;

  const errors = validationResult(req);
  // if there are errors
  if (!errors.isEmpty()) {
    return (
      res.status(422),
      {
        film: {
          title: updatedTitle,
          duration: updatedDuration,
          director: updatedDirector,
          description: updatedDescription,
          year: updatedYear,
          type: updatedType,
          _id: filmId,
        },
        // take the first error message from the array
        errorMessage: errors.array()[0].msg,
        validationErrors: errors.array(),
      }
    );
  }
  // Mongoose method to find by id which has been passed
  Film.findById(filmId)
    // Promise then product with a condition
    .then((film) => {
      let filmDbId = film._id.toString();
      // make the id a String, response (db) and request (user)
      if (filmDbId !== filmId) {
        // if they are not the same return the function must add some html
        return;
      }
      // updating the film inside the (db)
      const imageUrl = {
        data: fs.readFileSync("images/" + image.filename),
        contentType: "image/png",
      };

      film.title = updatedTitle;
      film.duration = updatedDuration;
      film.director = updatedDirector;
      film.description = updatedDescription;
      film.year = updatedYear;
      film.type = updatedType;
      film.imageUrl = imageUrl;

      film.save().then((result) => {
        res.status(201).send(result);
        console.log("Film has been updated");
        return;
      });
    })
    .catch((err) => {
      console.log("error: ", err);
    });
};

// // POST => Delete a single product using the prod id and user id
// exports.postDeleteProduct = (req, res, next) => {
//     // req.body it is a request which fly to the name of the views input and take the informations from there (look inside the view products)
//   const prodId = req.body.productId;
//   Product.findById(prodId)
//     .then(product => {
//       if (!product) {
//         return next(new Error('Product not found.'));
//       }
//       // deleting the file from the image picher path
//       fileHelper.deleteFile(product.imageUrl);
//         // Mongoose deleteOne method looking for the product id of a specific user which is request to the server (req.user._i)
//       return Product.deleteOne({ _id: prodId, userId: req.user._id });
//     })
//     // returns a promise
//     .then(() => {
//       console.log('DESTROYED PRODUCT');
//       // then redirect the suer
//       res.redirect('/admin/products');
//     })
//     // catching the errors
//     .catch(err => {
//       const error = new Error(err);
//       error.httpStatusCode = 500;
//       return next(error);
//     });
// };
