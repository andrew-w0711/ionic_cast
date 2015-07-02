angular.module('starter.services', [])

// DB wrapper  https://gist.github.com/jgoux/10738978
    .factory('DB', function ($q, $log) {
        var self = this;
        self.db = null;

        self.init = function () {

        };

        self.query = function (query, bindings) {

        };

        self.fetchAll = function (result) {

        };

        self.fetch = function (result) {

        };

        return self;
    })
// Resource service example
    .factory('Chats', function (DB, $log) {
        var self = this;

        self.all = function () {

        };

        self.get = function (id) {

        };
        return self;
    })
    //login check
    .service('checkStatus', function ($http, API, $location) {
        this.login = function () {
            console.log(localStorage.getItem('id_token'));
            var req = {
                method: 'GET',
                url: API + '/mydata',
                headers: {
                    'x-access-token': window.localStorage.getItem('id_token')
                }
            };
            $http(req).success(function(data) {
                if (data.success) {

                    return true;
                }

                window.localStorage.removeItem('id_token');
                $location.path('/login');

            }).error(function(data) {
                window.localStorage.removeItem('id_token');
                $location.path('/login');
            });

        }

    })
//Camera
    .factory('Camera', ['$q', function ($q) {

        return {
            getPicture: function (options) {
                var q = $q.defer();

                navigator.camera.getPicture(function (result) {
                    // Do any magic you need
                    q.resolve(result);
                }, function (err) {
                    q.reject(err);
                }, options);

                return q.promise;
            }
        }
    }]);