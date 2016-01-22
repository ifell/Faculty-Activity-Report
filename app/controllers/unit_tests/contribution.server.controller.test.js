'use strict';

var should = require('should');
var	section = require('../../controllers/section.server.controller.js');

describe('Mongoose', function() {
    var mongoose = require('mongoose'),
        Schema = mongoose.Schema;

    beforeEach(function() {
        section.createModel('mySchema', {
            name: {
                type: String
            }
        });
    });

    it ('should be able to create a model', function(done) {
        var MySchema = section.getModel('mySchema');

        should.equal(MySchema.schema.options.collection, 'mySchema');
        should.exist(MySchema.schema.tree.name);
        should.exist(MySchema.schema.tree.id);

        done();
    });

    it ('should be able to create a doc given a model', function(done) {
        var mockRes = {
            jsonp: function(obj) {
                should.equal('Huck Finn', obj.name);
                should.exist(obj._id);
            }
        };

        section.createDoc('mySchema', {name: 'Huck Finn'}, mockRes);

        done();
    });

    it ('should be able to update an existing doc', function(done) {
        var mockRes = {
            jsonp: function(obj) {
                should.equal('Tom Sawyer', obj.name);
                done();
            }
        };

        var mockReq = {
            mySchema: {
                name: 'Huck Finn',
                save: function(callback) {
                    callback(undefined, this);
                }
            }
        };

        section.updateDoc('mySchema', {name: 'Tom Sawyer'}, mockReq, mockRes);
    });

    describe('Route Middleware Tests', function() {
        it('name() should return true if the section exists, and false otherwise', function(done) {
            function nameShould(exist, name, done) {
                section.nameHelper(name, function(doesExist) {
                    should.equal(exist, doesExist);
                    done();
                });
            }

            nameShould(true, 'mySchema', function() {
                nameShould(false, 'thisSectionDoesNotExist', done);
            });
        });

        it('id() should return a document given the collection and a valid id', function(done) {
            var mockRes = {
                jsonp: function(obj) {
                    section.idHelper('mySchema', obj._id, function(doc) {
                        done();
                    });
                }
            };

            section.createDoc('mySchema', {name: 'Huck Finn'}, mockRes);
        });

        it('id() return undefined given an invalid id', function(done) {
            section.idHelper('mySchema', 0, function(doc) {
                should.equal(undefined, doc);
                done();
            });
        });

    });

    afterEach(function() {
        section.removeModel('mySchema');
    });
});

describe('Section MiddleWare Tests', function() {
    it('should return true if the user can access the section, false otherwise', function(done) {
        should.equal(true, section.hasAuthorizationHelper('1', '1', []));
        should.equal(false, section.hasAuthorizationHelper('1', '2', []));
        should.equal(true, section.hasAuthorizationHelper('1', '2', ['admin']));
        done();
    });
});

describe('Error Tests', function() {
    var mockReq = {
        jsonp: function(obj) { return obj; }
    };

    function run(inputObj) {
        var error = section.errorJSON(mockReq, inputObj);

        if (inputObj.type) should.equal(error.type, inputObj.type + ': Does not exist');
        if (inputObj.message) should.equal(error.message, 'req.body.section was not ' + inputObj.message);
        if (inputObj.changed) should.equal(error.changed, 'Nothing ' + inputObj.changed);
    }

    it('errorJSON() should return JSON in the proper format', function(done) {
        run({type: 'AwesomeType', message: 'AwesomeMessage', changed: 'AwesomeAction'});

        done();
    });

    it('errorJSON() should read only the fields specified by the given parameters', function(done) {
        run({type: 'AwesomeType'});
        run({message: 'AwesomeMessage'});
        run({changed: 'AwesomeAction'});
        run({type: 'AwesomeType', changed: 'AwesomeAction'});

        done();
    });
});



