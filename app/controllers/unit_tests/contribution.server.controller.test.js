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

describe('Error Tests', function() {
    it('errorJSON() should return JSON in the proper format', function(done) {
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

    it('should save the given contribution body', function(done) {
        testReq.body.contribution.info = 'This is a test.';

        testReq.user = {
            _id: '1',
            displayName: 'Ian Fell',
            provider: 'local',
            username: 'ian',
            __v: 0,
            reportsCreated: 1,
            created: 'Thu Jan 07 2016 20:49:39 GMT-0500 (EST)',
            roles: [ 'user' ],
            email: 'ifell@ufl.edu',
            lastName: 'Fell',
            firstName: 'Ian'
        };

        testReq.report = undefined;

        var contribution_doc = contribution.create(testReq, testRes);
        should.exist(contribution_doc);
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
