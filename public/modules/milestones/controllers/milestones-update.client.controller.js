'use strict';

angular.module('milestones').controller('MilestonesUpdateController', ['$scope', 'Milestones', 'Notify',
    function($scope, Milestones, Notify ) {
        // Milestones update controller logic

        $scope.achievementOptions = [
            {id: '1', opt:'Begin Journey'},
            {id: '2', opt:'Discovery'},
            {id: '3', opt:'Pivot'},
            {id: '4', opt:'Validate'},
            {id: '5', opt:'Other Side'}
        ];


        // Update existing Milestone
        this.update = function(updatedMilestone) {
            var milestone = updatedMilestone ;

            milestone.$update(function(response) {

                Notify.sendMsg('UpdatedMilestone', {'id': response._id});

            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };
    }
]);


