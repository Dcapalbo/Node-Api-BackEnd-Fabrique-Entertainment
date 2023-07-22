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
		check('director').isString().isLength({ min: 6, max: 40 }).trim(),
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
							productionName.trim().length > 40)
					) {
						throw new Error(
							`Il nome della società di produzione ${
								index + 1
							} deve contenere almeno 6 caratteri e non più di 40`
						);
					}
				});
				return true;
			}),
		check('producers')
			.isArray({ min: 1 })
			.withMessage(
				"L'elenco delle produzioni deve contenere almeno una società di produzione"
			)
			.custom((producers) => {
				producers.forEach((producer, index) => {
					const { producerName } = producer;

					if (
						!producerName ||
						(producerName.trim().length < 6 && producerName.trim().length > 40)
					) {
						throw new Error(
							`Il nome della società di produzione ${
								index + 1
							} deve contenere almeno 6 caratteri e non più di 40`
						);
					}
				});
				return true;
			}),
		check('coProductions').custom((coProductions) => {
			if (!coProductions || coProductions.length === 0) {
				return true;
			}

			coProductions.forEach((coProduction, index) => {
				const { coProductionName } = coProduction;

				if (coProductionName.length < 10 || coProductionName.length > 40) {
					throw new Error(
						`Il nome della co-produzione ${
							index + 1
						} deve contenere almeno 10 caratteri e non più di 40`
					);
				}
			});

			return true;
		}),
		check('coProducers').custom((coProducers) => {
			if (!coProducers || coProducers.length === 0) {
				return true;
			}

			coProducers.forEach((coProducer, index) => {
				const { coProducerName } = coProducer;

				if (coProducerName.length < 10 || coProducerName.length > 40) {
					throw new Error(
						`Il nome del co-produttore ${
							index + 1
						} deve contenere almeno 10 caratteri e non più di 40`
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
							screenwriterName.trim().length > 40)
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
		check('genre').isString().trim(),
		check('directorOfPhotography')
			.isString()
			.isLength({ min: 6, max: 40 })
			.trim(),
		check('editing').isString().isLength({ min: 6, max: 40 }).trim(),
		check('scenography').isString().isLength({ min: 6, max: 40 }).trim(),
		check('costumes').isString().isLength({ min: 6, max: 40 }).trim(),
		check('music').isString().isLength({ min: 6, max: 40 }).trim(),
		check('sound').isString().isLength({ min: 6, max: 40 }).trim(),
		check('soundDesign').isString().isLength({ min: 6, max: 40 }).trim(),
		check('casting').isString().isLength({ min: 6, max: 40 }).trim(),
		check('lineProducer').isString().isLength({ min: 6, max: 40 }).trim(),
		check('executiveProducers')
			.isArray({ min: 1 })
			.withMessage('Deve essere presente almeno 1 produttore esecutivo')
			.custom((executiveProducers) => {
				executiveProducers.forEach((executiveProducer, index) => {
					const { executiveProducerName } = executiveProducer;

					if (
						!executiveProducerName ||
						(executiveProducerName.trim().length < 6 &&
							executiveProducerName.trim().length > 40)
					) {
						throw new Error(
							`Il nome del produttore esecutivo ${
								index + 1
							} deve contenere almeno 6 caratteri e non più di 40`
						);
					}
				});
				return true;
			}),
		check('distributor').isString().isLength({ min: 6, max: 40 }).trim(),
		check('salesAgent').isString().isLength({ min: 6, max: 40 }).trim(),
		check('firstAssistantDirector')
			.isString()
			.isLength({ min: 6, max: 40 })
			.trim(),
		check('synopsis').isString().isLength({ min: 10, max: 300 }).trim(),
		check('productionNotes').isString().isLength({ min: 10, max: 300 }).trim(),
		check('duration').isFloat().isLength({ min: 1, max: 3 }),
		check('year').isFloat().isLength({ min: 4, max: 4 }),
		check('festivals').custom((festivals) => {
			if (!festivals || festivals.length === 0) {
				return true;
			}

			festivals.forEach((festival, index) => {
				const { festivalName } = festival;
				if (festivalName.length < 10 || festivalName.length > 50) {
					throw new Error(
						`Il nome del festival ${
							index + 1
						} deve contenere almeno 10 caratteri e non più di 50`
					);
				}
			});
			return true;
		}),
		check('type').isString().trim(),
		check('trailer')
			.optional()
			.isURL({
				protocols: ['http', 'https'],
				require_tld: true,
				require_protocol: true,
			})
			.withMessage(
				'Il trailer deve essere un URL valido con il protocollo HTTP o HTTPS'
			),
		check('imdb')
			.optional()
			.isURL({
				protocols: ['http', 'https'],
				require_tld: true,
				require_protocol: true,
			})
			.withMessage(
				'Il link di imdb deve essere un URL valido con il protocollo HTTP o HTTPS'
			),
		check('instagram')
			.optional()
			.isURL({
				protocols: ['http', 'https'],
				require_tld: true,
				require_protocol: true,
			})
			.withMessage(
				'Il link di instagram deve essere un URL valido con il protocollo HTTP o HTTPS'
			),
		check('facebook')
			.optional()
			.isURL({
				protocols: ['http', 'https'],
				require_tld: true,
				require_protocol: true,
			})
			.withMessage(
				'Il link di facebook deve essere un URL valido con il protocollo HTTP o HTTPS'
			),
	],
	addFilm
);
//update-film => PUT
router.put(
	'/update-film',
	[
		check('title').isString().isLength({ min: 3, max: 30 }).trim(),
		check('director').isString().isLength({ min: 6, max: 40 }).trim(),
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
							productionName.trim().length > 40)
					) {
						throw new Error(
							`Il nome della società di produzione ${
								index + 1
							} deve contenere almeno 6 caratteri e non più di 40`
						);
					}
				});
				return true;
			}),
		check('producers')
			.isArray({ min: 1 })
			.withMessage(
				"L'elenco delle produzioni deve contenere almeno una società di produzione"
			)
			.custom((producers) => {
				producers.forEach((producer, index) => {
					const { producerName } = producer;

					if (
						!producerName ||
						(producerName.trim().length < 6 && producerName.trim().length > 40)
					) {
						throw new Error(
							`Il nome della società di produzione ${
								index + 1
							} deve contenere almeno 6 caratteri e non più di 40`
						);
					}
				});
				return true;
			}),
		check('coProductions').custom((coProductions) => {
			if (!coProductions || coProductions.length === 0) {
				return true;
			}

			coProductions.forEach((coProduction, index) => {
				const { coProductionName } = coProduction;

				if (coProductionName.length < 10 || coProductionName.length > 40) {
					throw new Error(
						`Il nome della co-produzione ${
							index + 1
						} deve contenere almeno 10 caratteri e non più di 40`
					);
				}
			});

			return true;
		}),
		check('coProducers').custom((coProducers) => {
			if (!coProducers || coProducers.length === 0) {
				return true;
			}

			coProducers.forEach((coProducer, index) => {
				const { coProducerName } = coProducer;

				if (coProducerName.length < 10 || coProducerName.length > 40) {
					throw new Error(
						`Il nome del co-produttore ${
							index + 1
						} deve contenere almeno 10 caratteri e non più di 40`
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
							screenwriterName.trim().length > 40)
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
		check('genre').isString().trim(),
		check('directorOfPhotography')
			.isString()
			.isLength({ min: 6, max: 40 })
			.trim(),
		check('editing').isString().isLength({ min: 6, max: 40 }).trim(),
		check('scenography').isString().isLength({ min: 6, max: 40 }).trim(),
		check('costumes').isString().isLength({ min: 6, max: 40 }).trim(),
		check('music').isString().isLength({ min: 6, max: 40 }).trim(),
		check('sound').isString().isLength({ min: 6, max: 40 }).trim(),
		check('soundDesign').isString().isLength({ min: 6, max: 40 }).trim(),
		check('casting').isString().isLength({ min: 6, max: 40 }).trim(),
		check('lineProducer').isString().isLength({ min: 6, max: 40 }).trim(),
		check('executiveProducers')
			.isArray({ min: 1 })
			.withMessage(
				"L'elenco delle produzioni deve contenere almeno una società di produzione"
			)
			.custom((executiveProducers) => {
				executiveProducers.forEach((executiveProducer, index) => {
					const { executiveProducerName } = executiveProducer;

					if (
						!executiveProducerName ||
						(executiveProducerName.trim().length < 6 &&
							executiveProducerName.trim().length > 40)
					) {
						throw new Error(
							`Il nome del produttore esecutivo ${
								index + 1
							} deve contenere almeno 6 caratteri e non più di 40`
						);
					}
				});
				return true;
			}),
		check('distributor').isString().isLength({ min: 6, max: 40 }).trim(),
		check('salesAgent').isString().isLength({ min: 6, max: 40 }).trim(),
		check('firstAssistantDirector')
			.isString()
			.isLength({ min: 6, max: 40 })
			.trim(),
		check('synopsis').isString().isLength({ min: 10, max: 300 }).trim(),
		check('productionNotes').isString().isLength({ min: 10, max: 300 }).trim(),
		check('duration').isFloat().isLength({ min: 1, max: 3 }),
		check('year').isFloat().isLength({ min: 4, max: 4 }),
		check('festivals').custom((festivals) => {
			if (!festivals || festivals.length === 0) {
				return true;
			}

			festivals.forEach((festival, index) => {
				const { festivalName } = festival;
				if (festivalName.length < 10 || festivalName.length > 50) {
					throw new Error(
						`Il nome del festival ${
							index + 1
						} deve contenere almeno 10 caratteri e non più di 50`
					);
				}
			});
			return true;
		}),
		check('type').isString().trim(),
		check('trailer')
			.optional()
			.isURL({
				protocols: ['http', 'https'],
				require_tld: true,
				require_protocol: true,
			})
			.withMessage(
				'Il trailer deve essere un URL valido con il protocollo HTTP o HTTPS'
			),
		check('imdb')
			.optional()
			.isURL({
				protocols: ['http', 'https'],
				require_tld: true,
				require_protocol: true,
			})
			.withMessage(
				'Il link di imdb deve essere un URL valido con il protocollo HTTP o HTTPS'
			),
		check('instagram')
			.optional()
			.isURL({
				protocols: ['http', 'https'],
				require_tld: true,
				require_protocol: true,
			})
			.withMessage(
				'Il link di instagram deve essere un URL valido con il protocollo HTTP o HTTPS'
			),
		check('facebook')
			.optional()
			.isURL({
				protocols: ['http', 'https'],
				require_tld: true,
				require_protocol: true,
			})
			.withMessage(
				'Il link di facebook deve essere un URL valido con il protocollo HTTP o HTTPS'
			),
	],
	editFilm
);
//delete-film => DELETE
router.delete('/delete-film', deleteFilm);

module.exports = router;
