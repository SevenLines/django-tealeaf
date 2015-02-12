/**
 * Created by m on 11.02.15.
 */
define(['knockout'], function (ko) {
    return function (data, model) {
        var self = this;

        self.model = model;

        self.url = {
            edit: data.url ? data.url.edit : '',
            remove: data.url ? data.url.remove : ''
        };

        self.id = data.id;
        self.year = ko.observable(data.year);
        self.title = ko.observable(data.title);
        self.visible = ko.observable(data.visible);

        self.toggleDiscipline = function () {
            console.log("cool");
            $.post(model.url.discipline_edit, model.csrfize({
                'id': self.id,
                'visible': !self.visible()
            })).done(function () {
                self.visible(!self.visible());
                InterfaceAlerts.showSuccess();
            }).fail(function () {
                InterfaceAlerts.showFail();
            });
        };
    }
});
