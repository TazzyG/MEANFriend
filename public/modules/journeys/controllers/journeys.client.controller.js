'use strict';

// Journeys controller
angular.module('journeys').controller('JourneysController', ['$scope', '$stateParams','Authentication', 'Journeys', '$modal', '$log',
	function($scope, $stateParams, Authentication, Journeys, $modal, $log) {

		this.authentication = Authentication;

		// Find a list of Journey
		this.journeys = Journeys.query();


		// Open a modal window to Create a single journey record
		this.modalCreate = function (size) {

			var modalInstance = $modal.open({
				templateUrl: 'modules/journeys/views/create-journey.modal.view.html',
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

		// Open a modal window to Update a single journey record
		this.modalUpdate = function (size, selectedJourney) {

			var modalInstance = $modal.open({
				templateUrl: 'modules/journeys/views/update-journey.modal.view.html',
				controller: function ($scope, $modalInstance, aJourney) {

					$scope.theJourney = {};

					$scope.theJourney = angular.copy(aJourney);


					$scope.ok = function () {
						$modalInstance.close();
					};

					$scope.cancel = function () {
						$modalInstance.dismiss('cancel');
					};
				},
				size: size,
				resolve: {
					aJourney: function () {
						return selectedJourney;
					}
				}
			});

			modalInstance.result.then(function (selectedItem) {
				$scope.selected = selectedItem;
			}, function () {
				$log.info('Modal dismissed at: ' + new Date());
			});
		};




		// Remove existing Journey
		this.remove = function(journey) {
			if ( journey ) {
				journey.$remove();

				for (var i in this.journeys) {
					if (this.journeys [i] === journey) {
						this.journeys.splice(i, 1);
					}
				}
			} else {
				this.journey.$remove(function() {

				});
			}
		};


	}
]);
