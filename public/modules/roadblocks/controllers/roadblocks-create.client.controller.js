'use strict';

angular.module('roadblocks').controller('RoadblocksCreateController', ['$scope', 'Roadblocks', 'Notify',
    function($scope, Roadblocks, Notify ) {
        // Roadblocks create controller logic

        $scope.nameOptions = [
            {id: '1', opt:'Time Machine'},
            {id: '2', opt:'Travel Guide'},
            {id: '3', opt:'Treasure Map'},
            {id: '4', opt:'Shady Tree'},
            {id: '5', opt:'Message in a Bottle'},
            {id: '6', opt:'Fire Side Chat'}
        ];

        // Create new Roadblocks
        this.create = function() {
            // Create new Roadblocks object
            var roadblock = new Roadblocks ({
                name: this.name,
                description: this.description,
                sherpa: this.sherpa,
                googleDocs: this.googleDocs

            });

            // Redirect after save
            roadblock.$save(function(response) {

                Notify.sendMsg('NewRoadblock', {'id': response._id});

            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };
    }
]);

