'use strict';

// Configuring the Articles module
angular.module('sherpas').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Sherpas', 'sherpas', 'dropdown', '/sherpas(/create)?');
		Menus.addSubMenuItem('topbar', 'sherpas', 'List Sherpas', 'sherpas');
		//Menus.addSubMenuItem('topbar', 'sherpas', 'New Sherpa', 'sherpas/create');
	}
]);
