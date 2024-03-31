/** @format */

const {
	lengthCheck,
	validateArrayFieldLength,
	validateOptionalStringFieldLength,
	optionalUrlCheck,
} = require('../util/functions');
const { check } = require('express-validator');
const express = require('express');
const router = express.Router();
const {
	getFilms,
	addFilm,
	editFilm,
	deleteFilm,
	deleteImage,
} = require('../controller/films');

//films => GET ALL
router.get('/get-films', getFilms);
//add-film => POST
router.post(
	'/add-film',
	[
		lengthCheck('title', 3, 30),
		lengthCheck('director', 6, 40),
		...validateArrayFieldLength('productions', 'productionName', 6, 40),
		...validateArrayFieldLength('producers', 'producerName', 6, 40),
		...validateArrayFieldLength('coProductions', 'coProductionName', 6, 40),
		...validateArrayFieldLength('coProducers', 'coProducerName', 6, 40),
		...validateArrayFieldLength('collaborations', 'collaborationName', 6, 40),
		...validateArrayFieldLength('contributes', 'contributeName', 6, 40),
		check('actors')
			.isArray({ min: 1 })
			.withMessage(
				"L'elenco degli attori deve contenere almeno un nome e un ruolo"
			)
			.custom((actors) => {
				actors.forEach((actor, index) => {
					const { actorName, actorRole } = actor;

					if (
						!actorName ||
						(actorName.trim().length < 3 && actorName.trim().length > 40)
					) {
						throw new Error(
							`Il nome dell'attore ${
								index + 1
							} deve contenere almeno 3 caratteri e non più di 40`
						);
					}

					if (
						!actorRole ||
						(actorRole.trim().length < 3 && actorRole.trim().length > 40)
					) {
						throw new Error(
							`Il ruolo dell'attore ${
								index + 1
							} deve contenere almeno 3 caratteri e non più di 40`
						);
					}
				});
				return true;
			}),
		...validateArrayFieldLength('subjects', 'subjectName', 6, 40),
		...validateArrayFieldLength('screenwriters', 'screenwriterName', 6, 40),
		check('genre').isString().trim(),
		check('projectState').isString().trim(),
		lengthCheck('directorOfPhotography', 6, 40),
		lengthCheck('editing', 6, 40),
		validateOptionalStringFieldLength('scenography', 6, 40),
		validateOptionalStringFieldLength('costumes', 6, 40),
		...validateArrayFieldLength('musics', 'musicName', 6, 40),
		validateOptionalStringFieldLength('sound', 6, 40),
		validateOptionalStringFieldLength('soundDesign', 6, 40),
		validateOptionalStringFieldLength('casting', 6, 40),
		validateOptionalStringFieldLength('lineProducer', 6, 40),
		...validateArrayFieldLength(
			'executiveProducers',
			'executiveProducerName',
			6,
			40
		),
		validateOptionalStringFieldLength('distributor', 6, 40),
		validateOptionalStringFieldLength('salesAgent', 6, 40),
		validateOptionalStringFieldLength('firstAssistantDirector', 6, 40),
		lengthCheck('synopsis', 10, 5000),
		lengthCheck('productionNotes', 10, 5000),
		lengthCheck('directorNotes', 10, 5000),
		check('duration').isFloat().isLength({ min: 1, max: 3 }),
		check('year').isFloat().isLength({ min: 4, max: 4 }),
		check('festivals').custom((festivals) => {
			if (!festivals || festivals.length === 0) {
				throw new Error('Festivals array is required');
			}

			festivals.forEach((festival, index) => {
				const { festivalName, festivalType, festivalRoles } = festival;

				if (
					!festivalName ||
					festivalName.length < 10 ||
					festivalName.length > 80
				) {
					throw new Error(
						`Festival name at index ${index} must be between 10 and 80 characters`
					);
				}

				if (!festivalType) {
					throw new Error(`Festival type at index ${index} is required`);
				}

				if (festivalRoles) {
					festivalRoles.forEach((role, roleIndex) => {
						const { festivalRoleName, festivalPersonName } = role;

						if (
							!festivalRoleName ||
							festivalRoleName.length < 6 ||
							festivalRoleName.length > 40
						) {
							throw new Error(
								`Festival role name at index ${roleIndex} must be between 6 and 40 characters`
							);
						}

						if (
							!festivalPersonName ||
							festivalPersonName.length < 6 ||
							festivalPersonName.length > 40
						) {
							throw new Error(
								`Festival person name at index ${roleIndex} must be between 6 and 40 characters`
							);
						}
					});
				}
			});

			return true;
		}),
		check('type').isString().trim(),
		optionalUrlCheck('trailer'),
		optionalUrlCheck('imdb'),
		optionalUrlCheck('instagram'),
		optionalUrlCheck('facebook'),
	],
	addFilm
);
//update-film => PUT
router.put(
	'/update-film',
	[
		lengthCheck('title', 3, 30),
		lengthCheck('director', 6, 40),
		...validateArrayFieldLength('productions', 'productionName', 6, 40),
		...validateArrayFieldLength('producers', 'producerName', 6, 40),
		...validateArrayFieldLength('coProductions', 'coProductionName', 6, 40),
		...validateArrayFieldLength('coProducers', 'coProducerName', 6, 40),
		...validateArrayFieldLength('collaborations', 'collaborationName', 6, 40),
		...validateArrayFieldLength('contributes', 'contributeName', 6, 40),
		check('actors')
			.isArray({ min: 1 })
			.withMessage(
				"L'elenco degli attori deve contenere almeno un nome e un ruolo"
			)
			.custom((actors) => {
				actors.forEach((actor, index) => {
					const { actorName, actorRole } = actor;

					if (
						!actorName ||
						(actorName.trim().length < 3 && actorName.trim().length > 40)
					) {
						throw new Error(
							`Il nome dell'attore ${
								index + 1
							} deve contenere almeno 3 caratteri e non più di 40`
						);
					}

					if (
						!actorRole ||
						(actorRole.trim().length < 3 && actorRole.trim().length > 40)
					) {
						throw new Error(
							`Il ruolo dell'attore ${
								index + 1
							} deve contenere almeno 3 caratteri e non più di 40`
						);
					}
				});
				return true;
			}),
		...validateArrayFieldLength('subjects', 'subjectName', 6, 40),
		...validateArrayFieldLength('screenwriters', 'screenwriterName', 6, 40),
		check('genre').isString().trim(),
		check('projectState').isString().trim(),
		lengthCheck('directorOfPhotography', 6, 40),
		lengthCheck('editing', 6, 40),
		validateOptionalStringFieldLength('scenography', 6, 40),
		validateOptionalStringFieldLength('costumes', 6, 40),
		...validateArrayFieldLength('musics', 'musicName', 6, 40),
		validateOptionalStringFieldLength('sound', 6, 40),
		validateOptionalStringFieldLength('soundDesign', 6, 40),
		validateOptionalStringFieldLength('casting', 6, 40),
		validateOptionalStringFieldLength('lineProducer', 6, 40),
		...validateArrayFieldLength(
			'executiveProducers',
			'executiveProducerName',
			6,
			40
		),
		validateOptionalStringFieldLength('distributor', 6, 40),
		validateOptionalStringFieldLength('salesAgent', 6, 40),
		validateOptionalStringFieldLength('firstAssistantDirector', 6, 40),
		lengthCheck('synopsis', 10, 5000),
		lengthCheck('productionNotes', 10, 5000),
		lengthCheck('directorNotes', 10, 5000),
		check('duration').isFloat().isLength({ min: 1, max: 3 }),
		check('year').isFloat().isLength({ min: 4, max: 4 }),
		check('festivals').custom((festivals) => {
			if (!festivals || festivals.length === 0) {
				throw new Error('Festivals array is required');
			}

			festivals.forEach((festival, index) => {
				const { festivalName, festivalType, festivalRoles } = festival;

				if (
					!festivalName ||
					festivalName.length < 10 ||
					festivalName.length > 80
				) {
					throw new Error(
						`Festival name at index ${index} must be between 10 and 80 characters`
					);
				}

				if (!festivalType) {
					throw new Error(`Festival type at index ${index} is required`);
				}

				if (festivalRoles) {
					festivalRoles.forEach((role, roleIndex) => {
						const { festivalRoleName, festivalPersonName } = role;

						if (
							!festivalRoleName ||
							festivalRoleName.length < 6 ||
							festivalRoleName.length > 40
						) {
							throw new Error(
								`Festival role name at index ${roleIndex} must be between 6 and 40 characters`
							);
						}

						if (
							!festivalPersonName ||
							festivalPersonName.length < 6 ||
							festivalPersonName.length > 40
						) {
							throw new Error(
								`Festival person name at index ${roleIndex} must be between 6 and 40 characters`
							);
						}
					});
				}
			});

			return true;
		}),
		check('type').isString().trim(),
		optionalUrlCheck('trailer'),
		optionalUrlCheck('imdb'),
		optionalUrlCheck('instagram'),
		optionalUrlCheck('facebook'),
	],
	editFilm
);
//delete-film => DELETE
router.delete('/delete-film', deleteFilm);
//delete-image => DELETE
router.delete('/delete-film-image', deleteImage);

module.exports = router;
