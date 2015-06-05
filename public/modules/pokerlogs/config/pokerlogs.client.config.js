'use strict';

// Configuring the Articles module
angular.module('pokerlogs').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Pokerlogs', 'pokerlogs', 'dropdown', '/pokerlogs(/create)?');
		Menus.addSubMenuItem('topbar', 'pokerlogs', 'List Pokerlogs', 'pokerlogs');
		Menus.addSubMenuItem('topbar', 'pokerlogs', 'New Pokerlog', 'pokerlogs/create');
	}
]);