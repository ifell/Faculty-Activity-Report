'use strict';

var mongoose = require('mongoose');
var Contribution = mongoose.model('Contribution');

var is = require('is-js');

var u = require('underscore');

var section = require('../section.server.controller.js');

exports.create = function(req, res) {
	if (is.empty(req.body.contribution))
		return section.errorJSON(res, {type: 'Post', message: 'sent', changed: 'Created'});

	return section.createDoc('Contribution', {
        info: req.body.contribution.info,
        user: req.user,
        report: req.report
    }, res);
};

exports.update = function(req, res) {
	if (is.empty(req.body.contribution))
		return section.errorJSON(res, {type: 'Put', message: 'sent', changed: 'Updated'});

	return section.updateDoc('Contribution', req.body.contribution, req, res);
};

exports.readFromReport = function(req, res) {
	Contribution.findOne({report: req.report})
	.populate('user', 'displayName')
	.populate('report', 'reportName')
	.exec(function(err, result) {
		if (err)
			return section.errorJSON(res, {type: 'ReadFromReport', changed: 'Read'});

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
