/**
 * Created by m on 13.02.15.
 */
define(["knockout", "urls"], function (ko, urls) {
    return function(data, model) {
        var self = this;
        self.title = ko.observable(data.title);
        self.discipline = ko.observable(data.discipline);
    }
});