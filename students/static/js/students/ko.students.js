function Student(data) {
    var self = this;
    self.id = data.id;
    self.name = ko.observable(data.name);
    self.second_name = ko.observable(data.second_name);
    self.phone = ko.observable(data.phone);
    self.vk = ko.observable(data.vk);
    self.email = ko.observable(data.email);
    self.group_id = data.group_id;
    self.photo = ko.observable(data.photo);

    self.old_name = ko.observable(data.name);
    self.old_second_name = ko.observable(data.second_name);
    self.old_phone = ko.observable(data.phone);
    self.old_vk = ko.observable(data.vk);
    self.old_email = ko.observable(data.email);
    self.old_group_id = data.group_id;


    self.modified = ko.computed(function () {
        return self.old_name() != self.name()
            || self.old_second_name() != self.second_name()
            || self.old_vk() != self.vk()
            || self.old_email() != self.email()
            || self.old_phone() != self.phone()
            || self.old_group_id != self.group_id
    });

    self.reset = function () {
        self.old_name(self.name());
        self.old_second_name(self.second_name());
        self.old_phone(self.phone());
        self.old_vk(self.vk());
        self.old_email(self.email());
        self.old_group_id = self.group_id;
    };

    self.changePhoto = function (form) {

        var input_file = $(form).find("input[type=file]");
        input_file.unbind();

        input_file.change(function () {
            var formData = new FormData(form);
            console.log(formData);
            $.ajax({
                url: form.action,
                type: "POST",
                data: formData,
                async: false,
                cache: false,
                contentType: false,
                processData: false
            }).success(function (new_url) {
                self.photo(new_url);
                InterfaceAlerts.showSuccess();
            });
        });
        input_file.click();
    }
}

function Group(data) {
    var self = this;
    self.id = data.id;
    self.title = ko.observable(data.title);
    self.year = ko.observable(data.year);
    self.has_ancestor = data.has_ancestor;
    self.captain = ko.observable(data.captain);

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


function StudentViewModel(data, modal_selector) {
    var self = this;

    self.yearsList = ko.observableArray();
    self.groupsList = ko.observableArray();
    self.studentsList = ko.observableArray();

    self.year = ko.observable();
    self.group = ko.observable();

    self.url = {
        years: data.url.years,
        groups: data.url.groups,
        students: data.url.students,
        save_groups: data.url.save_groups,
        save_students: data.url.save_students,
        set_captain: data.url.set_captain
    };

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

    // subscribes blocking control
    self._block = false;
    self.block = function () {
        self._block = true
    };
    self.unblock = function () {
        self._block = false
    };
    self.check_block = function (func) {
        if (!self._block)
            return func();
        return null;
    };
    // end subscribes blocking control

    self.modalConfirm = new ModalConfirm({
        variable_name: 'modalConfirm'
    });

    function csrfize(data) {
        data.csrfmiddlewaretoken = $.cookie('csrftoken');
        return data;
    }


/// YEARS CONTROL
    self.year.subscribe(function () {
        self.check_block(function () {
            self.group(null);
            self.listGroups(self.year);
        })
    });

    self.listYears = function () {
        self.block();
        $.get(self.url.years, {}, self.yearsList).done(function () {
            self.unblock();
            if ($.cookie("year"))
                self.year($.cookie("year"));
        });
    };
/// END YEARS CONTROL

/// GROUPS CONTROL
    self.listGroups = function (year) {
        self.block();
        $.get(self.url.groups, {year: year}).done(function (data) {

            var mapped_data = $.map(data, function (item) {
                return new Group(item);
            });
            self.groupsList(mapped_data);

            // restore last group from cookies
            self.group(null);
            self.unblock();
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

            $.cookie("year", self.year(), { expires: 7 });
            self.newGroup.year(self.year());
        });
    };

    // позволяет сформировать и закачать xlsx список студентов
    self.downloadStudentsList = function (url) {
        window.location = url + "?year=" + self.year();
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

        var groups_json = JSON.stringify(json);

        $.post(self.url.save_groups, csrfize({
            groups: groups_json
        })).success(function (data) {
            self.listGroups($.cookie("year"));
        });
    };


    self.copyGroupToNextYear = function (form, group) {
        $.post(form.action, csrfize({
            group_id: group['id']
        })).success(function () {
            self.listGroups($.cookie("year"));
        });
    };

    self.setAsCaptain = function (data) {
        $.post(self.url.set_captain, csrfize({
            student_id: data.id,
            group_id: self.group().id
        })).done(function () {
            self.group().captain(data.id);
            InterfaceAlerts.showSuccess();
        }).fail(function () {
            InterfaceAlerts.showFail();
        });
    };

/// END GROUPS CONTROL

/// STUDENTS CONTROL
    self.listStudents = function (group) {
        $.get(self.url.students, {group_id: group['id']}).done(function (data) {
            var mapped_data = $.map(data, function (item) {
                return new Student(item);
            });
            $.cookie("group_id", group['id'], { expires: 7 });
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

        var students_json = JSON.stringify(json);

        $.post(self.url.save_students, csrfize({
            students: students_json
        })).success(function () {
            self.listStudents(self.group());
        });
    };
/// END STUDENTS CONTROL

    self.listYears();
}