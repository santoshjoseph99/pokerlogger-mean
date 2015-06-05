'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var pokerlogs = require('../../app/controllers/pokerlogs.server.controller');

	// Pokerlogs Routes
	app.route('/pokerlogs')
		.get(pokerlogs.list)
		.post(users.requiresLogin, pokerlogs.create);

	app.route('/pokerlogs/:pokerlogId')
		.get(pokerlogs.read)
		.put(users.requiresLogin, pokerlogs.hasAuthorization, pokerlogs.update)
		.delete(users.requiresLogin, pokerlogs.hasAuthorization, pokerlogs.delete);

	// Finish by binding the Pokerlog middleware
	app.param('pokerlogId', pokerlogs.pokerlogByID);
};
