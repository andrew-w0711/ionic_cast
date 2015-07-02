'use strict';
angular.module('starter')
    .controller('AssignmentCtrl', function ($rootScope, $scope, $http, $cordovaSQLite, $window, $ionicModal, Camera, $ionicPopup, API, $state, $ionicSideMenuDelegate,$ionicScrollDelegate, checkStatus) {
        checkStatus.login();
        function getURLParam(oTarget, sVar) {
            return decodeURI(oTarget.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURI(sVar).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
        }
        $scope.scrollBottom = function() {
            $ionicScrollDelegate.scrollBottom(true);
        };
        //if(window.localStorage['id_token']==null)
        //$state.go('login');

        //var userId = 1;//getURLParam($window.location, 'userid');
        var d = new Date();
        var month = d.getMonth() + 1;
        var day = d.getDate();
        var hrs = d.getHours();
        var mins = d.getMinutes();
        var year = d.getFullYear();
        var output = (month < 10 ? '0' : '') + month + '/' + (day < 10 ? '0' : '') + day + '/' + year + ' ' + (hrs < 10 ? '0' : '') + hrs + ":" + (mins < 10 ? '0' : '') + mins;
        var currentDate = year + '-' + (month < 10 ? '0' : '') + month + '-' + (day < 10 ? '0' : '') + day;
        $scope.getEmpInfo = function () {
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
                        datetime: output
                    };
                    drawPieChart(mydata.message.Quality_Of_Work__c / 100, "workQuality");
                    drawPieChart(mydata.message.On_Time_Performance__c / 100, "serviceQuality");
                    var Stars = mydata.message.Employee_Stars__c;
                    for(var i = 0 ; i < Stars ; i ++) {
                        $('.feedback').find("div").eq(4-i).removeClass('fa-star-o');
                        $('.feedback').find("div").eq(4-i).addClass('fa-star');
                    }
                }).error(function (mydata, mystatus, myheader) {
                    console.log(mystatus);
                    console.log(mydata);
                    console.log(myheader);
                });
            }
        };
        function drawPieChart(workingQualityPercent, chartId) {

            var width = 140,
                height = 140,
                radius = Math.min(width, height) / 2;

            var color = d3.scale.ordinal()
                .range(["#4bc8ef", "#bdbec0"]);

            var arc = d3.svg.arc()
                .outerRadius(radius - 10)
                .innerRadius(radius - 40);

            var pie = d3.layout.pie()
                .sort(null);
            var formatPercent = d3.format(".0%");
            var svg = d3.select("#" + chartId).append("svg")
                .attr("width", width)
                .attr("height", height)
                .append("g")
                .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

            var workdata = [];
            workdata.push(workingQualityPercent);
            workdata.push(1 - workingQualityPercent);


            var g = svg.selectAll(".arc")
                .data(pie(workdata))
                .enter().append("g")
                .attr("class", "arc");

            g.append("path")
                .attr("d", arc)
                .style("fill", function (d, i) {
                    return color(i);
                })

            g.append("text")
                .attr("dy", ".35em")
                .style("text-anchor", "middle")
                .style("fill", "#000")
                .text(formatPercent(workingQualityPercent));

        };
    
        $scope.getempInfoDb = function () {
            setTimeout(function () {
                var userquery = "SELECT employeeId,displayname FROM users WHERE id = ?";
                $cordovaSQLite.execute(db, userquery, [userId]).then(function (res) {
                    $scope.employee = {
                        employeeId: res.rows.item(0).employeeId,
                        employeeName: res.rows.item(0).displayname,
                        datetime: output
                    }
                }, function (err) {
                    console.error(err);
                });
            }, 2500);
        };
        var pindex = 0;
        var psize = 3;
        var isthereMore = true;
        $scope.loadMore = function () {
            $scope.getData();
        };
        $scope.canWeLoadMoreContent = function () {
            return isthereMore;
        };
    
        var d = new Date();
        
        var Month =d.getMonth()+1;
        if(Month < 10)
            Month = "0" + Month;
        var Year = d.getYear() +1900;
        var Day = d.getDate();
        if(Day < 10)
            Day = "0" + Day;
    
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
            $scope.getEmpInfo();
            //$scope.getData = function () {
            $scope.date = new Date();

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
                if (data.success) {
                    
                    $scope.assignments = data.message;
                    angular.forEach($scope.assignments, function (assignment) {
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
                            }
                        });
                    });
                }
            });
            ///

        };
        // $scope.results = [];
        // var query = "SELECT * FROM visits join stores on visits.store_id=stores.id WHERE visitdate like '" + currentDate + "%' and user_id = ? order by id limit ? offset ?";
        // setTimeout(function () {
        //     $cordovaSQLite.execute(db, query, [userId, psize, psize * pindex]).then(function (res) {
        //         if (res.rows.length > 0) {
        //             for (var i = 0; i < psize; i++) {
        //                 var vdate = new Date(res.rows.item(i).visitdate);
        //                 var hrs = vdate.getHours();
        //                 var mins = ("0" + vdate.getMinutes()).slice(-2);
        //                 var visithrs = hrs > 12 ? ("0" + (hrs - 12)).slice(-2) : hrs;
        //                 ;
        //                 var ampm = hrs < 12 ? ' AM' : ' PM'
        //                 var v = {
        //                     id: res.rows.item(i).id,
        //                     visitdate: visithrs + ':' + mins + ampm,
        //                     esttime: res.rows.item(i).esttime,
        //                     displayname: res.rows.item(i).displayname,
        //                     storeId: res.rows.item(i).storeId,
        //                     address: res.rows.item(i).address,
        //                     estdrivetime: res.rows.item(i).estdrivetime,
        //                     latitude: res.rows.item(i).latitude,
        //                     longitude: res.rows.item(i).longitude
        //                 };
        //                 $scope.results.push(v);
        //             }
        //             pindex++;
        //             $scope.$broadcast('scroll.infiniteScrollComplete');
        //         }
        //         else
        //             isthereMore = false;
        //     }, function (err) {
        //         console.error(err);
        //     });
        // }, 2000);
        //};

        $rootScope.TaskOpen = true;
        $rootScope.$on('OpenTask', function (event, args) {
            if ($rootScope.TaskOpen) {
                $rootScope.TaskOpen = false;
                $scope.editTask(args.assignmentId, args.assignment);
            }
        });
        $rootScope.AssMap = true;
        $rootScope.$on('OpenMap', function (event, args) {
            if ($rootScope.AssMap) {
                $rootScope.AssMap = false;
                $scope.getMapDirection(args.e, args.destlat, args.destlong);
            }
        });
        $rootScope.TaskPhoto = true;
        $rootScope.$on('OpenPhoto', function (event, args) {
            if ($rootScope.TaskPhoto) {
                $rootScope.TaskPhoto = false;
                $scope.takePhoto();
            }
        });
        $scope.myLocation = {
            lng: '',
            lat: ''
        }

        $scope.getMapDirection = function (e, destlat, destlong) {
            console.log(destlat, destlong);
            if (!e) e = window.event;
            e.stopPropagation();
            $scope.destlat = destlat;
            $scope.destlong = destlong;
            navigator.geolocation.getCurrentPosition($scope.drawMap);
            $ionicModal.fromTemplateUrl('templates/popover.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                $scope.modal = modal;
                $scope.modal.show();
            });
        };
        $scope.closeModal = function () {
            $('#map').empty();
            //var myNode = document.getElementById("map");
            //myNode.innerHTML = '';
            $scope.modal.remove();
        };

        $scope.drawMap = function (position) {
            //testing 29.9676167,31.0581543
            var directionsService = new google.maps.DirectionsService();
            var directionsDisplay = new google.maps.DirectionsRenderer();
            var myLatlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            //var destLatlng = new google.maps.LatLng($scope.destlat, $scope.destlong);
            var destLatlng = new google.maps.LatLng(29.9676167,31.0581543);
            var mapOptions = {
                zoom: 7,
                center: myLatlng
            };

            var mapDiv = $('<div style="width: 100%; height: 100%"></div>');
            $('#map').append(mapDiv);
            var map = new google.maps.Map($(mapDiv)[0], mapOptions);
            //console.log(map);
            directionsDisplay.setMap(map);
            var request = {
                origin: myLatlng,
                destination: destLatlng,
                travelMode: google.maps.TravelMode.DRIVING
            };
            directionsService.route(request, function (response, status) {
                if (status == google.maps.DirectionsStatus.OK) {
                    directionsDisplay.setDirections(response);
                }
            });
            $scope.map = map;
        };


        $scope.editTask = function (assignmentId, assignment) {

            var req = {
                method: 'POST',
                url: API + '/tasksbyid',
                headers: {
                    'x-access-token': localStorage.getItem('id_token')
                },
                data: {
                    assignId: assignmentId
                }
            };
            $http(req).success(function (data) {
                if (data.success) {
                    $scope.Questions();

                    $ionicModal.fromTemplateUrl('templates/task.html', {
                        scope: $scope,
                        animation: 'slide-in-up'
                    }).then(function (modal) {
                        $scope.taskModel = modal;
                        $scope.taskModel.show();
                    });

                    $scope.tasks = data.message;
                    $scope.currentAssignment = assignment;
                    assignment.minutes = 0;
                    angular.forEach($scope.tasks, function (task) {
                        task.params = {
                            tasksid: task.Id,
                            tasksMongoid: task._id,
                            storeId: task.Store__c != null ? task.Store__c.Id : null,
                            storeMongoId: task.Store__c != null ? task.Store__c._id : null
                        };
                        task.url = '/report?' + jQuery.param(task.params);
                        assignment.minutes += task.Scheduled_Minutes__c;
                    });
                }
            });
            // var query = "SELECT * FROM visits join stores on visits.store_id=stores.id WHERE visits.id = ?";
            // $cordovaSQLite.execute(db, query, [visitId]).then(function (res) {
            //     var vdate = res.rows.item(0).visitdate;
            //     $scope.currentVisit = {
            //         id: res.rows.item(0).id,
            //         visitdate: vdate.substring(vdate.indexOf(' '), vdate.length - 3),
            //         esttime: res.rows.item(0).esttime,
            //         displayname: res.rows.item(0).displayname,
            //         storeId: res.rows.item(0).storeId,
            //         address: res.rows.item(0).address,
            //         estdrivetime: res.rows.item(0).estdrivetime,
            //         latitude: res.rows.item(0).latitude,
            //         longitude: res.rows.item(0).longitude
            //     };

            //     $scope.taskModel.show();
            // }, function (err) {
            //     console.error(err);
            // });
        };
        $scope.Questions = function () {
            $http.get(API + '/visitform/P-1405551/2960', {
                headers: {
                    'x-access-token': window.localStorage['id_token']
                }
            }).success(function (data) {
                $scope.assignment = JSON.parse(data.content);
                //console.log($scope.report);
            }).error(function (mydata, mystatus, myheader) {
                console.log(mystatus);
                console.log(mydata);
                console.log(myheader);
            });
        };
        $scope.noPeriods = function (string) {
            if (string) {
                return string.toString().replace(/\./g, '');
            }
        };
        $scope.closeTaskModal = function () {
            $scope.lastPhoto = '';
            $scope.taskPhoto = '';
            $scope.taskModel.remove();
        };

        $scope.takePhoto = function () {
            Camera.getPicture().then(function (imageURI) {
                console.log(imageURI);
                $scope.lastPhoto = imageURI;
                $ionicModal.fromTemplateUrl('templates/camera.html', {
                    scope: $scope,
                    animation: 'slide-in-up'
                }).then(function (modal) {
                    $scope.cameraModal = modal;
                    $scope.cameraModal.show();
                });

            }, function (err) {
                alert(err);
            }, {
                quality: 50,
                correctOrientation: true,
                //encodingType : Camera.EncodingType.PNG,
                targetWidth: 320,
                targetHeight: 320,
                saveToPhotoAlbum: false
            });


        };
        $scope.toggleTasks = function (task) {
            if ($scope.isTaskShown(task)) {
                $scope.shownTask = null;
            } else {
                $scope.shownTask = task;
            }
        };
        $scope.isTaskShown = function (task) {
            return $scope.shownTask === task;
        };
        $scope.counter = 'Break';
        $scope.isBreakClicked = false;
        $scope.isBreakDisabled = true;
        var taskBreakInterval;
        $scope.taskBreak = function () {
            $scope.isBreakClicked = true;
            $scope.isBreakDisabled = true;
            var timer = 10 * 60, minutes, seconds;
            taskBreakInterval = setInterval(function () {
                minutes = parseInt(timer / 60, 10);
                seconds = parseInt(timer % 60, 10);

                minutes = minutes < 10 ? "0" + minutes : minutes;
                seconds = seconds < 10 ? "0" + seconds : seconds;

                $scope.counter = minutes + ":" + seconds;
                $scope.$apply();
                if (--timer < 0) {
                    timer = timer;
                    $scope.counter = 'Break';
                    $scope.isBreakClicked = false;
                    $scope.$apply();
                    clearInterval(taskBreakInterval);
                }
            }, 1000);
        };

        $scope.isLunchClicked = false;
        $scope.isLunchDisabled = true;
        var taskLunchInterval;
        $scope.taskLunch = function () {
            $scope.isLunchClicked = true;
            $scope.isLunchDisabled = true;
            var timer = 30 * 60, minutes, seconds;
            taskLunchInterval = setInterval(function () {
                minutes = parseInt(timer / 60, 10);
                seconds = parseInt(timer % 60, 10);

                minutes = minutes < 10 ? "0" + minutes : minutes;
                seconds = seconds < 10 ? "0" + seconds : seconds;

                $scope.counter = minutes + ":" + seconds;
                $scope.$apply();
                if (--timer < 0) {
                    timer = timer;
                    $scope.counter = 'Break';
                    $scope.isLunchClicked = false;
                    $scope.$apply();
                    clearInterval(taskLunchInterval);
                }
            }, 1000);
        };

        $scope.isTaskPaused = false;
        $scope.taskPauseText = 'Pause';
        $scope.taskPauseClass = "ion-pause";
        var pasueTimer = 0;
        var pasueTime = 5;//5min. pause time
        var refreshIntervalId;
        $scope.taskPause = function () {
            if ($scope.isTaskPaused == false) {
                $scope.isTaskPaused = true;
                $scope.taskPauseText = "Continue";
                $scope.taskPauseClass = "ion-play";
                StartPauseTimer();
            }
            else {
                $scope.isTaskPaused = false;
                $scope.taskPauseText = 'Pause';
                $scope.taskPauseClass = "ion-pause";
            }
        };
        function StartPauseTimer() {
            if (refreshIntervalId)
                clearInterval(refreshIntervalId);
            var timer = pasueTime * 60, minutes, seconds;
            refreshIntervalId = setInterval(function () {
                if ($scope.isTaskPaused) {
                    minutes = parseInt(pasueTimer / 60, 10);
                    seconds = parseInt(pasueTimer % 60, 10);

                    minutes = minutes < 10 ? "0" + minutes : minutes;
                    seconds = seconds < 10 ? "0" + seconds : seconds;

                    $scope.taskPauseText = minutes + ":" + seconds;
                    pasueTimer++;
                    if (--timer < 0) {
                        timer = timer;
                    }
                    if (timer == 0) {
                        var confirmPopup = $ionicPopup.confirm({
                            title: 'Pause Notification',
                            template: 'Your work session is paused',
                            cancelText: 'Continue Pause',
                            okText: 'Resume Time'
                        });
                        confirmPopup.then(function (res) {
                            if (res) {
                                timer = -1;
                                $scope.taskPauseText = 'Pause';
                                $scope.taskPauseClass = "ion-pause";
                                $scope.isTaskPaused = false;
                                clearInterval(refreshIntervalId);
                            } else {
                                StartPauseTimer();
                                $scope.taskPauseClass = "ion-play";
                                $scope.isTaskPaused = true;
                            }
                        });
                    }
                    $scope.$apply();
                }
            }, 1000);
        }


        $scope.CheckInOut = function (action, lat, lon, taskId) {
            //lat= 28.044226;
            //lon= -82.673729;
            /*params
             action: 	tasks.Id,
             tasksMongoid:		check/checkout
             lat: 28.0452879,
             lon: -82.6758985,
             taskMongoid: task._id*/
            var req = {
                method: 'POST',
                url: API + '/taskcheckpoint',
                headers: {
                    'x-access-token': localStorage.getItem('id_token')
                },
                data: {
                    action: action,
                    lat: lat,
                    lon: lon,
                    taskMongoid: taskId
                }
            };
            $http(req).success(function (data) {
                if (!data.success) {
                    var alertPopup = $ionicPopup.alert({
                        title: 'Wrong Checkin',//'Not At Task Site',
                        template: data.message//'You must be at the Task site before checking in.'
                    });
                    alertPopup.then(function (res) {
                    });
                }
                return data.success;
            });
        };
        $scope.terms = function () {
        };
        $scope.contact = function () {
        };
        $scope.faq = function () {
        };
        $scope.logOut = function () {
            if ($scope.checkOutClicked) {
                var confirmlogOut = $ionicPopup.confirm({
                    title: 'Checkout warning',
                    template: 'You should checkout this task first',
                    cancelText: 'Cancel',
                    okText: 'Check-out'
                });
                confirmlogOut.then(function (res) {
                    if (res) {
                        $scope.checkOut($scope.selectedTask);
                        window.localStorage.removeItem("id_token");
                        $state.go('login');
                    }
                });
            }
            else {
                window.localStorage.removeItem("id_token");
                $state.go('login');
            }
            $ionicSideMenuDelegate.toggleRight();
        };
        $scope.checkOut = function (task) {
            $scope.selectedTask = task;
            $scope.checkOutClicked = false;
            if (taskcheckInInteval)
                clearInterval(taskcheckInInteval);
            $scope.isTaskPaused = true;
            $scope.taskPause();
            if (taskLunchInterval)
                clearInterval(taskLunchInterval);
            if (taskBreakInterval)
                clearInterval(taskBreakInterval);
            navigator.geolocation.getCurrentPosition(checkOutWithLocation);
        };
        function checkOutWithLocation(position) {
            $scope.myLatlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            $scope.latit = position.coords.latitude;
            $scope.longtit = position.coords.longitude;
            $scope.CheckInOut('checkout', $scope.latit, $scope.longtit, $scope.selectedTask._id);
        }

        //////
        $scope.taskPeriod = "00:00";
        $scope.cntDown = "00:00";
        $scope.totalWorkingTime = "00:00";
        $scope.checkOutClicked = false;
        var taskcheckInInteval;
        $scope.checkIn = function (task) {
            $scope.selectedTask = task;
            $scope.estTime = task.Scheduled_Minutes__c;
            navigator.geolocation.getCurrentPosition(getMyLocation, getMyLocationError);
        };
        function getMyLocation(position) {
            $scope.myLatlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            $scope.latit = position.coords.latitude;
            $scope.longtit = position.coords.longitude;
            CheckInWithLocation();
        }

        function getMyLocationError(error) {
            CheckInWithLocation();
        }

        function CheckInWithLocation() {
            if (!$scope.CheckInOut('checkin', $scope.latit, $scope.longtit, $scope.selectedTask._id))
                return;
            $scope.checkOutClicked = true;
            if (taskcheckInInteval)
                clearInterval(taskcheckInInteval);
            var wTotalMins = 0, wTotalHours, wTotalMinutes;
            wTotalHours = parseInt(wTotalMins / 60, 10);
            wTotalMinutes = parseInt(wTotalMins % 60, 10);
            wTotalHours = wTotalHours < 10 ? "0" + wTotalHours : wTotalHours;
            wTotalMinutes = wTotalMinutes < 10 ? "0" + wTotalMinutes : wTotalMinutes;
            $scope.totalWorkingTime = wTotalHours + ":" + wTotalMinutes;

            $scope.isBreakDisabled = (wTotalHours >= 4 && $scope.isBreakClicked == false) ? false : true;
            $scope.isLunchDisabled = (wTotalHours >= 6 && $scope.isLunchClicked == false) ? false : true;
            $scope.$apply();

            var estTime = '00:' + $scope.estTime;
            $scope.cntDown = estTime;
            $scope.$apply();
            var estHrs = parseInt(estTime.substring(0, estTime.indexOf(":")));
            var estMin = parseInt(estTime.substring(estTime.indexOf(":") + 1));
            var timer = (estHrs * 60) + estMin, minutes, hours, taskHours, taskMin;
            var totalTimer = 0, totalTimerHours, totalTimerMinutes;
            taskcheckInInteval = setInterval(function () {
                if ($scope.isBreakClicked == false && $scope.isLunchClicked == false && $scope.isTaskPaused == false) {
                    if (--timer <= 0) {
                        timer = timer;
                        clearInterval(taskcheckInInteval);
                    }
                }
                if ($scope.isTaskPaused == false) {
                    if (++totalTimer <= 9) {//Employee working hours
                        totalTimer = totalTimer;
                    }
                }
                hours = parseInt(timer / 60, 10);
                minutes = parseInt(timer % 60, 10);

                taskHours = estHrs - hours;
                taskMin = estMin - minutes;
                taskHours = parseInt(taskHours / 60, 10);
                taskMin = parseInt(taskMin % 60, 10);
                taskHours = taskHours < 10 ? "0" + taskHours : taskHours;
                taskMin = taskMin < 10 ? "0" + taskMin : taskMin;

                hours = hours < 10 ? "0" + hours : hours;
                minutes = minutes < 10 ? "0" + minutes : minutes;

                var totalDayMinutes = parseInt(wTotalMins) + parseInt(totalTimer);
                totalTimerHours = parseInt(totalDayMinutes / 60, 10);
                totalTimerMinutes = parseInt(totalDayMinutes % 60, 10);

                totalTimerHours = totalTimerHours < 10 ? "0" + totalTimerHours : totalTimerHours;
                totalTimerMinutes = totalTimerMinutes < 10 ? "0" + totalTimerMinutes : totalTimerMinutes;

                $scope.cntDown = hours + ":" + minutes;
                $scope.taskPeriod = taskHours + ":" + taskMin;
                $scope.totalWorkingTime = totalTimerHours + ":" + totalTimerMinutes;

                $scope.isBreakDisabled = (totalTimerHours >= 4 && $scope.isBreakClicked == false) ? false : true;
                $scope.isLunchDisabled = (totalTimerHours >= 6 && $scope.isLunchClicked == false) ? false : true;

                $scope.$apply();

            }, 1000 * 60);
        };
        /*function CheckInWithLocation() {
         if (taskcheckInInteval)
         clearInterval(taskcheckInInteval);
         var query = "SELECT * FROM visits WHERE user_id = ? and visitdate like '" + currentDate + "%'";
         $cordovaSQLite.execute(db, query, [userId]).then(function (res) {
         var wTotalMins = 0, wTotalHours, wTotalMinutes;
         for (var i = 0; i < res.rows.length; i++) {
         var wh = res.rows.item(i).workinghours;
         //var dtd = res.rows.item(i).t;
         //alert(wh);
         var wHrs = parseInt(wh.substring(0, wh.indexOf(':')));
         var wMins = parseInt(wh.substring(wh.indexOf(':') + 1));
         wTotalMins += (wHrs * 60) + wMins;
         }
         wTotalHours = parseInt(wTotalMins / 60, 10);
         wTotalMinutes = parseInt(wTotalMins % 60, 10);
         wTotalHours = wTotalHours < 10 ? "0" + wTotalHours : wTotalHours;
         wTotalMinutes = wTotalMinutes < 10 ? "0" + wTotalMinutes : wTotalMinutes;
         $scope.totalWorkingTime = wTotalHours + ":" + wTotalMinutes;

         $scope.isBreakDisabled = (wTotalHours >= 4 && $scope.isBreakClicked == false) ? false : true;
         $scope.isLunchDisabled = (wTotalHours >= 6 && $scope.isLunchClicked == false) ? false : true;
         $scope.$apply();


         var estTime = $scope.currentVisit.esttime;
         $scope.cntDown = estTime;
         var estHrs = parseInt(estTime.substring(0, estTime.indexOf(":")));
         var estMin = parseInt(estTime.substring(estTime.indexOf(":") + 1));
         var timer = (estHrs * 60) + estMin, minutes, hours, taskHours, taskMin;
         var totalTimer = 0, totalTimerHours, totalTimerMinutes;
         taskcheckInInteval = setInterval(function () {
         if ($scope.isBreakClicked == false && $scope.isLunchClicked == false && $scope.isTaskPaused == false) {
         if (--timer < 0) {
         timer = timer;
         clearInterval(taskcheckInInteval);
         }
         }
         if ($scope.isTaskPaused == false) {
         if (++totalTimer <= 9) {//Employee working hours
         totalTimer = totalTimer;
         }
         }
         hours = parseInt(timer / 60, 10);
         minutes = parseInt(timer % 60, 10);

         taskHours = estHrs - hours;
         taskMin = estMin - minutes;
         taskHours = parseInt(taskHours / 60, 10);
         taskMin = parseInt(taskMin % 60, 10);
         taskHours = taskHours < 10 ? "0" + taskHours : taskHours;
         taskMin = taskMin < 10 ? "0" + taskMin : taskMin;

         hours = hours < 10 ? "0" + hours : hours;
         minutes = minutes < 10 ? "0" + minutes : minutes;

         var totalDayMinutes = parseInt(wTotalMins) + parseInt(totalTimer);
         totalTimerHours = parseInt(totalDayMinutes / 60, 10);
         totalTimerMinutes = parseInt(totalDayMinutes % 60, 10);

         totalTimerHours = totalTimerHours < 10 ? "0" + totalTimerHours : totalTimerHours;
         totalTimerMinutes = totalTimerMinutes < 10 ? "0" + totalTimerMinutes : totalTimerMinutes;

         $scope.cntDown = hours + ":" + minutes;
         $scope.taskPeriod = taskHours + ":" + taskMin;
         $scope.totalWorkingTime = totalTimerHours + ":" + totalTimerMinutes;

         $scope.isBreakDisabled = (totalTimerHours >= 4 && $scope.isBreakClicked == false) ? false : true;
         $scope.isLunchDisabled = (totalTimerHours >= 6 && $scope.isLunchClicked == false) ? false : true;

         $scope.$apply();

         }, 1000 * 60);
         }, function (err) {
         console.error(err);
         });
         };*/
        $scope.closeCameraModal = function () {
            $scope.lastPhoto = '';
            $scope.cameraModal.remove();
        };
        $scope.useImage = function () {
            $scope.taskPhoto = $scope.lastPhoto;
            $scope.cameraModal.remove();
        };
        $scope.retakeImage = function () {
            Camera.getPicture().then(function (imageURI) {
                console.log(imageURI);
                $scope.lastPhoto = imageURI;
            }, function (err) {
                alert(err);
            }, {
                quality: 50,
                correctOrientation: true,
                //encodingType : Camera.EncodingType.PNG,
                targetWidth: 320,
                targetHeight: 320,
                saveToPhotoAlbum: false
            });
        };
        var angle = 0;
        $scope.rotateImage = function () {
            angle = (angle + 90) % 360;
            var imgs = document.getElementsByName('image');
            for (var i = 0; i < imgs.length; i++) {
                document.getElementsByName('image')[i].className = "rotate" + angle;
            }

        };
    });