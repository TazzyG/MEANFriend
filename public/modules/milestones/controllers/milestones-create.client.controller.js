'use strict';

angular.module('milestones').controller('MilestonesCreateController', ['$scope', 'Milestones', 'Notify',
    function($scope, Milestones, Notify ) {
        // Milestones create controller logic

        $scope.achievementOptions = [
            {id: '1', opt:'Begin Journey'},
            {id: '2', opt:'Discovery'},
            {id: '3', opt:'Pivot'},
            {id: '4', opt:'Validate'},
            {id: '5', opt:'Other Side'}
        ];

        // Create new Milestone
        this.create = function() {
            // Create new Milestone object
            var milestone = new Milestones ({
                name: this.name,
                major: this.major,
                achievement: this.achievement,
                event: this.event,
                nextDate: this.nextDate
            });

            // Redirect after save
            milestone.$save(function(response) {

                Notify.sendMsg('NewMilestone', {'id': response._id});

            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };
    }
]);

