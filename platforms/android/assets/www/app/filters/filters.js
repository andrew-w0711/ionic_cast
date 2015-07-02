'use strict';

angular.module('starter')

    .filter('object2Array', function() {
        return function(input) {
            var out = [],
                i;
            for (i in input) {
                if (input.hasOwnProperty(i)) {
                    out.push(input[i]);
                }
            }
            return out;
        };
    })
    .filter('firstletter', function() {
        return function (input) {
            return input.charAt(0);
        };
    })
    .filter('startFrom', function () {
        return function (input, start) {
            if (input) {
                start = +start;
                return input.slice(start);
            }
            return [];
        };
    })

    .filter('url', function() {
        return function(input) {
            return encodeURIComponent(input).replace(/[!'()*]/g, function(c) {
                return '%' + c.charCodeAt(0).toString(16);
            });
        };
    })

    .filter('eligible', function() {
        return function(input) {
            input = input || false;
            var out = '';
            if (input) {
                out = '<span class="label label-success">Eligible</span>';
            } else {
                out = '<span class="label label-danger">Not Eligible</span>';
            }
            return out;
        };
    })
    .filter('enrolled', function() {
        return function(input) {
            input = input || false;
            var out = '';
            if (input) {
                out = '<span class="label label-success">Enrolled</span>';
            } else {
                out = '<span class="label label-danger">Not Enrolled</span>';
            }
            return out;
        };
    })
    .filter('ucfirst', function() {
        return function(input) {
            return input.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
        };
    }).filter('remaining', function() {
        return function(input) {
            var total = 130;
            return total - input;
        };
    }).filter('trending', function() {
        return function(input) {
            input = input || '';
            var out = '';
            if (input === 'up') {
                out = '<span class="glyphicon glyphicon-arrow-up success"></span>';
            } else if (input === 'down') {
                out = '<span class="glyphicon glyphicon-arrow-down danger"></span>';
            } else {
                out = '<span class="glyphicon glyphicon-resize-horizontal"></span>';
            }
            return out;
        };
    });