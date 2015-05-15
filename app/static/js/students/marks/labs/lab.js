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
		self.bgimage = ko.observable(data.bgimage);
		self.new_bgimage_data = ko.observable(null);
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
		//
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
				data.discipline != self.discipline() ||
				self.new_bgimage_data() != null;
		});

		self.style = ko.pureComputed(function () {
			//return "columns" + self.columns_count();
			return {
				backgroundImage: 'url(' + self.bgimage() + ')',
			};
		});


		self.css = ko.pureComputed(function () {
			return {
				'showable': self.show(),
				'with_pic': self.bgimage()
			};
		});

		self.order_changed = ko.pureComputed(function () {
			return data.order != self.order();
		});

		self.setImage = function (input) {
			helpers.input2base64f(input, function (e) {
				console.log(e.target.result);
				self.bgimage(e.target.result);
			});
			self.new_bgimage_data(input.files[0]);
		};


		self.clearImage = function () {
			if (self.new_bgimage_data()) {
				self.new_bgimage_data(null);
				self.bgimage(data.bgimage);
				return;
			}
			$.prompt("Удалить изображение:" + self.title() + "?", {
				title: "Подтвердите",
				buttons: {'Да': true, 'Не сейчас': false},
				submit: function (e, v, m, f) {
					if (v) {
						$.post(urls.url.lab_clear_image, helpers.csrfize({
							id: self.id
						})).done(function (d) {
							self.bgimage(null);
							helpers.showSuccess();
						}).fail(function () {
							helpers.showFail();
						});
					}
				}
			});
		};

		self.save = function (data, e) {
			if (e) e.stopImmediatePropagation();

			// создаем упорядоченный список задач
			var order_array = [];
			for (var i = 0, l = self.tasks().length; i < l; ++i) {
				var task = self.tasks()[i];
				order_array.push(task.id);
			}

			// подготавливаем данные для отправки
			var formdata = new FormData();
			formdata.append('id', self.id);
			formdata.append('title', self.title());
			formdata.append('description', self.description());
			formdata.append('discipline', self.discipline());
			formdata.append('visible', self.visible());
			formdata.append('regular', self.regular());
			formdata.append('columns_count', self.columns_count());
			formdata.append('csrfmiddlewaretoken', $.cookie('csrftoken'));
			formdata.append('order_array', JSON.stringify(order_array));
			if (self.new_bgimage_data()) {
				formdata.append('bgimage', self.new_bgimage_data());
			}

			// отправляем
			$.ajax({
				url: urls.url.lab_save,
				type: "POST",
				data: formdata,
				cache: false,
				processData: false,
				contentType: false,
			}).done(function (r) {
				helpers.showSuccess();
				self.bgimage(r.bgimage);
				self.reset();
			}).fail(function () {
				helpers.showFail();
			});
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
			data.bgimage = self.bgimage();
			self.new_bgimage_data(null);
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