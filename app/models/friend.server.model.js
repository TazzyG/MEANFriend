'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Friend Schema
 */
var FriendSchema = new Schema({
	firstName: {
		type: String,
		default: '',
		required: 'Please fill in your first name',
		trim: true
	},
	lastName: {
		type: String,
		default: '',
		required: 'Please fill your last name',
		trim: true
	},
	email: {
		type: String,
		default: '',
		required: 'Please fill in your email ',
		trim: true
	},

	founder: {
		type: Boolean
	},
	skill1: {
		type: String,
		default: '',
		trim: true
	},
	skill2: {
		type: String,
		default: '',
		trim: true
	},

	wifm1: {
		type: String,
		default: '',
		trim: true
	},
	website: {
		type: String,
		default: '',
		trim: true
	},
	myStyle: {
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

mongoose.model('Friend', FriendSchema);
