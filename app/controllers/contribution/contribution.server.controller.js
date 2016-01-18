'use strict';

var mongoose = require('mongoose');
var Contribution = mongoose.model('Contribution');

var errorHandler = require('../errors');
var is = require('is-js');
var _ = require('lodash');

var u = require('underscore');

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var createModel = exports.createModel = function(modelName, definitions) {
	var Model = new Schema(definitions, {collection: modelName});
    mongoose.model(modelName, Model);
    return Model;
};

var removeModel = exports.removeModel = function(modelName) {
    delete mongoose.connection.models[modelName];
};

var getModel = exports.getModel = function(modelName) {
    return mongoose.model(modelName);
};

var createDoc = exports.createDoc = function(modelName, inputJSON, onceAdded) {
    var nModel = getModel(modelName);
	var Model = new nModel(inputJSON);
	Model.save(function(err, doc) {
		if (err)
			return errorJSON(res, {type: 'Save', message: 'saved', changed: 'Saved'});

		onceAdded(doc);
	});
};

var errorJSON = exports.errorJSON = function(res, inputObj) {
	var errorObj = {};

	if (inputObj.type) errorObj.type = inputObj.type + ': Does not exist';
	if (inputObj.message) errorObj.message = 'req.body.contribution was not ' + inputObj.message;
	if (inputObj.changed) errorObj.changed = 'Nothing ' + inputObj.changed + 'ed';

	return res.jsonp(errorObj);
};

var createSchema = exports.createSchema = function(section, schemaJSON, res) {
	var schema = undefined; // null schema?

	if (section === 'Contribution')
		schema = new Contribution(schemaJSON);

	/* Adapters for database? */
	schema.save(function(err) {
		if (err)
			return errorJSON(res, {type: 'Save', message: 'saved', changed: 'Saved'});

		return res.jsonp(schema);
	});
};

var updateSchema = exports.updateSchema = function(section, schemaJSON, req, res) {
	var schema = undefined; // null schema?

	if (section === 'Contribution')
		schema = req.contribution;

	schema = _.extend(schema, schemaJSON);

	/* Adapters for database? */
	schema.save(function(err) {
		if (err)
			return errorJSON(res, {type: 'Save', message: 'saved', changed: 'Updated'});

		return res.jsonp(schema);
	});
};

exports.create = function(req, res) {
	if (is.empty(req.body.contribution))
		return errorJSON(res, {type: 'Post', message: 'sent', changed: 'Created'});

	return createSchema('Contribution', {
		info: req.body.contribution.info,
		user: req.user,
		report: req.report
	}, res);
};

exports.update = function(req, res) {
	if (is.empty(req.body.contribution))
		return errorJSON(res, {type: 'Put', message: 'sent', changed: 'Updated'});

	return updateSchema('Contribution', req.body.contribution, req, res);
};

exports.readFromReport = function(req, res) {
	Contribution.findOne({report: req.report})
	.populate('user', 'displayName')
	.populate('report', 'reportName')
	.exec(function(err, result) {
		if (err)
			return errorJSON(res, {type: 'ReadFromReport', changed: 'Read'});

		return res.jsonp(result);
	});
};

exports.read = function(req, res) {
	res.jsonp(req.contribution);
};

exports.contributionById = function(req, res, next, id) {
	Contribution.findById(id)
	.populate('user', 'displayName')
	.populate('report', 'reportName')
	.exec(function(err, contribution) {
		if (err) return next(err);
		if (!contribution) return next(new Error('Failed to load Contribution ' + id));
		req.contribution = contribution;
		next();
	});
};

exports.hasAuthorization = function(req, res, next) {
	if (req.contribution.user.id !== req.user.id && !u.contains(req.user.roles, 'admin')) {
		return res.status(403).send({
			message: 'User is not authorized'
		});
	}
	next();
};
