// create modal discipline for adding purposes
(function () {
    ModalAddDiscipline.prototype = new ModalConfirm({ prototype: true });
    ModalAddDiscipline.prototype.constructor = ModalConfirm;
    function ModalAddDiscipline() {
        var self = this;

        self.title = ko.observable('');
        arguments[0].custom_modal_body = [
            '<form class="form" data-bind="submit: $root.addDiscipline">',
            '<input class="form-control" data-bind="value: title" />',
            '<button hidden="" type="submit" />',
            '</form>'
        ].join("\n");

        ModalConfirm.apply(this, arguments);
    }

// marks model
    function MarksViewModel(data) {
        var self = this;

        self.init = function () {
            self.loadYears();
            self.loadDisciplines();
        };

        self.url = { // urls
            years: data.url.years,
            groups: data.url.groups,
            students: data.url.students,
            disciplines: data.url.disciplines,
            discipline_add: data.url.discipline_add,
            discipline_edit: data.url.discipline_edit,
            discipline_remove: data.url.discipline_remove
        };

        self.cookie = { // cookie names
            year: "year",
            group_id: "group_id",
            expires: 7 // days
        };

        self.csrf = data.csrf;
        self.csrfize = function (data) {
            data.csrfmiddlewaretoken = self.csrf;
            return data;
        };

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

        self.years = ko.observableArray();
        self.year = ko.observable();

        self.groups = ko.observableArray();
        self.group = ko.observable();

        self.students = ko.observableArray();
        self.student = ko.observable();

        self.disciplines = ko.observableArray();
        self.discipline = ko.observable();


        self.modalDeleteDescipline = new ModalConfirm({
            variable_name: 'modalDeleteDescipline',
            header: 'Потдвердите',
            message: 'Удалить дисциплину?'
        });

        self.modalAddDescipline = new ModalAddDiscipline({
            variable_name: 'modalAddDescipline',
            header: 'Дисциплина'
        });

        self.year.subscribe(function () {
            self.check_block(function () {
                if (self.year()) {
                    self.loadGroups();
                }
            });
        });

        self.group.subscribe(function () {
            self.check_block(function () {
                if (self.group()) {
                    self.loadStudents();
                } else {
                    self.students(null);
                }
            });
        });

        self.loadYears = function () {
            self.block();
            $.get(self.url.years, {}, self.years).success(function (data) {
                self.unblock();
                self.year($.cookie(self.cookie.year));
            })
        };

        self.loadGroups = function () {
            self.block();
            $.get(self.url.groups, { 'year': self.year() }, self.groups).success(function (data) {
                $.cookie(self.cookie.year, self.year(), { expires: self.cookie.expires });
                var group_id = $.cookie(self.cookie.group_id);

                self.unblock();
                if (self.groups().every(function (entry) {
                    if (group_id == entry.id) {
                        self.group(entry);
                        return false;
                    }
                    return true;
                })) {
                    self.group(null);
                }
            })
        };

        self.loadStudents = function () {
            $.get(self.url.students, { 'group_id': self.group().id }, self.students).success(function (data) {
                $.cookie(self.cookie.group_id, self.group().id, { expires: self.cookie.expires });
            });
        };

        self.loadDisciplines = function () {
            $.get(self.url.disciplines, {}, self.disciplines).fail(function () {
                InterfaceAlerts.showFail();
            }).fail(function () {
                InterfaceAlerts.showFail();
            })
        };


        self.addDiscipline = function () {
            self.modalAddDescipline.header("Создание новой дисциплины");
            self.modalAddDescipline.title("");
            self.modalAddDescipline.show(function () {
                $.post(self.url.discipline_add, self.csrfize({
                    'title': self.modalAddDescipline.title()
                })).success(function () {
                    self.loadDisciplines();
                }).fail(function () {
                    InterfaceAlerts.showFail();
                });
            })
        };

        self.editDiscipline = function () {
            if (!self.discipline().id)
                return;
            self.modalAddDescipline.header('Редактирование дисциплины "'+self.discipline().title+'"');
            self.modalAddDescipline.title(self.discipline().title);
            self.modalAddDescipline.show(function () {
                $.post(self.url.discipline_edit, self.csrfize({
                    'id': self.discipline().id,
                    'title': self.modalAddDescipline.title()
                })).success(function () {
                    self.loadDisciplines();
                    InterfaceAlerts.showSuccess();
                }).fail(function () {
                    InterfaceAlerts.showFail();
                });
            })
        };

        self.removeDiscipline = function (data) {
            self.modalDeleteDescipline.message("Удалить дисциплину<h2>" + self.discipline().title + "?</h2>");
            self.modalDeleteDescipline.show(function () {
                $.post(self.url.discipline_remove, self.csrfize({
                    id: self.discipline().id
                })).success(function () {
                    self.disciplines.remove(self.discipline());
                }).fail(function () {
                    InterfaceAlerts.showFail();
                })
            })
        };

        self.init();
    }

    window.MarksViewModel = MarksViewModel;
}());

