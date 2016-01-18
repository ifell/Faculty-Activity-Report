'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	validator = require('validator');

var Contribution = new Schema({
	info: {
		type: String,
		default: 'N/A'
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	report: {
		type: Schema.ObjectId,
		ref: 'Report'
	}
}, {collection:'Contribution'});

mongoose.model('Contribution', Contribution);
