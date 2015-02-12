var marksTypes = [];
var studentColorMin = Color("#FDD").lighten(0.03);
var studentColorMax = Color("#89EB04").lighten(0.5);

// create modal discipline for adding purposes
define(['knockout', 'app/lesson', 'app/mark', 'app/student', 'app/discipline', 'app/markselector'],
    function (ko, Lesson, Mark, Student, Discipline, MarkSelector) {
        return function (data) {
            var self = this;

            self.init = function () {
                self.loadDisciplines().done(function () {
                    self.loadYears().done(function () {

                        var lastDisciplineId = $.cookie(self.cookie.discipline_id);
                        var lastYear = $.cookie(self.cookie.year);

                        // set year and discipline
                        for (var i = 0; i < self.disciplines().length; ++i) {
                            var disc = self.disciplines()[i];
                            if (disc.id == lastDisciplineId) {
                                self.discipline(disc);
                                break;
                            }
                        }

                        self.year.subscribe(function () {
                            self.check_block(function () {
                                if (self.year() && self.discipline()) {
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
                                if (self.discipline()) {
                                    $.cookie(self.cookie.discipline_id, self.discipline().id, {expires: self.cookie.expires});
                                }
                                self.loadGroups();
                            });
                        });

                        var contains_year = self.years().some(function (item) {
                            return item.year == lastYear;
                        });
                        if (contains_year) {
                            self.year(lastYear);
                        } else if (self.years().length > 0) {
                            self.year(self.years()[0].year);
                        }

                    })
                });
            };

// SERVICE VARIABLES
            self.url = { // urls
                years: data.url.years,
                groups: data.url.groups,
                students: data.url.students,
                students_control: data.url.students_control,
                disciplines: data.url.disciplines,
                discipline_add: data.url.discipline_add,
                discipline_edit: data.url.discipline_edit,
                discipline_remove: data.url.discipline_remove,
                lesson_add: data.url.lesson_add,
                lesson_remove: data.url.lesson_remove,
                lesson_save: data.url.lesson_save,
                marks_save: data.url.marks_save,
                to_excel: data.url.to_excel,
                reset_cache: data.url.reset_cache
            };

            self.cookie = { // cookie names
                year: "year",
                group_id: "group_id",
                discipline_id: "discipline_id",
                sorting: 'students-sorting',
                score_method: 'score-method',
                expires: 7 // days
            };

            self.marksTypes = ko.observableArray();
            self.hideBadStudents = ko.observable(true);

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
            self.students_control = ko.observableArray();
            self.student = ko.observable();

            self.disciplines = ko.observableArray();
            self.discipline = ko.observable();

            self.lessons = ko.observableArray();
            self.lesson_types = ko.observableArray();
            self.lesson = ko.observable(new Lesson({}));

            self.markSelector = new MarkSelector("#mark-selector", self.marksTypes);

// >>> SUBSCRIPTIONS
//            self.year.subscribe(function () {
//                self.check_block(function () {
//                    if (self.year() && self.discipline()) {
//                        self.loadGroups();
//                    }
//                });
//            });
//
//            self.group.subscribe(function () {
//                self.check_block(function () {
//                    if (self.group()) {
//                        self.loadStudents();
//                    } else {
//                        self.students([]);
//                    }
//                });
//            });
//
//            self.discipline.subscribe(function () {
//                self.check_block(function () {
//                    if (self.discipline()) {
//                        $.cookie(self.cookie.discipline_id, self.discipline().id, {expires: self.cookie.expires});
//                    }
//                    self.loadGroups();
//                });
//            });

// >>> LOADING FUNCTIONS
            self.loadYears = function () {
                //if (self._block) return;
                //self.block();
                self.years.length = 0;
                return $.get(self.url.years, {}, self.years).success(function (data) {
                });
            };

            self.loadGroups = function () {
                if (self._block) return;
                self.block();
                self.groups.removeAll();
                $.get(self.url.groups, {
                    'year': self.year() || 0,
                    'discipline_id': self.discipline().id
                }, self.groups).done(function (data) {
                    $.cookie(self.cookie.year, self.year(), {expires: self.cookie.expires});
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
                }).always(function () {
                    self.unblock();
                })
            };

            self.loadStudents = function () {
                if (self._block) return;
                self.block();
                self.students.removeAll();
                self.isStudentsLoading(true);

                setTimeout(function () {
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

                        var i = -1;

                        function add_item() {
                            if (i == -1) {
                                self.students.removeAll();
                                setTimeout(add_item, 0);
                                ++i;
                            }
                            if (i < data.students.length) {
                                var item = data.students[i];
                                ++i;
                                item.lessons = self.lessons;
                                self.students.push(new Student(item));
                                setTimeout(add_item, 0);
                            } else {
                                self.sortMethod(self.sortMethods[$.cookie(self.cookie.sorting)]);
                                $.cookie(self.cookie.group_id, self.group().id, {expires: self.cookie.expires});
                                self.isStudentsLoading(false);
                                self.resetMarksInterface();
                            }
                        }

                        if (data.students.length > 0) {
                            add_item();
                        }

                    }).always(function () {
                        self.unblock();
                    }).fail(function () {
                        self.isStudentsLoading(false);
                        self.resetMarksInterface();
                    });
                }, 60);
            };

            self.loadStudentsControl = function () {
                window.location = self.url.students_control + '?' + $.param([
                    {name: 'year', value: self.year()},
                    {name: 'discipline_id', value: self.discipline().id},
                    {name: 'k', value: 0.5}
                ])
            };

            self.loadDisciplines = function () {
                self.disciplines.removeAll();
                return $.get(self.url.disciplines).done(function (data) {
                    for (var i = 0; i < data.length; ++i) {
                        var disc = new Discipline(data[i], self);
                        self.disciplines.push(disc);
                    }

                }).fail(function () {
                    InterfaceAlerts.showFail();
                });
            };


// ### РЕИНИЦИЛИЗАЦИЯ ИНТЕРФЕЙСА
            self.resetMarksInterface = function () {
                $('thead [data-toggle="tooltip"]').tooltip({placement: "bottom"});
                $('tfoot [data-toggle="tooltip"]').tooltip({placement: "top"});
                //$('.student [data-toggle="tooltip"]').tooltip({placement: "top"});

// подключаем события, чтобы не закрывалась менюшка
                $('.modal-lesson-editor .dropdown-menu').bind('click', function (e) {
                    e.stopPropagation()
                });

// ### всплывающее меню редактирование занятия
//            console.log($(".lesson-edit").qtip());
                $(".lesson-edit").qtip({
                    content: {
                        text: "",
                        title: function () {
                            return 'Занятие';
                        }
                    },
                    position: {
                        my: 'top center',
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
                $("table.table-marks>tbody>tr").hover(function () {
                    var index = $(this).index();
                    $("table.table-marks>tbody").each(function (i, item) {
                        $($(item).find(">tr")[index]).addClass("hover");
                    });
                }, function () {
                    var index = $(this).index();
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

// >>> ЗАГРУЗКА ДАННЫХ
            self.isStudentsLoading = ko.observable(true);
            self.showLoading = ko.computed(function () {
                return self.group() && (self.isStudentsLoading() || (self.students && self.students().length == 0));
            });


// >>> СОРТИРОВКА
            self.sortByStudentsMark = function (left, right) {
                return left.sum() == right.sum() ? 0 : left.sum() < right.sum() ? 1 : -1;
            };
            self.sortByStudentsMark.title = "По цвету";

            self.sortByStudentsName = function (left, right) {
                var s1 = left.sum() >= 0 ? 1 : -1;
                var s2 = right.sum() >= 0 ? 1 : -1;

                // студенты с отрицательными оценками идут в конце
                if (left.second_name < right.second_name) {
                    return s1 == s2 ? -1 : s1 < s2 ? 1 : -1;
                } else if (left.second_name > right.second_name) {
                    return s1 == s2 ? 1 : s1 < s2 ? 1 : -1;
                } else {
                    return 0;
                }
            };
            self.sortByStudentsName.title = "По имени";

            self.sortMethods = {};
            self.sortMethods[self.sortByStudentsMark.title] = self.sortByStudentsMark;
            self.sortMethods[self.sortByStudentsName.title] = self.sortByStudentsName;
            self.sortMethods['undefined'] = self.sortByStudentsName;

            self.sortMethod = ko.observable();
            self.sortMethod.subscribe(function () {
                if (self.sortMethod()) {
                    self.students.sort(self.sortMethod());
                }
            });
            self.toggleStudentsSorting = function () {
                self.sortMethod(self.sortMethod() == self.sortByStudentsMark ?
                    self.sortByStudentsName : self.sortByStudentsMark);
                $.cookie(self.cookie.sorting, self.sortMethod().title, {expires: self.cookie.expires});
            };

/// >>> ОТОБРАЖЕНИЕ ОЦЕНОК
            self.showPercents = ko.observable($.cookie(self.cookie.score_method) !== 'false');
            self.scoreMethod = ko.computed(function () {
                return self.showPercents() ? "в процентах" : "в баллах"
            }, self.showPercents);
            self.toggleScorePercents = function () {
                self.showPercents(!self.showPercents());
                $.cookie(self.cookie.score_method, self.showPercents(), {expires: self.cookie.expires});
            };

            self.toggleBadStudentHiding = function () {
                self.hideBadStudents(!self.hideBadStudents());
            };


// >>> DISCIPLINES CONTROL
            self.addDiscipline = function () {
                var d = new Discipline({
                    id: '-1',
                    title: 'без названия'
                }, self);
                self.disciplines.push(d);
                self.discipline(d);
                d.add(function () {
                    self.loadDisciplines();
                });
            };

            self.editDiscipline = function () {
                if (self.discipline().id) {
                    self.discipline().editDiscipline();
                }
            };

            self.toggleDiscipline = function () {
                if (self.discipline()) {
                    self.discipline().toggleDiscipline();
                }
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
                    multiplier: data.multiplier(),
                    description_raw: data.description_raw(),
                    score_ignore: data.score_ignore(),
                    icon_id: data.icon_id() == null ? -1 : data.icon_id()
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

            self.toExcel = function (data, e) {
                window.location = self.url.to_excel + '?' + $.param([
                    {name: 'group_id', value: self.group().id},
                    {name: 'discipline_id', value: self.discipline().id},
                ]);
            };

            self.resetCache = function (date, e) {
                $.get(self.url.reset_cache).done(function () {
                    window.location.reload();
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

//add model to global namespace
        //window.MarksViewModel = MarksViewModel;
    });

