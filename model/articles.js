/** @format */

const mongoose = require('mongoose');
// creating the Mongoose db Schema
const Schema = mongoose.Schema;
// contacts Schema
const articleSchema = new Schema({
	title: {
		type: String,
		required: true,
	},
	date: {
		type: String,
		required: true,
	},
	tag: {
		type: String,
		required: true,
	},
	link: {
		type: String,
		required: true,
	},
	newsImageKey: {
		type: String,
		required: true,
	},
});

// / exporting the model and the Schema
module.exports = mongoose.model('Articles', articleSchema);
