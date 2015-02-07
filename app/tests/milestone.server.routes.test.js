'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Milestone = mongoose.model('Milestone'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, milestone;

/**
 * Milestone routes tests
 */
describe('Milestone CRUD tests', function() {
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

		// Save a user to the test db and create new Milestone
		user.save(function() {
			milestone = {
				name: 'Milestone Name'
			};

			done();
		});
	});

	it('should be able to save Milestone instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Milestone
				agent.post('/milestones')
					.send(milestone)
					.expect(200)
					.end(function(milestoneSaveErr, milestoneSaveRes) {
						// Handle Milestone save error
						if (milestoneSaveErr) done(milestoneSaveErr);

						// Get a list of Milestones
						agent.get('/milestones')
							.end(function(milestonesGetErr, milestonesGetRes) {
								// Handle Milestone save error
								if (milestonesGetErr) done(milestonesGetErr);

								// Get Milestones list
								var milestones = milestonesGetRes.body;

								// Set assertions
								(milestones[0].user._id).should.equal(userId);
								(milestones[0].name).should.match('Milestone Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Milestone instance if not logged in', function(done) {
		agent.post('/milestones')
			.send(milestone)
			.expect(401)
			.end(function(milestoneSaveErr, milestoneSaveRes) {
				// Call the assertion callback
				done(milestoneSaveErr);
			});
	});

	it('should not be able to save Milestone instance if no name is provided', function(done) {
		// Invalidate name field
		milestone.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Milestone
				agent.post('/milestones')
					.send(milestone)
					.expect(400)
					.end(function(milestoneSaveErr, milestoneSaveRes) {
						// Set message assertion
						(milestoneSaveRes.body.message).should.match('Please fill Milestone name');
						
						// Handle Milestone save error
						done(milestoneSaveErr);
					});
			});
	});

	it('should be able to update Milestone instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Milestone
				agent.post('/milestones')
					.send(milestone)
					.expect(200)
					.end(function(milestoneSaveErr, milestoneSaveRes) {
						// Handle Milestone save error
						if (milestoneSaveErr) done(milestoneSaveErr);

						// Update Milestone name
						milestone.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Milestone
						agent.put('/milestones/' + milestoneSaveRes.body._id)
							.send(milestone)
							.expect(200)
							.end(function(milestoneUpdateErr, milestoneUpdateRes) {
								// Handle Milestone update error
								if (milestoneUpdateErr) done(milestoneUpdateErr);

								// Set assertions
								(milestoneUpdateRes.body._id).should.equal(milestoneSaveRes.body._id);
								(milestoneUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Milestones if not signed in', function(done) {
		// Create new Milestone model instance
		var milestoneObj = new Milestone(milestone);

		// Save the Milestone
		milestoneObj.save(function() {
			// Request Milestones
			request(app).get('/milestones')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Milestone if not signed in', function(done) {
		// Create new Milestone model instance
		var milestoneObj = new Milestone(milestone);

		// Save the Milestone
		milestoneObj.save(function() {
			request(app).get('/milestones/' + milestoneObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', milestone.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Milestone instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Milestone
				agent.post('/milestones')
					.send(milestone)
					.expect(200)
					.end(function(milestoneSaveErr, milestoneSaveRes) {
						// Handle Milestone save error
						if (milestoneSaveErr) done(milestoneSaveErr);

						// Delete existing Milestone
						agent.delete('/milestones/' + milestoneSaveRes.body._id)
							.send(milestone)
							.expect(200)
							.end(function(milestoneDeleteErr, milestoneDeleteRes) {
								// Handle Milestone error error
								if (milestoneDeleteErr) done(milestoneDeleteErr);

								// Set assertions
								(milestoneDeleteRes.body._id).should.equal(milestoneSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Milestone instance if not signed in', function(done) {
		// Set Milestone user 
		milestone.user = user;

		// Create new Milestone model instance
		var milestoneObj = new Milestone(milestone);

		// Save the Milestone
		milestoneObj.save(function() {
			// Try deleting Milestone
			request(app).delete('/milestones/' + milestoneObj._id)
			.expect(401)
			.end(function(milestoneDeleteErr, milestoneDeleteRes) {
				// Set message assertion
				(milestoneDeleteRes.body.message).should.match('User is not logged in');

				// Handle Milestone error error
				done(milestoneDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Milestone.remove().exec();
		done();
	});
});