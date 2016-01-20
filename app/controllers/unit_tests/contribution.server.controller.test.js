'use strict';

var should = require('should');
var	section = require('../../controllers/section.server.controller.js');

describe('Mongoose', function() {
    var mongoose = require('mongoose'),
        Schema = mongoose.Schema;

    beforeEach(function() {
        section.createModel('MySchema', {
            name: {
                type: String
            }
        });
    });

    it ('should be able to create a model', function(done) {
        var MySchema = section.getModel('MySchema');

        should.equal(MySchema.schema.options.collection, 'MySchema');
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

        section.createDoc('MySchema', {name: 'Huck Finn'}, mockRes);

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

        section.updateDoc('MySchema', {name: 'Tom Sawyer'}, mockReq, mockRes);
    });

    describe('Route Middleware Tests', function() {
        it('name() should return true if the section exists, and false otherwise', function(done) {
            function nameShould(exist, name, done) {
                section.nameFunction(name, function(doesExist) {
                    should.equal(exist, doesExist);
                    done();
                });
            }

            nameShould(true, 'MySchema', function() {
                nameShould(false, 'thisSectionDoesNotExist', done);
            });
        });

        it('id() should return true if  ', function(done) {
           //section.id(id, )
            should.fail();
            done();
        });
    });

    afterEach(function() {
        section.removeModel('MySchema');
    });
});

describe('Error Tests', function() {
    var mockReq = {
        jsonp: function(obj) { return obj; }
    };

    function run(inputObj) {
        var error = section.errorJSON(mockReq, inputObj);

        if (inputObj.type) should.equal(error.type, inputObj.type + ': Does not exist');
        if (inputObj.message) should.equal(error.message, 'req.body.contribution was not ' + inputObj.message);
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



