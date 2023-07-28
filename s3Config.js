/** @format */
const S3 = require('aws-sdk/clients/s3');
require('dotenv').config();
const fs = require('fs');

const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;

const s3 = new S3({
	region,
	accessKeyId,
	secretAccessKey,
});

const uploadFile = (file, fileKey) => {
	const fileStream = fs.createReadStream(file.path);

	const uploadParams = {
		Bucket: bucketName,
		Body: fileStream,
		Key: fileKey,
		ContentType: file.mimetype,
	};

	return s3.upload(uploadParams).promise();
};

const getImageUrlFromS3 = async (imageKey) => {
	const params = {
		Bucket: bucketName,
		Key: imageKey,
	};

	return new Promise((resolve, reject) => {
		s3.getSignedUrl('getObject', params, (err, url) => {
			if (err) {
				reject(err);
			} else {
				resolve(url);
			}
		});
	});
};

const deleteImageFromS3 = (imageKey) => {
	const params = {
		Bucket: bucketName,
		Key: imageKey,
	};

	return new Promise((resolve, reject) => {
		s3.deleteObject(params, (err, data) => {
			if (err) {
				reject(err);
			} else {
				resolve(data);
			}
		});
	});
};

const findImageKey = async (imageKey) => {
	const params = {
		Bucket: bucketName,
		Key: imageKey,
	};

	return new Promise((resolve, reject) => {
		s3.headObject(params, (err, data) => {
			if (err) {
				reject(err);
			} else {
				resolve(data);
			}
		});
	});
};

const getImageKeysFromFilm = (film) => {
	const imageKeys = [];
	if (film.coverImageKey) {
		imageKeys.push(film.coverImageKey);
	}
	if (film.pressBookPdfKey) {
		imageKeys.push(film.pressBookPdfKey);
	}
	return imageKeys;
};

module.exports = {
	uploadFile,
	getImageUrlFromS3,
	getImageKeysFromFilm,
	deleteImageFromS3,
	findImageKey,
};
