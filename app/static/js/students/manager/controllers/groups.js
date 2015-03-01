app.controller("GroupsCtrl", ['$rootScope', '$scope', '$http', '$routeParams',
    function ($rootScope, $scope, $http, $routeParams) {

        $scope.group_id = $routeParams.group_id;
        $rootScope.group_id = $routeParams.group_id;

        $scope.$watch(function () {
            return $rootScope.year;
        }, function () {
            $http.get(commonUrls.groups, {
                params: {
                    year: $rootScope.year
                }
            }).success(function (data) {
                $scope.groups = data
            });
        });
    }]);