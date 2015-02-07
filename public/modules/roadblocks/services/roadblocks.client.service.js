'use strict';

//Roadblocks service used to communicate Roadblocks REST endpoints
angular.module('roadblocks').factory('Roadblocks', ['$resource',
	function($resource) {
		return $resource('roadblocks/:roadblockId', { roadblockId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);