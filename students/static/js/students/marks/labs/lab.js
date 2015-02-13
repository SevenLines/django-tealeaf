/**
 * Created by m on 13.02.15.
 */
define(["knockout", "urls", "labs/task"], function (ko, urls, Task) {
    return function(data) {
        var self = this;
        self.id = data.id;
        self.complex_choices = data.complex_choices;
        self.title = ko.observable(data.title);
        self.description = ko.observable(data.description);
        self.discipline = ko.observable(data.discipline);
        self.position = ko.observable(data.position);
        self.tasks = ko.observableArray();

        function init() {
            data.tasks.every(function(item){
                item.complex_choices = data.complex_choices;
                self.tasks.push(new Task(item));
                return true;
            });
        }

        init();
    }
});