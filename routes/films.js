/** @format */

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

				if (coProductionName.length < 6 || coProductionName.length > 40) {
					throw new Error(
						`Il nome della co-produzione ${
							index + 1
						} deve contenere almeno 6 caratteri e non più di 40`
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

				if (coProducerName.length < 6 || coProducerName.length > 40) {
					throw new Error(
						`Il nome del co-produttore ${
							index + 1
						} deve contenere almeno 6 caratteri e non più di 40`
					);
				}
			});

			return true;
		}),
		check('collaborations').custom((collaborations) => {
			if (!collaborations || collaborations.length === 0) {
				return true;
			}

			collaborations.forEach((collaboration, index) => {
				const { collaborationName } = collaboration;

				if (collaborationName.length < 6 || collaborationName.length > 40) {
					throw new Error(
						`Il nome della collaborazione ${
							index + 1
						} deve contenere almeno 6 caratteri e non più di 40`
					);
				}
			});

			return true;
		}),
		check('contributes').custom((contributes) => {
			if (!contributes || contributes.length === 0) {
				return true;
			}

			contributes.forEach((contribute, index) => {
				const { contributeName } = contribute;

				if (contributeName.length < 6 || contributeName.length > 40) {
					throw new Error(
						`Il nome del contributo ${
							index + 1
						} deve contenere almeno 6 caratteri e non più di 40`
					);
				}
			});

			return true;
		}),
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
		check('subjects')
			.isArray({ min: 1 })
			.withMessage(
				"L'elenco degli scrittori del soggetto deve contenere almeno un nome"
			)
			.custom((subjects) => {
				subjects.forEach((subject, index) => {
					const { subjectName } = subject;

					if (
						!subjectName ||
						(subjectName.trim().length < 6 && subjectName.trim().length > 40)
					) {
						throw new Error(
							`Il nome dello scritore del soggetto ${
								index + 1
							} deve contenere almeno 6 caratteri e non più di 40`
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
							} deve contenere almeno 6 caratteri e non più di 40`
						);
					}
				});
				return true;
			}),
		check('genre').isString().trim(),
		check('projectState').isString().trim(),
		check('directorOfPhotography')
			.isString()
			.isLength({ min: 6, max: 40 })
			.trim(),
		check('editing').isString().isLength({ min: 6, max: 40 }).trim(),
		check('scenography')
			.optional()
			.isString()
			.isLength({ min: 6, max: 40 })
			.trim(),
		check('costumes')
			.optional()
			.isString()
			.isLength({ min: 6, max: 40 })
			.trim(),
		check('musics')
			.isArray({ min: 1 })
			.withMessage("L'elenco dei musicisti deve contenere almeno un nome")
			.custom((musics) => {
				musics.forEach((music, index) => {
					const { musicName } = music;

					if (
						!musicName ||
						(musicName.trim().length < 6 && musicName.trim().length > 40)
					) {
						throw new Error(
							`Il nome del musicista ${
								index + 1
							} deve contenere almeno 6 caratteri e non più di 40`
						);
					}
				});
				return true;
			}),
		check('sound').optional().isString().isLength({ min: 6, max: 40 }).trim(),
		check('soundDesign')
			.optional()
			.isString()
			.isLength({ min: 6, max: 40 })
			.trim(),
		check('casting').optional().isString().isLength({ min: 6, max: 40 }).trim(),
		check('lineProducer')
			.optional()
			.isString()
			.isLength({ min: 6, max: 40 })
			.trim(),
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
		check('distributor')
			.optional()
			.isString()
			.isLength({ min: 6, max: 40 })
			.trim(),
		check('salesAgent')
			.optional()
			.isString()
			.isLength({ min: 6, max: 40 })
			.trim(),
		check('firstAssistantDirector')
			.optional()
			.isString()
			.isLength({ min: 6, max: 40 })
			.trim(),
		check('synopsis').isString().isLength({ min: 10, max: 5000 }).trim(),
		check('productionNotes')
			.optional()
			.isString()
			.isLength({ min: 10, max: 5000 })
			.trim(),
		check('directorNotes')
			.optional()
			.isString()
			.isLength({ min: 10, max: 5000 })
			.trim(),
		check('duration').isFloat().isLength({ min: 1, max: 3 }),
		check('year').isFloat().isLength({ min: 4, max: 4 }),
		check('festivals').custom((festivals) => {
			if (!festivals || festivals.length === 0) {
				return true;
			}

			festivals.forEach((festival, index) => {
				const { festivalName } = festival;
				if (festivalName.length < 10 || festivalName.length > 80) {
					throw new Error(
						`Il nome del festival ${
							index + 1
						} deve contenere almeno 10 caratteri e non più di 80`
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

				if (coProductionName.length < 6 || coProductionName.length > 40) {
					throw new Error(
						`Il nome della co-produzione ${
							index + 1
						} deve contenere almeno 6 caratteri e non più di 40`
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

				if (coProducerName.length < 6 || coProducerName.length > 40) {
					throw new Error(
						`Il nome del co-produttore ${
							index + 1
						} deve contenere almeno 6 caratteri e non più di 40`
					);
				}
			});

			return true;
		}),
		check('collaborations').custom((collaborations) => {
			if (!collaborations || collaborations.length === 0) {
				return true;
			}

			collaborations.forEach((collaboration, index) => {
				const { collaborationName } = collaboration;

				if (collaborationName.length < 6 || collaborationName.length > 40) {
					throw new Error(
						`Il nome della collaborazione ${
							index + 1
						} deve contenere almeno 6 caratteri e non più di 40`
					);
				}
			});

			return true;
		}),
		check('contributes').custom((contributes) => {
			if (!contributes || contributes.length === 0) {
				return true;
			}

			contributes.forEach((contribute, index) => {
				const { contributeName } = contribute;

				if (contributeName.length < 6 || contributeName.length > 40) {
					throw new Error(
						`Il nome del contributo ${
							index + 1
						} deve contenere almeno 6 caratteri e non più di 40`
					);
				}
			});

			return true;
		}),
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
		check('subjects')
			.isArray({ min: 1 })
			.withMessage(
				"L'elenco degli scrittori del soggetto deve contenere almeno un nome"
			)
			.custom((subjects) => {
				subjects.forEach((subject, index) => {
					const { subjectName } = subject;

					if (
						!subjectName ||
						(subjectName.trim().length < 6 && subjectName.trim().length > 40)
					) {
						throw new Error(
							`Il nome dello scritore del soggetto ${
								index + 1
							} deve contenere almeno 6 caratteri e non più di 40`
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
							} deve contenere almeno 6 caratteri e non più di 40`
						);
					}
				});
				return true;
			}),
		check('genre').isString().trim(),
		check('projectState').isString().trim(),
		check('directorOfPhotography')
			.isString()
			.isLength({ min: 6, max: 40 })
			.trim(),
		check('editing').isString().isLength({ min: 6, max: 40 }).trim(),
		check('scenography')
			.optional()
			.isString()
			.isLength({ min: 6, max: 40 })
			.trim(),
		check('costumes')
			.optional()
			.isString()
			.isLength({ min: 6, max: 40 })
			.trim(),
		check('musics')
			.isArray({ min: 1 })
			.withMessage("L'elenco dei musicisti deve contenere almeno un nome")
			.custom((musics) => {
				musics.forEach((music, index) => {
					const { musicName } = music;

					if (
						!musicName ||
						(musicName.trim().length < 6 && musicName.trim().length > 40)
					) {
						throw new Error(
							`Il nome del musicista ${
								index + 1
							} deve contenere almeno 6 caratteri e non più di 40`
						);
					}
				});
				return true;
			}),
		check('sound').optional().isString().isLength({ min: 6, max: 40 }).trim(),
		check('soundDesign')
			.optional()
			.isString()
			.isLength({ min: 6, max: 40 })
			.trim(),
		check('casting').optional().isString().isLength({ min: 6, max: 40 }).trim(),
		check('lineProducer')
			.optional()
			.isString()
			.isLength({ min: 6, max: 40 })
			.trim(),
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
		check('distributor')
			.optional()
			.isString()
			.isLength({ min: 6, max: 40 })
			.trim(),
		check('salesAgent')
			.optional()
			.isString()
			.isLength({ min: 6, max: 40 })
			.trim(),
		check('firstAssistantDirector')
			.optional()
			.isString()
			.isLength({ min: 6, max: 40 })
			.trim(),
		check('synopsis').isString().isLength({ min: 10, max: 5000 }).trim(),
		check('productionNotes')
			.optional()
			.isString()
			.isLength({ min: 10, max: 5000 })
			.trim(),
		check('directorNotes')
			.optional()
			.isString()
			.isLength({ min: 10, max: 5000 })
			.trim(),
		check('duration').isFloat().isLength({ min: 1, max: 3 }),
		check('year').isFloat().isLength({ min: 4, max: 4 }),
		check('festivals').custom((festivals) => {
			if (!festivals || festivals.length === 0) {
				return true;
			}

			festivals.forEach((festival, index) => {
				const { festivalName } = festival;
				if (festivalName.length < 10 || festivalName.length > 80) {
					throw new Error(
						`Il nome del festival ${
							index + 1
						} deve contenere almeno 10 caratteri e non più di 80`
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
//delete-image => DELETE
router.delete('/delete-film-image', deleteImage);

module.exports = router;
