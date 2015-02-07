'use strict';

angular.module('journeys').controller('JourneysCreateController', ['$scope', 'Journeys', 'Notify',
    function($scope, Journeys, Notify ) {
        // Journeys create controller logic

        $scope.mainTechnologyOptions = [
            {id: '1', opt:'Ruby'},
            {id: '2', opt:'HTML5'},
            {id: '3', opt:'Python'},
            {id: '4', opt:'Nodejs'},
            {id: '5', opt:'CMS'},
            {id: '6', opt:'NonTech'}
        ];

        // Create new Journey
        this.create = function() {
            // Create new Journey object
            var journey = new Journeys ({
                description: this.description,
                mainTechnology: this.mainTechnology,
                initiator: this.initiator,
                googleDocs: this.googleDocs,
                recruiting: this.recruiting,
                sponsor: this.sponsor,
                stage: this.stage
            });

            // Redirect after save
            journey.$save(function(response) {

                Notify.sendMsg('NewJourney', {'id': response._id});

            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };
    }
]);

