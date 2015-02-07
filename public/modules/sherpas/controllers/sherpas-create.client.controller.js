'use strict';

angular.module('sherpas').controller('SherpasCreateController', ['$scope', 'Sherpas', 'Notify',
    function($scope, Sherpas, Notify ) {
        // Sherpas create controller logic

        $scope.challengeOptions = [
            {id: 'Mentor', opt:'Mentor'},
            {id: 'Tester', opt:'Tester'},
            {id: 'Customer', opt:'Customer'},
            {id: 'Planner', opt:'Planner'},
            {id: 'Validator', opt:'Validator'}
        ];

        // Create new Sherpa
        this.create = function() {
            // Create new Sherpa object
            var sherpa = new Sherpas ({
                challenge: this.challenge,
                sherpa: this.sherpa,
                sherpaName: this.sherpaName
            });

            // Redirect after save
            sherpa.$save(function(response) {

                Notify.sendMsg('NewSherpa', {'id': response._id});

            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };
    }
]);

