'use strict';
angular.module('starter')
    .controller('layoutCtrl', function ($scope, $http, $cordovaSQLite, $window, API, $state, $ionicSideMenuDelegate) {
        $scope.openMenu = function () {
            $ionicSideMenuDelegate.toggleRight();
        }
        var d = new Date();
        var month = d.getMonth() + 1;
        var day = d.getDate();
        var hrs = d.getHours();
        var mins = d.getMinutes();
        var output = (month < 10 ? '0' : '') + month + '/' + (day < 10 ? '0' : '') + day + '/' + d.getFullYear() + ' ' + (hrs < 10 ? '0' : '') + hrs + ":" + (mins < 10 ? '0' : '') + mins;
        if (window.localStorage['id_token'] == null)
            $state.go('login');
        else {
            $http.get(API + '/mydata', {
                headers: {
                    'x-access-token': window.localStorage['id_token']
                }
            }).success(function (mydata) {
                $scope.employee = {
                    First_Name__c: mydata.message.First_Name__c,
                    Last_Name__c: mydata.message.Last_Name__c,
                    Name: mydata.message.Name,
                    Photo: mydata.message.Employee_Photo__c,
                    datetime: output
                };
                console.log(mydata);
                
            }).error(function (mydata, mystatus, myheader) {
                console.log(mystatus);
                console.log(mydata);
                console.log(myheader);
            });
        }

    });