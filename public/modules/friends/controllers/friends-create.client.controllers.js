'use strict';

angular.module('friends').controller('FriendsCreateController', ['$scope', 'Friends', 'Notify',
    function($scope, Friends, Notify ) {
        // Friends create controller logic

        $scope.myStyleOptions = [
            {id: '1', opt:'Hermit'},
            {id: '2', opt:'Rabble Rowzer'},
            {id: '3', opt:'Puzzle Solver'},
            {id: '4', opt:'The Boss'},
            {id: '5', opt:'Social Butterfly'},
            {id: '6', opt:'Perfectionist'},
        ];

        // Create new Friends
        this.create = function() {
            // Create new Friend object
            var friend = new Friends ({
                firstName: this.firstName,
                lastName: this.lastName,
                email: this.email,
                skill1: this.skill1,
                skill2: this.skill2,
                wifm1: this.wifm1,
                founder: this.founder,
                myStyle: this.myStyle,
                website: this.website
            });

            // Redirect after save
            friend.$save(function(response) {

                Notify.sendMsg('NewFriend', {'id': response._id});

            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };
    }
]);

