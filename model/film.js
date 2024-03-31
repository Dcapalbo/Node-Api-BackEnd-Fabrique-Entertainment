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
	collaborations: [
		{
			collaborationName: {
				type: String,
			},
		},
	],
	contributes: [
		{
			contributeName: {
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
	projectState: {
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
		default: null,
	},
	costumes: {
		type: String,
		default: null,
	},
	musics: [
		{
			musicName: {
				type: String,
				required: true,
			},
		},
	],
	sound: {
		type: String,
		required: true,
	},
	soundDesign: {
		type: String,
		default: null,
	},
	casting: {
		type: String,
		default: null,
	},
	lineProducer: {
		type: String,
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
		default: null,
	},
	salesAgent: {
		type: String,
		default: null,
	},
	firstAssistantDirector: {
		type: String,
		default: null,
	},
	synopsis: {
		type: String,
		required: true,
		default: null,
	},
	productionNotes: {
		type: String,
		default: null,
	},
	directorNotes: {
		type: String,
		default: null,
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
			festivalType: {
				type: String,
			},
			festivalRoles: [
				{
					festivalRoleName: {
						type: String,
					},
					festivalPersonName: {
						type: String,
					},
				},
			],
		},
	],
	type: {
		type: String,
		required: true,
	},
	trailer: {
		type: String,
		default: null,
	},
	imdb: {
		type: String,
		default: null,
	},
	facebook: {
		type: String,
		default: null,
	},
	instagram: {
		type: String,
		default: null,
	},
	slug: {
		type: String,
		required: true,
	},
	coverImageKey: {
		type: String,
		default: null,
	},
	pressBookPdfKey: {
		type: String,
		default: null,
	},
});

// / exporting the model and the Schema
module.exports = mongoose.model('Film', filmSchema);
