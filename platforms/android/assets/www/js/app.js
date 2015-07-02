var db = null;

angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'ngCordova', 'uiGmapgoogle-maps','ngMessages','ui.calendar'])
    .constant('API', 'https://castnode.castretail.com:3000/api/v1')
    .run(function ($ionicPlatform, DB, $log,$cordovaSQLite) {
        $ionicPlatform.registerBackButtonAction(function () {
            if (!window.localStorage['id_token'])
                navigator.app.exitApp();
        }, 100);
        $ionicPlatform.ready(function () {

            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }

            // /// db start
            //$cordovaSQLite.deleteDB("my.db");
            //db = $cordovaSQLite.openDB("my.db");
            //$cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS users (id integer primary key, username text, password text, First_Name__c text, Last_Name__c text, Name text, Email_Address__c text, Home_Phone__c text, Cell_Phone__c text, Street_Address__c text, Apartment__c text, City__c text, State__c text, Zip_Code__c text)");
            // $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS users (id integer primary key,employeeId integer, displayname text, username text, password text)");
            // $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS stores (id integer primary key,storeId integer, displayname text, address text, phone text, photo text,latitude real,longitude Real)");
            // $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS visits (id integer primary key, user_id integer,store_id integer, visitdate DATETIME, esttime text, estdrivetime Numeric,workinghours text)");
            // //Mockup data
            // var query = "SELECT displayname FROM users";
            // $cordovaSQLite.execute(db, query).then(function (res) {
            //     if (res.rows.length <= 0) {
            //         var insertedquery = "INSERT INTO users (employeeId,displayname,username, password) VALUES (?,?,?,?)";
            //         $cordovaSQLite.execute(db, insertedquery, ['4432', 'Dzuy', 'dzuy@thinktankconnect.com', 'password']);

            //         var stores = "INSERT INTO stores (storeId,displayname, address,phone,latitude,longitude) VALUES (?,?,?,?,?,?)";
            //         $cordovaSQLite.execute(db, stores, ['2342', 'Walmart', '555 Road Falls, NY 4321', '452323232', '27.9174221', '-82.7774378']);
            //         $cordovaSQLite.execute(db, stores, ['5353', 'L´Oreal', '2323 Main Road, SE 4321', '6534232', '29.9824087', '30.9786558']);
            //         $cordovaSQLite.execute(db, stores, ['3324', 'Ross', '43 hl Road, DF 4321', '5555555', '29.980925', '31.104117']);
            //         $cordovaSQLite.execute(db, stores, ['3421', 'Toys R Us', '87 df Road. d Falls, 4321', '4343343', '27.9609091', '-82.74809119999999']);

            //         var visits = "INSERT INTO visits (user_id, store_id,visitdate,esttime,estdrivetime,workinghours) VALUES (?,?,?,?,?,?)";
            //         $cordovaSQLite.execute(db, visits, ['1', '1', '2015-05-26 10:00:00', '01:30', '30', '03:01']);
            //         $cordovaSQLite.execute(db, visits, ['1', '2', '2015-05-26 12:00:00', '01:15', '15', '00:58']);
            //         $cordovaSQLite.execute(db, visits, ['1', '3', '2015-05-26 14:00:00', '01:10', '40', '00:00']);
            //         $cordovaSQLite.execute(db, visits, ['1', '4', '2015-05-26 16:00:00', '01:15', '15', '00:00']);
            //         $cordovaSQLite.execute(db, visits, ['1', '1', '2015-05-26 17:00:00', '01:10', '40', '00:00']);
            //         $cordovaSQLite.execute(db, visits, ['1', '3', '2015-05-26 16:00:00', '01:15', '15', '00:00']);
            //         $cordovaSQLite.execute(db, visits, ['1', '2', '2015-05-26 12:00:00', '01:15', '15', '00:58']);
            //         $cordovaSQLite.execute(db, visits, ['1', '4', '2015-05-26 14:00:00', '01:10', '40', '00:00']);
            //         $cordovaSQLite.execute(db, visits, ['1', '3', '2015-05-26 17:00:00', '01:10', '40', '00:00']);
            //         $cordovaSQLite.execute(db, visits, ['1', '1', '2015-05-27 10:00:00', '01:00', '10', '00:00']);
            //         $cordovaSQLite.execute(db, visits, ['1', '4', '2015-05-27 12:00:00', '00:30', '20', '00:00']);
            //         $cordovaSQLite.execute(db, visits, ['1', '4', '2015-05-27 14:00:00', '00:15', '15', '00:00']);
            //         $cordovaSQLite.execute(db, visits, ['1', '4', '2015-05-28 11:00:00', '01:20', '40', '00:00']);
            //         $cordovaSQLite.execute(db, visits, ['1', '4', '2015-05-28 13:00:00', '01:10', '10', '00:00']);
            //         $cordovaSQLite.execute(db, visits, ['1', '4', '2015-05-28 15:00:00', '00:03', '20', '00:00']);
            //     }
            // }, function (err) {
            //     console.error(err);
            // });
            // /// db end
        });
    })
    .config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
        $ionicConfigProvider.tabs.position('bottom')
        // Ionic uses AngularUI Router which uses the concept of states
        // Learn more here: https://github.com/angular-ui/ui-router
        // Set up the various states which the app can be in.
        // Each state's controller can be found in controllers.js
        $stateProvider
            .state('login', {
                url: '/login',
                templateUrl: 'templates/login.html',
                controller: 'loginCtrl'
            })
            .state('logout', {
                url: '/logout',
                controller: 'logoutCtl'
            })
            // setup an abstract state for the tabs directive
            .state('tab', {
                url: "/tab",
                abstract: true,
                templateUrl: "templates/tabs.html"
            })

            // Each tab has its own nav history stack:

            .state('tab.assignments', {
                url: '/assignments',
                views: {
                    'tab-assignments': {
                        templateUrl: 'templates/tab-assignments.html',
                        controller: 'AssignmentCtrl'
                    }
                }
            })

            .state('tab.profile', {
                url: '/profile',
                views: {
                    'tab-profile': {
                        templateUrl: 'templates/tab-profile.html',
                        controller: 'profileCtrl'
                    }
                }
            })
            .state('tab.schedule', {
                url: '/schedule',
                views: {
                    'tab-schedule': {
                        templateUrl: 'templates/tab-schedule.html',
                        controller: 'scheduleCtrl'
                    }
                }
            })

            .state('tab.messages', {
                url: '/messages',
                views: {
                    'tab-messages': {
                        templateUrl: 'templates/tab-messages.html',
                        controller: 'messagesCtrl'
                    }
                }
            });

        // if none of the above states are matched, use this as the fallback
        if (window.localStorage['id_token'])
            $urlRouterProvider.otherwise('/tab/assignments');
        else
            $urlRouterProvider.otherwise('/login');
    })
    .directive('detectGestures', function($ionicGesture) {
        return {
            restrict :  'A',

            link : function(scope, elem, attrs) {
                var gestureType = attrs.gestureType;

                switch(gestureType) {
                    case 'swipe':
                        $ionicGesture.on('swipe', scope.reportEvent, elem);
                        break;
                    case 'swiperight':
                        $ionicGesture.on('swiperight', scope.reportEvent, elem);
                        break;
                    case 'swipeleft':
                        $ionicGesture.on('swipeleft', scope.reportEvent, elem);
                        break;
                    case 'doubletap':
                        $ionicGesture.on('doubletap', scope.reportEvent, elem);
                        break;
                    case 'tap':
                        $ionicGesture.on('tap', scope.reportEvent, elem);
                        break;
                }

            }
        }
    });