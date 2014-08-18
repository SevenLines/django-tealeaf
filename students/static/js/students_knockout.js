function ModalConfirm(modal_selector, message) {
    // modal form should be bind to the bootstrap modal form:
    //
    //    <div id="main-modal-form" class="modal fade modal_remove" role="dialog">
    //        <div class="modal-footer">
    //            <button type="button" class="btn btn-danger" data-confirm data-dismiss="modal">Yes</button>
    //            <button type="button" class="btn btn-default" data-decline data-dismiss="modal">No</button>
    //        </div>
    //    </div>
    //
    // create new field in model:
    //
    //      self.modalConfirm = new ModalConfirm("#main-modal-form")
    //
    // Call to show dialog:
    //
    //      self.modalConfirm.show(function() { console.log("Yes pressed") }, function() { console.log("no") })
    //
    // You can omit second argument and implement only confirm event.
    // click on button with "data-confirm" attribute bind to confirm event (first param in show function)
    // click on button with "data-decline" attribute bind to decline event (second param in show function)
    //

    var self = this;
    self.message = ko.observable(message);

    self.callback_confirm = null;
    self.callback_decline = null;

    self.init_events = function () {
        $(modal_selector).find("[data-confirm]").click(function () {
            if (self.callback_confirm)
                self.callback_confirm();
        });
        $(modal_selector).find("[data-decline]").click(function () {
            if (self.callback_decline)
                self.callback_decline();
        })
    };

    self.show = function (callback_confirm, callback_decline) {
        self.callback_confirm = callback_confirm === undefined ? null : callback_confirm;
        self.callback_decline = callback_decline === undefined ? null : callback_decline;
        $(modal_selector).modal("show");
    };

    self.init_events();
}


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


function StudentViewModel(default_values, modal_selector, url_years, url_groups, url_students, url_save_students, url_save_groups) {
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

            // событие чтобы не закрывалась менюшка
            $('.groups-nav .dropdown-menu').bind('click', function (e) {
                e.stopPropagation()
            });

            $.cookie("year", self.year());
            self.newGroup.year(self.year());
        });
    };

    self.addGroup = function () {
        console.log(ko.toJS(self.newGroup));
        self.groupsList.push(new Group(ko.toJS(self.newGroup)));
        self.saveGroups();
    };

    self.removeGroup = function (group) {
        self.modalConfirm.message("Удалить группу?<h2>" + group.title() + "</h2>");
        self.modalConfirm.show(function () {
            if (group.id === -1) {
                self.groupsList.remove(group);
                return
            }
            self.groupsList.destroy(group);
            self.saveGroups();
        });
    };

    self.saveGroups = function () {
        console.dir(ko.toJS(self.groupsList));
        var json = $.grep(ko.toJS(self.groupsList), function (item) {
            return item.modified || item._destroy || item.id === -1;
        });

        if (json.length === 0)
            return;

        groups_json = JSON.stringify(json);

        $.post(url_save_groups, {
            csrfmiddlewaretoken: $.cookie('csrftoken'),
            groups: groups_json
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
        });
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
            self.listStudents(self.group());
        });
    };
/// END STUDENTS CONTROL

    self.listYears();
}