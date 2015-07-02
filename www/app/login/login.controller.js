'use strict';
angular.module('starter')
    .controller('loginCtrl', function ($scope, $http, $cordovaSQLite, $location, $cordovaNetwork, API) {
        $scope.backheight = window.innerHeight + "px";
        var d = new Date();
        var weekday = new Array(7);
        weekday[0]=  "Sunday";
        weekday[1] = "Monday";
        weekday[2] = "Tuesday";
        weekday[3] = "Wednesday";
        weekday[4] = "Thursday";
        weekday[5] = "Friday";
        weekday[6] = "Saturday";

        var day = weekday[d.getDay()];

        $scope.daystr = day + ", ";

        var dd = new Date();
        var month = new Array();
        month[0] = "January";
        month[1] = "February";
        month[2] = "March";
        month[3] = "April";
        month[4] = "May";
        month[5] = "June";
        month[6] = "July";
        month[7] = "August";
        month[8] = "September";
        month[9] = "October";
        month[10] = "November";
        month[11] = "December";
        var mon = month[dd.getMonth()];
        $scope.daystr +=mon + " ";
        var ddd = new Date();
        var n = ddd.getDate();
        $scope.daystr += n;
        var suf = "";
        if(n==1 || n==11 || n==21 || n==31)
            suf = "st";
        if(n==2 || n==12 || n==22)
            suf = "nd";
        if(n==3 || n==13 || n==23)
            suf = "rd";
        if(suf == "")
            suf = "th";
        $scope.daysup = suf;
        //document.addEventListener("deviceready", function () {
        $scope.authorization = {
            username: '',
            password: ''
        };

        //var type = $cordovaNetwork.getNetwork();
        //var isOnline = $cordovaNetwork.isOnline();
        var isOffline = false;// $cordovaNetwork.isOffline();
        $scope.loginCast = function (form) {
            if (form.$valid) {
                $http.post(API + '/auth', {
                    username: $scope.authorization.username,
                    source:'app',
                    Password__c: $scope.authorization.password

                }).success(function (data, status) {
                    if (data.success) {
                        window.localStorage['id_token'] = data.token;
                        $location.path('/tab/assignments');
                    } else {
                        alert('Invalid username or password');
                    }
                }).error(function (data, status, headers, config) {
                    alert(status);
                    // $scope.loginDb();
                });

            }
        };
        $scope.loginDb = function () {
            //alert('LogIn In offline mode');
            var query = "SELECT id,displayname FROM users WHERE username = ? and password = ?";
            $cordovaSQLite.execute(db, query, [$scope.username, $scope.password]).then(function (res) {
                if (res.rows.length > 0) {
                    $window.location.href = 'index.html?userId=' + res.rows.item(0).id;
                }
                else
                    alert('Invalid username or password');
            }, function (err) {
                console.error(err);
            });
        };
        // This Method to Sync between offline and Online mode (Not Finished yet)
        $scope.SyncApi = function () {
            $http.post(API + '/auth', {
                username: 'bob@gmail.com',
                Password__c: 'password'

            }).success(function (data) {
                if (data.success) {
                    $http.get(API + '/mydata', {
                        headers: {
                            'x-access-token': data.token
                        }
                    }).success(function (mydata) {
                        alert(mydata.message.firstName)
                    }).error(function (mydata, mystatus, myheader) {
                        console.log(mystatus);
                        console.log(mydata);
                        console.log(myheader);
                    });
                } else {
                    alert('Invalid username or password');
                }
            }).error(function (data, status, headers, config) {
                alert(status);
                alert(headers);
            });
        };
    });