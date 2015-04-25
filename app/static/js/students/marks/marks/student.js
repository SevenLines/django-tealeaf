/**
 * Created by m on 11.02.15.
 */
// >>> STUDENT CLASS
define(['knockout', 'marks/mark', 'color'], function (ko, Mark) {
	return function (data) {
		var marksTypes = [];
		var studentColorMin = Color("#FDD").lighten(0.03);
		var studentColorMax = Color("#C1F400").lighten(0.5);
		var self = this;
		self.id = data.id;
		self.name = data.name;
		self.sum = ko.observable(data.sum);
		self.second_name = data.second_name;

		self.marksTable = data.marksTable;

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



		/***
		 * возвращает пару (количество сданных задач студентом, общее количество задач)
		 */
		self.labsCount = 0;
		self.labsDone = function () {
			var model = self.marksTable.model;
			var labsTable = model.labsTable;

			var done = 0;
			var count = 0;

			for (var i = 0, l = labsTable.labs().length; i < l; ++i) {
				var lab = labsTable.labs()[i];
				if (lab.visible()) {
					if (lab.regular()) {
						count += lab.tasks().length;
					}
					var marks = lab.marks[self.id];
					for (var task_id in marks) {
						if (marks[task_id].done()) {
							done++;
						}
					}
				}
			}
			self.labsCount = count;
			return {
				done: done,
				count: count
			};
		};

		/***
		 * возвращает полную сумму оценок
		 * sum + баллы за сданные  задачи
		 */
		self.full_sum = ko.computed(function () {
			var labsTasksDone = self.labsDone();
			return self.sum() + labsTasksDone.done;
		});

		self.full_name = ko.pureComputed(function () {
			//var name = $(document).width() < 400 ? self.name[0] + '.' : self.name;
			return self.second_name + ' ' + self.name;
		});

		self.short_name = ko.pureComputed(function () {
			return self.name && self.name.slice(-1) != '.' ? self.name[0] + '.' : '';
		});

		self.success_factor = ko.pureComputed(function () {
			var lessons_count = self.marks.filter(function (m) {
				return !m.ignore_lesson();
			}).length;

			var max = lessons_count * 3 + self.labsCount;
			var min = lessons_count * -2;
			var base = 0.3;
			var fullSum = self.full_sum();

			if (fullSum == 0) {
				return base;
			} else if (fullSum > 0) {
				return base + (fullSum / max) * (1 - base);
			} else {
				return base - (fullSum / min) * base;
			}
		});

		self.color = ko.pureComputed(function () {
			if (self.full_sum() != 0) {
				var max = self.marks.length * 3 + self.labsCount;
				var min = self.marks.length * -2;
				var diff = (max - min);
				var k = 1 - self.full_sum() / diff;
//                var k = 1 - self.success_factor();
				var clr = studentColorMax.clone();
				clr.mix(studentColorMin, k * k * k);

				return {
					backgroundColor: clr.hexString(),
					opacity: self.full_sum() < 0 ? Math.max(0.1, 0.4 + -(k - 1)) : 1
				};
			}
			return {};
		});

		var __active = ko.observable(false);
		self.toggleActive = function (active) {
			__active(active);
		};

		self.style = ko.pureComputed(function () {
			return __active() ? "active" : "";
		}, __active);


		self.modified_marks = function () {
			return $.grep(self.marks, function (item) {
				return item.modified();
			});
		};

		self.regularStudent = ko.pureComputed(function () {
			return self.success_factor() >= 0.25 && self.marks.length > 0;
		});

		self.reset = function () {
			self.marks.every(function (item) {
				item.reset();
				return true
			});
		}
	}
});
