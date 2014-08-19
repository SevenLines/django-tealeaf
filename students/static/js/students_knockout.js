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

    self.reset = function () {
        self.old_name(self.name());
        self.old_second_name(self.second_name());
        self.old_group_id = self.group_id;
    }
}

function Group(data) {
    var self = this;
    self.id = data.id;
    self.title = ko.observable(data.title);
    self.year = ko.observable(data.year);
    self.has_ancestor = data.has_ancestor;

    self.old_title = ko.observable(data.title);
    self.old_year = ko.observable(data.year);

    self.modified = ko.computed(function () {
        return self.title() != self.old_title() ||
            self.old_year() != self.year()
    });

    self.reset = function () {
        self.old_title(self.title);
        self.old_year(self.year);
    };
}


function StudentViewModel(default_values, modal_selector, url_years, url_groups, url_students, url_save_groups, url_save_students) {
    var self = this;

    self.yearsList = ko.observableArray();
    self.groupsList = ko.observableArray();
    self.studentsList = ko.observableArray();

    self.year = ko.observable();
    self.group = ko.observable();

    self.newStudent = new Student({
        id: -1,
        name: '',
        second_name: '',
        group_id: -1
    });

    self.newGroup = new Group({
        id: -1,
        title: '',
        year: -1
    });

    self.modalConfirm = new ModalConfirm(modal_selector, '');

/// YEARS CONTROL
    self.year.subscribe(function () {
        self.group(null);
        self.listGroups(self.year);
    });

    self.listYears = function () {
        $.get(url_years, {}, self.yearsList).done(function () {
            if ($.cookie("year"))
                self.year($.cookie("year"));
        });
    };
/// END YEARS CONTROL

/// GROUPS CONTROL
    self.listGroups = function (year) {
        $.get(url_groups, {year: year}).done(function (data) {

            var mapped_data = $.map(data, function (item) {
                return new Group(item);
            });
            self.groupsList(mapped_data);

            // restore last group from cookies
            self.group(null);
            if ($.cookie("group_id")) {
                var id = $.cookie("group_id");
                for (var i = 0; i < self.groupsList().length; ++i) {
                    if (self.groupsList()[i].id == id) {
                        self.group(self.groupsList()[i]);
                        self.listStudents(self.group());
                        break;
                    }
                }
            }
            self.sortGroups();

            // подключаем события, чтобы не закрывалась менюшка
            $('.groups-nav .dropdown-menu').bind('click', function (e) {
                e.stopPropagation()
            });

            $.cookie("year", self.year());
            self.newGroup.year(self.year());
        });
    };

    // позволяет сформировать и закачать xlsx список студентов
    self.downloadStudentsList = function (url) {
        window.location = url+"?year="+self.year();
    };


    self.sortGroups = function () {
        self.groupsList.sort(function (a, b) {
            return a.title() < b.title() ? -1 : 1;
        })
    };

    self.addGroup = function () {
        console.log(ko.toJS(self.newGroup));
        self.groupsList.push(new Group(ko.toJS(self.newGroup)));
        self.saveGroups();
    };

    self.removeGroup = function (group) {
        console.log(group);
        self.modalConfirm.message("Удалить группу?<h2>" + group.title() + "</h2>");
        self.modalConfirm.show(function () {
            if (group.id === -1) {
                self.groupsList.remove(group);
            } else {
                self.groupsList.destroy(group);
            }
            self.saveGroups();
        });
    };

    self.saveGroups = function () {
        var json = $.grep(ko.toJS(self.groupsList), function (item) {
            return item.modified || item._destroy || item.id === -1;
        });

        if (json.length === 0)
            return;

        groups_json = JSON.stringify(json);

        $.post(url_save_groups, {
            csrfmiddlewaretoken: $.cookie('csrftoken'),
            groups: groups_json
        }).success(function (data) {
            self.listGroups($.cookie("year"));
        });
    };


    self.copyGroupToNextYear = function(form, group) {
        console.log(form.action);
        $.post(form.action, {
            csrfmiddlewaretoken: $.cookie('csrftoken'),
            group_id: group['id']
        }).success(function () {
            self.listGroups($.cookie("year"));
        });
    };
/// END GROUPS CONTROL

/// STUDENTS CONTROL
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
        for (var i = 0; i < self.studentsList().length; ++i) {
            self.studentsList()[i].reset();
        }
    };


    self.removeStudent = function (student) {
        self.modalConfirm.message("Удалить?<h2>" + student.second_name() + "<br>" + student.name() + "</h2>");
        self.modalConfirm.show(function () {
            if (student.id == -1) {
                self.studentsList.remove(student);
            } else {
                self.studentsList.destroy(student);
            }
            self.saveStudents();
        });
    };

    self.addStudent = function () {
        self.studentsList.push(new Student(ko.toJS(self.newStudent)));
        self.saveStudents();
        // reset add form and focus it
        var form = $(".group-students form.add")[0];
        if (form) {
            form.reset();
            $(form).find("input[data-name='second_name']").focus();
        }
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
            self.listStudents(self.group());
        });
    };
/// END STUDENTS CONTROL

    self.listYears();
}