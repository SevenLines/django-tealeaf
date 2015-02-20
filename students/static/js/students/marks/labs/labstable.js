/**
 * Created by m on 13.02.15.
 */
define(['knockout', 'jquery', 'urls', 'helpers', 'labs/lab'], function (ko, $, urls, helpers, Lab) {
    return function () {
        var self = this;

        self.discipline_id = 0;
        self.complex_choices = {};
        self.labs = ko.observableArray([]);

        var lastSortable = null;
        self.labsLoading = ko.observable(false);

        /**
         * done функция вызывается при успешной загрузке лабов; сигнатура: (response, labsTable)
         * @type function
         */
        self.onLabsLoadingComplete = null;

        function initSorting(data) {
            //if (lastSortable) {
            //    return;
            //}
            //var mlabs = $("#labs-editor").find(".m-labs")[0];
            //if ($("#labs-editor").find(".drag-handler").size == 0) {
            //    return;
            //}
            //if (!mlabs) {
            //    return;
            //}
            //lastSortable = new Sortable(mlabs, {
            //    handle: '.drag-handler',
            //    onUpdate: function (evt) {
            //        var mainItem = self.labs()[evt.oldIndex];
            //        evt.item.remove();
            //        self.labs.remove(mainItem);
            //        self.labs.push(mainItem);
            //        console.log(self.labs());
            //        self.labs().every(function (item) {
            //            if (evt.oldIndex > evt.newIndex) {
            //                if (evt.newIndex <= item.order() && item.order() <= evt.oldIndex) {
            //                    if (item.order() == evt.oldIndex) {
            //                        item.order(evt.newIndex);
            //                    } else {
            //                        item.order(item.order() + 1);
            //                    }
            //                }
            //            } else {
            //                if (evt.oldIndex <= item.order() && item.order() <= evt.newIndex) {
            //                    if (item.order() == evt.oldIndex) {
            //                        item.order(evt.newIndex);
            //                    } else {
            //                        item.order(item.order() - 1);
            //                    }
            //                }
            //            }
            //            return true;
            //        });
            //    },
            //    //onEnd: function (evt) {
            //    //    //self.sort();
            //    //    return false;
            //    //}
            //});
        };

        self.setParams = function (discipline_id) {
            if (self.discipline_id != discipline_id) {
                self.discipline_id = discipline_id;
                self.loadLabs();
            }
        };

        self.hasLabsForStudent = function (student) {
            return ko.pureComputed(function () {
                var result = self.labs().some(function(item) {
                    return item.hasTaskMarksForStudent(student);
                });
                return result;
            });
        };


        self.loadLabs = function (done) {
            self.labs.removeAll();
            self.labsLoading(true);
            //setTimeout(function () {
            $.get(urls.url.labs, {
                discipline_id: self.discipline_id
            }).done(function (r) {
                self.complex_choices = r.complex_choices;
                var order = 0;
                r.labs.every(function (item) {
                    item.complex_choices = r.complex_choices;
                    item.order = order++;
                    self.labs.push(new Lab(item));
                    return true;
                });
                initSorting();
                self.labsLoading(false);
                if (self.onLabsLoadingComplete) self.onLabsLoadingComplete(r, self);
            }).fail(helpers.showFail);
            //}, 10);
        };

        self.addLab = function (data, e) {
            e.stopImmediatePropagation();
            $.prompt({
                state: {
                    title: "Заполните",
                    html: '<input class="form-control" type="text" name="title" placeholder="название" value="без названия">',
                    buttons: {'Добавить': true, 'Отмена': false},
                    submit: function (e, v, m, f) {
                        if (v) {
                            helpers.post(urls.url.lab_add, {
                                discipline_id: self.discipline_id,
                                title: f.title
                            }, self.loadLabs);
                        }
                    }
                }
            });
        };

        self.saveAll = function (data, e) {
            e.stopImmediatePropagation();
            var order_array = [];
            self.sort();
            self.labs().every(function (item) {
                order_array.push(item.id);
                item.reset_order();
                return true;
            });

            helpers.post(urls.url.lab_save_order, {
                'order_array': JSON.stringify(order_array),
                'id': self.discipline_id
            }, function () {
                self.labs.notifySubscribers();
                self.labs().every(function (lab) {
                    if (lab.changed()) {
                        lab.save();
                    }
                    return true;
                });
            })
        };

        self.removeLab = function (data, e) {
            e.stopImmediatePropagation();
            data.remove(function () {
                self.labs.remove(data);
            });
        };

        self.changed = ko.pureComputed(function () {
            return self.labs().some(function (item) {
                return item.order_changed();
            });
        });

        self.is_active = ko.pureComputed(function () {
            return self.labs().length > 0;
        });

        self.sort = function () {
            self.labs.sort(function (left, right) {
                return left.order() == right.order() ? 0 : left.order() < right.order() ? -1 : 1;
            })
        };


        self.refresh = function (data, e) {
            e.stopImmediatePropagation();
            self.loadLabs();
        };


        //init();
    }
});
