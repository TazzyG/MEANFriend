'use strict';

// Friends controller


angular.module('friends').controller('FriendsController', ['$scope', '$stateParams', 'Authentication', 'Friends', '$modal', '$log',
	function($scope, $stateParams, Authentication, Friends, $modal, $log) {

		this.authentication = Authentication;

		// Find a list of Friends
		this.friends = Friends.query();

		// Open a modal window to Update a single friend record
		this.modalUpdate = function (size, selectedFriend) {

			var modalInstance = $modal.open({
				templateUrl: 'modules/friends/views/update-friend.modal.view.html',
				controller: function ($scope, $modalInstance, aFriend) {

					$scope.theFriend = {};

					$scope.theFriend = angular.copy(aFriend);


					$scope.ok = function () {
						$modalInstance.close();
					};

					$scope.cancel = function () {
						$modalInstance.dismiss('cancel');
					};
				},
				size: size,
				resolve: {
					aFriend: function () {
						return selectedFriend;
					}
				}
			});

			modalInstance.result.then(function (selectedItem) {
				$scope.selected = selectedItem;
			}, function () {
				$log.info('Modal dismissed at: ' + new Date());
			});
		};




		// Open a modal window to Create a single friend record
		this.modalCreate = function (size) {

			var modalInstance = $modal.open({
				templateUrl: 'modules/friends/views/create-friend.modal.view.html',
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




		// Remove existing Friend
		this.remove = function( friend ) {
			if ( friend ) { friend.$remove();

				for (var i in this.friends ) {
					if (this.friends [i] === friend ) {
						this.friends.splice(i, 1);
					}
				}
			} else {
				this.friend.$remove(function() {
				});
			}
		};
	}
]);
