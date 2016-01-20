'use strict';

/*jshint expr: true*/

var app = require('../../server');

var should = require('should');
var request = require('supertest');

var	section = require('./section.server.controller.js');

var mongoose = require('mongoose');
var Contribution = mongoose.model('Contribution');

var User = mongoose.model('User');
var Report = mongoose.model('Report');

var async = require('async');

var username, admin, usernamesContribution, adminsContribution, usernamesReport, adminsReport;

describe('Section Route Tests', function() {
    beforeEach(function(done) {

        username = new User({
            firstName: 'Full',
            lastName: 'Name',
            email: 'test@test.com',
            username: 'username',
            password: 'password',
            provider: 'local'
        });

        username.save();

        admin = new User({
            firstName: 'Full',
            lastName: 'Name',
            email: 'test@test.com',
            username: 'admin',
            password: 'password',
            provider: 'local',
            roles: ['admin']
        });

        admin.save();

        usernamesReport = new Report({
            reportName: 'MyReportName',
            user: username
        });

        usernamesReport.save();

        adminsReport = new Report({
            reportName: 'MyReportName',
            user: admin
        });

        adminsReport.save();

        usernamesContribution = new Contribution({
            info: 'I made the following contributions...',

            report: usernamesReport,
            user: username
        });

        adminsContribution = new Contribution({
            info: 'I did stuff too',

            report: usernamesReport,
            user: admin
        });

        usernamesContribution.save();
        adminsContribution.save();

        done();
    });

    describe('Route: "/reports/:reportId/contribution"', function() {
        describe('GET routes', function() {
            describe('Not Logged In, Not AuthoriZed', function () {
                it('should fail to get a section', function (done) {
                    request(app)
                        .get('/reports/' + usernamesReport.id + '/contribution')
                        .set('Accept', 'application/json')
                        .expect(401)
                        .end(function (err, res) {
                            should.not.exist(err);
                            res.body.should.be.eql({message: 'User is not logged in'});
                            done();
                        });
                });
            });

            describe('Logged In, Not AuthoriZed', function () {
                it('should fail to get a section', function (done) {
                    request(app)
                        .post('/auth/signin')
                        .send({
                            username: 'username',
                            password: 'password'
                        })
                        .expect(200)
                        .end(function (err, res) {
                            request(app)
                                .get('/reports/' + adminsReport.id + '/contribution')
                                .set('cookie', res.headers['set-cookie'])
                                .set('Accept', 'application/json')
                                .expect(403)
                                .end(function (err, res) {
                                    should.not.exist(err);
                                    res.body.should.be.eql({message: 'User is not authorized'});

                                    done();
                                });

                        });
                });
            });

            describe('Logged In, AuthoriZed (user)', function () {
                it('should get a section', function (done) {
                    request(app)
                        .post('/auth/signin')
                        .send({
                            username: 'username',
                            password: 'password'
                        })
                        .expect(200)
                        .end(function (err, res) {
                            request(app)
                                .get('/reports/' + usernamesReport.id + '/contribution')
                                .set('cookie', res.headers['set-cookie'])
                                .set('Accept', 'application/json')

                                .expect(200)
                                .end(function (err, res) {
                                    should.not.exist(err);

                                    res.body.should.have.property('_id', usernamesContribution.id);
                                    res.body.should.have.property('info', usernamesContribution.info);
                                    res.body.user.should.have.property('_id', username.id);
                                    res.body.report.should.have.property('_id', usernamesReport.id);
                                    done();
                                });
                        });
                });
            });

            describe('Logged In, AuthoriZed (superuser)', function () {
                it('should get a section', function (done) {
                    request(app)
                        .post('/auth/signin')
                        .send({
                            username: 'admin',
                            password: 'password'
                        })
                        .expect(200)
                        .end(function (err, res) {
                            request(app)
                                .get('/reports/' + usernamesReport.id + '/contribution')
                                .set('cookie', res.headers['set-cookie'])
                                .set('Accept', 'application/json')

                                .expect(200)
                                .end(function (err, res) {
                                    should.not.exist(err);

                                    res.body.should.have.property('_id', usernamesContribution.id);
                                    res.body.should.have.property('info', usernamesContribution.info);
                                    res.body.user.should.have.property('_id', username.id);
                                    res.body.report.should.have.property('_id', usernamesReport.id);
                                    done();
                                });
                        });
                });
            });
        });

        describe('POST', function() {
            var contributionObj = {
                contribution: {
                    info:'Contributing things'
                }
            };

            describe('Not Logged In, Not AuthoriZed', function() {
                it('should fail to create a section', function(done) {
                    request(app)
                        .post('/reports/' + usernamesReport.id + '/contribution')
                        .set('Accept', 'application/json')
                        .send(contributionObj)

                        .expect(401)
                        .end(function(err, res) {
                            should.not.exist(err);
                            res.body.should.be.eql({message: 'User is not logged in'});

                            done();
                        });
                });
            });

            describe('Logged In, Not AuthoriZed', function() {
                it('should fail to create a section', function(done) {
                    request(app)
                        .post('/auth/signin')
                        .send({
                            username:'username',
                            password:'password'
                        })
                        .expect(200)
                        .end(function(err, res) {
                            request(app)
                                .post('/reports/' + adminsReport.id + '/contribution')
                                .set('cookie', res.headers['set-cookie'])
                                .set('Accept', 'application/json')
                                .send(contributionObj)

                                .expect(403)
                                .end(function(err, res) {
                                    should.not.exist(err);
                                    res.body.should.be.eql({message: 'User is not authorized'});

                                    done();
                                });
                        });
                });
            });

            describe('Logged In, AuthoriZed (user)', function() {
                it('should create a section', function(done) {
                    request(app)
                        .post('/auth/signin')
                        .send({
                            username:'username',
                            password:'password'
                        })
                        .expect(200)
                        .end(function(err, res) {
                            request(app)
                                .post('/reports/' + usernamesReport.id + '/contribution')
                                .set('cookie', res.headers['set-cookie'])
                                .set('Accept', 'application/json')
                                .send(contributionObj)

                                .expect(200)
                                .end(function(err, res) {
                                    should.not.exist(err);

                                    res.body.should.have.property('info', contributionObj.contribution.info);
                                    res.body.should.have.property('_id');
                                    res.body.should.have.property('user');
                                    res.body.should.have.property('report');

                                    done();
                                });
                        });
                });
            });

            describe('Logged In, AuthoriZed (superuser)', function() {
                it('should create a section', function(done) {
                    request(app)
                        .post('/auth/signin')
                        .send({
                            username:'admin',
                            password:'password'
                        })
                        .expect(200)
                        .end(function(err, res) {
                            request(app)
                                .post('/reports/' + usernamesReport.id + '/contribution')
                                .set('cookie', res.headers['set-cookie'])
                                .set('Accept', 'application/json')
                                .send(contributionObj)

                                .expect(200)
                                .end(function(err, res) {
                                    should.not.exist(err);

                                    res.body.should.have.property('info', contributionObj.contribution.info);
                                    res.body.should.have.property('_id');
                                    res.body.should.have.property('user');
                                    res.body.should.have.property('report');

                                    done();
                                });
                        });
                });
            });
        });
    });

    describe('Route: "/contribution/:contributionId"', function() {
        describe('GET routes', function() {
            describe('Not Logged In, Not AuthoriZed', function() {
                it('should fail to get a section', function(done) {
                    request(app)
                        .get('/contribution/' + usernamesContribution.id)
                        .set('Accept', 'application/json')
                        .expect(401)
                        .end(function (err, res) {
                            should.not.exist(err);
                            res.body.should.be.eql({message: 'User is not logged in'});
                            done();
                        });
                });
            });

            describe('Logged In, Not AuthoriZed', function() {
                it('should fail to get a section', function (done) {
                    request(app)
                        .post('/auth/signin')
                        .send({
                            username: 'username',
                            password: 'password'
                        })
                        .expect(200)
                        .end(function (err, res) {
                            request(app)
                                .get('/contribution/' + adminsContribution.id)
                                .set('cookie', res.headers['set-cookie'])
                                .set('Accept', 'application/json')
                                .expect(403)
                                .end(function (err, res) {
                                    should.not.exist(err);
                                    res.body.should.eql({message: 'User is not authorized'});

                                    done();
                                });

                        });
                });
            });

            describe('Logged In, AuthroriZed (user)', function() {
                it('should get a section', function (done) {
                    request(app)
                        .post('/auth/signin')
                        .send({
                            username: 'username',
                            password: 'password'
                        })
                        .expect(200)
                        .end(function (err, res) {
                            request(app)
                                .get('/contribution/' + usernamesContribution.id)
                                .set('cookie', res.headers['set-cookie'])
                                .set('Accept', 'application/json')

                                .expect(200)
                                .end(function (err, res) {
                                    should.not.exist(err);

                                    res.body.should.have.property('_id', usernamesContribution.id);
                                    res.body.user.should.have.property('_id', username.id);
                                    res.body.report.should.have.property('_id', usernamesReport.id);

                                    done();
                                });

                        });
                });
            });

            describe('Logged In, AuthroriZed (superuser)', function() {
                it('should get a section', function (done) {
                    request(app)
                        .post('/auth/signin')
                        .send({
                            username: 'admin',
                            password: 'password'
                        })
                        .expect(200)
                        .end(function (err, res) {
                            request(app)
                                .get('/contribution/' + usernamesContribution.id)
                                .set('cookie', res.headers['set-cookie'])
                                .set('Accept', 'application/json')

                                .expect(200)
                                .end(function (err, res) {
                                    should.not.exist(err);

                                    res.body.should.have.property('_id', usernamesContribution.id);
                                    res.body.user.should.have.property('_id', username.id);
                                    res.body.report.should.have.property('_id', usernamesReport.id);

                                    done();
                                });

                        });
                });
            });
        });

        describe('PUT', function() {
            describe('Not Logged In, Not AuthoriZed', function() {
                it('should fail to update a section', function(done) {
                    request(app)
                        .put('/contribution/' + usernamesContribution.id)
                        .set('Accept', 'application/json')
                        .send({
                            contribution: {
                                info:'Different contributions'
                            }
                        })
                        .expect(401)
                        .end(function (err, res) {
                            should.not.exist(err);
                            res.body.should.be.eql({message: 'User is not logged in'});
                            done();
                        });
                });
            });

            describe('Logged In, Not AuthoriZed', function() {
                it('should fail to update a section', function(done) {
                    request(app)
                        .post('/auth/signin')
                        .send({
                            username:'username',
                            password:'password'
                        })
                        .expect(200)
                        .end(function(err, res) {
                            request(app)
                                .put('/contribution/' + adminsContribution.id)
                                .set('cookie', res.headers['set-cookie'])
                                .set('Accept', 'application/json')
                                .send({
                                    contribution: {
                                        info:'Different contributions'
                                    }
                                })
                                .expect(403)
                                .end(function(err, res) {
                                    should.not.exist(err);
                                    res.body.should.eql({message: 'User is not authorized'});

                                    done();
                                });

                        });
                });
            });

            describe('Logged In, AuthoriZed (user)', function() {
                it('should update a section', function(done) {
                    request(app)
                        .post('/auth/signin')
                        .send({
                            username:'username',
                            password:'password'
                        })
                        .expect(200)
                        .end(function(err, res) {
                            request(app)
                                .put('/contribution/' + usernamesContribution.id)
                                .set('cookie', res.headers['set-cookie'])
                                .set('Accept', 'application/json')
                                .send({
                                    contribution: {
                                        info:'Different contributions'
                                    }
                                })
                                .expect(200)
                                .end(function(err, res) {
                                    should.not.exist(err);

                                    res.body.should.be.an.Object.and.have.property('info', 'Different contributions');

                                    res.body.should.have.property('_id', usernamesContribution.id);
                                    res.body.user.should.have.property('_id', username.id);
                                    res.body.report.should.have.property('_id', usernamesReport.id);

                                    done();
                                });

                        });
                });
            });

            describe('Logged In, AuthoriZed (superuser)', function() {
                it('should update a section', function(done) {
                    request(app)
                        .post('/auth/signin')
                        .send({
                            username:'admin',
                            password:'password'
                        })
                        .expect(200)
                        .end(function(err, res) {
                            request(app)
                                .put('/contribution/' + usernamesContribution.id)
                                .set('cookie', res.headers['set-cookie'])
                                .set('Accept', 'application/json')
                                .send({
                                    contribution: {
                                        info:'Different contributions'
                                    }
                                })
                                .expect(200)
                                .end(function(err, res) {
                                    should.not.exist(err);

                                    res.body.should.be.an.Object.and.have.property('info', 'Different contributions');

                                    res.body.should.have.property('_id', usernamesContribution.id);
                                    res.body.user.should.have.property('_id', username.id);
                                    res.body.report.should.have.property('_id', usernamesReport.id);

                                    done();
                                });

                        });
                });
            });
        });
    });

    afterEach(function(done) {
        Contribution.remove().exec();
        User.remove().exec();
        Report.remove().exec();
        done();
    });
});

