'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var roadblocks = require('../../app/controllers/roadblocks.server.controller');

	// Roadblocks Routes
	app.route('/roadblocks')
		.get(roadblocks.list)
		.post(users.requiresLogin, roadblocks.create);

	app.route('/roadblocks/:roadblockId')
		.get(roadblocks.read)
		.put(users.requiresLogin, roadblocks.hasAuthorization, roadblocks.update)
		.delete(users.requiresLogin, roadblocks.hasAuthorization, roadblocks.delete);

	// Finish by binding the Roadblock middleware
	app.param('roadblockId', roadblocks.roadblockByID);
};
