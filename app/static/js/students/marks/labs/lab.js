/**
 * Created by m on 13.02.15.
 */
define(["knockout", "urls", "helpers", "labs/task", "labs/marktask"], function (ko, urls, helpers, Task, MarkTask) {
	return function (data) {
		var self = this;
		self.id = data.id;
		self.complex_choices = data.complex_choices;
		self.title = ko.observable(data.title);
		self.description = ko.observable(data.description);
		self.discipline = ko.observable(data.discipline);
		self.order = ko.observable(data.order);
		self.tasks = ko.observableArray();
		self.visible = ko.observable(data.visible);
		self.regular = ko.observable(data.regular);
		self.columns_count = ko.observable(data.columns_count);
		self.marks = {};

		self.leftMarksDate = "";
		self.rightMarksDate = "";
		self.diffMarksDate = "";
		self.show = ko.observable(false); // видно ли лабу на экране, используется для создания илююзии более плавной загрузки


		self.columns_with_tasks = ko.pureComputed(function () {
			var out = [];
			var lastCol = 0;
			var columnItems = {
				items: []
			};
			var value = Math.ceil(self.tasks().length / self.columns_count());
			for (var i = 0; i < self.tasks().length; ++i) {
				var col = ~~(i / value);
				if (lastCol != col) {
					lastCol = col;
					out.push(columnItems);
					columnItems = {
						items: []
					};
				}
				columnItems.items.push(self.tasks()[i]);
			}
			out.push(columnItems);
			return out;
		});

		self.column_style = ko.pureComputed(function () {
			return 'col-md-' + ~~(12 / self.columns_count());
		});

		function init() {
			var index = 1;

			// формируем список оценок


			data.tasks.every(function (item) {
				item.complex_choices = data.complex_choices;
				item.order = index++;
				item.lab = self;
				self.tasks.push(new Task(item));
				return true;
			});

			self.setMarks(data.marks);
		}

		self.hasTaskMarksForStudent = function (student) {
			var marks = self.marks[student.id];
			for (var mark in marks) {
				if (marks[mark].done()) {
					return true;
				}
			}
			return false;
			//return self.marks[student.id] !== undefined;
		};

		self.setMarks = function (marks) {
			self.marks = {};

			// определяем минимальную и максимальную дату когда сдавали эту лабу
			if (marks.length && marks[0].created) {
				self.leftMarksDate = new Date(marks[0].created);
				self.rightMarksDate = new Date(marks[0].created);
			}

			marks.every(function (item) {
				if (item.created) {
					var date = new Date(item.created);
					if (date < self.leftMarksDate) {
						self.leftMarksDate = date;
					}
					if (date > self.rightMarksDate) {
						self.rightMarksDate = date;
					}
				}


				return true;
			});

			self.diffMarksDate = self.rightMarksDate - self.leftMarksDate;

			marks.every(function (item) {
				//setTimeout(function () {
				var m = self.marks[item.student];
				if (!m) {
					self.marks[item.student] = {};
					m = self.marks[item.student];
				}
				item.student_inst = item.student;
				item.task_inst = item.task;
				item.lab = self;
				m[item.task] = new MarkTask(item);
				//}, 0);
				return true;
			});
		};


		self.mark = function (task, student) {
			//return ko.pureComputed(function () {
				if (!self.marks[student.id]) {
					self.marks[student.id] = {};
				}

				if (!self.marks[student.id][task.id]) {
					self.marks[student.id][task.id] = new MarkTask({
						student: student.id,
						task: task.id,
						student_inst: student,
						task_inst: student,
						lab: self
					});
				}

				return self.marks[student.id][task.id];
			//});
		};

		self.toggleTaskMark = function (mark) {
			var item = {};
			item[mark.student] = {};
			item[mark.student][mark.task] = mark;

			if (self.marks[mark.student] === undefined) {
				self.marks[mark.student] = {};
			}
			item = self.marks[mark.student];

			if (item[mark.task] === undefined) {
				item[mark.task] = {};
			}
			item[mark.task] = mark;
			mark.toggle();
		};

		self.remove = function (done, fail) {
			$.prompt("Удалить \"" + self.title() + "\"?", {
				persistent: false,
				buttons: {"Да": true, 'Не сейчас': false},
				submit: function (e, v) {
					if (v) {
						helpers.post(urls.url.lab_delete, {
							id: self.id
						}, done, fail);
					}
				}
			});
		};

		self.changed = ko.pureComputed(function () {
			return data.title != self.title() ||
				data.description != self.description() ||
				data.columns_count != self.columns_count() ||
				data.discipline != self.discipline();
		});

		self.style = ko.pureComputed(function () {
			return "columns" + self.columns_count();
		});

		self.order_changed = ko.pureComputed(function () {
			return data.order != self.order();
		});

		self.save = function (data, e) {
			if (e) e.stopImmediatePropagation();

			var order_array = [];
			for (var i = 0, l = self.tasks().length; i < l; ++i) {
				var task = self.tasks()[i];
				order_array.push(task.id);
			}

			helpers.post(urls.url.lab_save, {
				id: self.id,
				title: self.title(),
				description: self.description(),
				discipline: self.discipline(),
				visible: self.visible(),
				regular: self.regular(),
				columns_count: self.columns_count(),
				order_array: JSON.stringify(order_array)
			}, self.reset);
		};

		self.saveTaskMarks = function (data, e) {
			var items = [];
			for (var s in self.marks) {
				for (var t in self.marks[s]) {
					var mark = self.marks[s][t];
					if (mark.changed()) {
						items.push(mark.post_data());
						mark.reset();
					}
				}
			}
			if (items.length) {
				helpers.post(urls.url.lab_save_taskmarks, {
					marks: JSON.stringify(items)
				}, function () {
					//location.reload();
				});
			}
		};

		self.reset = function () {
			data.title = self.title();
			data.description = self.description();
			data.discipline = self.discipline();
			data.order = self.order();
			data.visible = self.visible();
			data.regular = self.regular();
			data.columns_count = self.columns_count();
			self.title.notifySubscribers();
			self.order.notifySubscribers();
		};

		self.reset_order = function () {
			data.order = self.order();
			self.order.notifySubscribers();
		};

		self.addTask = function (data, e) {
			if (e) e.stopImmediatePropagation();
			$.prompt({
				state: {
					title: "Заполните",
					html: '<textarea class="form-control" name="description" placeholder="описание" value="..."></textarea>',
					buttons: {'Добавить': true, 'Отмена': false},
					submit: function (e, v, m, f) {
						if (v) {
							helpers.post(urls.url.task_add, {
								lab_id: self.id,
								description: f.description
							}, function (r) {
								r.complex_choices = self.complex_choices;
								self.tasks.push(new Task(r))
								self.sort();
							});
						}
					}
				}
			});
		};

		self.removeTask = function (data, e) {
			if (e) e.stopImmediatePropagation();
			data.remove(function () {
				self.tasks.remove(data);
			});
		};

		self.sort = function () {
			self.tasks.sort(function (left, right) {
				return left.complexity() == right.complexity()
					? left.order() == right.order() ? 0 : left.order() < right.order() ? -1 : 1
					: left.complexity() < right.complexity() ? -1 : 1;
			})
		};

		self.toggle = function (data, e) {
			if (e) e.stopImmediatePropagation();
			self.visible(!self.visible());
			self.save(data, e);
		};

		self.toggle_regular = function (data, e) {
			if (e) e.stopImmediatePropagation();
			self.regular(!self.regular());
			self.save(data, e);
		};

		self.moveTaskUp = function (task, e) {
			if (e) e.stopImmediatePropagation();
			var index = self.tasks.indexOf(task);
			if (index == 0) {
				return;
			}
			var another_task = self.tasks()[index - 1];

			if (task.complexity() != another_task.complexity()) {
				return;
			}

			var order = task.order();
			task.order(another_task.order());
			another_task.order(order);

			//self.tasks()[index - 1] = task;
			//self.tasks()[index] = another_task;
			//self.tasks.valueHasMutated();
			self.sort();
		};

		self.moveTaskDown = function (task, e) {
			if (e) e.stopImmediatePropagation();
			var index = self.tasks.indexOf(task);
			if (index == self.tasks().length - 1) {
				return;
			}
			var another_task = self.tasks()[index + 1];

			if (task.complexity() != another_task.complexity()) {
				return;
			}

			var order = task.order();
			task.order(another_task.order());
			another_task.order(order);

			//self.tasks()[index + 1] = task;
			//self.tasks()[index] = another_task;
			//self.tasks.valueHasMutated();
			self.sort();
		};

		init();
	}
});