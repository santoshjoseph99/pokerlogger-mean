'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Pokerlog = mongoose.model('Pokerlog'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, pokerlog;

/**
 * Pokerlog routes tests
 */
describe('Pokerlog CRUD tests', function() {
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

		// Save a user to the test db and create new Pokerlog
		user.save(function() {
			pokerlog = {
				name: 'Pokerlog Name'
			};

			done();
		});
	});

	it('should be able to save Pokerlog instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Pokerlog
				agent.post('/pokerlogs')
					.send(pokerlog)
					.expect(200)
					.end(function(pokerlogSaveErr, pokerlogSaveRes) {
						// Handle Pokerlog save error
						if (pokerlogSaveErr) done(pokerlogSaveErr);

						// Get a list of Pokerlogs
						agent.get('/pokerlogs')
							.end(function(pokerlogsGetErr, pokerlogsGetRes) {
								// Handle Pokerlog save error
								if (pokerlogsGetErr) done(pokerlogsGetErr);

								// Get Pokerlogs list
								var pokerlogs = pokerlogsGetRes.body;

								// Set assertions
								(pokerlogs[0].user._id).should.equal(userId);
								(pokerlogs[0].name).should.match('Pokerlog Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Pokerlog instance if not logged in', function(done) {
		agent.post('/pokerlogs')
			.send(pokerlog)
			.expect(401)
			.end(function(pokerlogSaveErr, pokerlogSaveRes) {
				// Call the assertion callback
				done(pokerlogSaveErr);
			});
	});

	it('should not be able to save Pokerlog instance if no name is provided', function(done) {
		// Invalidate name field
		pokerlog.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Pokerlog
				agent.post('/pokerlogs')
					.send(pokerlog)
					.expect(400)
					.end(function(pokerlogSaveErr, pokerlogSaveRes) {
						// Set message assertion
						(pokerlogSaveRes.body.message).should.match('Please fill Pokerlog name');
						
						// Handle Pokerlog save error
						done(pokerlogSaveErr);
					});
			});
	});

	it('should be able to update Pokerlog instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Pokerlog
				agent.post('/pokerlogs')
					.send(pokerlog)
					.expect(200)
					.end(function(pokerlogSaveErr, pokerlogSaveRes) {
						// Handle Pokerlog save error
						if (pokerlogSaveErr) done(pokerlogSaveErr);

						// Update Pokerlog name
						pokerlog.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Pokerlog
						agent.put('/pokerlogs/' + pokerlogSaveRes.body._id)
							.send(pokerlog)
							.expect(200)
							.end(function(pokerlogUpdateErr, pokerlogUpdateRes) {
								// Handle Pokerlog update error
								if (pokerlogUpdateErr) done(pokerlogUpdateErr);

								// Set assertions
								(pokerlogUpdateRes.body._id).should.equal(pokerlogSaveRes.body._id);
								(pokerlogUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Pokerlogs if not signed in', function(done) {
		// Create new Pokerlog model instance
		var pokerlogObj = new Pokerlog(pokerlog);

		// Save the Pokerlog
		pokerlogObj.save(function() {
			// Request Pokerlogs
			request(app).get('/pokerlogs')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Pokerlog if not signed in', function(done) {
		// Create new Pokerlog model instance
		var pokerlogObj = new Pokerlog(pokerlog);

		// Save the Pokerlog
		pokerlogObj.save(function() {
			request(app).get('/pokerlogs/' + pokerlogObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', pokerlog.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Pokerlog instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Pokerlog
				agent.post('/pokerlogs')
					.send(pokerlog)
					.expect(200)
					.end(function(pokerlogSaveErr, pokerlogSaveRes) {
						// Handle Pokerlog save error
						if (pokerlogSaveErr) done(pokerlogSaveErr);

						// Delete existing Pokerlog
						agent.delete('/pokerlogs/' + pokerlogSaveRes.body._id)
							.send(pokerlog)
							.expect(200)
							.end(function(pokerlogDeleteErr, pokerlogDeleteRes) {
								// Handle Pokerlog error error
								if (pokerlogDeleteErr) done(pokerlogDeleteErr);

								// Set assertions
								(pokerlogDeleteRes.body._id).should.equal(pokerlogSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Pokerlog instance if not signed in', function(done) {
		// Set Pokerlog user 
		pokerlog.user = user;

		// Create new Pokerlog model instance
		var pokerlogObj = new Pokerlog(pokerlog);

		// Save the Pokerlog
		pokerlogObj.save(function() {
			// Try deleting Pokerlog
			request(app).delete('/pokerlogs/' + pokerlogObj._id)
			.expect(401)
			.end(function(pokerlogDeleteErr, pokerlogDeleteRes) {
				// Set message assertion
				(pokerlogDeleteRes.body.message).should.match('User is not logged in');

				// Handle Pokerlog error error
				done(pokerlogDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Pokerlog.remove().exec();
		done();
	});
});