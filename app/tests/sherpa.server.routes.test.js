'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Sherpa = mongoose.model('Sherpa'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, sherpa;

/**
 * Sherpa routes tests
 */
describe('Sherpa CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Sherpa
		user.save(function() {
			sherpa = {
				name: 'Sherpa Name'
			};

			done();
		});
	});

	it('should be able to save Sherpa instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Sherpa
				agent.post('/sherpas')
					.send(sherpa)
					.expect(200)
					.end(function(sherpaSaveErr, sherpaSaveRes) {
						// Handle Sherpa save error
						if (sherpaSaveErr) done(sherpaSaveErr);

						// Get a list of Sherpas
						agent.get('/sherpas')
							.end(function(sherpasGetErr, sherpasGetRes) {
								// Handle Sherpa save error
								if (sherpasGetErr) done(sherpasGetErr);

								// Get Sherpas list
								var sherpas = sherpasGetRes.body;

								// Set assertions
								(sherpas[0].user._id).should.equal(userId);
								(sherpas[0].name).should.match('Sherpa Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Sherpa instance if not logged in', function(done) {
		agent.post('/sherpas')
			.send(sherpa)
			.expect(401)
			.end(function(sherpaSaveErr, sherpaSaveRes) {
				// Call the assertion callback
				done(sherpaSaveErr);
			});
	});

	it('should not be able to save Sherpa instance if no name is provided', function(done) {
		// Invalidate name field
		sherpa.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Sherpa
				agent.post('/sherpas')
					.send(sherpa)
					.expect(400)
					.end(function(sherpaSaveErr, sherpaSaveRes) {
						// Set message assertion
						(sherpaSaveRes.body.message).should.match('Please fill Sherpa name');
						
						// Handle Sherpa save error
						done(sherpaSaveErr);
					});
			});
	});

	it('should be able to update Sherpa instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Sherpa
				agent.post('/sherpas')
					.send(sherpa)
					.expect(200)
					.end(function(sherpaSaveErr, sherpaSaveRes) {
						// Handle Sherpa save error
						if (sherpaSaveErr) done(sherpaSaveErr);

						// Update Sherpa name
						sherpa.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Sherpa
						agent.put('/sherpas/' + sherpaSaveRes.body._id)
							.send(sherpa)
							.expect(200)
							.end(function(sherpaUpdateErr, sherpaUpdateRes) {
								// Handle Sherpa update error
								if (sherpaUpdateErr) done(sherpaUpdateErr);

								// Set assertions
								(sherpaUpdateRes.body._id).should.equal(sherpaSaveRes.body._id);
								(sherpaUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Sherpas if not signed in', function(done) {
		// Create new Sherpa model instance
		var sherpaObj = new Sherpa(sherpa);

		// Save the Sherpa
		sherpaObj.save(function() {
			// Request Sherpas
			request(app).get('/sherpas')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Sherpa if not signed in', function(done) {
		// Create new Sherpa model instance
		var sherpaObj = new Sherpa(sherpa);

		// Save the Sherpa
		sherpaObj.save(function() {
			request(app).get('/sherpas/' + sherpaObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', sherpa.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Sherpa instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Sherpa
				agent.post('/sherpas')
					.send(sherpa)
					.expect(200)
					.end(function(sherpaSaveErr, sherpaSaveRes) {
						// Handle Sherpa save error
						if (sherpaSaveErr) done(sherpaSaveErr);

						// Delete existing Sherpa
						agent.delete('/sherpas/' + sherpaSaveRes.body._id)
							.send(sherpa)
							.expect(200)
							.end(function(sherpaDeleteErr, sherpaDeleteRes) {
								// Handle Sherpa error error
								if (sherpaDeleteErr) done(sherpaDeleteErr);

								// Set assertions
								(sherpaDeleteRes.body._id).should.equal(sherpaSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Sherpa instance if not signed in', function(done) {
		// Set Sherpa user 
		sherpa.user = user;

		// Create new Sherpa model instance
		var sherpaObj = new Sherpa(sherpa);

		// Save the Sherpa
		sherpaObj.save(function() {
			// Try deleting Sherpa
			request(app).delete('/sherpas/' + sherpaObj._id)
			.expect(401)
			.end(function(sherpaDeleteErr, sherpaDeleteRes) {
				// Set message assertion
				(sherpaDeleteRes.body.message).should.match('User is not logged in');

				// Handle Sherpa error error
				done(sherpaDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Sherpa.remove().exec();
		done();
	});
});