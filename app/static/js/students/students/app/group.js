/**
 * Created by m on 24.02.15.
 */
define(['knockout'], function (ko) {
    return function (data) {
        var self = this;
        self.id = data.id;
        self.title = ko.observable(data.title);
        self.year = ko.observable(data.year);
        self.has_ancestor = data.has_ancestor;
        self.captain = ko.observable(data.captain);

        self.old_title = ko.observable(data.title);
        self.old_year = ko.observable(data.year);

        self.modified = ko.computed(function () {
            return self.title() != self.old_title() ||
                self.old_year() != self.year()
        });

        self.reset = function () {
            self.old_title(self.title);
            self.old_year(self.year);
        };
    }
});