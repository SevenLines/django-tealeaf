/**
 * Created by m on 11.02.15.
 */
// >>> STUDENT CLASS
define(['knockout', 'app/mark'], function (ko, Mark) {
    return function (data) {
        var self = this;
        self.id = data.id;
        self.name = data.name;
        self.sum = ko.observable(data.sum);
        self.second_name = data.second_name;

        self.marks = $.map(data.marks, function (item) {
            data.lessons().every(function (lesson) {
                if (lesson.id == item.lid) {
                    item.lesson = lesson;
                    return false;
                }
                return true;
            });
            item.student = self;
            item.m = item.m ? item.m : 0; // значение
            return new Mark(item);
        });

        self.full_name = ko.computed(function () {
            //var name = $(document).width() < 400 ? self.name[0] + '.' : self.name;
            return self.second_name + ' ' + self.name;
        });

        self.short_name = ko.computed(function () {
            return self.name && self.name.slice(-1) != '.' ? self.name[0] + '.' : '';
        });


        self.success_factor = ko.computed(function () {
            var lessons_count = self.marks.filter(function (m) {
                return !m.ignore_lesson();
            }).length;
            var max = lessons_count * 3;
            var min = lessons_count * -2;
            var base = 0.3;
            if (self.sum() == 0) {
                return base;
            } else if (self.sum() > 0) {
                return base + (self.sum() / max) * (1 - base);
            } else {
                return base - (self.sum() / min) * base;
            }
        });

        self.color = ko.computed(function () {
            if (self.sum() != 0) {
                var max = self.marks.length * 3;
                var min = self.marks.length * -2;
                var diff = (max - min);
                var k = 1 - self.sum() / diff;
//                var k = 1 - self.success_factor();
                var clr = studentColorMax.clone();
                clr.mix(studentColorMin, k * k * k);

                return {
                    backgroundColor: clr.hexString(),
                    opacity: self.sum() < 0 ? Math.max(0.1, 0.4 + -(k - 1)) : 1
                };
            }
            return {};
        });

        var __active = ko.observable(false);
        self.toggleActive = function (active) {
            __active(active);
        };

        self.style = ko.computed(function () {
            return __active() ? "active" : "";
        }, __active);


        self.modified_marks = function () {
            return $.grep(self.marks, function (item) {
                return item.modified();
            });
        };

        self.reset = function () {
            self.marks.every(function (item) {
                item.reset();
                return true
            });
        }
    }
});
