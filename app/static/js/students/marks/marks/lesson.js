// >>> LESSON CLASS
define(['knockout', 'helpers', 'urls'], function (ko, helpers, urls) {
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
        self.fa_icon = ko.observable(data.fi ? data.fi : '');
        self.id = data.id;

        self.icon_has_loaded = ko.observable(false);

        self.icon_id = ko.observable(data.icn_id);
        self.icn_fld_id = ko.observable(data.icn_fld_id);
        self.icon_url = ko.observable(data.icn_url);

        self.icon_edit_url = ko.pureComputed(function () {
            var folder_id = self.icn_fld_id();
            if (folder_id == '' || folder_id == null) {
                folder_id = '';
            }
            //console.log(folder_id);
            return "/admin/filer/folder/" + ( folder_id == '' ? '' : folder_id + '/list/');
        });

        self.label = ko.pureComputed(function () {
            return self.date().split('/')[0];
        }, self.date);

        self.info = ko.pureComputed(function () {
            return "<p><p align=left>" + self.date() + "<p>" + self.description();
        }, self.description);

        self.style = ko.pureComputed(function () {
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

        });

        self.isodate = ko.pureComputed(function () {
            var date = new Date(self.isodate_old);
            var items = self.date().split('/');
            return items[2] + "-" + items[1] + "-" + items[0];

        });

        self.clearIcon = function () {
            self.icon_id(null);
            self.icn_fld_id('');
            self.icon_url('');
        };

        self.remove = function (ondone, onfail) {
            $.prompt("Удалить занятие?", {
                title: "Подтвердите",
                buttons: {'Да': true, 'Не сейчас': false},
                submit: function (e, v, m, f) {
                    if (v) {
                        $.post(urls.url.lesson_remove, helpers.csrfize({
                            lesson_id: self.id
                        })).done(function (d) {
                            if (ondone) ondone(d);
                            helpers.showSuccess();
                        }).fail(function () {
                            if (onfail) onfail(d);
                            helpers.showFail();
                        });
                    }
                }
            });
        }
    }
});