'use strict';

// Sherpas controller
angular.module('sherpas').controller('SherpasController', ['$scope', '$stateParams', 'Authentication', 'Sherpas', '$modal', '$log', '$modal','$log',
	function($scope, $stateParams, Authentication, Sherpas, $modal, $log) {
		this.authentication = Authentication;
		// Find a list of Sherpas
		this.sherpas = Sherpas.query();

		// Open a modal update window to Create a single sherpa record
		this.modalCreate = function (size) {

			var modalInstance = $modal.open({
				templateUrl: 'modules/sherpas/views/create-sherpa.modal.view.html',
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
		// Open a modal update window to Update a single sherpa record
		this.modalUpdate = function (size, selectedSherpa) {

			var modalInstance = $modal.open({
				templateUrl: 'modules/sherpas/views/update-sherpa.modal.view.html',
				controller: function ($scope, $modalInstance, aSherpa){

				$scope.theSherpa = {};
				$scope.theSherpa = angular.copy(aSherpa);
				$scope.ok = function () {
					$modalInstance.close();
				};

				$scope.cancel = function () {
					$modalInstance.dismiss('cancel');
				};
			},
			size: size,
				resolve: {
				aSherpa: function () {
					return selectedSherpa;
				}
			}
		});

		modalInstance.result.then(function (selectedItem) {
			$scope.selected = selectedItem;
		}, function () {
			$log.info('Modal dismissed at: ' + new Date());
		});
	};

		//Remove existing Sherpa
		this.remove = function(sherpa) {
			if (sherpa) {
				sherpa.$remove();

				for (var i in this.sherpas) {
					if (this.sherpas [i] === sherpa) {
						this.sherpas.splice(i, 1);
					}
				}
			} else {
				this.sherpa.$remove(function () {
				});
			}
		};
	}
]);



