'use strict';

// Milestones controller
angular.module('milestones').controller('MilestonesController', ['$scope', '$stateParams', 'Authentication', 'Milestones', '$modal','$log',
	function($scope, $stateParams, Authentication, Milestones, $modal, $log) {
		this.authentication = Authentication;

		// Find a list of Milestones

			this.milestones = Milestones.query();

		// Open a modal window to Create a single Milestone record
		this.modalCreate = function (size){
			var modalInstance = $modal.open({
				templateUrl: 'modules/milestones/views/create-milestone.modal.view.html',
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
			modalInstance.result.then(function (selectedItem){

			}, function() {
				$log.info('Modal dismissed at: ' + new Date());
			});

		};

		// Open a modal window to Update a single Milestone record
		this.modalUpdate = function (size, selectedMilestone){
			var modalInstance = $modal.open({
				templateUrl: 'modules/milestones/views/update-milestone.modal.view.html',
				controller: function ($scope, $modalInstance, aMilestone) {

					$scope.theMilestone = {};

					$scope.theMilestone = angular.copy(aMilestone);

					$scope.ok = function () {
						$modalInstance.close();
					};

					$scope.cancel = function () {
						$modalInstance.dismiss('cancel');
					};
				},
				size: size,
				resolve: {
					aMilestone: function() {
						return selectedMilestone;
					}
				}
			});
			modalInstance.result.then(function (selectedItem){
				$scope.selected = selectedItem;

			}, function() {
				$log.info('Modal dismissed at: ' + new Date());
			});

		};


		// Remove existing Milestone
		this.remove = function(milestone) {
			if ( milestone ) {
				milestone.$remove();

				for (var i in this.milestones) {
					if (this.milestones [i] === milestone) {
						this.milestones.splice(i, 1);
					}
				}
			} else {
				this.milestone.$remove(function() {

				});
			}
		};
	}
]);
