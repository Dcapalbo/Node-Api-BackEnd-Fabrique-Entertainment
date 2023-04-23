const { validationResult } = require("express-validator");
const fileHelper = require("../util/file");
const Film = require("../model/film");
const fs = require("fs");

// GET => Getting all films
exports.getFilms = async (req, res) => {
  try {
    const films = await Film.find().sort({
      year: -1,
    });
    res.status(200).send(films);
  } catch {
    res.status(404).json({ message: "Films was not found" });
  }
};
// POST => Adding a Film
exports.addFilm = async (req, res) => {
  const {
    title,
    director,
    production,
    screenwriter,
    directorOfPhotography,
    synopsis,
    duration,
    year,
    slug,
    type,
    file,
  } = req.body;
  const image = req.file;

  const errors = validationResult(req);
  // if there are errors
  // Send a response with the status and a json
  if (!errors.isEmpty()) {
    res.status(422).json({
      film: {
        title,
        director,
        production,
        screenwriter,
        directorOfPhotography,
        synopsis,
        duration,
        year,
        slug,
        type,
        userId,
      },
      message: "Validation errors are present",
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
    });
  }
  // saving the data inside the db
  try {
    const existingFilm = await Film.findOne({ title });
    if (existingFilm) {
      return res.status(400).json({ message: "The film exist already" });
    }

    const film = await Film.create({
      title,
      director,
      production,
      screenwriter,
      directorOfPhotography,
      synopsis,
      duration,
      year,
      slug,
      type,
      imageUrl: {
        data: fs.readFileSync("images/" + image.filename),
        contentType: "image/png",
      },
    });

    fileHelper.deleteFile("images/" + image.filename);
    return res.status(201).send(film);
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong." });
  }
};

// PUT => Editing a product
exports.editFilm = async (req, res) => {
  const {
    title,
    director,
    production,
    screenwriter,
    directorOfPhotography,
    synopsis,
    duration,
    year,
    slug,
    type,
    _id,
  } = req.body;

  if (!_id) {
    res.status(404).json({
      message:
        "Was not possible to update the specific film, because the id is missing",
    });
  }

  const image = req.file;
  const imageUrl = {
    data: fs.readFileSync("images/" + image.filename),
    contentType: image.mimetype,
  };

  const update = {
    title,
    director,
    production,
    screenwriter,
    directorOfPhotography,
    synopsis,
    duration,
    year,
    slug,
    type,
    imageUrl,
  };

  console.log(req.body);

  const errors = validationResult(req);
  // if there are errors
  // Send a response with the status and a json
  if (!errors.isEmpty()) {
    res.status(422).json({
      film: {
        title,
        director,
        production,
        screenwriter,
        directorOfPhotography,
        synopsis,
        duration,
        year,
        slug,
        type,
      },
      message: "Validation errors are present",
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
    });
  }
  try {
    const updatedFilm = await Film.findByIdAndUpdate(_id, update, {
      new: true,
    });
    fileHelper.deleteFile("images/" + image.filename);
    res.status(200).json(updatedFilm);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Was not possible to update the specific film." });
  }
};

//DELETE => Delete a single product using the prod id and user id
exports.deleteFilm = async (req, res) => {
  const filmId = req.body._id;
  try {
    await Film.findByIdAndRemove(filmId);
    res.status(200).json({
      message: "The film has been deleted",
    });
    console.log("The film has been deleted");
  } catch (error) {
    res.status(500).send(error.message);
    console.log("Something went wrong while deleting a film: ", error.message);
  }
};
