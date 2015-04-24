/**
 * Created by m on 19.02.15.
 */
define(['knockout', 'urls'], function (ko, urls) {
	return function (data_inst) {
		var self = this;
		var data = data_inst;

		data.done = (data.done === undefined ? false : data.done);

		self.id = data.id === undefined ? -1 : data.id;
		self.student = data.student;
		self.task = data.task;
		self.group = data.group;
		self.created = new Date(data.created);
		self.done = ko.observable(data.done);

		self.lab = ko.observable(data.lab);
		self.task_inst = ko.observable(data.task_inst);

		self.changed = ko.pureComputed(function () {
			return data.done != self.done();
		});

		self.post_data = function () {
			return {
				id: self.id,
				student: self.student,
				task: self.task,
				done: self.done()
			}
		};

		self.css = ko.pureComputed(function () {
			// расчитываем разницу дат
			// и устанавливаем соответствующий класс в качестве стиля
			var taskDiff = 0;
			if (self.lab) {
				taskDiff = ~~((self.created - self.lab().leftMarksDate) / (3600 * 1000 * 24));
			}

			var result = {
				'done': self.done(),
				'changed': self.changed(),
				'fast': taskDiff < 7,
				'fast-normal': 7 <= taskDiff && taskDiff < 14,
				'normal': 14 <= taskDiff && taskDiff < 21,
				'normal-slow': 21 <= taskDiff && taskDiff < 28,
				'slow': 28 <= taskDiff && taskDiff < 35,
				'slow-veryslow': 35 <= taskDiff && taskDiff < 42,
				'veryslow': 42 <= taskDiff
			};
			return result;
		});

		self.reset = function () {
			data.done = self.done();
		};

		self.toggle = function () {
			self.done(!self.done());
		}
	}

});
