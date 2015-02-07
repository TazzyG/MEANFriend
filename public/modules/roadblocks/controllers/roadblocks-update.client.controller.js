'use strict';

angular.module('roadblocks').controller('RoadblocksUpdateController', ['$scope', 'Roadblocks', 'Notify',
    function($scope, Roadblocks, Notify ) {
        // Roadblocks update controller logic

        $scope.nameOptions = [
            {id: '1', opt:'Time Machine'},
            {id: '2', opt:'Travel Guide'},
            {id: '3', opt:'Treasure Map'},
            {id: '4', opt:'Shady Tree'},
            {id: '5', opt:'Message in a Bottle'},
            {id: '6', opt:'Fire Side Chat'}
        ];


        // Update existing Roadblock
        this.update = function(updatedRoadblock) {
            var roadblock = updatedRoadblock ;

            roadblock.$update(function(response) {

                Notify.sendMsg('UpdatedRoadbock', {'id': response._id});

            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };
    }
]);
