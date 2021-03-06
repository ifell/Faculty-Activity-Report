'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var u = require('underscore');

var _ = require('lodash');

exports.createModel = function(modelName, definitions) {
    var Model = new Schema(definitions, {collection: modelName});
    mongoose.model(modelName, Model);
    return Model;
};

exports.removeModel = function(modelName) {
    delete mongoose.connection.models[modelName];
};

var getModel = exports.getModel = function(modelName) {
    return mongoose.model(modelName);
};

exports.createDoc = function(name, inputJSON, res) {
    var Model = getModel(name);
    var Doc = new Model(inputJSON);
    Doc.save(function(err, doc) {
        if (err)
            return errorJSON(res, {type: 'Save', message: 'saved', changed: 'Saved'});

        res.jsonp(doc);
    });
};

function toCamelCase(string) {
    return string.charAt(0).toLowerCase() + string.slice(1);
}

exports.updateDoc = function(name, inputJSON, req, res) {
    /* null doc? */
    var Doc = undefined;

    name = toCamelCase(name);

    if (req.hasOwnProperty(name))
        Doc = req[name];

    Doc = _.extend(Doc, inputJSON);

    Doc.save(function(err, doc) {
        if (err)
            return errorJSON(res, {type: 'Save', message: 'saved', changed: 'Saved'});

        res.jsonp(doc);
    });
};

var errorJSON = exports.errorJSON = function(res, inputObj) {
    var errorObj = {};

    if (inputObj.type) errorObj.type = inputObj.type + ': Does not exist';
    if (inputObj.message) errorObj.message = 'req.body.section was not ' + inputObj.message;
    if (inputObj.changed) errorObj.changed = 'Nothing ' + inputObj.changed;

    return res.jsonp(errorObj);
};

exports.name = function(req, res, next, id) {
    nameHelper(id, function(doesExist) {
        if (doesExist)
            next();
        else
            return res.status(404).send({
                message: 'Section was not found'
            });
    });
};

exports.id = function(req, res, next, id) {
    idHelper(req.params.section, id, function(doc) {
        if (doc) {
            req[req.params.section] = doc;
            next();
        } else
            return res.status(404).send({
                message: 'Doc was not found'
            });
    });
};

var idHelper = exports.idHelper = function(name, id, docCallback) {
    getModel(name).findById(id)
        .populate('user', 'displayName')
        .populate('report', 'reportName')
        .exec(function(err, doc) {
            if (err || !doc)
                docCallback(undefined);
            else
                docCallback(doc);
        });
};

var nameHelper = exports.nameHelper = function(name, exists) {
    mongoose.connection.db.listCollections({name: name})
        .next(function (err, section) {
            if (section)
                exists(true);
            else
                exists(false);
        });
};

exports.hasAuthorizationHelper = function(creatorsId, accessorsId, accessorsRoles) {
    return creatorsId === accessorsId || u.contains(accessorsRoles, 'admin');
};
