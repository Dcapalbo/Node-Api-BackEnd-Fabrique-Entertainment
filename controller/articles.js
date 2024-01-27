/** @format */

const { validationResult } = require('express-validator');
const Article = require('../model/article');
const {
	uploadFile,
	getImageUrlFromS3,
	deleteImageFromS3,
	getImageKeysFromEntity,
} = require('../s3Config');

// GET => Getting all articles
exports.getArticles = async (req, res) => {
	try {
		const articles = await Article.find();
		const articlesWithImages = await Promise.all(
			articles.map(async (article) => {
				let articleImageUrl;

				if (article.articleImageKey) {
					articleImageUrl = await getImageUrlFromS3(article.articleImageKey);
				}

				return {
					...article.toObject(),
					profileCover: {
						articleImageUrl,
						articleImageKey: article.articleImageKey,
					},
				};
			})
		);
		return res.status(200).send(articlesWithImages ?? articles);
	} catch (error) {
		return res.status(404).json({
			message: 'Something went wrong with the articles fetching',
			error,
		});
	}
};

// POST => create News
exports.createArticle = async (req, res) => {
	const { title, date, tag, description, link } = req.body;
	// Validate request body using express-validator
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).json({
			article: { title, date, tag, link },
			message: 'Validation errors are present',
			errorMessage: errors.array()[0].msg,
			validationErrors: errors.array(),
		});
	}

	try {
		// Check if Article already exists in the database
		const existingArticle = await Article.findOne({ link });
		if (existingArticle) {
			return res.status(400).json({
				message: 'The article has already been registered',
			});
		}
		//take the image to match with key for S3 AWS
		const articleImage = req.filed.find(
			(file) => file.fieldname === 'articleImage'
		);
		//create the key to match with image for S3 AWS
		const articleImageKey = `articles/${title}/ArticlePicture/${articleImage.originalname}`;

		await uploadFile(articleImage, articleImageKey);
		const article = await Article.create({
			title,
			date,
			tag,
			description,
			link,
		});
		// Return success response with created article

		deleteFile('images/' + articleImage.filename);

		res.status(201).json({
			message: 'The article has been created',
			article,
		});
	} catch (err) {
		// Handle errors
		console.error('Error creating article: ', err);
		res.status(500).json({
			message: 'Internal server error',
		});
	}
};
// PUT => edit the article
exports.editArticle = async (req, res) => {
	const { title, date, tag, description, link, _id } = req.body;

	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).json({
			article: { title, date, tag, link, _id },
			message: 'Validation errors are present',
			errorMessage: errors.array()[0].msg,
			validationErrors: errors.array(),
		});
	}

	if (!_id) {
		res.status(404).json({
			message:
				'Was not possible to update the specific article, because the id is missing',
		});
	}

	let articleImageKey;
	let articleImage;

	if (req.body.articleImage) {
		articleImageKey = req.body.articleImage;
	}

	if (req.files.length > 0) {
		articleImage = req.files.find((file) => file.fieldname === 'articleImage');
		articleImageKey = `articles/${title}/articlePicture/${articleImage.originalname}`;
		await uploadFile(articleImage, articleImageKey);
	}

	const update = { title, date, tag, description, link, _id };

	try {
		const updatedArticle = await Article.findByIdAndUpdate(_id, update, {
			new: true,
		});

		if (articleImage) {
			deleteFile('images/' + articleImage.filename);
		}

		return res.status(200).send(updatedArticle);
	} catch (error) {
		res.status(500).json({
			message: 'Was not possible to update the specific article.',
			error,
		});
	}
};

//DELETE => Delete a single article using the article id and the s3 images correlated to it
exports.deleteArticle = async (req, res) => {
	const articleId = req.body._id;

	try {
		const article = await Article.findById(articleId);

		if (!article) {
			return res.status(404).json({ message: 'article not found' });
		}

		const articleImageKey = getImageKeysFromEntity(article);

		await deleteImageFromS3(articleImageKey);
		await Article.findByIdAndRemove(articleId);

		res.status(200).json({
			message: 'The article and its associated images has been deleted',
		});
	} catch (error) {
		return res.status(500).json({
			message: 'Something went wrong while deleting a article:',
			error,
		});
	}
};

//DELETE IMAGE => delete one specific image attached to the film from s3
exports.deleteImage = async (req, res) => {
	const imageKey = req.query.image_key;

	try {
		const deleteResult = await deleteImageFromS3(imageKey);
		const article = await Article.findOne({ articleImageKey: imageKey });

		if (!article) {
			return res.status(404).json({ message: 'article not found' });
		}

		if (article.articleImageKey === imageKey) {
			article.articleImageKey = null;
		}

		await article.save();

		return res.json({
			message: 'article deleted from S3 successfully',
			deleteResult,
		});
	} catch (error) {
		return res
			.status(500)
			.json({ message: 'Error deleting image from S3.', error });
	}
};
