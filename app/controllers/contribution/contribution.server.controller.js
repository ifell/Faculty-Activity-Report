'use strict';

var is = require('is-js');
var section = require('../section.server.controller.js');

exports.create = function(req, res) {
	if (is.empty(req.body[req.params.section]))
		return section.errorJSON(res, {type: 'Post', message: 'sent', changed: 'Created'});

	return section.createDoc(req.params.section, {
        info: req.body[req.params.section].info,
        user: req.user,
        report: req.report
    }, res);
};

exports.update = function(req, res) {
	if (is.empty(req.body[req.params.section]))
		return section.errorJSON(res, {type: 'Put', message: 'sent', changed: 'Updated'});

	return section.updateDoc(req.params.section, req.body[req.params.section], req, res);
};

exports.readFromReport = function(req, res) {
	section.getModel(req.params.section).findOne({report: req.report})
	.populate('user', 'displayName')
	.populate('report', 'reportName')
	.exec(function(err, result) {
		if (err)
			return section.errorJSON(res, {type: 'ReadFromReport', changed: 'Read'});

		return res.jsonp(result);
	});
};

exports.read = function(req, res) {
	res.jsonp(req[req.params.section]);
};

exports.hasAuthorization = function(req, res, next) {
    if (!section.hasAuthorizationHelper(req[req.params.section].user.id, req.user.id, req.user.roles))
        return res.status(403).send({
            message: 'User is not authorized'
        });
    else
        next();
};
