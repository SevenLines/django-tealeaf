/**
 * Created by m on 11.02.15.
 */
define(['knockout', 'urls', 'utils'], function (ko, urls, utils) {
    return function (data, model) {
        var self = this;

        self.model = model;

        self.id = data.id;
        self.year = ko.observable(data.year);
        self.title = ko.observable(data.title);
        self.visible = ko.observable(data.visible);

        self.edit = function () {
            $.prompt({
                state0: {
                    title: 'Введите',
                    html: '<label>Новое имя: ' +
                    '<input type="text" name="title" value="' + self.title() + '">' +
                    '</label>',
                    buttons: {'Обновить': true, 'Отмена': false},
                    submit: function (e, v, m, f) {
                        if(v) {
                            self.title(f.title);
                            self.save();
                        }
                    }
                }
            });
        };

        self.save = function (ondone, onfail) {
            $.post(urls.url.discipline_edit, utils.csrfize({
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
            $.post(urls.url.discipline_add, utils.csrfize({
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

        self.remove = function (ondone, onfail) {
            $.prompt("Удалить дисциплину:"  + self.title() + "?", {
                title: "Подтвердите",
                buttons: {'Да': true, 'Не сейчас': false},
                submit: function (e, v, m, f) {
                    if (v) {
                        $.post(urls.url.discipline_remove, utils.csrfize({
                            id: self.id
                        })).done(function (d) {
                            if (ondone) ondone(d);
                            InterfaceAlerts.showSuccess();
                        }).fail(function () {
                            if (onfail) onfail(d);
                            InterfaceAlerts.showFail();
                        });
                    }
                }
            });

        }

        self.toggle = function () {
            self.visible(!self.visible());
            self.save(null, function () {
                self.visible(!self.visible());
            });
        };
    }
});
