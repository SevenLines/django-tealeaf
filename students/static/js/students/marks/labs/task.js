/**
 * Created by m on 13.02.15.
 */
define(['knockout', 'urls', 'utils'], function (ko, urls, utils) {
    return function (data) {
        var self = this;

        self.id = data.id;
        self.complexity = ko.observable(data.complexity);
        self.description = ko.observable(data.description);
        self.order = ko.observable(data.order);
        self.students = ko.observableArray(data.students);
        self._complex_choices = data.complex_choices;

        function get_ids(massdata) {
            var out = [];
            self.students().every(function (item) {
                out.push(item.id);
                return true;
            });
            return out;
        }

        self.students_ids = ko.computed(function () {
            return get_ids(self.students);
        });
        self.old_students = get_ids(data.students);

        self.complex = ko.computed(function () {
            return self._complex_choices[self.complexity()];
        });

        self.complex_choices = ko.computed(function () {
            var out = [];
            Object.keys(self._complex_choices).every(function (key) {
                out.push({
                    value: key,
                    class: self._complex_choices[key]
                });
                return true;
            });
            return out;
        });

        self.changed = ko.computed(function () {
            return self.complexity() != data.complexity ||
                self.description() != data.description ||
                !self.students_ids().equals(self.old_students);
        });

        self.setComplex = function ($data) {
            self.complexity($data.value);
        };

        self.reset = function () {
            data.complexity = self.complexity();
            data.description = self.description();
            self.old_students = self.students_ids();
            self.complexity.notifySubscribers();
        };

        self.save = function () {
            console.log('saved');
            utils.post(urls.url.task_save, utils.csrfize({
                id: self.id,
                complexity: self.complexity(),
                description: self.description(),
                students: JSON.stringify(self.students_ids())
            }), self.reset);
        };

        self.remove = function (done, fail) {
            $.prompt("Удалить \"" + self.description() + "\"?", {
                persistent: false,
                buttons: {"Да": true, 'Не сейчас': false},
                submit: function (e, v) {
                    if (v) {
                        utils.post(urls.url.task_delete, {
                            id: self.id
                        }, done, fail);
                    }
                }
            });
        };

    }
});