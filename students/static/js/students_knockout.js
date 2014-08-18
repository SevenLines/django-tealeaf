function Student(data) {
    var self = this;
    self.id = data.id;
    self.name = ko.observable(data.name);
    self.second_name = ko.observable(data.second_name);
    self.group_id = data.group_id;

    self.old_name = ko.observable(data.name);
    self.old_second_name = ko.observable(data.second_name);
    self.old_group_id = data.group_id;

    self.modified = ko.computed(function () {
        return self.old_name() != self.name()
            || self.old_second_name() != self.second_name()
            || self.old_group_id != self.group_id
    });

    self.reset = function() {
        self.old_name(self.name());
        self.old_second_name(self.second_name());
        self.old_group_id = self.group_id;
    }
}

function StudentViewModel(default_values, url_years, url_groups, url_students, url_save_students, url_save_group) {
    var self = this;

    self.yearsList = ko.observableArray();
    self.groupsList = ko.observableArray();
    self.studentsList = ko.observableArray();

    self.newStudent = new Student({
        id: -1,
        name: '',
        second_name: '',
        group_id: -1
    });

    self.year = ko.observable();
    self.group = ko.observable();

    self.year.subscribe(function () {
        self.group(null);
        self.listGroups(self.year);
    });

//    self.group.subscribe(function () {
//        self.listStudents(self.group());
//    });

    self.listYears = function () {
        $.get(url_years, {}, self.yearsList).done(function () {
            if ($.cookie("year"))
                self.year($.cookie("year"));
        });
    };

    self.listGroups = function (year) {
        $.get(url_groups, {year: year}, self.groupsList).done(function (data) {
            if ($.cookie("group_id")) {
                var id = $.cookie("group_id");
                for (var i = 0; i < data.length; ++i) {
                    if (data[i].id == id) {
                        self.group(data[i]);
                        self.listStudents(self.group());
                        break;
                    }
                }
            }
            $.cookie("year", self.year());
        });
    };

    self.addGroup = function () {

    };

    self.listStudents = function (group) {
        $.get(url_students, {group_id: group['id']}).done(function (data) {
            var mapped_data = $.map(data, function (item) {
                return new Student(item);
            });
            $.cookie("group_id", group['id']);
            self.group(group);
            self.studentsList(mapped_data);
            self.newStudent.group_id = group['id'];
            self.sortStudents();
        });
    };

    self.sortStudents = function () {
        self.studentsList.sort(function (a, b) {
            return a.second_name() < b.second_name() ? -1 : 1;
        })
    };

    self.resetStudents = function () {
        for (var i=0; i<self.studentsList().length;++i) {
            self.studentsList()[i].reset();
        }
    };


    self.removeStudent = function (student) {
        if (student.id == -1) {
            self.studentsList.remove(student);
        } else {
            self.studentsList.destroy(student);
        }
    };

    self.addStudent = function () {
        self.studentsList.push(new Student(ko.toJS(self.newStudent)));
    };

    self.saveStudents = function () {
        var json = $.grep(ko.toJS(self.studentsList), function (item) {
            return item.modified || item._destroy || item.id === -1;
        });

        if (json.length === 0)
            return;

        students_json = JSON.stringify(json);

        $.post(url_save_students, {
            csrfmiddlewaretoken: $.cookie('csrftoken'),
            students: students_json
        }).success(function () {
            console.log(self.group());
            self.listStudents(self.group());
        });
    };


    self.listYears();
}