// create modal discipline for adding purposes
define(['knockout',
        'cookies',
        'marks/discipline',
        'marks/markstable',
        'labs/labstable',
        'urls',
        'helpers',
        'jquery.cookie'
        //'qtip'
    ],
    function (ko, cookies, Discipline, MarksTable, LabsTable, urls, helpers) {

        return function () {
            var self = this;

            self.marksTable = new MarksTable();
            self.labsTable = new LabsTable();

            self.labs_loading_complete = true;
            self.groups_loading_complete = true;
            self.years_loading_complete = true;

            self.labsTable.onLabsLoadingComplete = function (response, labsTable) {
                self.labs_loading_complete = true;
                self.marksTable.setLabs(response, labsTable);
                self.loadGroups();
            };

            self.updateCookies = function (data, event) {
                $.cookie(cookies.keep_mark_table_open, !$("#marks-editor").hasClass("in"), cookies.expires);
            };

            function Init() {
                // подключение байдингов после загрузки дисциплин и годов
                self.loadDisciplines().done(function () {
                    self.loadYears().done(function () {

                        var lastDisciplineId = $.cookie(cookies.discipline_id);
                        var lastYear = $.cookie(cookies.year);

                        if (self.disciplines().length > 0) {
                            self.labs_loading_complete = false;
                            self.discipline(self.disciplines()[0]);
                            if (lastDisciplineId) {
                                // set year and discipline
                                for (var i = 0; i < self.disciplines().length; ++i) {
                                    var disc = self.disciplines()[i];
                                    if (disc.id == lastDisciplineId) {
                                        self.discipline(disc);
                                        break;
                                    }
                                }
                            }
                            self.labsTable.setParams(self.discipline().id);
                        }

                        self.year.subscribe(function () {
                            if (!self.labs_loading_complete) return;
                            if (self.year() && self.discipline()) {
                                self.loadGroups();
                            } else {
                                self.marksTable.setParams(null, null);
                            }
                        });

                        self.group.subscribe(function () {
                            if (!self.groups_loading_complete) return;
                            var group_id = self.group() ? self.group().id : null;
                            self.marksTable.setParams(group_id, self.discipline().id);
                        });

                        self.discipline.subscribe(function () {
                            self.labs_loading_complete = false;

                            self.marksTable.setParams(null, null);
                            self.groups.removeAll();

                            self.labsTable.setParams(self.discipline().id);
                            if (self.discipline()) {
                                $.cookie(cookies.discipline_id, self.discipline().id, {expires: cookies.expires});
                            }
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

            self.visibleStudent = function (student) {
                return ko.pureComputed(function () {
                    return student.regularStudent()
                    //|| self.labsTable.labs().length == 0
                    || self.labsTable.hasLabsForStudent(student)()
                });
            };

            self.taskPercentsComplete = function (task) {
                return ko.pureComputed(function () {
                    var students_count = self.marksTable.students().length;
                    var counter = 0;
                    for (var s in task.lab.marks) {
                        for (var t in task.lab.marks[s]) {
                            if (parseInt(t) == task.id) {
                                var mark = task.lab.marks[s][t];
                                if (mark.group == self.group().id) {
                                    ++counter;
                                    break;
                                }
                            }
                        }
                    }
                    return counter / students_count;
                });
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

            self.disciplines = ko.observableArray();
            self.discipline = ko.observable();

// >>> LOADING FUNCTIONS
            self.loadYears = function () {
                //if (self._block) return;
                //self.block();
                if (!self.years_loading_complete) return;
                self.years_loading_complete = false;
                self.years.length = 0;
                return $.get(urls.url.years, {}, self.years).done(function (data) {
                    self.years_loading_complete = true;
                });
            };

            self.loadGroups = function (done) {
                if (!self.groups_loading_complete) return;
                self.groups_loading_complete = false;

                //return;

                self.groups.removeAll();
                $.get(urls.url.groups, {
                    'year': self.year() || 0,
                    'discipline_id': self.discipline().id
                }, self.groups).done(function (data) {
                    $.cookie(cookies.year, self.year(), {expires: cookies.expires});
                    var group_id = $.cookie(cookies.group_id);
                    self.groups.sort(function (left, right) {
                        return left.title == right.title ? 0 : left.title < right.title ? -1 : 1;
                    });
                    self.groups_loading_complete = true;
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
                    if (done) done();
                }).always(function () {
                });
            };


            self.loadDisciplines = function () {
                self.disciplines.removeAll();
                return $.get(urls.url.disciplines).done(function (data) {
                    for (var i = 0; i < data.length; ++i) {
                        var disc = new Discipline(data[i], self);
                        self.disciplines.push(disc);
                    }

                }).fail(function () {
                    helpers.showFail();
                });
            };


// >>> DISCIPLINES CONTROL
            self.addDiscipline = function () {
                var d = new Discipline({
                    id: '-1',
                    title: 'без названия'
                }, self);
                d.add(function () {
                    location.reload();
                });
            };

            self.editDiscipline = function () {
                if (self.discipline().id) {
                    self.discipline().edit();
                }
            };

            self.toggleDiscipline = function () {
                if (self.discipline()) {
                    self.discipline().toggle();
                }
            };

            self.removeDiscipline = function () {
                if (self.discipline()) {
                    self.discipline().remove(function () {
                        self.disciplines.remove(self.discipline());
                    });
                }
            };

            /**
             * Возврщает количество активных объектов
             */
            self.activeItems = ko.pureComputed(function () {
                return self.marksTable.is_active() +
                    self.labsTable.is_active();
            });

            self.hasData = ko.pureComputed(function () {
                return self.marksTable.students().length > 0 ||
                    self.labsTable.labs().length > 0;
                //self.marksTable.onInit());
            });

            self.loadingComplete = ko.pureComputed(function () {
                return !self.marksTable.isStudentsLoading() && !self.labsTable.labsLoading();
            });

            Init();
        };
//add model to global namespace
        //window.MarksViewModel = MarksViewModel;
    });

