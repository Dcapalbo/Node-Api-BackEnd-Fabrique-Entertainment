/** @format */
const { lengthCheck } = require('../util/functions');
const express = require('express');
const router = express.Router();
const {
	createUser,
	loginUser,
	forgotPassword,
	resetPassword,
} = require('../controller/users');

//sign-up => POST
router.post(
	'/sign-up',
	[
		lengthCheck('name', 3, 30),
		lengthCheck('email', 10, 40),
		lengthCheck('password', 10, 30),
	],
	createUser
);
//login => POST
router.post(
	'/login',
	[lengthCheck('email', 10, 40), lengthCheck('password', 10, 30)],
	loginUser
);

//forgot password => POST
router.post('/forgot-password', [lengthCheck('email', 10, 40)], forgotPassword);

//reset password => PUT
router.put(
	'/reset-password',
	[lengthCheck('email', 10, 40), lengthCheck('password', 10, 30)],
	resetPassword
);

module.exports = router;
