//moment().format();
'use strict';
angular.module('starter')
    .controller('calCtrl', function ($scope, $http, $cordovaSQLite, $window, $ionicModal, Camera, uiCalendarConfig, $compile) {
        var date = new Date();
        var d = date.getDate();
        var m = date.getMonth();
        var y = date.getFullYear();
        $scope.events = [[
            {
                title: 'Event 1',
                start: new Date(y, m, d)
            },
            {
                title: 'Event 2',
                start: new Date(y, m, d - 5,10),
                end: new Date(y, m, d - 5,12)
            }
        ]];
        $scope.uiConfig = {
            calendar: {
                header: {
                    left: 'prev,next today',
                    right: 'month,agendaWeek',
                },
                allDaySlot: true,
                editable: true,
                weekMode: 'variable',
                minTime: 10,
                maxTime: 16,
                height: 500,
                slotMinutes: 15,
                columnFormat: {
                    agendaWeek: 'ddd dd/MM',
                    agendaDay: 'dddd dd/MM'
                },
                titleFormat: {
                    agendaWeek: "MMM dd[ yyyy]{ '&#8212;'[ MMM] dd, yyyy}",
                    agendaDay: 'dddd, MMM dd, yyyy'
                }

            }
        };
    });