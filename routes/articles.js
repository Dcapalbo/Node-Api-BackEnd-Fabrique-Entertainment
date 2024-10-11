/** @format */

const { check } = require('express-validator');
const express = require('express');
const router = express.Router();
const { getArticles, addArticle, editArticle, deleteArticle, deleteImage } = require('../controller/articles');

//articles => GET
router.get('/get-articles', getArticles);
//add-article => POST
router.post(
	'/add-article',
	[
		check('author').isString().isLength({ min: 3, max: 30 }).trim(),
		check('date').custom((value) => {
			const date = new Date(value);
			if (isNaN(date.getTime())) {
				throw new Error('Data non valida');
			}
			return true;
		}),
		check('tag').isString().isLength({ min: 5, max: 30 }).trim(),
		check('description').isString().isLength({ min: 10, max: 5000 }).trim(),
		check('link')
			.isURL({
				protocols: ['http', 'https'],
				require_tld: true,
				require_protocol: true,
			})
			.withMessage('Il trailer deve essere un URL valido con il protocollo HTTP o HTTPS'),
	],
	addArticle
);
//update-article => POC
router.put(
	'/update-article',
	[
		check('author').isString().isLength({ min: 3, max: 30 }).trim(),
		check('date').custom((value) => {
			const date = new Date(value);
			if (isNaN(date.getTime())) {
				throw new Error('Data non valida');
			}
			return true;
		}),
		check('tag').isString().isLength({ min: 5, max: 30 }).trim(),
		check('description').isString().isLength({ min: 10, max: 5000 }).trim(),
		check('link')
			.isURL({
				protocols: ['http', 'https'],
				require_tld: true,
				require_protocol: true,
			})
			.withMessage('Il trailer deve essere un URL valido con il protocollo HTTP o HTTPS'),
	],
	editArticle
);
//delete-article => DELETE
router.delete('/delete-article', deleteArticle);
//delete-image => DELETE
router.delete('/delete-article-image', deleteImage);

module.exports = router;
