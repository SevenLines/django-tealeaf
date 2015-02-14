/**
 * Created by m on 13.02.15.
 */
define(['knockout', 'urls', 'utils', 'labs/lab'], function (ko, urls, utils, Lab) {
    return function () {
        var self = this;

        self.group_id = 0;
        self.discipline_id = 0;
        self.complex_choices = {};
        self.labs = ko.observableArray();

        function initSorting() {
            var mlabs = $("#labs-editor").find(".m-labs")[0];
            if (!mlabs)  {
                return;
            }
            Sortable.create(mlabs, {
                handle: '.drag-handler',
                onUpdate: function (evt) {
                    self.labs().every(function (item) {
                        if (evt.oldIndex > evt.newIndex) {
                            if (evt.newIndex <= item.order() && item.order() <= evt.oldIndex) {
                                if (item.order() == evt.oldIndex) {
                                    item.order(evt.newIndex);
                                } else {
                                    item.order(item.order() + 1);
                                }
                            }
                        } else {
                            if (evt.oldIndex <= item.order() && item.order() <= evt.newIndex) {
                                if (item.order() == evt.oldIndex) {
                                    item.order(evt.newIndex);
                                } else {
                                    item.order(item.order() - 1);
                                }
                            }
                        }
                        return true;
                    });
                }
            });
        };

        self.setParams = function (group_id, discipline_id) {
            self.group_id = group_id;
            if (self.discipline_id != discipline_id) {
                self.discipline_id = discipline_id;
                self.loadLabs();
            }
        };

        self.loadLabs = function () {
            self.labs.removeAll();
            $.get(urls.url.labs, {
                group_id: self.group_id,
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
            }).fail(InterfaceAlerts.showFail);
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
                            utils.post(urls.url.lab_add, {
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
            self.labs().every(function(item) {
                order_array.push(item.id);
                item.reset_order();
                return true;
            });

            utils.post(urls.url.lab_save_order, {
                'order_array': JSON.stringify(order_array),
                'id': self.discipline_id
            }, function () {
                self.labs.notifySubscribers();
                self.labs().every(function(lab) {
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

        self.changed = ko.computed(function () {
            return self.labs().some(function (item) {
                return item.order_changed();
            });
        });

        self.is_active = ko.computed(function () {
            return self.labs().length > 0;
        });

        self.sort = function() {
            self.labs.sort(function (left, right) {
                return left.order() == right.order() ? 0 : left.order() < right.order() ? -1 : 1;
            })
        };

        //init();
    }
});
