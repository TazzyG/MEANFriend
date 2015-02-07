'use strict';

//Setting up route
angular.module('milestones').config(['$stateProvider',
	function($stateProvider) {
		// Milestones state routing
		$stateProvider.
		state('listMilestones', {
			url: '/milestones',
			templateUrl: 'modules/milestones/views/list-milestones.client.view.html'
		});
	}
]);



