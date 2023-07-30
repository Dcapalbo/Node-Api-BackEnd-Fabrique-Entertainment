/** @format */

const { validationResult } = require('express-validator');
const { deleteFile } = require('../util/functions');
const Contact = require('../model/contact');
const {
	uploadFile,
	getImageUrlFromS3,
	getImageKeysFromFilm,
	deleteImageFromS3,
	findImageKey,
} = require('../s3Config');

// GET => Getting all contacts
exports.getContacts = async (req, res) => {
	try {
		const contacts = await Contact.find();
		const contactsWithImages = await Promise.all(
			contacts.map(async (contact) => {
				let contactImageUrl;

				if (contact.contactImageKey) {
					contactImageUrl = await getImageUrlFromS3(contact.contactImageKey);
				}

				return {
					...contact.toObject(),
					profileCover: {
						contactImageUrl,
						contactImageKey: contact.contactImageKey,
					},
				};
			})
		);
		return res
			.status(200)
			.send(contactsWithImages ? contactsWithImages : contacts);
	} catch (error) {
		return res.status(404).json({
			message: 'Something went wrong with the contacts fetching',
			error,
		});
	}
};

// POST => Adding a Contact
exports.addContact = async (req, res) => {
	const { name, surname, role, bio, email, slug, phoneNumber } = req.body;

	const errors = validationResult(req);
	// if there are errors
	// Send a response with the status and a json
	if (!errors.isEmpty()) {
		res.status(422).json({
			contact: {
				name,
				surname,
				role,
				bio,
				email,
				slug,
				phoneNumber,
			},
			message: 'There was a problem with the validation process',
			errorMessage: errors.array()[0].msg,
			validationErrors: errors.array(),
		});
	}
	try {
		const existingContact = await Contact.findOne({ name, surname, email });
		if (existingContact) {
			return res.status(400).json({ message: 'The contact exists already' });
		}

		const contactImage = req.files.find(
			(file) => file.fieldname === 'contactImage'
		);
		const contactImageKey = `contacts/${name}/profilePicture/${contactImage.originalname}`;

		await uploadFile(contactImage, contactImageKey);

		const contact = await Contact.create({
			name,
			surname,
			role,
			bio,
			email,
			slug,
			phoneNumber,
			contactImageKey,
		});

		return res.status(201).send(contact);
	} catch (error) {
		return res.status(500).json({ message: 'Something went wrong.', error });
	}
};

// PUT => Editing a contact
exports.editContact = async (req, res) => {
	let contactImageKey = req.body.contactImageKey;

	const { name, surname, role, bio, email, slug, phoneNumber, _id } = req.body;

	if (!_id) {
		res.status(404).json({
			message:
				'Was not possible to update the specific contact, because the id is missing',
		});
	}

	let contactImage;

	if (req.files.length > 0) {
		contactImage = req.files.find((file) => file.fieldname === 'contactImage');
		contactImageKey = `contacts/${name}/profilePicture/${contactImage.originalname}`;

		const presentContact = await Contact.findById(_id);

		if (
			presentContact?.contactImageKey !== undefined &&
			presentContact?.contactImageKey !== null &&
			presentContact?.contactImageKey !== contactImageKey
		) {
			const findCoverImageS3 = await findImageKey(
				presentContact.contactImageKey
			);
			if (findCoverImageS3) {
				await deleteImageFromS3(presentContact.contactImageKey);
				await uploadFile(contactImage, contactImageKey);
			}
		}

		await uploadFile(contactImage, contactImageKey);
	}

	const update = {
		name,
		surname,
		role,
		bio,
		email,
		slug,
		phoneNumber,
		contactImageKey,
	};

	const errors = validationResult(req);
	// if there are errors
	// Send a response with the status and a json
	if (!errors.isEmpty()) {
		res.status(422).json({
			contact: {
				name,
				surname,
				role,
				bio,
				email,
				slug,
				phoneNumber,
				_id,
				contactImageKey,
			},
			message: 'There was a problem with the validation process',
			errorMessage: errors.array()[0].msg,
			validationErrors: errors.array(),
		});
	}

	try {
		const updatedContact = await Contact.findByIdAndUpdate(_id, update, {
			new: true,
		});

		deleteFile('images/' + contactImage.filename);

		res.status(200).json(updatedContact);
	} catch (error) {
		res
			.status(500)
			.json({ message: 'Was not possible to update the specific contact.' });
	}
};

//DELETE => Delete a single contact using the contact id and the s3 images correlated to it
exports.deleteContact = async (req, res) => {
	const contactId = req.body._id;

	try {
		const contact = await Contact.findById(contactId);

		if (!contact) {
			return res.status(404).json({ message: 'Contact not found' });
		}

		const imageKeys = getImageKeysFromFilm(contact);
		const deletePromises = imageKeys.map((imageKey) =>
			deleteImageFromS3(imageKey)
		);

		await Promise.all(deletePromises);
		await Contact.findByIdAndRemove(contactId);

		res.status(200).json({
			message: 'The contact and its associated images has been deleted',
		});
	} catch (error) {
		return res.status(500).json({
			message: 'Something went wrong while deleting a contact:',
			error,
		});
	}
};

//DELETE IMAGE => delete one specific image attached to the film from s3
exports.deleteImage = async (req, res) => {
	const imageKey = req.query.image_key;

	try {
		const deleteResult = await deleteImageFromS3(imageKey);
		const contact = await Contact.findOne({ contactImageKey: imageKey });

		if (!contact) {
			return res.status(404).json({ message: 'Contact not found' });
		}

		if (contact.contactImageKey === imageKey) {
			contact.contactImageKey = null;
		}

		await contact.save();

		return res.json({
			message: 'Contact deleted from S3 successfully',
			deleteResult,
		});
	} catch (error) {
		return res
			.status(500)
			.json({ message: 'Error deleting image from S3.', error });
	}
};
