'use strict';

angular.module('roadblocks').directive('roadblocksList', ['Roadblocks', 'Notify',
    function(Roadblocks, Notify) {

        return {
            restrict: 'E',
            transclude: true,
            templateUrl: 'modules/roadblocks/views/roadblock-list-template.html',
            link: function(scope, element, attrs){

                //when a new roadblock is added, update the roadblock list

                Notify.getMsg('NewRoadblock', function(event, data) {

                    scope.roadblocksCtrl.roadbocks = Roadblocks.query();

                });

                Notify.getMsg('UpdatedRoadblock', function(event, data) {

                    scope.roadblocksCtrl.roadblocks = Roadblocks.query();

                });
            }
        };

    }]);
