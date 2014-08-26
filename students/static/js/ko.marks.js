// create modal discipline for adding purposes
(function () {
// >>> модальное окно управления дисциплиной
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

// >>> DATE FORMATING
    Date.prototype.ddmmyyyy = function() {
        var yyyy = this.getFullYear().toString();
        var mm = (this.getMonth()+1).toString(); // getMonth() is zero-based
        var dd  = this.getDate().toString();

        return (dd[1]?dd:"0"+dd[0]) + '/' + (mm[1]?mm:"0"+mm[0]) + '/' + yyyy ;
   };

// >>> MARK CLASS
    function Mark(data) {
        var self = this;
        self.student_id = data.student_id;
        self.mark_id = data.mark_id;
        self.lesson_id = data.lesson_id;
        self.mark = ko.observable(data.mark !== null ? data.mark : 1);
        self.mark_old = ko.observable(data.mark !== null ? data.mark : 1);

        self.mark_text = ko.computed(function () { // надпись оценки
            switch (self.mark()) {
                case 0:
                    return "н";
//                case 2:
//                    return "∓";
//                case 3:
//                    return "±";
//                case 4:
//                    return "+";
            }
            return ""
        }, self.mark);

        self.mark_class = ko.computed(function () {
            var cls = "";
            switch (self.mark()) {
                case 0:
                    cls = "absent";
                    break;
                case 2:
                    cls = "quater";
                    break;
                case 3:
                    cls = "half";
                    break;
                case 4:
                    cls = "full";
                    break;
            }
            cls += self.mark() != self.mark_old() ? " modified" : "";
            return cls
        }, self.mark, self.mark_old);

        self.reset = function () {
            self.mark_old(self.mark());
        };

        self.modified = ko.computed(function () {
            return self.mark() != self.mark_old()
        }, self.mark, self.mark_old);
    }

// >>> STUDENT CLASS
    function Student(data) {
        var self = this;
        self.id = data.id;
        self.name = data.name;
        self.second_name = data.second_name;

        self.marks = $.map(data.marks, function (item) {
            return new Mark(item);
        });

        self.modified_marks = function () {
            var marks = $.grep(self.marks, function (item) {
                return item.modified();
            });
            return marks
        };

        self.reset = function () {
            self.marks.every(function (item) {
                item.reset();
                return true
            });
        }
    }

// >>> LESSON CLASS
    function Lesson(data) {
        var self = this;
        self.convert_date = function (isodate) {
            var date = new Date(isodate);
            return date.ddmmyyyy();
        };

        self.date = ko.observable(self.convert_date(data.isodate));
        self.lesson_type = ko.observable(data.lesson_type);
        self.description = ko.observable(data.description);
        self.isodate_old = data.isodate;
        self.id = data.id;

        self.setDate = function(e) {
            console.log(e);
        };

        self.isodate = ko.computed(function () {
            var date = new Date(self.isodate_old);
            var items = self.date().split('/');
            date.setFullYear(items[2], parseInt(items[1])-1, parseInt(items[0]));
            console.log(date);
            return date.toISOString();

        }, self.date);
    }

// >>> MAIN MODEL
    function MarksViewModel(data) {
        var self = this;

        self.init = function () {
            self.loadYears();
            self.loadDisciplines();
        };

// SERVICE VARIABLES
        self.url = { // urls
            years: data.url.years,
            groups: data.url.groups,
            students: data.url.students,
            disciplines: data.url.disciplines,
            discipline_add: data.url.discipline_add,
            discipline_edit: data.url.discipline_edit,
            discipline_remove: data.url.discipline_remove,
            lesson_add: data.url.lesson_add,
            lesson_remove: data.url.lesson_remove,
            lesson_save: data.url.lesson_save,
            marks_save: data.url.marks_save
        };

        self.cookie = { // cookie names
            year: "year",
            group_id: "group_id",
            expires: 7 // days
        };

// CSRF UTILS
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

// >>> VARIABLES
        self.years = ko.observableArray();
        self.year = ko.observable();

        self.groups = ko.observableArray();
        self.group = ko.observable();

        self.students = ko.observableArray();
        self.student = ko.observable();

        self.disciplines = ko.observableArray();
        self.discipline = ko.observable();

        self.lessons = ko.observableArray();
        self.lesson_types = ko.observableArray();

// >>> MODAL FORMS
        self.modalDeleteDescipline = new ModalConfirm({
            variable_name: 'modalDeleteDescipline',
            header: 'Потдвердите',
            message: 'Удалить дисциплину?'
        });

        self.modalAddDescipline = new ModalAddDiscipline({
            variable_name: 'modalAddDescipline',
            header: 'Дисциплина'
        });

        self.modelRemoveLesson = new ModalConfirm({
            variable_name: "modelRemoveLesson",
            header: "Потдвердите",
            message: "Удалить урок?"
        });

        self.modelEditLesson = new ModalConfirm({
            modal_selector: "#modal-lesson-editor",
            header: "Урок"
        });

// >>> SUBSCRIPTIONS
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

        self.discipline.subscribe(function () {
            self.check_block(function () {
                if (self.group()) {
                    self.loadStudents();
                } else {
                    self.students(null);
                }
            });
        });

// >>> LOADING FUNCTIONS
        self.loadYears = function () {
            self.block();
            $.get(self.url.years, {}, self.years).success(function (data) {
                self.unblock();
                self.year($.cookie(self.cookie.year));
            })
        };

        self.loadGroups = function () {
            self.block();
            $.get(self.url.groups, { 'year': self.year() }, self.groups).done(function (data) {
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
            $.get(self.url.students, {
                'group_id': self.group().id,
                'discipline_id': self.discipline().id
            }).done(function (data) {
                // fill lesson_types list
                self.lesson_types(data.lesson_types);

                // fill lessons list
                var map_lessons = $.map(data.lessons, function (item) {
                    return new Lesson(item);
                });
                self.lessons(map_lessons);

                // map students list
                var map_students = $.map(data.students, function (item) {
                    return new Student(item);
                });
                self.students(map_students);

                $.cookie(self.cookie.group_id, self.group().id, { expires: self.cookie.expires });

                $(".modal-lesson-editor .lesson-date").pickmeup_twitter_bootstrap({
                    hide_on_select: true,
                    format: 'd/m/Y',
                    hide: function (e) {
                        $(this).trigger('change');
                    }
                });

                // подключаем события, чтобы не закрывалась менюшка
                $('.modal-lesson-editor .dropdown-menu').bind('click', function (e) {
                    e.stopPropagation()
                });
            });
        };

        self.loadDisciplines = function () {
            $.get(self.url.disciplines, {

            }, self.disciplines).fail(function () {
                InterfaceAlerts.showFail();
            })
        };


// >>> DISCIPLINES CONTROL
        self.addDiscipline = function () {
            self.modalAddDescipline.header("Создание новой дисциплины");
            self.modalAddDescipline.title("");
            self.modalAddDescipline.show(function () {
                $.post(self.url.discipline_add, self.csrfize({
                    'title': self.modalAddDescipline.title()
                })).done(function () {
                    self.loadDisciplines();
                }).fail(function () {
                    InterfaceAlerts.showFail();
                });
            })
        };

        self.editDiscipline = function () {
            if (!self.discipline().id)
                return;
            self.modalAddDescipline.header('Редактирование дисциплины "' + self.discipline().title + '"');
            self.modalAddDescipline.title(self.discipline().title);
            self.modalAddDescipline.show(function () {
                $.post(self.url.discipline_edit, self.csrfize({
                    'id': self.discipline().id,
                    'title': self.modalAddDescipline.title()
                })).done(function () {
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
                })).done(function () {
                    self.disciplines.remove(self.discipline());
                }).fail(function () {
                    InterfaceAlerts.showFail();
                })
            })
        };

// LESSONS CONTROL
        self.addLesson = function () {
            $.post(self.url.lesson_add, self.csrfize({
                discipline_id: self.discipline().id,
                group_id: self.group().id
            })).done(function () {
                self.loadStudents()
            }).fail(function () {
                InterfaceAlerts.showFail();
            });
        };

        self.removeLesson = function (data) {
            self.modelRemoveLesson.show(function () {
                $.post(self.url.lesson_remove, self.csrfize({
                    lesson_id: data.id
                })).done(function () {
                    self.loadStudents()
                }).fail(function () {
                    InterfaceAlerts.showFail();
                });
            });
        };

        self.saveLesson = function (data) {
            $.post(self.url.lesson_save, self.csrfize({
                lesson_id: data.id,
                lesson_type: data.lesson_type,
                date: data.isodate()
            })).done(function ()  {
                if (data.isodate() != data.isodate_old) {
                    self.loadStudents()
                }
            }).fail(function () {
                InterfaceAlerts.showFail();
            })
        };

// MARKS CONTROL
        self.saveMarks = function () {
            var marks = [];
            for (var i = 0; i < self.students().length; ++i) {
                var mrks = self.students()[i].modified_marks();
                mrks.every(function (item) {
                    marks.push({
                        lesson_id: item.lesson_id,
                        student_id: item.student_id,
                        mark: item.mark()
                    });
                    return true;
                })
            }
            $.post(self.url.marks_save, self.csrfize({
                marks: JSON.stringify(marks)
            })).done(function () {
                for (var i = 0; i < self.students().length; ++i) {
                    self.students()[i].reset();
                }
                InterfaceAlerts.showSuccess()
            }).fail(function () {
                InterfaceAlerts.showFail()
            })

        };

        self.clickMark = function (data, e) {
            if (e.altKey) {
                self.decrease(data);
            } else {
                self.increase(data);
            }
        };

        self.increase = function (data) {
            data.mark(data.mark() ? data.mark() < 4 ? data.mark() + 1 : data.mark() : 1);
        };

        self.decrease = function (data) {
            data.mark(data.mark() > 1 ? data.mark() - 1 : 0);
        };

        self.init();
    }

// add model to global namespace
    window.MarksViewModel = MarksViewModel;
}());

