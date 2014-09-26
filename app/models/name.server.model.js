'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var validateInitLength= function(property) {
	return (property.length === 1);
};

	var nameSchema = new Schema({
	
		firstName: {
			type: String,
			required: true
		},
		
		midInit: {
			type: String,
			validate: [validateInitLength, 'Middle Initial can only be one letter']
		},
		
		lastName: {
			type: String,
			required: true
		}		
		
	}, {collection: 'namelist'});