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
require("bootstrap");
require("jquery-ui-bundle");
var introTemplate = require("../templates/introduction.html");
var irbTemplate = require("../templates/irb.html");
var demographicsTemplate = require("../templates/demographics.html");
var instructionsTemplate = require("/templates/instructions.html");
var practiceTemplate = require("/templates/practice.html");
var taskAbsoluteTemplate = require("/templates/taskAbsolute.html");
var taskRelativeTemplate = require("/templates/taskRelative.html");
var loadingTemplate = require("../templates/loading.html");
var resultsTemplate = require("/templates/results.html");
var resultsFooter = require("../templates/results-footer.html");
var commentsTemplate = require("../templates/comments.html");
require("../js/litw/jspsych-display-info");
require("../js/litw/jspsych-display-slide");

module.exports = (function(exports) {
	var timeline = [],
	params = {
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
		results: {
			absolute: [],
			relative: []
		},
		resultPercentages: {
			relAvgPercent: 100,
			absAvgPercent: 100,
		},
		preLoad: ["../img/btn-next.png","../img/btn-next-active.png","../img/ajax-loader.gif"],
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
			INSTRUCTIONS: {
				name: "instructions",
				type: "display-slide",
				template: instructionsTemplate,
				template_data: {
					task_order: 1,
					task_type: "absolute",
				},
				display_element: $("#instructions"),
				display_next_button: true,
			},
			PRACTICE: {
				name: "practice",
				type: "display-slide",
				template: practiceTemplate,
				template_data: {
					task_order: 1,
					task_type: "absolute",
				},
				display_element: $("#practice"),
				display_next_button: false,
			},
			TASK_ABSOLUTE: {
				name: "task_absolute",
				type: "display-slide",
				template: taskAbsoluteTemplate,
				display_element: $("#task-abs"),
				display_next_button: false,
			},
			INSTRUCTIONS2: {
				name: "instructions",
				type: "display-slide",
				template: instructionsTemplate,
				template_data: {
					task_order: 2,
					task_type: "relative",
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
					task_type: "relative",
				},
				display_element: $("#practice"),
				display_next_button: false,
			},
			TASK_RELATIVE: {
				name: "task_relative",
				type: "display-slide",
				template: taskRelativeTemplate,
				display_element: $("#task-rel"),
				display_next_button: false,
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
		timeline.push(params.slides.INTRODUCTION);
		timeline.push(params.slides.INFORMED_CONSENT);
		timeline.push(params.slides.DEMOGRAPHICS);
		timeline.push(params.slides.INSTRUCTIONS);
		timeline.push(params.slides.PRACTICE);
		timeline.push(params.slides.TASK_ABSOLUTE);
		timeline.push(params.slides.INSTRUCTIONS2);
		timeline.push(params.slides.PRACTICE2);
		timeline.push(params.slides.TASK_RELATIVE);
		timeline.push(params.slides.COMMENTS);
		timeline.push(params.slides.RESULTS);
	}

	function calculateResults() {
		let sumAbs = 0;
		let sumRel = 0;
    for (let index = 0; index < params.results.absolute.length; index++) {
      sumAbs = sumAbs + params.results.absolute[index];
    }
    params.resultPercentages.absAvgPercent = sumAbs / params.results.absolute.length;
		for (let index2 = 0; index2 < params.results.relative.length; index2++) {
      sumRel = sumRel + params.results.relative[index2];
    }
	  params.resultPercentages.relAvgPercent = sumRel / params.results.relative.length;
		let results_data = {}
		showResults(results_data, true)
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
					//TODO fix this before launching!
					share_url: "https://labinthewild.org/studies/covid-dilemmas/index.php",
					share_title: $.i18n('litw-irb-header'),
					share_text: $.i18n('litw-template-title'),
					more_litw_studies: [{
						study_url: "https://reading.labinthewild.org/",
						study_logo: "http://labinthewild.org/images/reading-assessment.jpg",
						study_slogan: $.i18n('litw-more-study1-slogan'),
						study_description: $.i18n('litw-more-study1-description'),
					},
					{
						study_url: "https://litw-sci-scomm.azurewebsites.net/LITW/consent",
						study_logo: "http://labinthewild.org/images/sci-comm-img.png",
						study_slogan: $.i18n('litw-more-study2-slogan'),
						study_description: $.i18n('litw-more-study2-description'),
					}]
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
	exports.study.params = params

})( window.LITW = window.LITW || {} );