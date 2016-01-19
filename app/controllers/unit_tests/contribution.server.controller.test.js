'use strict';

var should = require('should');
var	contribution = require('../../controllers/contribution/contribution');

describe('Mongoose', function() {
    var mongoose = require('mongoose'),
        Schema = mongoose.Schema;

    beforeEach(function() {
        contribution.createModel('MySchema', {
            name: {
                type: String
            }
        });
    });

    it ('should be able to create a model', function(done) {
        var MySchema = contribution.getModel('MySchema');

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

        contribution.createDoc('MySchema', {name: 'Huck Finn'}, mockRes);

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

        contribution.updateDoc('MySchema', {name: 'Tom Sawyer'}, mockReq, mockRes);
    });

    afterEach(function() {
        contribution.removeModel('MySchema');
    });
});

describe('Error Tests', function() {

    var mockReq = {
        jsonp: function(obj) { return obj; }
    };

    function run(inputObj) {
        var error = contribution.errorJSON(mockReq, inputObj);

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
