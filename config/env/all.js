'use strict';

module.exports = {
	app: {
		title: 'PokerLogger',
		description: 'Poker logging live sessions',
		keywords: 'Poker,Logger,'
	},
	port: process.env.PORT || 3000,
	templateEngine: 'swig',
	sessionSecret: 'MEAN',
	sessionCollection: 'sessions',
	assets: {
		lib: {
			css: [
				'public/lib/bootstrap/dist/css/bootstrap.css',
				'public/lib/bootstrap/dist/css/bootstrap-theme.css',
                'public/lib/jquery-ui/themes/smoothness/jquery-ui.css',
                'public/lib/jqueryui-timepicker-addon/dist/jquery-ui-timepicker-addon.css',
                'public/lib/angular-bootstrap-datetimepicker/src/css/datetimepicker.css'
			],
			js: [
                'public/lib/jquery/dist/jquery.js',
                'public/lib/moment/moment.js',
                'public/lib/bootstrap/dist/js/bootstrap.js',
				'public/lib/angular/angular.js',
				'public/lib/angular-resource/angular-resource.js', 
				'public/lib/angular-cookies/angular-cookies.js',
				'public/lib/angular-animate/angular-animate.js', 
				'public/lib/angular-touch/angular-touch.js', 
				'public/lib/angular-sanitize/angular-sanitize.js', 
				'public/lib/angular-ui-router/release/angular-ui-router.js',
				'public/lib/angular-ui-utils/ui-utils.js',
				'public/lib/angular-bootstrap/ui-bootstrap-tpls.js',
                'public/lib/ng-lodash/build/ng-lodash.js',
                'public/lib/jquery-ui/jquery-ui.js',
                'public/lib/jqueryui-timepicker-addon/dist/jquery-ui-timepicker-addon.js',
                'public/lib/angular-bootstrap-datetimepicker/src/js/datetimepicker.js'
			]
		},
		css: [
			'public/modules/**/css/*.css'
		],
		js: [
			'public/config.js',
			'public/application.js',
			'public/modules/*/*.js',
			'public/modules/*/*[!tests]*/*.js'
		],
		tests: [
			'public/lib/angular-mocks/angular-mocks.js',
			'public/modules/*/tests/*.js'
		]
	}
};
