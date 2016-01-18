'use strict';

var should = require('should');
var	contribution = require('../../controllers/contribution/contribution');

describe('Mongoose', function() {
   var mongoose = require('mongoose'),
       Schema = mongoose.Schema;

   function createMySchema() {
       return contribution.defineSchemaWith({
           name: {
               type: String
           }
       }, 'MySchema');
   }

   function createMyDoc(name, Schema, added) {
       return contribution.createDocWith({
           name: name
       }, Schema, added);
   }

   function getMySchema() {
       return mongoose.model('MySchema');
   }

   beforeEach(function() {
       mongoose.model('MySchema', createMySchema());
   });

   it ('should be able to define a schema', function(done) {
       var MySchema = getMySchema();

       should.equal(MySchema.schema.options.collection, 'MySchema');
       should.exist(MySchema.schema.tree.name);
       should.exist(MySchema.schema.tree.id);

       done();
   });

   it ('should be able to init a schema with given values', function(done) {
       function added(MyDoc) {
           should.equal('Huck Finn', MyDoc.name);
           should.exist(MyDoc._id);

           done();
       }

       createMyDoc('Huck Finn', getMySchema(), added);
   });

   afterEach(function() {
      delete mongoose.connection.models['MySchema'];
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
