/** @format */
const { lengthCheck } = require('../util/functions');
const { check } = require('express-validator');
const express = require('express');
const router = express.Router();
const {
	getContacts,
	addContact,
	editContact,
	deleteContact,
	deleteImage,
} = require('../controller/contacts');

//contacts => GET
router.get('/get-contacts', getContacts);
//add-contacts => POST
router.post(
	'/add-contact',
	[
		lengthCheck('name', 3, 15),
		lengthCheck('surname', 3, 20),
		lengthCheck('role', 5, 30),
		lengthCheck('bio', 10, 500),
		check('email')
			.isEmail()
			.normalizeEmail()
			.isLength({ min: 10, max: 40 })
			.trim(),
		check('phoneNumber').optional().isFloat().isLength({ min: 10, max: 15 }),
	],
	addContact
);
//update-contact => PUT
router.put(
	'/update-contact',
	[
		lengthCheck('name', 3, 15),
		lengthCheck('surname', 3, 20),
		lengthCheck('role', 5, 30),
		lengthCheck('bio', 10, 500),
		check('email')
			.isEmail()
			.normalizeEmail()
			.isLength({ min: 10, max: 40 })
			.trim(),
		check('phoneNumber').optional().isFloat().isLength({ min: 10, max: 15 }),
	],
	editContact
);
//delete-contact => DELETE
router.delete('/delete-contact', deleteContact);
//delete-image => DELETE
router.delete('/delete-contact-image', deleteImage);

module.exports = router;
