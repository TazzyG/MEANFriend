'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Milestone = mongoose.model('Milestone'),
	_ = require('lodash');

/**
 * Create a Milestone
 */
exports.create = function(req, res) {
	var milestone = new Milestone(req.body);
	milestone.user = req.user;

	milestone.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(milestone);
		}
	});
};

/**
 * Show the current Milestone
 */
exports.read = function(req, res) {
	res.jsonp(req.milestone);
};

/**
 * Update a Milestone
 */
exports.update = function(req, res) {
	var milestone = req.milestone ;

	milestone = _.extend(milestone , req.body);

	milestone.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(milestone);
		}
	});
};

/**
 * Delete an Milestone
 */
exports.delete = function(req, res) {
	var milestone = req.milestone ;

	milestone.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(milestone);
		}
	});
};

/**
 * List of Milestones
 */
exports.list = function(req, res) { 
	Milestone.find().sort('-created').populate('user', 'displayName').exec(function(err, milestones) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(milestones);
		}
	});
};

/**
 * Milestone middleware
 */
exports.milestoneByID = function(req, res, next, id) { 
	Milestone.findById(id).populate('user', 'displayName').exec(function(err, milestone) {
		if (err) return next(err);
		if (! milestone) return next(new Error('Failed to load Milestone ' + id));
		req.milestone = milestone ;
		next();
	});
};

/**
 * Milestone authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.milestone.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
