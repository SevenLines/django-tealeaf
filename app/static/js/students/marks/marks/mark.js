// >>> MARK CLASS
define(['knockout'], function (ko) {
    return function(data) {
        var self = this;
        self.student_id = data.sid;
        //self.student = data.student;
        self.mark_id = data.mid;
        self.lesson_id = data.lid;

        self.mark = ko.observable(data.m);
        self.mark_old = ko.observable(data.m);
        self.lesson = data.lesson;
        self.marksTypes = data.marksTypes;

        self.ignore_lesson = function () {
            return self.lesson && (self.lesson.score_ignore() || self.lesson.lesson_type() == 5);
        };

        self.mark_text = ko.pureComputed(function () { // надпись оценки
            return ""
        }, self.mark);

        self.mark_class = ko.pureComputed(function () {
	        var marksTypes = ko.utils.unwrapObservable(self.marksTypes);
	        return [
	            marksTypes[self.mark()],
	            self.mark() != self.mark_old() ? " modified" : "",
	            self.lesson ? self.lesson.style() ? (" " + self.lesson.style()) : "" : ""
            ].join(' ').trim()
        });

        self.reset = function () {
            self.mark_old(self.mark());
        };

        self.modified = ko.pureComputed(function () {
            return self.mark() != self.mark_old()
        });
        //
        //self.increase = function () {
        //    var m = self.mark();
        //    m = Math.min(m + 1, self.marksTypes().max);
        //    self.mark(m);
        //};
        //
        //self.decrease = function () {
        //    var m = self.mark();
        //    m = Math.max(m - 1, self.marksTypes().min);
        //    self.mark(m);
        //};
    }
});
