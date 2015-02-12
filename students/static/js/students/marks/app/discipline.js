/**
 * Created by m on 11.02.15.
 */
define(['knockout'], function (ko) {
    return function (data, model) {
        var self = this;

        self.model = model;

        self.id = data.id;
        self.year = ko.observable(data.year);
        self.title = ko.observable(data.title);
        self.visible = ko.observable(data.visible);

        self.editDiscipline = function () {
            $.prompt({
                state0: {
                    title: 'Введите',
                    html: '<label>Новое имя: ' +
                    '<input type="text" name="title" value="'+ self.title() + '">' +
                    '</label>',
                    buttons: {Ok: true, Cancel: false},
                    submit: function (e, v, m, f) {
                        self.title(f.title);
                        self.save();
                    }
                }
            });
        };

        self.save = function (ondone, onfail) {
            $.post(model.url.discipline_edit, model.csrfize({
                'id': self.id,
                'title': self.title(),
                'year': self.year(),
                'visible': self.visible()
            })).done(function (d) {
                if (ondone) ondone(d);
                InterfaceAlerts.showSuccess();
            }).fail(function () {
                if (onfail) onfail(d);
                InterfaceAlerts.showFail();
            });
        }

        self.add = function (ondone, onfail) {
            $.post(model.url.discipline_add, model.csrfize({
                'title': self.title(),
                'year': self.year(),
                'visible': self.visible()
            })).done(function (d) {
                if (ondone) ondone(d);
                InterfaceAlerts.showSuccess();
            }).fail(function () {
                if (onfail) onfail(d);
                InterfaceAlerts.showFail();
            });
        }

        self.toggleDiscipline = function () {
            self.visible(!self.visible());
            self.save(null, function () {
                self.visible(!self.visible());
            });
        };
    }
});
