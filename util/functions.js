/** @format */

const { check } = require('express-validator');
const path = require('path');
const fs = require('fs');

function deleteFile(filePath) {
	fs.unlink(filePath, (err) => {
		if (err) {
			throw err;
		}
	});
}

function readImageData(filePath) {
	const absolutePath = path.join(__dirname, filePath);
	const imageData = fs.readFileSync(absolutePath);
	return imageData;
}

function getContentType(fileExtension) {
	switch (fileExtension) {
		case '.jpg':
		case '.jpeg':
			return 'image/jpeg';
		case '.png':
			return 'image/png';
		case '.gif':
			return 'image/gif';
		// Add more supported file extensions as needed
		default:
			return null;
	}
}

const lengthCheck = (fieldName, min, max) =>
	check(fieldName)
		.isString()
		.trim()
		.isLength({ min, max })
		.withMessage(
			`${fieldName} deve contenere almeno ${min} caratteri e non più di ${max}`
		);

const validateOptionalStringFieldLength = (fieldName, minLen, maxLen) => {
	return check(fieldName)
		.optional({ checkFalsy: true })
		.isString()
		.withMessage(`${fieldName} deve essere una stringa`)
		.isLength({ min: minLen, max: maxLen })
		.withMessage(
			`${fieldName} deve contenere almeno ${minLen} caratteri e non più di ${maxLen}`
		)
		.trim();
};

const optionalUrlCheck = (fieldName) =>
	check(fieldName)
		.optional()
		.isURL({
			protocols: ['http', 'https'],
			require_tld: true,
			require_protocol: true,
		})
		.withMessage(
			`Il link di ${fieldName} deve essere un URL valido con il protocollo HTTP o HTTPS`
		);

const validateArrayFieldLength = (
	arrayFieldName,
	objectFieldName,
	minLen,
	maxLen,
	minArrayLen = 1
) => {
	return [
		check(arrayFieldName)
			.isArray({ min: minArrayLen })
			.withMessage(
				`L'elenco di ${arrayFieldName} deve contenere almeno ${minArrayLen} elemento/i`
			)
			.custom((array) => {
				array.forEach((item, index) => {
					const value = item[objectFieldName];
					if (
						!value ||
						value.trim().length < minLen ||
						value.trim().length > maxLen
					) {
						throw new Error(
							`Il campo ${objectFieldName} dell'elemento ${
								index + 1
							} in ${arrayFieldName} deve contenere almeno ${minLen} caratteri e non più di ${maxLen}`
						);
					}
				});
				return true;
			}),
	];
};

module.exports = {
	deleteFile,
	readImageData,
	getContentType,
	lengthCheck,
	validateOptionalStringFieldLength,
	optionalUrlCheck,
	validateArrayFieldLength,
};
