'use strict';

//Setting up route
angular.module('pokerlogs').config(['$stateProvider',
	function($stateProvider) {
		// Pokerlogs state routing
		$stateProvider.
		state('listPokerlogs', {
			url: '/pokerlogs',
			templateUrl: 'modules/pokerlogs/views/list-pokerlogs.client.view.html'
		}).
		state('createPokerlog', {
			url: '/pokerlogs/create',
			templateUrl: 'modules/pokerlogs/views/create-pokerlog.client.view.html'
		}).
		state('viewPokerlog', {
			url: '/pokerlogs/:pokerlogId',
			templateUrl: 'modules/pokerlogs/views/view-pokerlog.client.view.html'
		}).
		state('editPokerlog', {
			url: '/pokerlogs/:pokerlogId/edit',
			templateUrl: 'modules/pokerlogs/views/edit-pokerlog.client.view.html'
		});
	}
]);