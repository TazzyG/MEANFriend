'use strict';

angular.module('journeys').controller('JourneysUpdateController', ['$scope', 'Journeys', 'Notify',
    function($scope, Journeys, Notify ) {
        // Journeys update controller logic

        $scope.mainTechnologyOptions = [
            {id: '1', opt:'Ruby'},
            {id: '2', opt:'HTML5'},
            {id: '3', opt:'Python'},
            {id: '4', opt:'Nodejs'},
            {id: '5', opt:'CMS'},
            {id: '6', opt:'NonTech'}
        ];


        // Update existing Journeys
        this.update = function(updatedJourney) {
            var journey = updatedJourney ;

            journey.$update(function(response) {

                Notify.sendMsg('UpdatedJourney', {'id': response._id});

            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };
    }
]);
