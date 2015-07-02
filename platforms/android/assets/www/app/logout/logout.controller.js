'use strict';
angular.module('starter')
    .controller('logoutCtl', function ($scope, $http, $cordovaSQLite, $window, $cordovaNetwork, $location) {
        window.localStorage.removeItem('id_token');
        $location.path('/login');
    }
)
;