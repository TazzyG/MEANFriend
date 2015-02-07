'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Journey = mongoose.model('Journey'),
	_ = require('lodash');

/**
 * Create a Journey
 */
exports.create = function(req, res) {
	var journey = new Journey(req.body);
	journey.user = req.user;

	journey.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(journey);
		}
	});
};

/**
 * Show the current Journey
 */
exports.read = function(req, res) {
	res.jsonp(req.journey);
};

/**
 * Update a Journey
 */
exports.update = function(req, res) {
	var journey = req.journey ;

	journey = _.extend(journey , req.body);

	journey.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(journey);
		}
	});
};

/**
 * Delete a Journey
 */
exports.delete = function(req, res) {
	var journey = req.journey ;

	journey.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(journey);
		}
	});
};

/**
 * List of Journeys
 */
exports.list = function(req, res) { 
	Journey.find().sort('-created').populate('user', 'displayName').exec(function(err, journeys) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(journeys);
		}
	});
};

/**
 * Journey middleware
 */
exports.journeyByID = function(req, res, next, id) {
	Journey.findById(id).populate('user', 'displayName').exec(function(err, journey) {
		if (err) return next(err);
		if (! journey) return next(new Error('Failed to load Journey ' + id));
		req.journey = journey ;
		next();
	});
};

/**
 * Journey authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.journey.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
