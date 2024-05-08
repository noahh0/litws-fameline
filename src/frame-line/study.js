/*************************************************************
 * Main code, responsible for configuring the steps and their
 * actions.
 *
 * Author: LITW Team.
 *
 * © Copyright 2017-2023 LabintheWild.
 * For questions about this file and permission to use
 * the code, contact us at tech@labinthewild.org
 *************************************************************/

// load webpack modules
window.$ = window.jQuery = require("jquery");
window.bootstrap = require("bootstrap");
require("jquery-ui-bundle");
var _ = require('lodash');
var introTemplate = require("./templates/introduction.html");
var irbTemplate = require("../templates/irb.html");
var demographicsTemplate = require("../templates/demographics.html");
var instructionsTemplate = require("/templates/instructions.html");
var practiceTemplate = require("/templates/practice.html");
var flTaskTemplate = require("/templates/fl-task.html");
var loadingTemplate = require("../templates/loading.html");
var resultsTemplate = require("/templates/results.html");
var resultsFooter = require("../templates/results-footer.html");
var commentsTemplate = require("../templates/comments.html");
require("../js/litw/jspsych-display-info");
require("../js/litw/jspsych-display-slide");

import * as frameline from "./js/fl-mechanics.mjs";

module.exports = (function(exports) {
	var timeline = [],
	params = {
		preLoad: ["../img/btn-next.png","../img/btn-next-active.png","../img/ajax-loader.gif"],
		study_id: "e699772e-b179-411e-87bf-df7b5735b50b",
		study_recommendation: [],
		tasks: [
			{promptBoxSize:	191.0	, promptLineLength:	21.0	, responseBoxSize:	101.0	},
			{promptBoxSize:	179.0	, promptLineLength:	31.0	, responseBoxSize:	89.0	},
			{promptBoxSize:	101.0	, promptLineLength:	21.2	, responseBoxSize:	103.0	},
			{promptBoxSize:	164.0	, promptLineLength:	41.0	, responseBoxSize:	125.0	},
			{promptBoxSize:	102.0	, promptLineLength:	29.0	, responseBoxSize:	153.0	},
			{promptBoxSize:	121.0	, promptLineLength:	38.7	, responseBoxSize:	163.0	},
			{promptBoxSize:	81.0	, promptLineLength:	30.0	, responseBoxSize:	148.0	},
			{promptBoxSize:	127.0	, promptLineLength:	53.0	, responseBoxSize:	127.0	},
			{promptBoxSize:	200.0	, promptLineLength:	92.0	, responseBoxSize:	84.0	},
			{promptBoxSize:	116.0	, promptLineLength:	56.8	, responseBoxSize:	189.0	},
			{promptBoxSize:	94.0	, promptLineLength:	49.8	, responseBoxSize:	180.0	},
			{promptBoxSize:	153.0	, promptLineLength:	87.0	, responseBoxSize:	102.0	},
			{promptBoxSize:	149.0	, promptLineLength:	92.4	, responseBoxSize:	188.0	},
			{promptBoxSize:	135.0	, promptLineLength:	90.5	, responseBoxSize:	155.0	},
			{promptBoxSize:	89.0	, promptLineLength:	62.0	, responseBoxSize:	179.0	},
			{promptBoxSize:	141.0	, promptLineLength:	104.3	, responseBoxSize:	116.0	},
			{promptBoxSize:	184.0	, promptLineLength:	145.4	, responseBoxSize:	109.0	},
			{promptBoxSize:	110.0	, promptLineLength:	90.2	, responseBoxSize:	189.0	},
			{promptBoxSize:	159.0	, promptLineLength:	136.7	, responseBoxSize:	145.0	},
			{promptBoxSize:	170.0	, promptLineLength:	151.3	, responseBoxSize:	121.0	}
		],
		task_qtd: 2,
		practice_trial: [{promptBoxSize: 150, promptLineLength: 50, responseBoxSize: 100}],
		results: {
			absolute: [],
			relative: []
		},
		slides: {
			INTRODUCTION: {
				name: "introduction",
				type: "display-slide",
				template: introTemplate,
				display_element: $("#intro"),
				display_next_button: false,
			},
			INFORMED_CONSENT: {
				name: "informed_consent",
				type: "display-slide",
				template: irbTemplate,
				display_element: $("#irb"),
				display_next_button: false,
			},
			DEMOGRAPHICS: {
				type: "display-slide",
				template: demographicsTemplate,
				display_element: $("#demographics"),
				name: "demographics",
				finish: function(){
					var dem_data = $('#demographicsForm').alpaca().getValue();
					LITW.data.submitDemographics(dem_data);
				}
			},
			INSTRUCTIONS1: {
				name: "instructions",
				type: "display-slide",
				template: instructionsTemplate,
				template_data: {
					task_order: 1,
					task_type: "",
				},
				display_element: $("#instructions"),
				display_next_button: true,
			},
			PRACTICE1: {
				name: "practice",
				type: "display-slide",
				template: practiceTemplate,
				template_data: {
					task_order: 1,
					task_type: "",
				},
				display_element: $("#practice"),
				display_next_button: false,
			},
			TASK_ABSOLUTE: {
				name: "task_absolute",
				type: "display-slide",
				template: flTaskTemplate,
				template_data: {
					config: {
						task_type: 'absolute'
					}
				},
				display_element: $("#task-abs"),
				display_next_button: false,
				finish: function(){
					LITW.data.submitStudyData({
						absolute: params.results.absolute
					});
				}
			},
			INSTRUCTIONS2: {
				name: "instructions",
				type: "display-slide",
				template: instructionsTemplate,
				template_data: {
					task_order: 2,
					task_type: "",
				},
				display_element: $("#instructions"),
				display_next_button: true,
			},
			PRACTICE2: {
				name: "practice",
				type: "display-slide",
				template: practiceTemplate,
				template_data: {
					task_order: 2,
					task_type: "",
				},
				display_element: $("#practice"),
				display_next_button: false,
			},
			TASK_RELATIVE: {
				name: "task_relative",
				type: "display-slide",
				template: flTaskTemplate,
				template_data: {
					config: {
						task_type: 'relative'
					}
				},
				display_element: $("#task-rel"),
				display_next_button: false,
				finish: function(){
					LITW.data.submitStudyData({
						relative: params.results.relative
					});
				}

			},
			COMMENTS: {
				type: "display-slide",
				template: commentsTemplate,
				display_element: $("#comments"),
				name: "comments",
				finish: function(){
					var comments = $('#commentsForm').alpaca().getValue();
					if (Object.keys(comments).length > 0) {
						LITW.data.submitComments({
							comments: comments
						});
					}
				}
			},
			RESULTS: {
				type: "call-function",
				func: function(){
					calculateResults();
				}
			}
		}
	};

	function configureStudy() {
		// timeline.push(params.slides.INTRODUCTION);
		// timeline.push(params.slides.INFORMED_CONSENT);
		// timeline.push(params.slides.DEMOGRAPHICS);
		let relative_first = Math.random()<0.5;
		LITW.data.submitStudyConfig({
			relative_first: relative_first
		});

		if (relative_first) {
			params.slides.INSTRUCTIONS1.template_data.task_type = "relative";
			params.slides.PRACTICE1.template_data.task_type = "relative";
			params.slides.INSTRUCTIONS2.template_data.task_type = "absolute";
			params.slides.PRACTICE2.template_data.task_type = "absolute";
			timeline.push(params.slides.INSTRUCTIONS1);
			timeline.push(params.slides.PRACTICE1);
			timeline.push(params.slides.TASK_RELATIVE);
			timeline.push(params.slides.INSTRUCTIONS2);
			timeline.push(params.slides.PRACTICE2);
			timeline.push(params.slides.TASK_ABSOLUTE);
		} else {
			params.slides.INSTRUCTIONS1.template_data.task_type = "absolute";
			params.slides.PRACTICE1.template_data.task_type = "absolute";
			params.slides.INSTRUCTIONS2.template_data.task_type = "relative";
			params.slides.PRACTICE2.template_data.task_type = "relative";
			timeline.push(params.slides.INSTRUCTIONS1);
			timeline.push(params.slides.PRACTICE1);
			timeline.push(params.slides.TASK_ABSOLUTE);
			timeline.push(params.slides.INSTRUCTIONS2);
			timeline.push(params.slides.PRACTICE2);
			timeline.push(params.slides.TASK_RELATIVE);
		}
		// params.slides.PRACTICE1.template_data.task_type = "relative";
		// timeline.push(params.slides.PRACTICE1);
		// timeline.push(params.slides.TASK_RELATIVE);
		// timeline.push(params.slides.COMMENTS);
		timeline.push(params.slides.RESULTS);
	}

	function calculateResults() {
		//CREATING DUMMY DATA FOR TESTING
		if(Object.keys(params.results.absolute).length === 0) {
			params.results.absolute = [
				{promptBoxSize:164,promptLineLength:41,responseBoxSize:125,response:36,error_abs:5,error_perc:12},
				{promptBoxSize:101,promptLineLength:21.2,responseBoxSize:103,response:21,error_abs:0,error_perc:0},
				{promptBoxSize:184,promptLineLength:145.4,responseBoxSize:109,response:109,error_abs:36,error_perc:24},
				{promptBoxSize:179,promptLineLength:31,responseBoxSize:89,response:21,error_abs:10,error_perc:32},
				{promptBoxSize:89,promptLineLength:62,responseBoxSize:179,response:58,error_abs:4,error_perc:6}
			]
		}
		if(Object.keys(params.results.relative).length === 0) {
			params.results.relative = [
				{promptBoxSize:164,promptLineLength:41,responseBoxSize:125,response:36,error_abs:5,error_perc:16},
				{promptBoxSize:101,promptLineLength:21.2,responseBoxSize:103,response:21,error_abs:0,error_perc:0},
				{promptBoxSize:184,promptLineLength:145.4,responseBoxSize:109,response:109,error_abs:23,error_perc:26},
				{promptBoxSize:179,promptLineLength:31,responseBoxSize:89,response:21,error_abs:6,error_perc:40},
				{promptBoxSize:89,promptLineLength:62,responseBoxSize:179,response:58,error_abs:66,error_perc:53}
			]
		}
		
		let results_data = {
			relative: _.meanBy(params.results.relative, (trial) => {return trial.error_perc}),
			absolute: _.meanBy(params.results.absolute, (trial) => {return trial.error_perc}),
			message: $.i18n('study-fl-results-header2-absolute')
		}
		if(results_data.relative < results_data.absolute) {
			results_data.message = $.i18n('study-fl-results-header2-relative');
		}
		//TODO: We need a message for when the relative and absolute error are the same!
		showResults(results_data, true);
	}

	function showResults(results = {}, showFooter = false) {
		if('PID' in params.URL) {
			//REASON: Default behavior for returning a unique PID when collecting data from other platforms
			results.code = LITW.data.getParticipantId();
		}

		$("#results").html(
			resultsTemplate({
				data: results
			}));
		if(showFooter) {
			$("#results-footer").html(resultsFooter(
				{
					share_url: window.location.href,
					share_title: $.i18n('litw-irb-header'),
					share_text: $.i18n('litw-template-title'),
					more_litw_studies: params.study_recommendation
				}
			));
		}
		$("#results").i18n();
		LITW.utils.showSlide("results");
	}

	function readSummaryData() {
		$.getJSON( "summary.json", function( data ) {
			//TODO: 'data' contains the produced summary form DB data
			//      in case the study was loaded using 'index.php'
			//SAMPLE: The example code gets the cities of study partcipants.
			console.log(data);
		});
	}

	function startStudy() {
		// generate unique participant id and geolocate participant
		LITW.data.initialize();
		// save URL params
		params.URL = LITW.utils.getParamsURL();
		if( Object.keys(params.URL).length > 0 ) {
			LITW.data.submitData(params.URL,'litw:paramsURL');
		}
		// populate study recommendation
		LITW.engage.getStudiesRecommendation(2, (studies_list) => {
			params.study_recommendation = studies_list;
		});
		// initiate pages timeline
		jsPsych.init({
		  timeline: timeline
		});
	}

	function startExperiment(){
		//TODO These methods should be something like act1().then.act2().then...
		//... it is close enough to that... maybe the translation need to be encapsulated next.
		// get initial data from database (maybe needed for the results page!?)
		//readSummaryData();

		// determine and set the study language
		$.i18n().locale = LITW.locale.getLocale();
		var languages = {
			'en': './i18n/en.json?v=1.0',
			'pt': './i18n/pt-br.json?v=1.0',
		};
		//TODO needs to be a little smarter than this when serving specific language versions, like pt-BR!
		var language = LITW.locale.getLocale().substring(0,2);
		var toLoad = {};
		if(language in languages) {
			toLoad[language] = languages[language];
		} else {
			toLoad['en'] = languages['en'];
		}
		$.i18n().load(toLoad).done(
			function() {
				$('head').i18n();
				$('body').i18n();

				LITW.utils.showSlide("img-loading");
				//start the study when resources are preloaded
				jsPsych.pluginAPI.preloadImages(params.preLoad,
					function () {
						configureStudy();
						startStudy();
					},

					// update loading indicator
					function (numLoaded) {
						$("#img-loading").html(loadingTemplate({
							msg: $.i18n("litw-template-loading"),
							numLoaded: numLoaded,
							total: params.preLoad.length
						}));
					}
				);
			});
	}



	// when the page is loaded, start the study!
	$(document).ready(function() {
		startExperiment();
	});
	exports.study = {};
	exports.study.params = params;
	exports.study.frameline = frameline;

})( window.LITW = window.LITW || {} );