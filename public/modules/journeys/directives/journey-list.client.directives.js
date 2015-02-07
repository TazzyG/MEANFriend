'use strict';

angular.module('journeys').directive('journeyList', ['Journeys', 'Notify',
    function(Journeys, Notify) {

        return {
            restrict: 'E',
            transclude: true,
            templateUrl: 'modules/journeys/views/journey-list-template.html',
            link: function(scope, element, attrs){

                //when a new journey is added, update the journey list

                Notify.getMsg('NewJourney', function(event, data) {

                    scope.journeysCtrl.journeys = Journeys.query();

                });

                Notify.getMsg('UpdatedJourney', function(event, data) {

                    scope.journeysCtrl.journeys = Journeys.query();

                });
            }
        };

    }]);
