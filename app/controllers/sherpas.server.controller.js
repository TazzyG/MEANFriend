'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Sherpa = mongoose.model('Sherpa'),
	_ = require('lodash');

/**
 * Create a Sherpa
 */
exports.create = function(req, res) {
	var sherpa = new Sherpa(req.body);
	sherpa.user = req.user;

	sherpa.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(sherpa);
		}
	});
};

/**
 * Show the current Sherpa
 */
exports.read = function(req, res) {
	res.jsonp(req.sherpa);
};

/**
 * Update a Sherpa
 */
exports.update = function(req, res) {
	var sherpa = req.sherpa ;

	sherpa = _.extend(sherpa , req.body);

	sherpa.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(sherpa);
		}
	});
};

/**
 * Delete an Sherpa
 */
exports.delete = function(req, res) {
	var sherpa = req.sherpa ;

	sherpa.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(sherpa);
		}
	});
};

/**
 * List of Sherpas
 */
exports.list = function(req, res) { 
	Sherpa.find().sort('-created').populate('user', 'displayName').exec(function(err, sherpas) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(sherpas);
		}
	});
};

/**
 * Sherpa middleware
 */
exports.sherpaByID = function(req, res, next, id) { 
	Sherpa.findById(id).populate('user', 'displayName').exec(function(err, sherpa) {
		if (err) return next(err);
		if (! sherpa) return next(new Error('Failed to load Sherpa ' + id));
		req.sherpa = sherpa ;
		next();
	});
};

/**
 * Sherpa authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.sherpa.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
