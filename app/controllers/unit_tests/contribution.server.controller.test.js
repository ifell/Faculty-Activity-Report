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

describe('Contribution Create Tests', function() {
    it('should fail if the contribution body request is empty', function(done) {
        var error = contribution.create(testReq, testRes);
        should.exist(error.err);
        should.exist(error.message);
        should.exist(error.changes);

        should.equal(error.err, 'Post (create): Does not exist');
        should.equal(error.message, 'req.body.contribution was not sent');
        should.equal(error.changes, 'Nothing Created');

        done();
    });
});

describe('Contribution Update Tests', function() {
    it('should fail if the contribution body request is empty', function(done) {
        var error = contribution.update(testReq, testRes);
        should.exist(error.err);
        should.exist(error.message);
        should.exist(error.changes);

        should.equal(error.err, 'Put (update): Does not exist');
        should.equal(error.message, 'req.body.contribution was not sent');
        should.equal(error.changes, 'Nothing Updated');

        done();
    });
});
