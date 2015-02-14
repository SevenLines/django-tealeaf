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

        init();
    }
});