'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Journey Schema
 */
var JourneySchema = new Schema({
	initiator: {
		type: String,
		default: '',
		required: 'Please fill in a name',
		trim: true
	},
	description: {
		type: String,
		default: '',
		required: 'Please fill in a description',
		trim: true
	},

	mainTechnology:  {
		type: String,
		default: '',
		trim: true
	},
	googleDocs: {
		type: Boolean,
		default: false
	},
	recruiting: {
		type: Boolean,
		default: false
	},

	sponsor: {
		type: String,
		default: '',
		trim: true
	},
	stage: {
		type: String,
		default: '',
		trim: true
	},

	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Journey', JourneySchema);
