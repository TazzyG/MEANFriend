'use strict';

angular.module('friends').factory('Notify', ['$rootScope',
    function($rootScope) {
        // Notify service logic
        // Public API

        var notify = {};

        notify.sendMsg = function(msg, data) {
            data = data || {};
            $rootScope.$emit(msg, data);

            console.log('message sent!');
        };

        notify.getMsg = function(msg, func, scope) {
            var unbind = $rootScope.$on(msg, func);

            if (scope) {
                scope.$on('destroy', unbind);
            }
        };

        return notify;
    }

]);
