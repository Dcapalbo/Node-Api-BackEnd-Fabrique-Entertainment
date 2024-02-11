/** @format */

const mongoose = require('mongoose');
// creating the Mongoose db Schema
const Schema = mongoose.Schema;
// contacts Schema
const articleSchema = new Schema({
	author: {
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
	description: {
		type: String,
		required: true,
	},
	link: {
		type: String,
		required: true,
	},
	articleImageKey: {
		type: String,
	},
});

// / exporting the model and the Schema
module.exports = mongoose.model('Article', articleSchema);
