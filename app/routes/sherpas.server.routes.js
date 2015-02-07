'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var sherpas = require('../../app/controllers/sherpas.server.controller');

	// Sherpas Routes
	app.route('/sherpas')
		.get(sherpas.list)
		.post(users.requiresLogin, sherpas.create);

	app.route('/sherpas/:sherpaId')
		.get(sherpas.read)
		.put(users.requiresLogin, sherpas.hasAuthorization, sherpas.update)
		.delete(users.requiresLogin, sherpas.hasAuthorization, sherpas.delete);

	// Finish by binding the Sherpa middleware
	app.param('sherpaId', sherpas.sherpaByID);
};
