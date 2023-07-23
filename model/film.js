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
	productions: [
		{
			productionName: {
				type: String,
				required: true,
			},
		},
	],
	producers: [
		{
			producerName: {
				type: String,
				required: true,
			},
		},
	],
	coProductions: [
		{
			coProductionName: {
				type: String,
			},
		},
	],
	coProducers: [
		{
			coProducerName: {
				type: String,
			},
		},
	],
	actors: [
		{
			actorName: {
				type: String,
				required: true,
			},
			actorRole: {
				type: String,
				required: true,
			},
		},
	],
	subjects: [
		{
			subjectName: {
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
	genre: {
		type: String,
		required: true,
	},
	directorOfPhotography: {
		type: String,
		required: true,
	},
	editing: {
		type: String,
		required: true,
	},
	scenography: {
		type: String,
		required: true,
	},
	costumes: {
		type: String,
		required: true,
	},
	music: {
		type: String,
		required: true,
	},
	sound: {
		type: String,
		required: true,
	},
	soundDesign: {
		type: String,
		required: true,
	},
	casting: {
		type: String,
		required: true,
	},
	lineProducer: {
		type: String,
		required: true,
	},
	executiveProducers: [
		{
			executiveProducerName: {
				type: String,
				required: true,
			},
		},
	],
	distributor: {
		type: String,
	},
	salesAgent: {
		type: String,
	},
	firstAssistantDirector: {
		type: String,
		required: true,
	},
	synopsis: {
		type: String,
		required: true,
	},
	productionNotes: {
		type: String,
	},
	duration: {
		type: Number,
		required: true,
	},
	year: {
		type: Number,
		required: true,
	},
	festivals: [
		{
			festivalName: {
				type: String,
			},
		},
	],
	type: {
		type: String,
		required: true,
	},
	trailer: {
		type: String,
	},
	imdb: {
		type: String,
	},
	facebook: {
		type: String,
	},
	instagram: {
		type: String,
	},
	slug: {
		type: String,
		required: true,
	},
});

// / exporting the model and the Schema
module.exports = mongoose.model('Film', filmSchema);
