const filmsController = require("../controller/films");
const { check } = require("express-validator");
const express = require("express");
const router = express.Router();

//films => GET
router.get("/get-films", filmsController.getFilms);
//add-film => POST
router.post(
  "/add-film",
  [
    check("title").isString().isLength({ min: 3, max: 30 }).trim(),
    check("duration").isFloat().isLength({ min: 1, max: 3 }),
    check("director").isString().isLength({ min: 6, max: 30 }).trim(),
    check("description").isString().isLength({ min: 10, max: 300 }).trim(),
    check("year").isFloat().isLength({ min: 4, max: 4 }),
    check("type").isString().trim(),
  ],
  filmsController.postAddFilm
);
//update-film =>POST
router.post(
  "/update-film",
  [
    check("title").isString().isLength({ min: 3, max: 30 }).trim(),
    check("duration").isFloat().isLength({ min: 1, max: 3 }),
    check("director").isString().isLength({ min: 3, max: 30 }).trim(),
    check("description").isString().isLength({ min: 10, max: 300 }).trim(),
    check("year").isFloat().isLength({ min: 4, max: 4 }),
    check("type").isString().trim(),
  ],
  filmsController.postEditFilm
);

router.post("/delete-film", filmsController.postDeleteFilm);

module.exports = router;
