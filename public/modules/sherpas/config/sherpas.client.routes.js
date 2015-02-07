'use strict';

//Setting up route
angular.module('sherpas').config(['$stateProvider',
	function($stateProvider) {
		// Sherpas state routing
		$stateProvider.
		state('listSherpas', {
			url: '/sherpas',
			templateUrl: 'modules/sherpas/views/list-sherpas.client.view.html'
		});
	}
]);
