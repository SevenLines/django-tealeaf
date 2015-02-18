/**
 * Created by m on 13.02.15.
 */
define(['knockout',
        'urls',
        'cookies',
        'utils',
        'marks/lesson',
        'marks/mark',
        'marks/student',
        'marks/markselector'
    ],
    function (ko, urls, cookies, utils, Lesson, Mark, Student, MarkSelector) {
        return function () {
            var self = this;

            self.students = ko.observableArray();
            self.students_control = ko.observableArray();
            self.student = ko.observable();

            self.lessons = ko.observableArray();
            self.lesson_types = ko.observableArray();
            self.lesson = ko.observable();

            self.labs = ko.observableArray();

            self.group_id = 0;
            self.discipline_id = 0;

            self.firstLoadingAfterParametersChanged = ko.observable(true);
// >>> ЗАГРУЗКА ДАННЫХ
            self.isStudentsLoading = ko.observable(true);
            self.showLoading = ko.computed(function () {
                return (self.isStudentsLoading() || (self.students && self.students().length == 0));
            });

            self.showPanel = ko.computed(function () {
                return (self.students().length || self.isStudentsLoading())
                    && !self.firstLoadingAfterParametersChanged();
            });

            self.setParams = function (group_id, discipline_id) {
                self.group_id = group_id;
                //self.firstLoadingAfterParametersChanged(true);
                if (group_id == null) {
                    self.isStudentsLoading(false);
                    //self.onInit(false);
                }
                self.discipline_id = discipline_id;
                self.loadStudents();
            };

            self.setLabs = function (r, labsTable) {
                self.labs = labsTable.labs
            };

            // SERVICE VARIABLES

            self.marksTypes = ko.observableArray();
            self.hideBadStudents = ko.observable(true);

            self.markSelector = new MarkSelector("#mark-selector", self.marksTypes);

            self.loadStudents = function () {
                //if (self._block) return;
                //self.block();
                self.students.removeAll();

                if (!self.group_id)
                    return;

                self.isStudentsLoading(true);

                setTimeout(function () {
                    $.get(urls.url.students, {
                        'group_id': self.group_id,
                        'discipline_id': self.discipline_id
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
                            return new Lesson(item, self);
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
                                self.sortMethod(self.sortMethods[$.cookie(cookies.sorting)]);
                                $.cookie(cookies.group_id, self.group_id, {expires: cookies.expires});
                                self.resetMarksInterface();
                                self.isStudentsLoading(false);
                                self.firstLoadingAfterParametersChanged(false);

                                // open / close marksTable collapse according ot saved state
                                var keep_mark_table_open = $.cookie(cookies.keep_mark_table_open);
                                if (keep_mark_table_open == "false") {
                                    $("#marks-editor").removeClass("in");
                                } else {
                                    $("#marks-editor").addClass("in");
                                }
                            }
                        }

                        if (data.students.length > 0) {
                            add_item();
                        }
                    }).always(function () {
                        //self.onInit(false);
                    }).fail(function () {
                        self.resetMarksInterface();
                    });
                }, 60);
            };

            self.loadStudentsControl = function () {
                window.location = urls.url.students_control + '?' + $.param([
                    {name: 'year', value: self.year()},
                    {name: 'discipline_id', value: self.discipline_id},
                    {name: 'k', value: 0.5}
                ])
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

                // ### скроллинг мышью таблицы оценок
                var lastX = -1;
                var leftButtonDown = false;
                var scroll_container = $(".m-table-container");
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
                $(".m-table>tbody>.t-row").hover(function () {
                    var index = $(this).index();
                    $(this).addClass("hover");
                    $(".m-table>tbody, .s-table>tbody").each(function (i, item) {
                        $($(item).find(">.t-row")[index]).addClass("hover");
                    });
                }, function () {
                    $(this).removeClass("hover");
                    var index = $(this).index();
                    $(".m-table>tbody, .s-table>tbody").each(function (i, item) {
                        $($(item).find(">.t-row")[index]).removeClass("hover");
                    });
                });
// --- конец синхронизация подсветки строк таблицы оценок
            };
// КОНЕЦ РЕИНИЦИАЛИЗАЦИИ ИНТЕРФЕЙСА


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
                $.cookie(cookies.sorting, self.sortMethod().title, {expires: cookies.expires});
            };

/// >>> ОТОБРАЖЕНИЕ ОЦЕНОК
            self.showPercents = ko.observable($.cookie(cookies.score_method) !== 'false');
            self.scoreMethod = ko.computed(function () {
                return self.showPercents() ? "в процентах" : "в баллах"
            }, self.showPercents);
            self.toggleScorePercents = function () {
                self.showPercents(!self.showPercents());
                $.cookie(cookies.score_method, self.showPercents(), {expires: cookies.expires});
            };

            self.toggleBadStudentHiding = function () {
                self.hideBadStudents(!self.hideBadStudents());
            };

            // LESSONS CONTROL
            self.lessonHover = function (data) {
                self.lesson(data);
            };

            self.addLesson = function () {
                $.post(urls.url.lesson_add, utils.csrfize({
                    discipline_id: self.discipline_id,
                    group_id: self.group_id
                })).done(function () {
                    self.loadStudents()
                }).fail(function () {
                    InterfaceAlerts.showFail();
                });
            };

            self.removeLesson = function (data) {
                data.remove(function () {
                    //self.lessons.remove(data);
                    self.loadStudents();
                });
            };

            self.saveLesson = function (data) {
                $.post(urls.url.lesson_save, utils.csrfize({
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
                $.post(urls.url.marks_save, utils.csrfize({
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
                window.location = urls.url.to_excel + '?' + $.param([
                    {name: 'group_id', value: self.group_id},
                    {name: 'discipline_id', value: self.discipline_id},
                ]);
            };

            self.resetCache = function (date, e) {
                $.get(urls.url.reset_cache).done(function () {
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

            self.is_active = ko.computed(function () {
                return self.students().length > 0;
            });
        }
    })
;