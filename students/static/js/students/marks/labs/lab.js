/**
 * Created by m on 13.02.15.
 */
define(["knockout", "urls",  "helpers", "labs/task", "labs/marktask"], function (ko, urls, helpers, Task, MarkTask) {
    return function (data) {
        var self = this;
        self.id = data.id;
        self.complex_choices = data.complex_choices;
        self.title = ko.observable(data.title);
        self.description = ko.observable(data.description);
        self.discipline = ko.observable(data.discipline);
        self.order = ko.observable(data.order);
        self.tasks = ko.observableArray();
        self.visible = ko.observable(data.visible);
        self.regular = ko.observable(data.regular);
        self.columns_count = ko.observable(data.columns_count);
        self.marks = {};

        self.columns_with_tasks = ko.pureComputed(function () {
            var out = [];
            var lastCol = 0;
            var columnItems = {
                items: []
            };
            var value = Math.ceil(self.tasks().length / self.columns_count());
            for (var i = 0; i < self.tasks().length; ++i) {
                var col = ~~(i / value);
                if (lastCol != col) {
                    lastCol = col;
                    out.push(columnItems);
                    columnItems = {
                        items: []
                    };
                }
                columnItems.items.push(self.tasks()[i]);
            }
            out.push(columnItems);
            return out;
        });

        self.column_style = ko.pureComputed(function () {
            return 'col-md-' + ~~(12 / self.columns_count());
        });

        function init() {
            var index = 1;
            data.tasks.every(function (item) {
                item.complex_choices = data.complex_choices;
                item.order = index++;
                item.lab = self;
                self.tasks.push(new Task(item));
                return true;
            });

            self.setMarks(data.marks);
        }

        self.hasTaskMarksForStudent = function (student) {
            return self.marks[student.id] !== undefined;
        };

        self.setMarks = function (marks) {
            self.marks = {};
            marks.every(function (item) {
                var m = self.marks[item.student];
                if (!m) {
                    self.marks[item.student] = {};
                    m = self.marks[item.student];
                }
                item.student_inst = item.student;
                item.task_inst = item.task;
                item.lab = self;
                m[item.task] = new MarkTask(item);
                return true;
            });
        };


        self.mark = function (task, student) {
            return ko.pureComputed(function () {
                var out = self.marks[student.id];

                if (!out) return new MarkTask({
                    student: student.id,
                    task: task.id,
                    student_inst: student,
                    task_inst: student,
                    lab: self
                });

                out = out[task.id];
                if (!out) return new MarkTask({
                    student: student.id,
                    task: task.id,
                    student_inst: student,
                    task_inst: student,
                    lab: self
                });

                return out;
            });
        };

        self.toggleTaskMark = function (mark) {
            var item = {};
            item[mark.student] = {};
            item[mark.student][mark.task] = mark;

            if (self.marks[mark.student] === undefined) {
                self.marks[mark.student] = {};
            }
            item = self.marks[mark.student]

            if (item[mark.task] === undefined) {
                item[mark.task] = {};
            }
            item[mark.task] = mark;
            mark.toggle();
        };

        self.remove = function (done, fail) {
            $.prompt("Удалить \"" + self.title() + "\"?", {
                persistent: false,
                buttons: {"Да": true, 'Не сейчас': false},
                submit: function (e, v) {
                    if (v) {
                        helpers.post(urls.url.lab_delete, {
                            id: self.id
                        }, done, fail);
                    }
                }
            });
        };

        self.changed = ko.pureComputed(function () {
            return data.title != self.title() ||
                data.description != self.description() ||
                data.columns_count != self.columns_count() ||
                data.discipline != self.discipline();
        });

        self.style = ko.pureComputed(function () {
            return "columns" + self.columns_count();
        });

        self.order_changed = ko.pureComputed(function () {
            return data.order != self.order();
        });

        self.save = function (data, e) {
            if (e) e.stopImmediatePropagation();
            helpers.post(urls.url.lab_save, {
                id: self.id,
                title: self.title(),
                description: self.description(),
                discipline: self.discipline(),
                visible: self.visible(),
                regular: self.regular(),
                columns_count: self.columns_count()
            }, self.reset);
        };

        self.saveTaskMarks = function (data, e) {
            var items = [];
            for (var s in self.marks) {
                for (var t in self.marks[s]) {
                    var mark = self.marks[s][t];
                    if (mark.changed()) {
                        items.push(mark.post_data());
                        mark.reset();
                    }
                }
            }
            if (items.length) {
                helpers.post(urls.url.lab_save_taskmarks, {
                    marks: JSON.stringify(items)
                }, function () {
                    //location.reload();
                });
            }
        };

        self.reset = function () {
            data.title = self.title();
            data.description = self.description();
            data.discipline = self.discipline();
            data.order = self.order();
            data.visible = self.visible();
            data.regular = self.regular();
            data.columns_count = self.columns_count();
            self.title.notifySubscribers();
            self.order.notifySubscribers();
        };

        self.reset_order = function () {
            data.order = self.order();
            self.order.notifySubscribers();
        };

        self.addTask = function (data, e) {
            if (e) e.stopImmediatePropagation();
            $.prompt({
                state: {
                    title: "Заполните",
                    html: '<textarea class="form-control" name="description" placeholder="описание" value="..."></textarea>',
                    buttons: {'Добавить': true, 'Отмена': false},
                    submit: function (e, v, m, f) {
                        if (v) {
                            helpers.post(urls.url.task_add, {
                                lab_id: self.id,
                                description: f.description
                            }, function (r) {
                                r.complex_choices = self.complex_choices;
                                self.tasks.push(new Task(r))
                                self.sort();
                            });
                        }
                    }
                }
            });
        };

        self.removeTask = function (data, e) {
            if (e) e.stopImmediatePropagation();
            data.remove(function () {
                self.tasks.remove(data);
            });
        };

        self.sort = function () {
            self.tasks.sort(function (left, right) {
                return left.complexity() == right.complexity() ? 0 : left.complexity() < right.complexity() ? -1 : 1;
            })
        };

        self.toggle = function (data, e) {
            if (e) e.stopImmediatePropagation();
            self.visible(!self.visible());
            self.save(data, e);
        };

        self.toggle_regular = function (data, e) {
            if (e) e.stopImmediatePropagation();
            self.regular(!self.regular());
            self.save(data, e);
        };

        init();
    }
});