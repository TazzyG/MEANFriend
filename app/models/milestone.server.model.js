'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Milestone Schema
 */
var MilestoneSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill in Your name',
		trim: true
	},
	major: {
		type: Boolean,
		default: '',
		trim: true
	},
	achievement: {
		type: String,
		default: '',
		trim: true
	},
	event: {
		type: String,
		default: '',
		trim: true
	},
	nextDate: {
		type: Date,
		default: ''
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

mongoose.model('Milestone', MilestoneSchema);
