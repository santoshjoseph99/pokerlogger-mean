'use strict';

//Pokerlogs service used to communicate Pokerlogs REST endpoints
angular.module('pokerlogs').factory('Pokerlogs', ['$resource',
	function($resource) {
		return $resource('pokerlogs/:pokerlogId', { pokerlogId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);