'use strict';

angular.module('friends').directive('friendList', ['Friends', 'Notify',
    function(Friends, Notify) {

        return {
            restrict: 'E',
            transclude: true,
            templateUrl: 'modules/friends/views/friend-list-template.html',
            link: function(scope, element, attrs){

                //when a new friend is added, update the friend list

                Notify.getMsg('NewFriend', function(event, data) {

                    scope.friendsCtrl.friends = Friends.query();

                });

                Notify.getMsg('UpdatedFriend', function(event, data) {

                    scope.friendsCtrl.friends = Friends.query();

                });
            }
        };

    }]);
