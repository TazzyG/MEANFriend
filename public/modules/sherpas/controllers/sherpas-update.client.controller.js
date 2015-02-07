'use strict';

angular.module('sherpas').controller('SherpasUpdateController', ['$scope', 'Sherpas', 'Notify',
    function($scope, Sherpas, Notify ) {
        // Sherpas update controller logic

        $scope.challengeOptions = [
            {id: '1', opt:'Mentor'},
            {id: '2', opt:'Tester'},
            {id: '3', opt:'Customer'},
            {id: '4', opt:'Planner'},
            {id: '5', opt:'Validator'}
        ];


        // Update existing Sherpa
        this.update = function(updatedSherpa) {
            var sherpa = updatedSherpa ;

            sherpa.$update(function(response) {

                Notify.sendMsg('UpdatedSherpa', {'id': response._id});

            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };
    }
]);
