/** @format */

const { check } = require('express-validator');
const express = require('express');
const router = express.Router();
const {
	getFilms,
	addFilm,
	editFilm,
	deleteFilm,
} = require('../controller/films');

//films => GET ALL
router.get('/get-films', getFilms);
//add-film => POST
router.post(
	'/add-film',
	[
		check('title').isString().isLength({ min: 3, max: 30 }).trim(),
		check('director').isString().isLength({ min: 6, max: 30 }).trim(),
		check('productions')
			.isArray({ min: 1 })
			.withMessage(
				"L'elenco delle produzioni deve contenere almeno una società di produzione"
			)
			.custom((productions) => {
				productions.forEach((production, index) => {
					const { productionName } = production;

					if (
						!productionName ||
						(productionName.trim().length < 6 &&
							productionName.trim().length > 50)
					) {
						throw new Error(
							`Il nome della società di produzione ${
								index + 1
							} deve contenere almeno 6 caratteri e non più di 50`
						);
					}
				});
				return true;
			}),
		check('screenwriters')
			.isArray({ min: 1 })
			.withMessage("L'elenco degli sceneggiatori deve contenere almeno un nome")
			.custom((screenwriters) => {
				screenwriters.forEach((screenwriter, index) => {
					const { screenwriterName } = screenwriter;

					if (
						!screenwriterName ||
						(screenwriterName.trim().length < 6 &&
							screenwriterName.trim().length > 30)
					) {
						throw new Error(
							`Il nome dello sceneggiatore ${
								index + 1
							} deve contenere almeno 6 caratteri e non più di 30`
						);
					}
				});
				return true;
			}),
		check('genres')
			.isArray({ min: 1 })
			.withMessage(
				"L'elenco dei generi deve essere di una lunghezza minima di una unità"
			)
			.custom((genres) => {
				genres.forEach((genre, index) => {
					const { genreName } = genre;

					if (!genreName) {
						throw new Error(
							`Il nome del genere cinematografico ${index + 1} è obbligatorio`
						);
					}
				});
				return true;
			}),
		check('directorOfPhotography')
			.isString()
			.isLength({ min: 6, max: 30 })
			.trim(),
		check('synopsis').isString().isLength({ min: 10, max: 300 }).trim(),
		check('duration').isFloat().isLength({ min: 1, max: 3 }),
		check('year').isFloat().isLength({ min: 4, max: 4 }),
		check('type').isString().trim(),
	],
	addFilm
);
//update-film => PUT
router.put(
	'/update-film',
	[
		check('title').isString().isLength({ min: 3, max: 30 }).trim(),
		check('director').isString().isLength({ min: 6, max: 30 }).trim(),
		check('productions')
			.isArray({ min: 1 })
			.withMessage(
				"L'elenco delle produzioni deve contenere almeno una società di produzione"
			)
			.custom((productions) => {
				productions.forEach((production, index) => {
					const { productionName } = production;

					if (
						!productionName ||
						(productionName.trim().length < 6 &&
							productionName.trim().length > 50)
					) {
						throw new Error(
							`Il nome della società di produzione ${
								index + 1
							} deve contenere almeno 6 caratteri e non più di 50`
						);
					}
				});
				return true;
			}),
		check('screenwriters')
			.isArray({ min: 1 })
			.withMessage("L'elenco degli sceneggiatori deve contenere almeno un nome")
			.custom((screenwriters) => {
				screenwriters.forEach((screenwriter, index) => {
					const { screenwriterName } = screenwriter;

					if (
						!screenwriterName ||
						(screenwriterName.trim().length < 6 &&
							screenwriterName.trim().length > 30)
					) {
						throw new Error(
							`Il nome dello sceneggiatore ${
								index + 1
							} deve contenere almeno 6 caratteri e non più di 30`
						);
					}
				});
				return true;
			}),
		check('genres')
			.isArray({ min: 1 })
			.withMessage(
				"L'elenco dei generi deve essere di una lunghezza minima di una unità"
			)
			.custom((genres) => {
				genres.forEach((genre, index) => {
					const { genreName } = genre;

					if (!genreName) {
						throw new Error(
							`Il nome del genere cinematografico ${index + 1} è obbligatorio`
						);
					}
				});
				return true;
			}),
		check('directorOfPhotography')
			.isString()
			.isLength({ min: 6, max: 30 })
			.trim(),
		check('synopsis').isString().isLength({ min: 10, max: 300 }).trim(),
		check('duration').isFloat().isLength({ min: 1, max: 3 }),
		check('year').isFloat().isLength({ min: 4, max: 4 }),
		check('type').isString().trim(),
	],
	editFilm
);
//delete-film => DELETE
router.delete('/delete-film', deleteFilm);

module.exports = router;
