/** @format */

const mongoose = require('mongoose');
// creating the Mongoose db Schema
const Schema = mongoose.Schema;
// products Schema
const filmSchema = new Schema({
	title: {
		type: String,
		required: true,
	},
	director: {
		type: String,
		required: true,
	},
	genres: [
		{
			genreName: {
				type: String,
				required: true,
			},
		},
	],
	productions: [
		{
			productionName: {
				type: String,
				required: true,
			},
		},
	],
	screenwriters: [
		{
			screenwriterName: {
				type: String,
				required: true,
			},
		},
	],
	directorOfPhotography: {
		type: String,
		required: true,
	},
	synopsis: {
		type: String,
		required: true,
	},
	duration: {
		type: Number,
		required: true,
	},
	year: {
		type: Number,
		required: true,
	},
	type: {
		type: String,
		required: true,
	},
	slug: {
		type: String,
		required: true,
	},
	imageUrl: {
		data: Buffer,
		contentType: String,
	},
});

// / exporting the model and the Schema
module.exports = mongoose.model('Film', filmSchema);
