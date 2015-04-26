// >>> MARK CLASS
define(['knockout'], function (ko) {
    return function(data) {
        var self = this;
        self.student_id = data.sid;
        self.student = data.student;
        self.mark_id = data.mid;
        self.lesson_id = data.lid;
        self.mark = ko.observable(data.m);
        self.mark_old = ko.observable(data.m);
        self.lesson = data.lesson;

        self.ignore_lesson = function () {
            return self.lesson && (self.lesson.score_ignore() || self.lesson.lesson_type() == 5);
        };

        var last_mark = data.m;
        // тут происходит пересчет оценок
        self.mark.subscribe(function () {
            if (self.student) {
                var marks = self.student.marks;
                var sum = 0;
                var lessons_count = 0;
                for (var i = 0; i < marks.length; ++i) {
                    if (!marks[i].ignore_lesson()) {
                        ++lessons_count;
                    }
                    // пропускаем экзамены, они не влияют на оценку
                    if (marks[i].lesson.lesson_type() == 5) {
                        continue;
                    }
                    var item = marks[i];
                    var cls = marksTypes[item.mark()];
                    switch (cls) {
                        case 'black-hole':
                            if (sum > 0) {
                                sum = 0;
                            }
                            break;
                        case 'shining':
                            if (sum < (lessons_count) * 3) {
                                sum = (lessons_count) * 3;
                            } else if (i + 1 == marks.length) {
                                sum = (lessons_count) * 30 + ((lessons_count) * 30) / 70 * 27;
                            }
                            break;
                        case 'mercy':
                            if (sum < 0) {
                                sum = 0;
                            }
                            break;
                        default :
                            sum += item.mark();
                    }
                }
                ;
                last_mark = self.mark();
                self.student.sum(sum);
            }
        });

        self.mark_text = ko.pureComputed(function () { // надпись оценки
            return ""
        }, self.mark);

        self.mark_class = ko.pureComputed(function () {
            var cls = marksTypes[self.mark()];
            cls += self.mark() != self.mark_old() ? " modified" : "";
            cls += self.lesson.style() ? (" " + self.lesson.style()) : "";
            return cls
        }, self.mark, self.mark_old);

        self.reset = function () {
            self.mark_old(self.mark());
        };

        self.modified = ko.pureComputed(function () {
            return self.mark() != self.mark_old()
        }, self.mark, self.mark_old);

        self.increase = function () {
            var m = self.mark();
            m = Math.min(m + 1, marksTypes.max);
            self.mark(m);
        };

        self.decrease = function () {
            var m = self.mark();
            m = Math.max(m - 1, marksTypes.min);
            self.mark(m);
        };
    }
});
