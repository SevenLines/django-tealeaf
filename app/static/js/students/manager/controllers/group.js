app.controller('GroupCtrl', ['$scope', '$http', '$routeParams', 'Student',
    function ($scope, $http, $routeParams, Student) {
        $scope.group_id = $routeParams.group_id;
        $scope.students = [];
        $scope.newStudentIndex = -1;

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
            }, function (new_students_index) {
                for (var i = 0; i < $scope.students.length; ++i) {
                    var item = $scope.students[i];
                    if (item._destroy) {
                        $scope.students.splice(i, 1);
                        --i;
                    } else {
                        if (item.id <= -1) {
                            item.id = new_students_index[item.id];
                        }
                        item.reset();
                    }
                }
                $scope.$apply();
            });
        };

        $scope.toggleStudent = function (student) {
            if (student.id <= -1) {
                var index = $scope.students.indexOf(student);
                $scope.students.splice(index, 1);
            } else {
                student.toggleDestroy();
            }
        };

        $scope.addStudent = function (second_name, name) {
            $scope.students.push(new Student({
                id: $scope.newStudentIndex--,
                group: $scope.group_id,
                name: name,
                second_name: second_name
            }));
        }
    }]);
