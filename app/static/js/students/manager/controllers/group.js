app.controller('GroupCtrl', ['$scope', '$http', '$routeParams', 'Student',
    function ($scope, $http, $routeParams, Student) {
        $scope.group_id = $routeParams.group_id;
        $scope.students = [];

        $http.get(commonUrls.students, {
            params: {
                group_id: $scope.group_id
            }
        }).success(function (data) {
            $scope.students = data.map(function (item) {
                return new Student(item);
            });
        });

        $scope.saveStudents = function () {
            var students = $scope.students.filter(function (item) {
                return item.changed();
            }).map(function (item) {
                return item.data();
            });

            helpers.post(commonUrls.save_students, {
                students: JSON.stringify(students)
            }, function () {
                for (var i= 0;i<$scope.students.length;++i) {
                    var item = $scope.students[i];
                    if (item._destroy) {
                        $scope.students.splice(i, 1);
                        --i;
                    } else {
                        item.reset();
                    }
                }
                //$scope.students.forEach(function (item) {
                //    if (item._destroy) {
                //        var index = $scope.students
                //    } else {
                //        item.reset();
                //    }
                //});
                $scope.$apply();
            });
        }
    }]);
