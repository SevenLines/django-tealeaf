'use strict';

function HeaderController($scope, $location) {
    $scope.isActive = function (viewLocation) {
        return viewLocation === $location.path();
    };
}

var app = angular.module("studentsApp", [
    'ngRoute',
    'ngAnimate'
]);

app.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.
            when('/year/:year/group/:group_id', {
                templateUrl: commonUrls.base + 'views/group.html',
                controller: 'GroupCtrl'
            })
    }]).run(['$rootScope', '$location',
    function ($rootScope, $location) {
        $rootScope.year = $.cookie('year');
        $rootScope.group_id = $.cookie('group_id');

        $rootScope.$on('$routeChangeSuccess', function (event, next, current) {
            $rootScope.group_id = next.params.group_id;
            $rootScope.year = next.params.year;
        })
    }]);






