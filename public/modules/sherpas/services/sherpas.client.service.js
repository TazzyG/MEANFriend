'use strict';

//Sherpas service used to communicate Sherpas REST endpoints
angular.module('sherpas').factory('Sherpas', ['$resource',
	function($resource) {
		return $resource('sherpas/:sherpaId', { sherpaId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);


