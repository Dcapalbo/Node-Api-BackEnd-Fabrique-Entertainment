const mongoose = require('mongoose');
const Film = require('../model/film');
const { validationResult } = require('express-validator');

// POST => Adding a Film
exports.postAddFilm = (req, res) => {
  // req.body it is a request which fly to the name of the views input and take the informations from there (look inside the view edit-product)
  const title = req.body.title;
  const duration = req.body.duration;
  const director = req.body.director;
  const description = req.body.description;
  const errors = validationResult(req);
  // if there are errors  
  if (!errors.isEmpty()) {
    console.log('here my errors', errors.array());
    // then return the status and the route
    return ({
      //   hasError: true,
      product: {
        title,
        duration,
        director,
        description,
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
      res: res.status('400').send('input invalid')
    });
  }

  const film = new Film({
    title,
    duration,
    director,
    description,
  });
  
  console.log('where is my film?', film);
  // saving the data inside the db 
  film
  .save((error) => {
    if (error) {
        console.log('something went wrong, here the error: ', error.name);
        res.status(400).send('error')
    } else {
        console.log("Film has been created");
        res.status(201).send('Film has been created')
    }
  });
}

// GET => Getting the editing product form
// exports.getEditProduct = (req, res, next) => {
//   // request a query for edit a product 
//   const editMode = req.query.edit;
//   if (!editMode) {
//     return res.redirect('/');
//   }
//   const prodId = req.params.productId;
//   Product.findById(prodId)
//     .then(product => {
//       if (!product) {
//         return res.redirect('/');
//       }
//       // response from the server with the render method and passing an object (look inside the edit product view)
//       res.render('admin/edit-product', {
//         pageTitle: 'Edit Product',
//         path: '/admin/edit-product',
//         editing: editMode,
//         product: product,
//         hasError: false,
//         errorMessage: null,
//         validationErrors: []
//       });
//     })
//     .catch(err => console.log(err));
// };

// // POST => Editing a product 
// exports.postEditProduct = (req, res, next) => {
//   // req.body it is a request which fly to the name of the views input and take the informations from there (look inside the view edit-product)
//   const prodId = req.body.productId;
//   const updatedTitle = req.body.title;
//   const updatedPrice = req.body.price;
//   const updatedImageUrl = req.body.imageUrl;
//   const updatedDesc = req.body.description;
//   // Mongoose method to find by id which has passed with an hidden input inside the edit-product view
//   const errors = validationResult(req);
//    // if there ar errors 
//   if (!errors.isEmpty()) {
//     return res.status(422).render('admin/edit-product', {
//       pageTitle: 'Edit Product',
//       path: '/admin/edit-product',
//       editing: true,
//       hasError: true,
//       product: {
//         title: updatedTitle,
//         imageUrl: updatedImageUrl,
//         price: updatedPrice,
//         description: updatedDesc,
//         _id: prodId
//       },
//       // take the first error message from the array
//       errorMessage: errors.array()[0].msg,
//       validationErrors: errors.array()
//     });
//   }
//   // Mongoose method to find by id which has passed with an hidden input inside the edit-product view
//   Product.findById(prodId)
//   // Promise then product with a condition
//     .then(product => {
//       // make the id a String, response (db) and request (user)
//       if (product.userId.toString() !== req.user._id.toString()) {
//         // if they are not the same redirect the client
//         return res.redirect('/');
//       }
//       // updating the product (db) value and save it 
//       product.title = updatedTitle;
//       product.price = updatedPrice;
//       product.description = updatedDesc;
//       product.imageUrl = updatedImageUrl;
//       return product.save().then(result => {
//         console.log('UPDATED PRODUCT!');
//         // then redirect the user
//         res.redirect('/admin/products');
//       });
//     })
//     .catch(err => console.log(err));
// };

// // GET => Getting all products from the db in the specific route 
// exports.getProducts = (req, res, next) => {
//   // Mongoose find method looking for the products of the specific user which is request to the server (req.user._i)
//   Product.find({ userId: req.user._id })
//     .then(products => {
//       console.log(products);
//       // response from the server with the render method and passing an object
//       res.render('admin/products', {
//         prods: products,
//         pageTitle: 'Admin Products',
//         path: '/admin/products'
//       });
//     })
//     // catching errors
//     .catch(err => console.log(err));
// };

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
