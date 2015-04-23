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
			var k = 0;
			if (self.lab) {
				var diff = ~~(self.lab().diffMarksDate / (3600 * 1000 * 24));
				if (diff > 0) {
					var taskDiff = ~~((self.created - self.lab().leftMarksDate) / (3600 * 1000 * 24));
					k = taskDiff / diff;
				}
			}

			//var result = [
			//	self.done() ? 'done' : '',
			//	k ? 'done-' + k : '',
			//	self.changed() ? 'changed' : ''
			//].join(" ");
			//return result;
			var result = {
				'done': self.done(),
				'changed': self.changed(),
				'fast': k >= 0 && k < 0.125,
				'fast-normal': k >= 0.125 && k < 0.25,
				'normal': k >= 0.25 && k < 0.375,
				'normal-slow': k >= 0.375 && k < 0.5,
				'slow': k >= 0.5 && k < 0.75,
				'slow-veryslow': k >= 0.75 && k < 0.875,
				'veryslow': k >= 0.875 && k <= 1
			};
			//result[stl] = k >= 0;
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
