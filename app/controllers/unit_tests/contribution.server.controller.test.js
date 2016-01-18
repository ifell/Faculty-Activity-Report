'use strict';

var should = require('should');
var	contribution = require('../../controllers/contribution/contribution');

describe('Error Tests', function() {

    var mockReq = {
        jsonp: function(obj) { return obj; }
    };

    function run(inputObj) {
        var error = contribution.errorJSON(mockReq, inputObj);

        if (inputObj.type) should.equal(error.type, inputObj.type + ': Does not exist');
        if (inputObj.message) should.equal(error.message, 'req.body.contribution was not ' + inputObj.message);
        if (inputObj.changed) should.equal(error.changed, 'Nothing ' + inputObj.changed + 'ed');
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

describe('Dynamic Schema Tests', function() {
    var mockReq = {
        body: {
            contribution: {
                info: 'Hello'
            }
        },
        user: {

        },
        report: {

        },
        contribution: {
            info: 'This should change'
        }
    };

    var mockRes = {
        message: '',
        jsonp: function(obj) { this.message = obj; return obj; }
    };

    it('createSchema() should be able to create a new contribution', function(done) {
       var schema = contribution.createSchema('Contribution', {
           info: mockReq.body.contribution.info,
           user: mockReq.user,
           report: mockReq.report
       }, mockRes);

       should.equal(mockRes.message, '');
       should.equal(schema.info, 'Hello');

       done();
    });

    it ('updateSchema() should be able to update the schema given', function(done) {
        var schema = contribution.updateSchema('Contribution', {
            info: 'Hello',
            user: mockReq.user,
            report: mockReq.report
        }, mockReq, mockRes);

        should.equal(schema.info, 'Hello');

        done();
    });
});
