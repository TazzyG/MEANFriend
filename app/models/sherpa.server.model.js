'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Sherpa Schema
 */
var SherpaSchema = new Schema({
	challenge: {
		type: String,
		default: '',
		trim: true
	},
	sherpa: {
		type: Boolean
	},

	sherpaName: {
		type: String,
		default: '',
		required: 'Please fill in a name',
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

mongoose.model('Sherpa', SherpaSchema);
