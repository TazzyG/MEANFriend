'use strict';

//Setting up route
angular.module('roadblocks').config(['$stateProvider',
	function($stateProvider) {
		// Roadblocks state routing
		$stateProvider.
		state('listRoadblocks', {
			url: '/roadblocks',
			templateUrl: 'modules/roadblocks/views/list-roadblocks.client.view.html'
		});
	}
]);
