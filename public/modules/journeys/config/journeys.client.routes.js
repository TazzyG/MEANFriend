'use strict';

//Setting up route
angular.module('journeys').config(['$stateProvider',
	function($stateProvider) {
		// Journeys state routing
		$stateProvider.
		state('listJourneys', {
			url: '/journeys',
			templateUrl: 'modules/journeys/views/list-journey.client.view.html'
		});
	}
]);
