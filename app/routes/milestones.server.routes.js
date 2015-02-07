'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var milestones = require('../../app/controllers/milestones.server.controller');

	// Milestones Routes
	app.route('/milestones')
		.get(milestones.list)
		.post(users.requiresLogin, milestones.create);

	app.route('/milestones/:milestoneId')
		.get(milestones.read)
		.put(users.requiresLogin, milestones.hasAuthorization, milestones.update)
		.delete(users.requiresLogin, milestones.hasAuthorization, milestones.delete);

	// Finish by binding the Milestone middleware
	app.param('milestoneId', milestones.milestoneByID);
};

