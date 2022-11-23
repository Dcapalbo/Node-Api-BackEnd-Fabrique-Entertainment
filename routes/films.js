const filmsController = require('../controller/films');
const { check } = require('express-validator');
const express = require('express');
const router = express.Router();

//add-film => POST
router.post(
  '/add-film',
  [
    check('title')
      .isString()
      .isLength({ min: 3, max: 30 })
      .trim(),
    check('duration')
      .isFloat()
      .isLength({ min: 1, max: 3 }),
    check('director')
      .isString()
      .isLength({ min: 3, max: 30 })
      .trim(),
    check('description')
      .isString()
      .isLength({ min: 10, max: 300 })
      .trim(),
  ],
  filmsController.postAddFilm
);

module.exports = router;
