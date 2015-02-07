'use strict';

angular.module('sherpas').directive('sherpaList', ['Sherpas', 'Notify',
    function(Sherpas, Notify) {

        return {
            restrict: 'E',
            transclude: true,
            templateUrl: 'modules/Sherpas/views/sherpa-list-template.html',
            link: function(scope, element, attrs){

                //when a new sherpa is added, update the sherpa list

                Notify.getMsg('NewSherpa', function(event, data) {

                    scope.sherpasCtrl.sherpas = Sherpas.query();

                });

                Notify.getMsg('UpdatedSherpa', function(event, data) {

                    scope.sherpasCtrl.sherpas = Sherpas.query();

                });
            }
        };

    }]);
