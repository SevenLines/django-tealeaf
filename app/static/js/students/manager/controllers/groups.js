app.controller("GroupsCtrl", ['$rootScope', '$scope', '$http', '$routeParams', 'Group',
    function ($rootScope, $scope, $http, $routeParams, Group) {

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
                $scope.groups = data.map(function (item) {
                    return new Group(item);
                });
            });
        });

        $scope.addGroup = function (title) {
            $scope.groups.push(new Group({
                title: title,
                id: -1,
                year: $rootScope.year
            }));
        };

        $scope.toggleGroup = function (group) {
            if (group.id <= -1) {
                var index = $scope.groups.indexOf(group);
                $scope.groups.splice(index, 1);
            } else {
                group.toggleDestroy();
            }
        };

        $scope.saveGroups = function () {
            var groups = $scope.groups.filter(function (item) {
                return item.changed();
            }).map(function (item) {
                return item.data();
            });

            helpers.post(commonUrls.save_groups, {
                groups: JSON.stringify(groups)
            }, function (new_groups_index) {
                for (var i = 0; i < $scope.groups.length; ++i) {
                    var item = $scope.groups[i];
                    if (item._destroy) {
                        $scope.groups.splice(i, 1);
                        --i;
                    } else {
                        if (item.id <= -1) {
                            item.id = new_groups_index[item.id];
                        }
                        item.reset();
                    }
                }
                $scope.$apply();
            })
        }
    }]);