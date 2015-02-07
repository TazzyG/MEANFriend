'use strict';

// Configuring the Articles module
angular.module('journeys').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Journeys', 'journeys', 'dropdown', '/journeys(/create)?');
		Menus.addSubMenuItem('topbar', 'journeys', 'List Journeys', 'journeys');
		//Menus.addSubMenuItem('topbar', 'journeys', 'New Journey', 'journeys/create');
	}
]);
