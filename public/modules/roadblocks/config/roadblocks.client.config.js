'use strict';

// Configuring the Articles module
angular.module('roadblocks').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Roadblocks', 'roadblocks', 'dropdown', '/roadblocks(/create)?');
		Menus.addSubMenuItem('topbar', 'roadblocks', 'List Roadblocks', 'roadblocks');
		//Menus.addSubMenuItem('topbar', 'roadblocks', 'New Roadblock', 'roadblocks/create');
	}
]);
