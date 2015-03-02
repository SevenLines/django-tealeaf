app.controller('YearsCtrl', ['$rootScope', '$scope', '$http', '$routeParams',
    function ($rootScope, $scope, $http, $routeParams) {
        $scope.year = $rootScope.year;

        $http.get(commonUrls.years).success(function (data) {
            $scope.years = data
        });

        $scope.setYear = function (year) {
            $rootScope.year = year;
            $scope.year = year;
        }
    }]);
