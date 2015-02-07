'use strict';

//Setting up route
angular.module('friends').config(['$stateProvider',
	function($stateProvider) {
		// Friends state routing
		$stateProvider.
		state('listFriends', {
				url: '/friends',
				templateUrl: 'modules/friends/views/list-friends.client.view.html'
		});

	}
]);

