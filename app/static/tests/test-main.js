var allTestFiles = [];
var TEST_REGEXP = /(test_).*\.js$/i;

var pathToModule = function (path) {
	return path.replace(/^\/base\//, '').replace(/\.js$/, '');
};

Object.keys(window.__karma__.files).forEach(function (file) {
	if (TEST_REGEXP.test(file)) {
		//console.log(file);
		//var path = pathToModule(file);
		//console.log(path);
		// Normalize paths to RequireJS module names.
		allTestFiles.push(pathToModule(file));
	}
});

require.config({
	// Karma serves files under /base, which is the basePath from your config file
	baseUrl: '/base',

	// dynamically load all test files
	deps: allTestFiles,

	shim: {
		'ckeditorinlinebinding': {deps: ['knockout']},
		'select2binding': {deps: ['select2']},
		'select2': {deps: ['jquery']},
		'bootstrap': {"deps": ['jquery']},
		'iconpicker': {deps: ['jquery']},
		'qtip': {"deps": ['jquery']},
		'color': {"deps": ['jquery']},
		'pickmeup': {"deps": ['jquery']}
	},
	paths: {
		'qtip': 'bower_components/qtip2/jquery.qtip',
		'knockout': 'bower_components/knockout/dist/knockout',
		'prettify': 'bower_components/google-code-prettify/bin/prettify.min',
		'jquery': 'bower_components/jquery/dist/jquery',
		'jquery.cookie': 'bower_components/jquery.cookie/jquery.cookie',
		'select2': 'bower_components/select2/select2',
		'jquery-impromptu': 'bower_components/jquery-impromptu/dist/jquery-impromptu',
		'pickmeup': 'bower_components/pickmeup/js/jquery.pickmeup',
		'iconpicker': 'bower_components/fontawesome-iconpicker/dist/js/fontawesome-iconpicker',

		'color': 'lib/color',
		'bootstrap': 'lib/bootstrap/bootstrap.min',

		'marks': 'js/students/marks/marks',
		'marksmain': 'js/students/marks/main',
		'cookies': 'js/students/marks/cookies',
		'labs': 'js/students/marks/labs',

		'helpers': 'js/helpers',
		'interface': 'js/interface',
		'common': 'js/common',
		'jquery.toc': 'js/jquery.toc',

		//'ckeditorinlinebinding': '../../bindings/ckeditorinlinebinding',
		//'select2binding': '../../bindings/select2binding',

		'marks_fixtures': 'js/students/marks/tests/fixtures',
	},

	// we have to kickoff jasmine, as it is asynchronous
	callback: window.__karma__.start
});


define("urls", function () {
	return {
		url: {

		}
	}
});