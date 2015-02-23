/**
 * Created by m on 21.02.15.
 */
define(['knockout'], function (ko) {
    return function (data) {
        var self = this;

        self.id = data.id;
        self.title = ko.observable(data.title);
        self.description = ko.observable(data.description);
        self.item_url = ko.observable(data.item_url);
        self.item_thumb_url = ko.observable(data.item_thumb_url);
        self.active = ko.observable(data.active);
    }
});
