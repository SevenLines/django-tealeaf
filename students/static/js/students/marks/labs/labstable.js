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

        function init() {
            Sortable.create($("#labs-editor").find(".m-labs")[0], {
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

        self.removeLab = function (data, e) {
            e.stopImmediatePropagation();
            data.remove(function () {
                self.labs.remove(data);
            });
        };

        self.addLab = function (data, e) {
            e.stopImmediatePropagation();
        };

        self.resort = function (data, e) {

        };

        init();
    }
});
