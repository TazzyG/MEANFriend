'use strict';

// Configuring the Articles module
angular.module('milestones').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Milestones', 'milestones', 'dropdown', '/milestones(/create)?');
		Menus.addSubMenuItem('topbar', 'milestones', 'List Milestones', 'milestones');
		//Menus.addSubMenuItem('topbar', 'milestones', 'New Milestone', 'milestones/create');
	}
]);
