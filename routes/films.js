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
		check('genre').isString().trim(),
		check('directorOfPhotography')
			.isString()
			.isLength({ min: 6, max: 30 })
			.trim(),
		check('synopsis').isString().isLength({ min: 10, max: 300 }).trim(),
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
				  `Il nome del festival ${index + 1} deve contenere almeno 10 caratteri e non più di 50`
				);
			  }
			});  
			return true;
		  }),		  
		check('type').isString().trim(),
		check('trailer').optional()      
			.isURL({ protocols: ['http', 'https'], require_tld: true, require_protocol: true })
      		.withMessage('Il trailer deve essere un URL valido con il protocollo HTTP o HTTPS'),
		check('imdb').optional()      
			.isURL({ protocols: ['http', 'https'], require_tld: true, require_protocol: true })
			.withMessage('Il link di imdb deve essere un URL valido con il protocollo HTTP o HTTPS'),
		check('instagram').optional()      
			.isURL({ protocols: ['http', 'https'], require_tld: true, require_protocol: true })
			.withMessage('Il link di instagram deve essere un URL valido con il protocollo HTTP o HTTPS'),
		check('facebook').optional()      
			.isURL({ protocols: ['http', 'https'], require_tld: true, require_protocol: true })
			.withMessage('Il link di facebook deve essere un URL valido con il protocollo HTTP o HTTPS'),
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
		check('genre').isString().trim(),
		check('directorOfPhotography')
			.isString()
			.isLength({ min: 6, max: 30 })
			.trim(),
		check('synopsis').isString().isLength({ min: 10, max: 300 }).trim(),
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
				  `Il nome del festival ${index + 1} deve contenere almeno 10 caratteri e non più di 50`
				);
			  }
			});  
			return true;
		  }),			  
		check('type').isString().trim(),
		check('trailer').optional()      
			.isURL({ protocols: ['http', 'https'], require_tld: true, require_protocol: true })
      		.withMessage('Il trailer deve essere un URL valido con il protocollo HTTP o HTTPS'),
		check('imdb').optional()      
			.isURL({ protocols: ['http', 'https'], require_tld: true, require_protocol: true })
			.withMessage('Il link di imdb deve essere un URL valido con il protocollo HTTP o HTTPS'),
		check('instagram').optional()      
			.isURL({ protocols: ['http', 'https'], require_tld: true, require_protocol: true })
			.withMessage('Il link di instagram deve essere un URL valido con il protocollo HTTP o HTTPS'),
		check('facebook').optional()      
			.isURL({ protocols: ['http', 'https'], require_tld: true, require_protocol: true })
			.withMessage('Il link di facebook deve essere un URL valido con il protocollo HTTP o HTTPS'),
	],
	editFilm
);
//delete-film => DELETE
router.delete('/delete-film', deleteFilm);

module.exports = router;
