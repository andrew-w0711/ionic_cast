'use strict';
angular.module('starter')
    .controller('messagesCtrl', function ($scope, $http, $cordovaSQLite, $window, $ionicModal, API) {
        var objDate = new Date(),
            locale = "en-us";
        var currentDay=objDate.toLocaleString(locale, { month: "short",day:"numeric" });
        $scope.loadMessages = function () {
            $scope.inboxMessages = [
                {
                    From: 'Test',
                    MessageSubject: 'This is Subject',
                    MessageContent: 'Testing long message',
                    MessageDate: currentDay
                },
                {
                    From: 'Test1',
                    MessageSubject: 'What is up ?',
                    MessageContent: 'Hello Mike how are the work today',
                    MessageDate: currentDay
                },
                {
                    From: 'Test2',
                    MessageSubject: 'This is Subject 2',
                    MessageContent: 'Testing long message',
                    MessageDate:currentDay
                },
                {
                    From: 'Test3',
                    MessageSubject: 'Hey',
                    MessageContent: 'Testing long message',
                    MessageDate: currentDay
                },
                {
                    From: 'Test4',
                    MessageSubject: 'Urgent Subject',
                    MessageContent: 'Testing long message',
                    MessageDate: currentDay
                }
            ];
        };
    });