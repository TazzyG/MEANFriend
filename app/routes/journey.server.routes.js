'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var journey = require('../controllers/journey.server.controller.js');

	// Journeys Routes
	app.route('/journeys')
		.get(journey.list)
		.post(users.requiresLogin, journey.create);

	app.route('/journeys/:journeyId')
		.get(journey.read)
		.put(users.requiresLogin, journey.hasAuthorization, journey.update)
		.delete(users.requiresLogin, journey.hasAuthorization, journey.delete);

	// Finish by binding the Journey middleware
	app.param('journeyId', journey.journeyByID);
};
