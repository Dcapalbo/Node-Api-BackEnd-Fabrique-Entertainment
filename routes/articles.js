/** @format */

const { lengthCheck, optionalUrlCheck } = require('../util/functions');
const { check } = require('express-validator');
const express = require('express');
const router = express.Router();
const {
	getArticles,
	addArticle,
	editArticle,
	deleteArticle,
	deleteImage,
} = require('../controller/articles');

//articles => GET
router.get('/get-articles', getArticles);
//add-article => POST
router.post(
	'/add-article',
	[
		lengthCheck('author', 3, 30),
		check('date').custom((value) => {
			const date = new Date(value);
			if (isNaN(date.getTime())) {
				throw new Error('Data non valida');
			}
			return true;
		}),
		lengthCheck('tag', 3, 30),
		lengthCheck('description', 10, 5000),
		optionalUrlCheck('link'),
	],
	addArticle
);
//update-article => PUT
router.put(
	'/update-article',
	[
		lengthCheck('author', 3, 30),
		check('date').custom((value) => {
			const date = new Date(value);
			if (isNaN(date.getTime())) {
				throw new Error('Data non valida');
			}
			return true;
		}),
		lengthCheck('tag', 3, 30),
		lengthCheck('description', 10, 5000),
		optionalUrlCheck('link'),
	],
	editArticle
);
//delete-article => DELETE
router.delete('/delete-article', deleteArticle);
//delete-image => DELETE
router.delete('/delete-article-image', deleteImage);

module.exports = router;
