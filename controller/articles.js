/** @format */

const { uploadEntityFiles } = require('../util/functions');
const Article = require('../model/article');
const {
	getImageUrlFromS3,
	deleteImageFromS3,
	getImageKeysFromEntity,
} = require('../s3Config');

// GET => Getting all articles
exports.getArticles = async (req, res) => {
	try {
		const articles = await Article.find().sort({ date: 1 });
		const articlesWithImages = await Promise.all(
			articles.map(async (article) => {
				let articleImageUrl;

				if (article.articleImageKey) {
					articleImageUrl = await getImageUrlFromS3(article.articleImageKey);
				}

				return {
					...article.toObject(),
					articleCover: {
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

// POST => add Article
exports.addArticle = async (req, res) => {
	let uploadedFileKey; // To keep track of the uploaded file key for cleanup
	try {
		// Check if the article already exists
		const existingArticle = await Article.findOne({ link: req.body.link });
		if (existingArticle) {
			return res
				.status(400)
				.json({ message: 'The article has already been registered.' });
		}

		// Handle the file upload
		const { articleImageKey } = await uploadEntityFiles(
			req,
			'articles',
			req.body.author
		);
		uploadedFileKey = articleImageKey; // Save the uploaded file key for potential cleanup

		// Create the article in the database with validated fields
		const article = await Article.create({
			...req.body,
			articleImageKey, // This field will be undefined if no image was provided/uploaded
		});

		res.status(201).json({
			message: 'The article has been created successfully.',
			article,
		});
	} catch (err) {
		console.error('Error creating article: ', err);
		// Cleanup uploaded files from S3 in case of error
		if (uploadedFileKey) {
			await deleteImageFromS3(uploadedFileKey);
		}
		res.status(500).json({ message: 'Internal server error.' });
	}
};
// PUT => edit the article
exports.editArticle = async (req, res) => {
	// Extract the article ID from the request body
	const { _id } = req.body;

	// Return an error if the ID is missing from the request
	if (!_id) {
		return res.status(404).json({
			message: 'Unable to update the article because the ID is missing.',
		});
	}

	// Variable to keep track of any uploaded file's key for potential cleanup
	let uploadedFileKey = null;

	try {
		// Verify that the article exists in the database
		const existingArticle = await Article.findById(_id);
		if (!existingArticle) {
			return res.status(404).json({ message: 'Article not found.' });
		}

		// Start with all the validated fields from the request for the update
		let update = { ...req.body };

		// Handle a new image upload, if provided
		if (req.files.length > 0) {
			const uploadResult = await uploadEntityFiles(
				req,
				'articles',
				existingArticle.author
			);
			if (uploadResult.articleImageKey) {
				// Update the articleImageKey only if a new image has been successfully uploaded
				update.articleImageKey = uploadResult.articleImageKey;
				uploadedFileKey = update.articleImageKey; // Keep track of the uploaded file key for cleanup
			}
		}

		// Update the article in the database with the new values
		const updatedArticle = await Article.findByIdAndUpdate(_id, update, {
			new: true,
		});

		// Respond with the updated article and a success message
		return res.status(200).json({
			message: 'The article has been updated successfully.',
			article: updatedArticle,
		});
	} catch (error) {
		console.error('Error updating article: ', error);

		// If an error occurred after uploading a file to S3, clean up the uploaded file
		if (uploadedFileKey) {
			// Ensure the deleteImageFromS3 function exists and is implemented correctly
			await deleteImageFromS3(uploadedFileKey);
		}

		// Respond with an error message if the update process fails
		return res.status(500).json({
			message: 'Unable to update the specified article.',
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
