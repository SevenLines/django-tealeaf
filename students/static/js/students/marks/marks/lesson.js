// >>> LESSON CLASS
define(['knockout', 'utils', 'urls'], function (ko, utils, urls) {
    return function (data, model) {
        var self = this;
        self.convert_date = function (isodate) {
            var date = new Date(isodate);
            return date.ddmmyyyy();
        };

        self.date = ko.observable(self.convert_date(data.dt));
        self.lesson_type = ko.observable(data.lt);
        self.description = ko.observable(data.dn);
        self.description_raw = ko.observable(data.dn_raw);
        self.multiplier = ko.observable(data.k);
        self.score_ignore = ko.observable(data.si);
        self.isodate_old = data.dt;
        self.id = data.id;

        self.icon_has_loaded = ko.observable(false);

        self.icon_id = ko.observable(data.icn_id);
        self.icn_fld_id = ko.observable(data.icn_fld_id);
        self.icon_url = ko.observable(data.icn_url);

        self.icon_edit_url = ko.computed(function () {
            var folder_id = self.icn_fld_id();
            if (folder_id == '' || folder_id == null) {
                folder_id = '';
            }
            //console.log(folder_id);
            return "/admin/filer/folder/" + ( folder_id == '' ? '' : folder_id + '/list/');
        });

        self.day = ko.computed(function () {
            return self.date().split('/')[0];
        }, self.date);

        self.info = ko.computed(function () {
            return "<p><p align=left>" + self.date() + "<p>" + self.description();
        }, self.description);

        self.style = ko.computed(function () {
            switch (self.lesson_type()) {
                case 2:
                    return "test";
                case 3:
                    return "lect";
                case 4:
                    return "laba";
                case 5:
                    return "exam";
            }
            return "";

        }, self.lesson_type);

        self.isodate = ko.computed(function () {
            var date = new Date(self.isodate_old);
            var items = self.date().split('/');
            return items[2] + "-" + items[1] + "-" + items[0];

        }, self.date);

        self.clearIcon = function () {
            self.icon_id(null);
            self.icn_fld_id('');
            self.icon_url('');
        }

        self.remove = function (ondone, onfail) {
            $.prompt("Удалить занятие?", {
                title: "Подтвердите",
                buttons: {'Да': true, 'Не сейчас': false},
                submit: function (e, v, m, f) {
                    if (v) {
                        $.post(urls.url.lesson_remove, utils.csrfize({
                            lesson_id: self.id
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
    }
});