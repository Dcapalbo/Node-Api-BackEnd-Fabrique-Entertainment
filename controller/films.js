/** @format */

const { validationResult } = require('express-validator');
const { deleteFile } = require('../util/functions');
const Film = require('../model/film');
const fs = require('fs');

// GET => Getting all films
exports.getFilms = async (req, res) => {
	try {
		const films = await Film.find().sort({
			year: -1,
		});
		res.status(200).send(films);
	} catch {
		res.status(404).json({ message: 'Films was not found' });
	}
};
// POST => Adding a Film
exports.addFilm = async (req, res) => {
	const {
		title,
		director,
		productions,
		producers,
		coProductions,
		coProducers,
		actors,
		subjects,
		screenwriters,
		genre,
		directorOfPhotography,
		editing,
		scenography,
		costumes,
		music,
		sound,
		soundDesign,
		casting,
		lineProducer,
		executiveProducers,
		distributor,
		salesAgent,
		firstAssistantDirector,
		synopsis,
		productionNotes,
		duration,
		year,
		festivals,
		slug,
		type,
		trailer,
		imdb,
		instagram,
		facebook,
	} = req.body;

	const cover = req.files.find((cover) => cover.fieldname === 'coverImage');
	const pressBook = req.files.find(
		(pressBook) => pressBook.fieldname === 'pressBookPdf'
	);

	const errors = validationResult(req);
	// if there are errors
	// Send a response with the status and a json
	if (!errors.isEmpty()) {
		res.status(422).json({
			film: {
				title,
				director,
				productions,
				producers,
				coProductions,
				coProducers,
				actors,
				subjects,
				screenwriters,
				genre,
				directorOfPhotography,
				editing,
				scenography,
				costumes,
				music,
				sound,
				soundDesign,
				casting,
				lineProducer,
				executiveProducers,
				distributor,
				salesAgent,
				firstAssistantDirector,
				synopsis,
				productionNotes,
				duration,
				year,
				festivals: festivals ?? null,
				slug,
				type,
				trailer: trailer ?? null,
				imdb: imdb ?? null,
				instagram: instagram ?? null,
				facebook: facebook ?? null,
			},
			message: 'Validation errors are present',
			errorMessage: errors.array()[0].msg,
			validationErrors: errors.array(),
		});
	}
	// saving the data inside the db
	try {
		const existingFilm = await Film.findOne({ title });
		if (existingFilm) {
			return res.status(400).json({ message: 'The film exist already' });
		}

		const film = await Film.create({
			title,
			director,
			productions,
			producers,
			coProductions,
			coProducers,
			actors,
			subjects,
			screenwriters,
			genre,
			directorOfPhotography,
			editing,
			scenography,
			costumes,
			music,
			sound,
			soundDesign,
			casting,
			lineProducer,
			executiveProducers,
			distributor,
			salesAgent,
			firstAssistantDirector,
			synopsis,
			productionNotes,
			duration,
			year,
			festivals: festivals ?? null,
			slug,
			type,
			trailer: trailer ?? null,
			imdb: imdb ?? null,
			instagram: instagram ?? null,
			facebook: facebook ?? null,
			coverImage: {
				data: fs.readFileSync('images/' + cover.filename),
				contentType: cover.mimetype,
			},
			pressBookPdf: {
				data: fs.readFileSync('images/' + pressBook.filename),
				contentType: pressBook.mimetype,
			},
		});

		return res.status(201).send(film);
	} catch (error) {
		return res.status(500).json({ message: 'Something went wrong.', error });
	}
};

// PUT => Editing a product
exports.editFilm = async (req, res) => {
	const {
		title,
		director,
		productions,
		producers,
		coProductions,
		coProducers,
		actors,
		subjects,
		screenwriters,
		genre,
		directorOfPhotography,
		editing,
		scenography,
		costumes,
		music,
		sound,
		soundDesign,
		casting,
		lineProducer,
		executiveProducers,
		distributor,
		salesAgent,
		firstAssistantDirector,
		synopsis,
		productionNotes,
		duration,
		year,
		festivals,
		slug,
		type,
		trailer,
		imdb,
		instagram,
		facebook,
		_id,
	} = req.body;

	if (!_id) {
		res.status(404).json({
			message:
				'Was not possible to update the specific film, because the id is missing',
		});
	}

	const cover = req.files.find((cover) => cover.fieldname === 'coverImage');
	const pressBook = req.files.find(
		(pressBook) => pressBook.fieldname === 'pressBookPdf'
	);

	const coverImage = {
		data: fs.readFileSync('images/' + cover.filename),
		contentType: cover.mimetype,
	};

	const pressBookPdf = {
		data: fs.readFileSync('images/' + pressBook.filename),
		contentType: pressBook.mimetype,
	};

	const update = {
		title,
		director,
		productions,
		producers,
		coProductions,
		coProducers,
		actors,
		subjects,
		screenwriters,
		genre,
		directorOfPhotography,
		editing,
		scenography,
		costumes,
		music,
		sound,
		soundDesign,
		casting,
		lineProducer,
		executiveProducers,
		distributor,
		salesAgent,
		firstAssistantDirector,
		synopsis,
		productionNotes,
		duration,
		year,
		festivals: festivals ?? null,
		slug,
		type,
		trailer: trailer ?? null,
		imdb: imdb ?? null,
		instagram: instagram ?? null,
		facebook: facebook ?? null,
		coverImage,
		pressBookPdf,
	};

	console.log(req);

	const errors = validationResult(req);
	// if there are errors
	// Send a response with the status and a json
	if (!errors.isEmpty()) {
		res.status(422).json({
			film: {
				title,
				director,
				productions,
				producers,
				coProductions,
				coProducers,
				actors,
				subjects,
				screenwriters,
				genre,
				directorOfPhotography,
				editing,
				scenography,
				costumes,
				music,
				sound,
				soundDesign,
				casting,
				lineProducer,
				executiveProducers,
				distributor,
				salesAgent,
				firstAssistantDirector,
				synopsis,
				productionNotes,
				duration,
				year,
				festivals: festivals ?? null,
				slug,
				type,
				trailer: trailer ?? null,
				imdb: imdb ?? null,
				instagram: instagram ?? null,
				facebook: facebook ?? null,
			},
			message: 'Validation errors are present',
			errorMessage: errors.array()[0].msg,
			validationErrors: errors.array(),
		});
	}
	try {
		const updatedFilm = await Film.findByIdAndUpdate(_id, update, {
			new: true,
		});
		deleteFile('images/' + cover.filename);
		res.status(200).json(updatedFilm);
	} catch (error) {
		res.status(500).json({
			message: 'Was not possible to update the specific film.',
			error,
		});
	}
};

//DELETE => Delete a single product using the prod id and user id
exports.deleteFilm = async (req, res) => {
	const filmId = req.body._id;
	try {
		await Film.findByIdAndRemove(filmId);
		res.status(200).json({
			message: 'The film has been deleted',
		});
		console.log('The film has been deleted');
	} catch (error) {
		res.status(500).send(error.message);
		console.log('Something went wrong while deleting a film: ', error.message);
	}
};
