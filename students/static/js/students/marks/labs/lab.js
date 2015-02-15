/**
 * Created by m on 13.02.15.
 */
define(["knockout", "urls", "utils", "labs/task"], function (ko, urls, utils, Task) {
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
        self.columns_count = ko.observable(data.columns_count);


        //self.lastSortable = null;
        //
        //self.initSortable = function (data) {
        //    if (self.lastSortable) {
        //        return;
        //    }
        //    var mtasks = $("#labs-editor").find(".m-tasks")[0];
        //    if (!mtasks) {
        //        return;
        //    }
        //    self.lastSortable = new Sortable(mtasks, {
        //        onUpdate: function (evt) {
        //            var mainItem = self.tasks()[evt.oldIndex];
        //            evt.item.remove();
        //            self.tasks.remove(mainItem);
        //            self.tasks.push(mainItem);
        //            console.log(self.tasks());
        //            self.tasks().every(function (item) {
        //                if (evt.oldIndex > evt.newIndex) {
        //                    if (evt.newIndex <= item.order() && item.order() <= evt.oldIndex) {
        //                        if (item.order() == evt.oldIndex) {
        //                            item.order(evt.newIndex);
        //                        } else {
        //                            item.order(item.order() + 1);
        //                        }
        //                    }
        //                } else {
        //                    if (evt.oldIndex <= item.order() && item.order() <= evt.newIndex) {
        //                        if (item.order() == evt.oldIndex) {
        //                            item.order(evt.newIndex);
        //                        } else {
        //                            item.order(item.order() - 1);
        //                        }
        //                    }
        //                }
        //                return true;
        //            });
        //        }
        //    });
        //};

        function init() {
            data.tasks.every(function (item) {
                item.complex_choices = data.complex_choices;
                self.tasks.push(new Task(item));
                return true;
            });
        }

        self.remove = function (done, fail) {
            $.prompt("Удалить \"" + self.title() + "\"?", {
                persistent: false,
                buttons: {"Да": true, 'Не сейчас': false},
                submit: function (e, v) {
                    if (v) {
                        utils.post(urls.url.lab_delete, {
                            id: self.id
                        }, done, fail);
                    }
                }
            });
        };

        self.changed = ko.computed(function () {
            return data.title != self.title() ||
                data.description != self.description() ||
                data.columns_count != self.columns_count() ||
                data.discipline != self.discipline();
        });

        self.style = ko.computed(function () {
            return "columns" + self.columns_count();
        });

        self.order_changed = ko.computed(function () {
            return data.order != self.order();
        });

        self.save = function (data, e) {
            if (e) e.stopImmediatePropagation();
            utils.post(urls.url.lab_save, {
                id: self.id,
                title: self.title(),
                description: self.description(),
                discipline: self.discipline(),
                visible: self.visible(),
                columns_count: self.columns_count()
            }, self.reset);
        };

        self.reset = function () {
            data.title = self.title();
            data.description = self.description();
            data.discipline = self.discipline();
            data.order = self.order();
            data.visible = self.visible();
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
                            utils.post(urls.url.task_add, {
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

        self.sort = function() {
            self.tasks.sort(function (left, right) {
                return left.complexity() == right.complexity() ? 0 : left.complexity() < right.complexity() ? -1 : 1;
            })
        };

        self.toggle = function (data, e) {
            if (e) e.stopImmediatePropagation();
            self.visible(!self.visible());
            self.save(data, e);
        };
        init();
    }
});