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
            if (next.params) {
                $.cookie('group_id', next.params.group_id,  { expires: 7, path: '/' });
                $.cookie('year', next.params.year,  { expires: 7, path: '/' });
                $rootScope.group_id = next.params.group_id;
                $rootScope.year = next.params.year;
            }
        });

        // redirects to the last page
        $location.path([
            $rootScope.year ? "/year/" : "",
            $rootScope.year ? $rootScope.year : "",
            $rootScope.group_id ? "/group/" : "",
            $rootScope.group_id ? $rootScope.group_id: ""
        ].join(''));
    }]);






