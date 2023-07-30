/** @format */

const { validationResult } = require('express-validator');
const { deleteFile } = require('../util/functions');
const Film = require('../model/film');
const {
	uploadFile,
	getImageUrlFromS3,
	deleteImageFromS3,
	findImageKey,
	getImageKeysFromEntity,
} = require('../s3Config');
const film = require('../model/film');

// GET => Getting all films
exports.getFilms = async (req, res) => {
	try {
		const films = await Film.find().sort({ year: -1 });
		const filmsWithImages = await Promise.all(
			films.map(async (film) => {
				let coverImageUrl, pressBookPdfUrl;

				if (film.coverImageKey) {
					coverImageUrl = await getImageUrlFromS3(film.coverImageKey);
				}

				if (film.pressBookPdfKey) {
					pressBookPdfUrl = await getImageUrlFromS3(film.pressBookPdfKey);
				}

				return {
					...film.toObject(),
					cover: {
						coverImageUrl,
						coverImageKey: film.coverImageKey,
					},
					pressBook: {
						pressBookPdfUrl,
						pressBookPdfKey: film.pressBookPdfKey,
					},
				};
			})
		);

		return res.status(200).send(filmsWithImages ? filmsWithImages : films);
	} catch (error) {
		return res.status(404).json({ message: 'Films was not found', error });
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

	// saving the data inside the db and the images on s3
	try {
		const existingFilm = await Film.findOne({ title });
		if (existingFilm) {
			return res.status(400).json({ message: 'The film exist already' });
		}

		const cover = req.files.find((file) => file.fieldname === 'coverImage');
		const coverImageKey = `films/${title}/cover/${cover.originalname}`;

		await uploadFile(cover, coverImageKey);

		let pressBook, pressBookPdfKey;

		if (req.files.find((file) => file.fieldname === 'pressBookPdf')) {
			pressBook = req.files.find((file) => file.fieldname === 'pressBookPdf');
			pressBookPdfKey = `films/${title}/pressbook/${pressBook.originalname}`;
			await uploadFile(pressBook, pressBookPdfKey);
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
			coverImageKey,
			pressBookPdfKey,
		});

		deleteFile('images/' + cover.filename);

		if (pressBook) {
			deleteFile('images/' + pressBook.filename);
		}

		return res.status(201).send(film);
	} catch (error) {
		return res.status(500).json({ message: 'Something went wrong.', error });
	}
};

// PUT => Editing a product
exports.editFilm = async (req, res) => {
	let coverImageKey = req.body.coverImageKey;
	let pressBookPdfKey = req.body.pressBookPdfKey;

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

	if (req.files.length > 0) {
		let pressBook, cover;

		cover = req.files.find((file) => file.fieldname === 'coverImage');
		coverImageKey = `films/${title}/cover/${cover.originalname}`;

		if (req.files.find((file) => file.fieldname === 'pressBookPdf')) {
			pressBook = req.files.find((file) => file.fieldname === 'pressBookPdf');
			pressBookPdfKey = `films/${title}/pressbook/${pressBook.originalname}`;
		}

		const presentFilm = await film.findById(_id);

		if (
			presentFilm?.coverImageKey !== undefined &&
			presentFilm?.coverImageKey !== null &&
			presentFilm?.coverImageKey !== coverImageKey
		) {
			const findCoverImageS3 = await findImageKey(presentFilm.coverImageKey);
			if (findCoverImageS3) {
				await deleteImageFromS3(presentFilm.coverImageKey);
				await uploadFile(cover, coverImageKey);
			}
		}

		if (
			presentFilm?.pressBookPdfKey !== undefined &&
			presentFilm?.pressBookPdfKey !== null &&
			presentFilm?.pressBookPdfKey !== pressBookPdfKey
		) {
			const findPressBookPdfS3 = await findImageKey(
				presentFilm.pressBookPdfKey
			);
			if (findPressBookPdfS3) {
				await deleteImageFromS3(presentFilm.pressBookPdfKey);
				await uploadFile(pressBook, presentFilm.pressBookPdfKey);
			}
		}

		await uploadFile(cover, coverImageKey);
		await uploadFile(pressBook, pressBookPdfKey);
	}

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
		coverImageKey,
		pressBookPdfKey,
	};

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
				coverImageKey,
				pressBookPdfKey,
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

		if (pressBook) {
			deleteFile('images/' + pressBook.filename);
		}

		res.status(200).json(updatedFilm);
	} catch (error) {
		res.status(500).json({
			message: 'Was not possible to update the specific film.',
			error,
		});
	}
};

//DELETE => Delete a single film using the film id and the s3 images correlated to it
exports.deleteFilm = async (req, res) => {
	const filmId = req.body._id;

	try {
		const film = await Film.findById(filmId);

		if (!film) {
			return res.status(404).json({ message: 'Film not found' });
		}

		const imageKeys = getImageKeysFromEntity(film);
		const deletePromises = imageKeys.map((imageKey) =>
			deleteImageFromS3(imageKey)
		);

		await Promise.all(deletePromises);
		await Film.findByIdAndRemove(filmId);

		return res.status(200).json({
			message: 'The film and its associated images has been deleted',
		});
	} catch (error) {
		return res.status(500).json({
			message: 'Something went wrong while deleting a film:',
			error,
		});
	}
};
//DELETE IMAGE => delete one specific image attached to the film from s3
exports.deleteImage = async (req, res) => {
	const imageKey = req.query.image_key;

	try {
		const deleteResult = await deleteImageFromS3(imageKey);
		const film = await Film.findOne({
			$or: [{ coverImageKey: imageKey }, { pressBookPdfKey: imageKey }],
		});

		if (!film) {
			return res.status(404).json({ message: 'Film not found' });
		}

		if (film.coverImageKey === imageKey) {
			film.coverImageKey = null;
		}
		if (film.pressBookPdfKey === imageKey) {
			film.pressBookPdfKey = null;
		}

		await film.save();

		res.json({ message: 'Image deleted from S3 successfully', deleteResult });
	} catch (error) {
		console.error('Error deleting image from S3:', error);
		res.status(500).json({ message: 'Error deleting image from S3.', error });
	}
};
