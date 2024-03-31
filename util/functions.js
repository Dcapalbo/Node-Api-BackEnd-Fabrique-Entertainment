/** @format */

const { check, validationResult } = require('express-validator');
const path = require('path');
const fs = require('fs');
const { uploadFile } = require('../s3Config');

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

const handleValidationErrors = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).json({ errors: errors.array() });
	}
	next();
};

async function uploadEntityFiles(req, entityType, entityIdentifier) {
	const fileKeys = {};

	const entityFileConfig = {
		films: [
			{ fieldname: 'coverImage', keyName: 'coverImageKey', required: true },
			{
				fieldname: 'pressBookPdf',
				keyName: 'pressBookPdfKey',
				required: false,
			},
		],
		articles: [
			{ fieldname: 'articleImage', keyName: 'articleImageKey', required: true },
		],
		contacts: [
			{ fieldname: 'contactImage', keyName: 'contactImageKey', required: true },
		],
	};

	const filesToUpload = entityFileConfig[entityType] || [];
	console.log(filesToUpload, 'i miei files');

	for (const { fieldname, keyName, required } of filesToUpload) {
		const file = req.files.find((file) => file.fieldname === fieldname);
		if (file) {
			const fileKey = `${entityType}/${entityIdentifier}/${fieldname}/${file.originalname}`;
			await uploadFile(file, fileKey);
			fileKeys[keyName] = fileKey;
			fs.unlinkSync(file.path);
		} else if (required) {
			throw new Error(
				`Il file obbligatorio "${fieldname}" per ${entityType} (${entityIdentifier}) non è stato fornito.`
			);
		}
	}

	return fileKeys;
}

module.exports = {
	deleteFile,
	readImageData,
	lengthCheck,
	validateOptionalStringFieldLength,
	optionalUrlCheck,
	validateArrayFieldLength,
	handleValidationErrors,
	uploadEntityFiles,
};
