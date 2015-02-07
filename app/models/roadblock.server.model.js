'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Roadblock Schema
 */
var RoadblockSchema = new Schema({
	name: {
		type: String,
		default: '',
		trim: true
	},
	description: {
		type: String,
		required: 'Please fill Roadblock description',
		default: '',
		trim: true
	},
	sherpaFound: {
		type: Boolean
	},
	googleDocs: {
		type: Boolean
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

mongoose.model('Roadblock', RoadblockSchema);
