'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Roadblock = mongoose.model('Roadblock'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, roadblock;

/**
 * Roadblock routes tests
 */
describe('Roadblock CRUD tests', function() {
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

		// Save a user to the test db and create new Roadblock
		user.save(function() {
			roadblock = {
				name: 'Roadblock Name'
			};

			done();
		});
	});

	it('should be able to save Roadblock instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Roadblock
				agent.post('/roadblocks')
					.send(roadblock)
					.expect(200)
					.end(function(roadblockSaveErr, roadblockSaveRes) {
						// Handle Roadblock save error
						if (roadblockSaveErr) done(roadblockSaveErr);

						// Get a list of Roadblocks
						agent.get('/roadblocks')
							.end(function(roadblocksGetErr, roadblocksGetRes) {
								// Handle Roadblock save error
								if (roadblocksGetErr) done(roadblocksGetErr);

								// Get Roadblocks list
								var roadblocks = roadblocksGetRes.body;

								// Set assertions
								(roadblocks[0].user._id).should.equal(userId);
								(roadblocks[0].name).should.match('Roadblock Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Roadblock instance if not logged in', function(done) {
		agent.post('/roadblocks')
			.send(roadblock)
			.expect(401)
			.end(function(roadblockSaveErr, roadblockSaveRes) {
				// Call the assertion callback
				done(roadblockSaveErr);
			});
	});

	it('should not be able to save Roadblock instance if no name is provided', function(done) {
		// Invalidate name field
		roadblock.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Roadblock
				agent.post('/roadblocks')
					.send(roadblock)
					.expect(400)
					.end(function(roadblockSaveErr, roadblockSaveRes) {
						// Set message assertion
						(roadblockSaveRes.body.message).should.match('Please fill Roadblock name');
						
						// Handle Roadblock save error
						done(roadblockSaveErr);
					});
			});
	});

	it('should be able to update Roadblock instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Roadblock
				agent.post('/roadblocks')
					.send(roadblock)
					.expect(200)
					.end(function(roadblockSaveErr, roadblockSaveRes) {
						// Handle Roadblock save error
						if (roadblockSaveErr) done(roadblockSaveErr);

						// Update Roadblock name
						roadblock.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Roadblock
						agent.put('/roadblocks/' + roadblockSaveRes.body._id)
							.send(roadblock)
							.expect(200)
							.end(function(roadblockUpdateErr, roadblockUpdateRes) {
								// Handle Roadblock update error
								if (roadblockUpdateErr) done(roadblockUpdateErr);

								// Set assertions
								(roadblockUpdateRes.body._id).should.equal(roadblockSaveRes.body._id);
								(roadblockUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Roadblocks if not signed in', function(done) {
		// Create new Roadblock model instance
		var roadblockObj = new Roadblock(roadblock);

		// Save the Roadblock
		roadblockObj.save(function() {
			// Request Roadblocks
			request(app).get('/roadblocks')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Roadblock if not signed in', function(done) {
		// Create new Roadblock model instance
		var roadblockObj = new Roadblock(roadblock);

		// Save the Roadblock
		roadblockObj.save(function() {
			request(app).get('/roadblocks/' + roadblockObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', roadblock.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Roadblock instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Roadblock
				agent.post('/roadblocks')
					.send(roadblock)
					.expect(200)
					.end(function(roadblockSaveErr, roadblockSaveRes) {
						// Handle Roadblock save error
						if (roadblockSaveErr) done(roadblockSaveErr);

						// Delete existing Roadblock
						agent.delete('/roadblocks/' + roadblockSaveRes.body._id)
							.send(roadblock)
							.expect(200)
							.end(function(roadblockDeleteErr, roadblockDeleteRes) {
								// Handle Roadblock error error
								if (roadblockDeleteErr) done(roadblockDeleteErr);

								// Set assertions
								(roadblockDeleteRes.body._id).should.equal(roadblockSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Roadblock instance if not signed in', function(done) {
		// Set Roadblock user 
		roadblock.user = user;

		// Create new Roadblock model instance
		var roadblockObj = new Roadblock(roadblock);

		// Save the Roadblock
		roadblockObj.save(function() {
			// Try deleting Roadblock
			request(app).delete('/roadblocks/' + roadblockObj._id)
			.expect(401)
			.end(function(roadblockDeleteErr, roadblockDeleteRes) {
				// Set message assertion
				(roadblockDeleteRes.body.message).should.match('User is not logged in');

				// Handle Roadblock error error
				done(roadblockDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Roadblock.remove().exec();
		done();
	});
});