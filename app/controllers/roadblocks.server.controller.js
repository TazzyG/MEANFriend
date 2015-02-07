'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Roadblock = mongoose.model('Roadblock'),
	_ = require('lodash');

/**
 * Create a Roadblock
 */
exports.create = function(req, res) {
	var roadblock = new Roadblock(req.body);
	roadblock.user = req.user;

	roadblock.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(roadblock);
		}
	});
};

/**
 * Show the current Roadblock
 */
exports.read = function(req, res) {
	res.jsonp(req.roadblock);
};

/**
 * Update a Roadblock
 */
exports.update = function(req, res) {
	var roadblock = req.roadblock ;

	roadblock = _.extend(roadblock , req.body);

	roadblock.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(roadblock);
		}
	});
};

/**
 * Delete an Roadblock
 */
exports.delete = function(req, res) {
	var roadblock = req.roadblock ;

	roadblock.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(roadblock);
		}
	});
};

/**
 * List of Roadblocks
 */
exports.list = function(req, res) { 
	Roadblock.find().sort('-created').populate('user', 'displayName').exec(function(err, roadblocks) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(roadblocks);
		}
	});
};

/**
 * Roadblock middleware
 */
exports.roadblockByID = function(req, res, next, id) { 
	Roadblock.findById(id).populate('user', 'displayName').exec(function(err, roadblock) {
		if (err) return next(err);
		if (! roadblock) return next(new Error('Failed to load Roadblock ' + id));
		req.roadblock = roadblock ;
		next();
	});
};

/**
 * Roadblock authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.roadblock.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
