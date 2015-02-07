'use strict';

angular.module('milestones').directive('milestoneList', ['Milestones', 'Notify',
    function(Milestones, Notify) {

        return {
            restrict: 'E',
            transclude: true,
            templateUrl: 'modules/milestones/views/milestone-list-template.html',
            link: function(scope, element, attrs){

                //when a new milestone is added, update the milestone list

                Notify.getMsg('NewMilestone', function(event, data) {

                    scope.milestonesCtrl.milestones = Milestones.query();

                });

                Notify.getMsg('UpdatedMilestone', function(event, data) {

                    scope.milestonesCtrl.milestones = Milestones.query();

                });
            }
        };

    }]);
