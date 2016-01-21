'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var contribution = require('../../app/controllers/contribution/contribution');
	var reports = require('../../app/controllers/reports');

    var section = require('../../app/controllers/section.server.controller.js');

	app.route('/reports/:reportId/:section')
		.get(users.requiresLogin, reports.hasAuthorization, contribution.readFromReport)
		.post(users.requiresLogin, reports.hasAuthorization, contribution.create);

	app.route('/:section/:sectionId')
		.get(users.requiresLogin, contribution.hasAuthorization, contribution.read)
		.put(users.requiresLogin, contribution.hasAuthorization, contribution.update);

	// Finish by binding the Contribution middleware
    app.param('section', section.name);
    app.param('sectionId', section.id);
};
