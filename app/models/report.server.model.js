'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Report Schema
 */
var ReportSchema = new Schema({
	reportName: {
		type: String,
		default: 'MyReportName',
		//required: 'Please fill Report name',
		trim: true
	},

	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	profile: {
		type: Schema.ObjectId,
		ref: 'Profile'
	},

	//TEMPORARY FIELDS FOR REPORT SECTIONS------------------------------------------------
	/*
	firstName: {
		type: String,
		default: '',
		required: 'Please fill first name',
		trim: true
	},
	middleName: {
		type: String,
		default: '',
		required: 'Please fill middle name',
		trim: true
	},
	lastName: {
		type: String,
		default: '',
		required: 'Please fill last name',
		trim: true
	},


	tenure: {
		type: String,
		default: 'Not Tenured',
		enum: ['Tenured', 'Not Tenured'],
		trim: true
	},
	*/



	name: {
		type: Schema.Types.ObjectId, ref: 'Name'
	},

	tenure: {
		type: Schema.Types.ObjectId, ref: 'Tenure'
	},

	currentRank: {
		type: Schema.Types.ObjectId, ref: 'CurrentRank'
	},

	dateAppointed: {
		type: Schema.Types.ObjectId, ref: 'DateAppointed'
	},

	affiliateAppointments: {
		type: Schema.Types.ObjectId, ref: 'AffiliateAppointments'
	},

	assignedActivity: {
		type: Schema.Types.ObjectId, ref: 'AssignedActivity'
	},

	teachingAdvising: {
		type: Schema.Types.ObjectId, ref: 'TeachingAdvising'
	},

	contribution: {
		type: Schema.Types.ObjectId, ref: 'Contribution'
	},

	international: {
		type: Schema.Types.ObjectId, ref: 'International'
	},

	membership: {
		type: Schema.Types.ObjectId, ref: 'Membership'
	},

	teachingEvaluation: {
		type: Schema.Types.ObjectId, ref: 'TeachingEvaluation'
	},
	
	conferences: {
		type: Schema.Types.ObjectId, ref: 'Conferences'
	},
	
	contracts: {
		type: Schema.Types.ObjectId, ref: 'Contracts'
	},

	graduateCommittee: {
		type: Schema.Types.ObjectId, ref: 'GraduateCommittee'
	},

	creativeWorks: {
		type: Schema.Types.ObjectId, ref: 'CreativeWorks'
	},

	patents: {
		type: Schema.Types.ObjectId, ref: 'Patents'
	},

	honors: {
		type: Schema.Types.ObjectId, ref: 'Honors'
	},	

	furtherInformationSection: {
		type: Schema.Types.ObjectId, ref: 'FurtherInformationSection'
	},	

	consultationsOutsideUniversity: {
		type: Schema.Types.ObjectId, ref: 'ConsultationsOutsideUniversity'
	},
	
	governance: {
		type: Schema.Types.ObjectId, ref: 'Governance'
	},
	
	editorServiceReviewer: {
		type: Schema.Types.ObjectId, ref: 'EditorServiceReviewer'
	},

	publication: {
		type: Schema.Types.ObjectId, ref: 'Publication'
	},

	serviceToSchools: {
		type: Schema.Types.ObjectId, ref: 'ServiceToSchools'
	}

//END TEMP-------------------------------------------------




});

mongoose.model('Report', ReportSchema);
