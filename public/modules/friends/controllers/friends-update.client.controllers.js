'use strict';

angular.module('friends').controller('FriendsUpdateController', ['$scope', 'Friends', 'Notify',
    function($scope, Friends, Notify ) {
        // Friend update controller logic

        $scope.myStyleOptions = [
            {id: '1', opt:'Hermit'},
            {id: '2', opt:'Rabble Rowzer'},
            {id: '3', opt:'Puzzle Solver'},
            {id: '4', opt:'The Boss'},
            {id: '5', opt:'Social Butterfly'},
            {id: '6', opt:'Perfectionist'},
        ];


        // Update existing Friend
        this.update = function(updatedFriend) {
            var friend = updatedFriend ;

            friend.$update(function(response) {

                Notify.sendMsg('UpdatedFriend', {'id': response._id});

            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };
    }
]);
