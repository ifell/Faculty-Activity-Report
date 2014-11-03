'use strict';

var mongoose = require('mongoose');
var Name = mongoose.model('Name');

var modelClass = require('../modelClass');
var renderModel = new modelClass.RenderModel( Name, 'name/name.tex', 'name/na.tex');

/*
will explicitly populate the report with
the data you provide
*/
renderModel.setDebugPopulate( false, {
	firstName: 'Rosie',
	middleName: 'T',
	lastName: 'Poodle'
});

/*
will explicitly print the N/A latex
to the screen for debugging purposes
*/
renderModel.isDebugNull = false;

/*
render function that finds the obj in the database
and converts it into latex.
*/
module.exports.render = function(req, callback) {
	renderModel.render(req, callback);
};

/*
Gets the data from the frontend and
saves it in the database.
*/
module.exports.submit = function(req, callback) {
	console.log(require('util').inspect(req.body));

	if (!req.body.name) return;

	var name = new Name({
		firstName: req.body.name.firstName,
		middleName: req.body.name.middleName,
		lastName: req.body.name.lastName,
		user: req.user
	});

	name.save(function(err) {
		callback(err, name);
	});
};

