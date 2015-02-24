/**
 * Created by m on 24.02.15.
 */
define(['knockout', 'helpers', 'student-urls'], function (ko, helpers, urls) {
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
        self.files = ko.observableArray(data.files);

        //
        //self.old_name = ko.observable(data.name);
        //self.old_second_name = ko.observable(data.second_name);
        //self.old_sex = ko.observable(data.sex);
        //self.old_phone = ko.observable(data.phone);
        //self.old_vk = ko.observable(data.vk);
        //self.old_email = ko.observable(data.email);
        //self.old_group_id = data.group_id;


        self.modified = ko.computed(function () {
            return data.name != self.name()
                || data.second_name != self.second_name()
                || data.vk != self.vk()
                || data.email != self.email()
                || data.phone != self.phone()
                || data.sex != self.sex()
                || data.group_id != self.group_id
        });

        self.reset = function () {
            data.name = self.name();
            data.second_name = self.second_name();
            data.phone = self.phone();
            data.vk = self.vk();
            data.email = self.email();
            data.sex = self.sex();
            data.group_id = self.group_id;
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
                    url: urls.url.change_photo,
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
        };


        self.removePhoto = function () {
            helpers.post(urls.url.remove_photo, {
                student_id: self.id
            }, function () {
                self.photo("");
            })
        };

        self.addFile = function (data, e) {
            var parent = $(e.target).parent();
            var form = parent.find("form");
            if (form.size() == 0) {
                return;
            }
            form = form[0];
            var $input = $(form.file);

            $input.unbind();
            $input.one("change", function () {
                var formData = new FormData(form);
                $.ajax({
                    url: urls.url.add_student_file,
                    type: "POST",
                    data: formData,
                    async: false,
                    cache: false,
                    contentType: false,
                    processData: false
                }).done(function (d) {
                    self.files.push(d);
                    helpers.showSuccess();
                });
            });

            $input.click();
        };

        self.removeStudentFile = function (data, e) {
            $.get(urls.url.remove_student_file, {
                'student_file_id': data.id
            }).done(function () {
                self.files.remove(data);
            });
        };

        self.getStudentFile = function (data, e) {
            var params = $.param({
                'student_file_id': data.id
            });
            window.location = urls.url.get_student_file + "?" + params;
        };
    }
});