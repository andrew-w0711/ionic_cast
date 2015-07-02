'use strict';
angular.module('starter')
    .controller('profileCtrl', function ($scope, $http, $cordovaSQLite, $window, $ionicModal,API, checkStatus) {



        $scope.loadProfile = function () {
            $http.get(API+'/mydata', {
                headers: {
                    'x-access-token': window.localStorage['id_token']
                }
            }).success(function (mydata) {
                $scope.model = mydata.message;
                drawChart(mydata.message.Quality_Of_Work__c / 100, "work_value");
                drawChart(mydata.message.On_Time_Performance__c / 100, "service_value");
                var Stars = mydata.message.Employee_Stars__c;
                for(var i = 0 ; i < Stars ; i ++) {
                    $('.feedback_pro').find("div").eq(4-i).removeClass('fa-star-o');
                    $('.feedback_pro').find("div").eq(4-i).addClass('fa-star');
                }
            }).error(function (mydata, mystatus, myheader) {
                console.log(mystatus);
                console.log(mydata);
                console.log(myheader);
            });
        };
    
        function drawChart(workingQualityPercent, chartId) {

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
    });