'use strict';

// Roadblocks controller
angular.module('roadblocks').controller('RoadblocksController', ['$scope', '$stateParams', 'Authentication', 'Roadblocks', '$modal', '$log',
	function($scope, $stateParams, Authentication, Roadblocks, $modal, $log) {
		this.authentication = Authentication;

		//Find a list of Roadblocks
		this.roadblocks = Roadblocks.query();

		// Open a modal window to Create a single roadblock record
		this.modalCreate = function (size) {

			var modalInstance = $modal.open({
				templateUrl: 'modules/roadblocks/views/create-roadblock.modal.view.html',
				controller: function ($scope, $modalInstance) {

					$scope.ok = function () {
						$modalInstance.close();
					};

					$scope.cancel = function () {
						$modalInstance.dismiss('cancel');
					};
				},
				size: size
			});

			modalInstance.result.then(function (selectedItem) {
			}, function () {
				$log.info('Modal dismissed at: ' + new Date());
			});
		};



		// Open a modal window to Update a single roadblock record
		this.modalUpdate = function (size, selectedRoadblock) {

			var modalInstance = $modal.open({
				templateUrl: 'modules/roadblocks/views/update-roadblock.modal.view.html',
				controller: function ($scope, $modalInstance, aRoadblock) {

					$scope.theRoadblock = {};

					$scope.theRoadblock = angular.copy(aRoadblock);


					$scope.ok = function () {
						$modalInstance.close();
					};

					$scope.cancel = function () {
						$modalInstance.dismiss('cancel');
					};
				},
				size: size,
				resolve: {
					aRoadblock: function () {
						return selectedRoadblock;
					}
				}
			});

			modalInstance.result.then(function (selectedItem) {
				$scope.selected = selectedItem;
			}, function () {
				$log.info('Modal dismissed at: ' + new Date());
			});
		};





		// Remove existing Roadblock
		this.remove = function(roadblock) {
			if ( roadblock ) { 
				roadblock.$remove();

				for (var i in this.roadblocks) {
					if (this.roadblocks [i] === roadblock) {
						this.roadblocks.splice(i, 1);
					}
				}
			} else {
				this.roadblock.$remove(function() {
				});
			}
		};
	}
]);
