/**
 * Created by m on 13.02.15.
 */
define(['knockout', 'urls', 'utils'], function (ko, urls, utils) {
    return function (data) {
        var self = this;

        self.id = data.id;
        self.complexity = ko.observable(data.complexity);
        self.description = ko.observable(data.description);
        self._complex_choices = data.complex_choices;

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
                self.description() != data.description;
        });

        self.setComplex = function ($data) {
            self.complexity($data.value);
        };

        self.reset = function () {
            data.complexity = self.complexity();
            data.description = self.description();
            self.complexity.notifySubscribers();
        };

        self.save = function () {
            console.log('saved');
            utils.post(urls.url.task_save, utils.csrfize({
                id: self.id,
                complexity: self.complexity(),
                description: self.description()
            }), self.reset);
        };

        self.remove = function () {
            console.log('remove');
        };

    }
});