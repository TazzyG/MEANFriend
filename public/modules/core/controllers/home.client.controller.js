'use strict';


angular.module('core').controller('HomeController',['$scope', 'Authentication', 'video',
	function($scope, Authentication, Video) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
        document.createElement('video');

	}



]);

