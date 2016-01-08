'use strict';

var should = require('should');
var	contribution = require('../../controllers/contribution/contribution');

var testReq = {
    body: {
        contribution: {}
    }
};

var testRes = {
    jsonp: function(obj) { return obj; }
};

describe('Error JSON Test', function() {
    it('should return JSON in the proper format', function(done) {
        var error = contribution.errorJSON(testRes, 'AwesomeType', 'AwesomeAction');
        should.exist(error.err);
        should.exist(error.message);
        should.exist(error.changes);

        should.equal(error.err, 'AwesomeType: Does not exist');
        should.equal(error.message, 'req.body.contribution was not sent');
        should.equal(error.changes, 'Nothing AwesomeAction');

        done();
    });
});


describe('Contribution Create Tests', function() {
    it('should fail if the contribution body request is empty', function(done) {
        var error = contribution.create(testReq, testRes);
        should.exist(error);

        done();
    });
});

describe('Contribution Update Tests', function() {
    it('should fail if the contribution body request is empty', function(done) {
        var error = contribution.update(testReq, testRes);
        should.exist(error);

        done();
    });
});
