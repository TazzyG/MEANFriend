'use strict';

//Milestones service used to communicate Milestones REST endpoints
angular.module('milestones').factory('Milestones', ['$resource',
	function($resource) {
		return $resource('milestones/:milestoneId', { milestoneId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);