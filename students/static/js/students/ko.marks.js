// create modal discipline for adding purposes
(function () {

    var marksTypes = [];
    var studentColorMin = Color("#FDD").lighten(0.03);
    var studentColorMax = Color("#0F0").lighten(0.5);


// >>> селектор оценки

    function MarkSelector(selector, markTypes) {
        var self = this;
        self.mark_selector = $(selector);
        self.type = ko.observable();
        self.mark = null;

        var visible = false;

        self.show = function (mark, target) {
            self.mark = mark;
            var offset = $(target).offset();
            var width = target.clientWidth * 1.1;
            var height = target.clientHeight;
            var index = $.map(self.mark_types(), function (item) {
                return item.k;
            }).indexOf(mark.mark());
            self.mark_selector.show().offset({
                left: offset.left,
                top: offset.top - height * (index)
            }).find("li").css({
                width: width,
                height: height
            });


            if (self.mark && self.mark.student) {
                self.mark.student.toggleActive(true);
            }

            visible = true;

            self.mark_selector.find(".mark").removeClass("exam test current");
            self.mark_selector.find(".mark").toggleClass(mark.lesson.style(), true);
            self.mark_selector.find(".mark." + marksTypes[mark.mark()]).toggleClass("current", true);
        };

        self.close = function () {
            visible = false;
            self.mark_selector.hide();
            if (self.mark && self.mark.student) {
                self.mark.student.toggleActive(false);
            }
        };

        self.init = function () {
            $("body").click(function () {
                if (visible) {
                    self.close();
                }
            });
            $(document).keypress(function (e) {
                if (e.keyCode == 27) {
                    self.close();
                }
            })
        };

        self.mark_types = markTypes;

        self.setMark = function (data) {
            self.mark.mark(data['k']);
            self.close();
        };

        self.init();
    }

// >>> модальное окно управления дисциплиной
    ModalAddDiscipline.prototype = new ModalConfirm({ prototype: true });
    ModalAddDiscipline.prototype.constructor = ModalConfirm;
    function ModalAddDiscipline() {
        var self = this;

        self.title = ko.observable('');
        arguments[0].custom_modal_body = [
            '<form class="form" data-bind="submit: function() {}">',
            '<input class="form-control" data-bind="value: title" />',
            '</form>'
        ].join("\n");

        ModalConfirm.apply(this, arguments);
    }

// >>> DATE FORMATING
    Date.prototype.ddmmyyyy = function () {
        var yyyy = this.getFullYear().toString();
        var mm = (this.getMonth() + 1).toString(); // getMonth() is zero-based
        var dd = this.getDate().toString();

        return (dd[1] ? dd : "0" + dd[0]) + '/' + (mm[1] ? mm : "0" + mm[0]) + '/' + yyyy;
    };

// >>> MARK CLASS
    function Mark(data) {
        var self = this;
        self.student_id = data.sid;
        self.student = data.student;
        self.mark_id = data.mid;
        self.lesson_id = data.lid;
        self.mark = ko.observable(data.m);
        self.mark_old = ko.observable(data.m);
        self.lesson = data.lesson;

        var last_mark = data.m;
        self.mark.subscribe(function () {
            if (self.student) {
                var sum = self.student.sum();
                console.log(sum);
                sum += self.mark() - last_mark;
                last_mark = self.mark();
                self.student.sum(sum);
            }
        });

        self.mark_text = ko.computed(function () { // надпись оценки
            return ""
        }, self.mark);

        self.mark_class = ko.computed(function () {
            var cls = marksTypes[self.mark()];
            cls += self.mark() != self.mark_old() ? " modified" : "";
            cls += self.lesson.style() ? (" " + self.lesson.style()) : "";
            return cls
        }, self.mark, self.mark_old);

        self.reset = function () {
            self.mark_old(self.mark());
        };

        self.modified = ko.computed(function () {
            return self.mark() != self.mark_old()
        }, self.mark, self.mark_old);

        self.increase = function () {
            var m = self.mark();
            m = Math.min(m + 1, marksTypes.max);
            self.mark(m);
        };

        self.decrease = function () {
            var m = self.mark();
            m = Math.max(m - 1, marksTypes.min);
            self.mark(m);
        };
    }

// >>> STUDENT CLASS
    function Student(data) {
        var self = this;
        self.id = data.id;
        self.name = data.name;
        self.sum = ko.observable(data.sum);
        self.second_name = data.second_name;

        self.marks = $.map(data.marks, function (item) {
            data.lessons().every(function (lesson) {
                if (lesson.id == item.lid) {
                    item.lesson = lesson;
                    return false;
                }
                return true;
            });
            item.student = self;
            item.m = item.m ? item.m : 0; // значение
            return new Mark(item);
        });

        self.color = ko.computed(function () {
            if (self.sum() != 0) {
                var max = self.marks.length * marksTypes.max;
                var min = self.marks.length * marksTypes.min;
                var diff = (max - min);
                var k = 1 - self.sum() / diff;
                var clr = studentColorMax.clone();
                clr.mix(studentColorMin, k * k * k);

                return {
                    backgroundColor: clr.hexString()
                };
            }
            return {};
        });

        var __active = ko.observable(false);
        self.toggleActive = function (active) {
            __active(active);
        };

        self.style = ko.computed(function () {
            return __active() ? "active" : "";
        }, __active);

        self.modified_marks = function () {
            return $.grep(self.marks, function (item) {
                return item.modified();
            });
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

        self.date = ko.observable(self.convert_date(data.dt));
        self.lesson_type = ko.observable(data.lt);
        self.description = ko.observable(data.dn);
        self.description_raw = ko.observable(data.dn_raw);
        self.isodate_old = data.dt;
        self.id = data.id;

        self.day = ko.computed(function () {
            return self.date().split('/')[0];
        }, self.date);

        self.info = ko.computed(function () {
            return "<p><p align=left>" + self.date() + "<p>" + self.description();
        }, self.description);

        self.style = ko.computed(function () {
            switch (self.lesson_type()) {
                case 2:
                    return "test";
                case 3:
                    return "exam";
            }
            return "";

        }, self.lesson_type);

        self.isodate = ko.computed(function () {
            var date = new Date(self.isodate_old);
            var items = self.date().split('/');
            return items[2] + "-" + items[1] + "-" + items[0];

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

        self.marksTypes = ko.observableArray();

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
        self.lesson = ko.observable(new Lesson({}));

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

        self.markSelector = new MarkSelector("#mark-selector", self.marksTypes);

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
                    self.students([]);
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
                var c_year = $.cookie(self.cookie.year);
                var contains_year = self.years().some(function (item) {
                    return item.year == c_year;
                });
                if (contains_year) {
                    self.year(c_year);
                } else if (self.years().length > 0) {
                    self.year(self.years()[0].year);
                }
            })
        };

        self.loadGroups = function () {
            self.block();
            $.get(self.url.groups, { 'year': self.year() }, self.groups).done(function (data) {
                $.cookie(self.cookie.year, self.year(), { expires: self.cookie.expires });
                var group_id = $.cookie(self.cookie.group_id);
                self.groups.sort(function (left, right) {
                    return left.title == right.title ? 0 : left.title < right.title ? -1 : 1;
                });
                self.unblock();
                if (self.groups().every(function (entry) {
                    if (group_id == entry.id) {
                        self.group(entry);
                        return false;
                    }
                    return true;
                })) {
                    if (self.groups().length) {
                        self.group(self.groups()[0]);
                    } else {
                        self.group(null);
                    }
                }
            })
        };

// ### РЕИНИЦИЛИЗАЦИЯ ИНТЕРФЕЙСА
        self.resetMarksInterface = function () {
            $('thead [data-toggle="tooltip"]').tooltip({ placement: "bottom" });
            $('tfoot [data-toggle="tooltip"]').tooltip({ placement: "top" });

// подключаем события, чтобы не закрывалась менюшка
            $('.modal-lesson-editor .dropdown-menu').bind('click', function (e) {
                e.stopPropagation()
            });

// ### всплывающее меню редактирование занятия
            $(".lesson-edit").qtip({
                content: {
                    text: "",
                    title: function () {
                        return 'Занятие';
                    }
                },
                position: {
                    my: 'top center'
                },
                show: {
                    solo: true,
                    event: "click",
                    effect: function () {
                        $(this).fadeIn(120); // "this" refers to the tooltip
                    }
                },
                hide: {
                    fixed: true,
                    event: null,
                    effect: function () {
                        $(this).fadeOut(120); // "this" refers to the tooltip
                    }
                },
                style: {
                    classes: 'qtip-bootstrap'
                },
                events: {
                    show: function (event, api) {
                        // подключаем форму к тултипу
                        var tag = $("#template-lesson-edit");
                        api.set('content.text', tag);

                        // событие внутри формы не закрывает окно
                        var that = this;
                        $(that).on("click", function (event) {
                            event.stopPropagation();
                        });

                        // инициализируем календарь
                        $(that).find(".lesson-date").pickmeup_twitter_bootstrap({
                            hide_on_select: true,
                            format: 'd/m/Y',
                            hide: function (e) {
                                $(this).trigger('change');
                            }
                        });

                        var clickEvent = function () {
                            $(that).unbind("click");
                            $(that).qtip("hide");
                        };
                        // события клика по кнопки сохранить
                        $(that).find(".delete, .save").on("click", clickEvent);
                        // событие клика вне формы
                        $(document).one("click", clickEvent);
                    }
                }
            });
// --- конец всплывающее меню редактирование занятия

// ### синхронизация подсветки строк таблицы оценок
            $("table.table-marks>tbody>tr>td").hover(function () {
                var index = $(this).closest('tr').index();
                $("table.table-marks>tbody").each(function (i, item) {
                    $($(item).find(">tr")[index]).addClass("hover");
                });
            }, function () {
                var index = $(this).closest('tr').index();
                $("table.table-marks>tbody").each(function (i, item) {
                    $($(item).find(">tr")[index]).removeClass("hover");
                });
            });
// --- конец синхронизация подсветки строк таблицы оценок

// ### скроллинг мышью таблицы оценок
            var lastX = -1;
            var leftButtonDown = false;
            var scroll_container = $(".marks-list");
            var funcScroll = function (e) {
                var left = e.clientX;
                if (leftButtonDown) {
                    if (lastX != -1 && Math.abs(lastX - left) > 2) {
                        this.scrollLeft += lastX - left;
                        $.cookie("lastScroll", this.scrollLeft);
                    }
                }
                lastX = left;
            };
            scroll_container.mousedown(function (e) {
                if (e.which === 1) leftButtonDown = true;
            });
            $(document).mouseup(function (e) {
                leftButtonDown = false;
            });
            scroll_container.on("touchmove, mousemove", funcScroll);

            // восстановления последнего скролла значения из куков
            if (scroll_container.size() && $.cookie("lastScroll")) {
                scroll_container[0].scrollLeft = $.cookie("lastScroll");
            }
// --- конец скроллинг мышью таблицы оценок
        };
// КОНЕЦ РЕИНИЦИАЛИЗАЦИИ ИНТЕРФЕЙСА

        self.isStudentsLoading = ko.observable(true);
        self.loadStudents = function () {
            self.isStudentsLoading(true);
            $.get(self.url.students, {
                'group_id': self.group().id,
                'discipline_id': self.discipline() ? self.discipline().id : -1
            }).done(function (data) {
                // fill lesson_types list
                self.lesson_types(data.lesson_types);

                // fill mark types, and find max and min value at the same time
                marksTypes = {};
                self.marksTypes(data.mark_types);
                data.mark_types.every(function (item) {
                    marksTypes[item['k']] = item['v'];
                    if (!marksTypes.max < parseInt(item['k'])) {
                        marksTypes.max = parseInt(item['k']);
                    }
                    if (!marksTypes.min > parseInt(item['k'])) {
                        marksTypes.min = parseInt(item['k']);
                    }
                    return true
                });

                // fill lessons list
                var map_lessons = $.map(data.lessons, function (item) {
                    return new Lesson(item);
                });
                self.lessons(map_lessons);

                // map students list
                var map_students = $.map(data.students, function (item) {
                    item.lessons = self.lessons;
                    return new Student(item);
                });
                self.students(map_students);
                self.sortMethod(self.sortByStudentsName);

                $.cookie(self.cookie.group_id, self.group().id, { expires: self.cookie.expires });
            }).always(function () {
                self.isStudentsLoading(false);
                self.resetMarksInterface();
            });
        };

        self.loadDisciplines = function () {
            $.get(self.url.disciplines, {

            }, self.disciplines).fail(function () {
                InterfaceAlerts.showFail();
            })
        };

// >>> STUDENTS CONTROL
        self.sortByStudentsMark = function (left, right) {
            return left.sum() == right.sum() ? 0 : left.sum() < right.sum() ? 1 : -1;
        };
        self.sortByStudentsMark.title = "Цвет";

        self.sortByStudentsName = function (left, right) {
            return left.sum == right.second_name ? 0 : left.second_name < right.second_name ? -1 : 1;
        };
        self.sortByStudentsName.title = "Имя";

        self.sortMethod = ko.observable();
        self.sortMethod.subscribe(function () {
            if (self.sortMethod()) {
                self.students.sort(self.sortMethod());
            }
        });
        self.toggleStudentsSorting = function () {
            self.sortMethod(self.sortMethod() == self.sortByStudentsMark ?
                self.sortByStudentsName : self.sortByStudentsMark);
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
        self.lessonHover = function (data) {
            self.lesson(data);
        };

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
                    self.loadStudents();
                }).fail(function () {
                    InterfaceAlerts.showFail();
                });
            });
        };

        self.saveLesson = function (data) {
            $.post(self.url.lesson_save, self.csrfize({
                lesson_id: data.id,
                lesson_type: data.lesson_type(),
                date: data.isodate(),
                description_raw: data.description_raw()
            })).done(function (response) {
                if (data.isodate() != data.isodate_old) {
                    self.loadStudents();
                } else {
                    data.description(response.description);
                    data.description_raw(response.description_raw);
                }
                InterfaceAlerts.showSuccess();
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
            if ($.clickMouseMoved()) {
                return false;
            }
            setTimeout(function () {
                self.markSelector.show(data, e.target);
            }, 10);
            return false;
        };

        self.increase = function (mark) {
            mark.increase();
        };

        self.decrease = function (mark) {
            mark.decrease();
        };

        self.init();
    }

// add model to global namespace
    window.MarksViewModel = MarksViewModel;
}());
