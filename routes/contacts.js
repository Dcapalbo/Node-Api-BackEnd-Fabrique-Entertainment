/** @format */

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
		check('name').isString().isLength({ min: 3, max: 15 }).trim(),
		check('surname').isString().isLength({ min: 3, max: 20 }).trim(),
		check('role').isString().isLength({ min: 5, max: 30 }).trim(),
		check('bio').isString().isLength({ min: 10, max: 500 }).trim(),
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
		check('name').isString().isLength({ min: 3, max: 15 }).trim(),
		check('surname').isString().isLength({ min: 1, max: 20 }).trim(),
		check('role').isString().isLength({ min: 5, max: 30 }).trim(),
		check('bio').isString().isLength({ min: 10, max: 500 }).trim(),
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
