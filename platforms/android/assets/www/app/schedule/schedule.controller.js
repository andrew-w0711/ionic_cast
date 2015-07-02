//moment().format();
'use strict';
angular.module('starter')
    .controller('scheduleCtrl', function ($rootScope, $scope, $http, $cordovaSQLite, $window, $ionicModal, Camera, uiCalendarConfig, $compile, API) {
        $scope.reportEvent = function (event) {
            if (event.gesture.direction == 'left')
                uiCalendarConfig.calendars.myCalendar1.fullCalendar('next');
            else if (event.gesture.direction == 'right')
                uiCalendarConfig.calendars.myCalendar1.fullCalendar('prev');
        };
        //var date = new Date();
        //var d = date.getDate();
        //var m = date.getMonth();
        //var y = date.getFullYear();
        var userId = 1;//getURLParam($window.location, 'userid');
        setTimeout(function(){
            $('.fc-today-button').before('<button id="change_schedule" class = "fc-change-schedule">Change Schedule</button>');
            $('.fc-view-container').hide();
        },1);
    
        $scope.visit = {
            visitdate: '01:00 PM',
            esttime: '01:30',
            displayname: 'Walmart',
            storeId: '2342',
            address: '555 Road Falls, NY 4321'
        };
        $ionicModal.fromTemplateUrl('templates/sheduleEvent.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modalEvent = modal;
        });
        $scope.closeEventModal = function () {
            $scope.modalEvent.hide();
        };
        $scope.events = [];
    
        var d = new Date();
        
        var Month =d.getMonth()+1;
        if(Month < 10)
            Month = "0" + Month;
        var Year = d.getYear() +1900;
        var Day = d.getDate();
        if(Day < 10)
            Day = "0" + Day;
        
        $scope.today = new Date();
    
        $scope.startDate = Year+"-"+Month+"-"+Day+"T"+"00:00:00.000Z";
        var e = new Date(d.getTime()+86400000);

        Month =e.getMonth()+1;
        if(Month < 10)
            Month = "0"+Month;
        Year = e.getYear() +1900;
        Day = e.getDate();
        if(Day < 10)
            Day = "0" + Day;
    
        $scope.endDate = Year+"-"+Month+"-"+Day+"T"+"00:00:00.000Z";
    
        $scope.getData = function () {
            var req = {
                method: 'POST',
                url: API + '/assignlist',
                headers: {
                    'x-access-token': localStorage.getItem('id_token')
                },
                data: {
                    startDate: $scope.startDate,
                    endDate: $scope.endDate
                }
            };

            $http(req).success(function (data) {
                $scope.myassignments = data.message;
                if (data.success) {
                    angular.forEach(data.message, function (assignment) {

                        req = {
                            method: 'POST',
                            url: API + '/tasksbyid',
                            headers: {
                                'x-access-token': localStorage.getItem('id_token')
                            },
                            data: {
                                assignId: assignment._id
                            }
                        };
                        assignment.endTime = new Date(assignment.Scheduled_Visit_Date_Time__c).getTime();
                        if (assignment.endTime > new Date().getTime()) {
                            assignment.pastOrFuture = 'future';
                        } else {
                            assignment.pastOrFuture = 'past';
                        }
                        $http(req).success(function (data) {
                            if (data.success) {
                                assignment.tasks = data.message;
                                assignment.minutes = 0;
                                angular.forEach(assignment.tasks, function (task) {
                                    task.params = {
                                        tasksid: task.Id,
                                        tasksMongoid: task._id,
                                        storeId: task.Store__c != null ? task.Store__c.Id : null,
                                        storeMongoId: task.Store__c != null ? task.Store__c._id : null
                                    };
                                    task.url = '/report?' + jQuery.param(task.params);
                                    assignment.minutes += task.Scheduled_Minutes__c;
                                });
                                var calEvent = [];
                                var startTime = new Date(assignment.Scheduled_Visit_Date_Time__c);
                                var v = {
                                    id: assignment._id,
                                    assignmentdate: assignment.Scheduled_Visit_Date_Time__c,
                                    assignmentminutes: assignment.minutes,
                                    title: assignment.tasks[0].Store__c.Name,
                                    start: startTime,
                                    end: startTime.setDate(startTime.getMinutes() + assignment.minutes),
                                    address: assignment.tasks[0].Store__c.Store_Address__c,
                                    city: assignment.tasks[0].Store__c.City__c,
                                    state: assignment.tasks[0].Store__c.Store_State__c[0],
                                    zipCode: assignment.tasks[0].Store__c.Zip_Code__c,
                                    allDay: false,
                                    //storeId: res.rows.item(i).storeId,
                                    //address: res.rows.item(i).address,
                                    //estdrivetime: res.rows.item(i).estdrivetime,
                                    latitude: assignment.tasks[0].Store__c.MALatitude__c,
                                    longitude: assignment.tasks[0].Store__c.MALongitude__c
                                };
                                calEvent.push(v);
                                $scope.events.push(calEvent);
                            }
                        });
                    });
                }
            });
        };
    
        $(document).on('click','.fc-next-button',function(){
            
            $scope.myassignments = [];
            var e = new Date($scope.today.getTime()+86400000);
            
            var Month =e.getMonth()+1;
            if(Month < 10)
                Month = "0" + Month;
            var Year = e.getYear() +1900;
            var Day = e.getDate();
            if(Day < 10)
                Day = "0" + Day;

            $scope.startDate = Year+"-"+Month+"-"+Day+"T"+"00:00:00.000Z";
            
            var f = new Date(e.getTime()+86400000);

            Month =f.getMonth()+1;
            if(Month < 10)
                Month = "0"+Month;
            Year = f.getYear() +1900;
            Day = f.getDate();
            if(Day < 10)
                Day = "0" + Day;

            $scope.endDate = Year+"-"+Month+"-"+Day+"T"+"00:00:00.000Z";
            $scope.today = e;
            
            $scope.getData();
        });
    
        $(document).on('click','.fc-prev-button',function(){
            
            $scope.myassignments = [];
            $scope.myassignments = [];
            var e = new Date($scope.today.getTime()-86400000);
            
            var Month =e.getMonth()+1;
            if(Month < 10)
                Month = "0" + Month;
            var Year = e.getYear() +1900;
            var Day = e.getDate();
            if(Day < 10)
                Day = "0" + Day;

            $scope.startDate = Year+"-"+Month+"-"+Day+"T"+"00:00:00.000Z";
            
            var f = new Date(e.getTime()+86400000);

            Month =f.getMonth()+1;
            if(Month < 10)
                Month = "0"+Month;
            Year = f.getYear() +1900;
            Day = f.getDate();
            if(Day < 10)
                Day = "0" + Day;

            $scope.endDate = Year+"-"+Month+"-"+Day+"T"+"00:00:00.000Z";
            $scope.today = e;
            
            $scope.getData();
        });
        
        $scope.OpenTask = function (assignmentId, assignment) {
            $rootScope.TaskOpen = true;
            $rootScope.$emit('OpenTask', {assignmentId: assignmentId, assignment: assignment});

        };
        $scope.OpenMap = function (e, destlat, destlong) {
            $rootScope.AssMap = true;
            $rootScope.$emit('OpenMap', {e: e, destlat: destlat,destlong:destlong});

        };
        $scope.OpenPhoto = function () {
            $rootScope.TaskPhoto = true;
            $rootScope.$emit('OpenPhoto', {});

        };
        /* alert on eventClick */
        $scope.alertOnEventClick = function (calEvent, jsEvent, view) {
            $scope.currentAssignment = calEvent;
            $scope.modalEvent.show();
        };
        /* alert on Drop */
        $scope.alertOnDrop = function (event, delta, revertFunc, jsEvent, ui, view) {
            alert('drop');
            $scope.alertMessage = ('Event Droped to make dayDelta ' + delta);
        };
        /* alert on Resize */
        $scope.alertOnResize = function (event, delta, revertFunc, jsEvent, ui, view) {
            alert('Resize');
            $scope.alertMessage = ('Event Resized to make dayDelta ' + delta);
        };

        /* Render Tooltip */
        $scope.eventRender = function (event, element, view) {
            element.attr({
                'tooltip': event.title,
                'tooltip-append-to-body': true
            });
            $compile(element)($scope);
        };
        /* config object */

        $scope.uiConfig = {
            calendar: {
                header: {
                    left: 'prev,next today',
                    center: 'title',
                    right: 'month,agendaWeek,agendaDay'
                },
                //aspectRatio: 4,
                allDaySlot: false,
                height: 480,
                //minTime: "09:00:00",
                scrollTime: '09:00:00',
                businessHours: {
                    //start: '09:00',
                    //end: '18:00', // an end time (6pm in this example)
                    dow: [1, 2, 3, 4, 5]
                },
                eventStartEditable: true,
                //dragScroll: false,
                eventDragStart: function (event, jsEvent, ui, view) {
                    alert('Drag');
                },
                eventDrop: function (event, delta, revertFunc) {
                    alert('DD');
                },
                editable: true,
                defaultView: 'agendaDay',
                eventClick: $scope.alertOnEventClick,
                eventResize: $scope.alertOnResize,
                eventRender: $scope.eventRender,
                // If we're on an iPad, this is used as our "eventClick"
                eventMouseover: function () {
                    if (isTouchDevice) {
                        alert('clicked using eventMouseover method');
                    }
                }
            }
        };

    });