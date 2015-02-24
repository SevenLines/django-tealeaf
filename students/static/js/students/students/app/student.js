/**
 * Created by m on 24.02.15.
 */
define(['knockout', 'helpers'], function (ko, helpers) {
    return function (data) {
        var self = this;
        self.id = data.id;
        self.name = ko.observable(data.name);
        self.second_name = ko.observable(data.second_name);
        self.sex = ko.observable(data.sex);
        self.phone = ko.observable(data.phone);
        self.vk = ko.observable(data.vk);
        self.email = ko.observable(data.email);
        self.group_id = data.group_id;
        self.photo = ko.observable(data.photo);

        self.old_name = ko.observable(data.name);
        self.old_second_name = ko.observable(data.second_name);
        self.old_sex = ko.observable(data.sex);
        self.old_phone = ko.observable(data.phone);
        self.old_vk = ko.observable(data.vk);
        self.old_email = ko.observable(data.email);
        self.old_group_id = data.group_id;


        self.modified = ko.computed(function () {
            return self.old_name() != self.name()
                || self.old_second_name() != self.second_name()
                || self.old_vk() != self.vk()
                || self.old_email() != self.email()
                || self.old_phone() != self.phone()
                || self.old_sex() != self.sex()
                || self.old_group_id != self.group_id
        });

        self.reset = function () {
            self.old_name(self.name());
            self.old_second_name(self.second_name());
            self.old_phone(self.phone());
            self.old_vk(self.vk());
            self.old_email(self.email());
            self.old_sex(self.sex());
            self.old_group_id = self.group_id;
        };

        self.setSex = function (sexEnum) {
            self.sex(sexEnum);
        };

        self.changePhoto = function (form) {

            var input_file = $(form).find("input[type=file]");
            input_file.unbind();

            input_file.change(function () {
                var formData = new FormData(form);
                $.ajax({
                    url: form.action,
                    type: "POST",
                    data: formData,
                    async: false,
                    cache: false,
                    contentType: false,
                    processData: false
                }).success(function (new_url) {
                    self.photo(new_url);
                    helpers.showSuccess();
                });
            });
            input_file.click();
        }
    }
});