'use strict';

require.config({
    paths: {
        'angular': "../../../bower_components/angular/angular",
        'domready': "../../../lib/require-domReady"
    },
    shim: {
        'angular': {
            exports: 'angular'
        }
    }
});


require(['urls', "angular", 'domready!'], function (urls, ng) {
    var app = ng.module("myApp", []);

    app.controller("YearsController" ['$scope', '$http', function ($scope, $http) {
        $scope.years = [];
        $http.get(urls.years).success(function (data) {
            $scope.years = data;
        });
    }]);

    app.controller("GroupsController", ['$scope', '$http', function ($scope, $http) {
        $scope.name = "GroupList";
    }]);
});