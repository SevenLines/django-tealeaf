/**
 * Created by m on 13.02.15.
 */
define(['knockout',
		'urls',
		'cookies',
		'helpers',
		'marks/lesson',
		'marks/mark',
		'marks/student',
		'marks/markselector',
		'marks/qtipsettings',
		'jquery',
		'qtip',
	],
	function (ko, urls, cookies, helpers, Lesson, Mark, Student, MarkSelector, qtipsettings) {
		return function (model) {
			var self = this;

			var selectors = {
				marks_editor: '#marks-editor',
				marks_selector: '#mark-selector',
				scroll_container: '.m-table-container'
			};
			self.selectors = selectors;

			self.students = ko.observableArray();
			self.students_control = ko.observableArray();
			self.student = ko.observable();
			self.students_cache = {};

			self.lessons = ko.observableArray();
			self.lesson_types = ko.observableArray();
			self.lesson = ko.observable();

			self.labs = ko.observableArray();
			self.tasksProgress = ko.observableArray();

			self.group_id = 0;
			self.discipline_id = 0;

			self.firstLoadingAfterParametersChanged = ko.observable(true);
// >>> ЗАГРУЗКА ДАННЫХ
			self.isStudentsLoading = ko.observable(true);
			self.isStudentsAboutToLoading = ko.observable(false);
			self.showLoading = ko.pureComputed(function () {
				return (self.isStudentsLoading() || (self.students && self.students().length == 0));
			});

			self.showPanel = ko.pureComputed(function () {
				return (self.students().length || self.isStudentsLoading())
					&& !self.firstLoadingAfterParametersChanged();
			});

			/***
			 * устанавливет группу и дисциплину для таблицы оценок, и загружает соответствующих студентов
			 * @param group_id
			 * @param discipline_id
			 */
			self.setParams = function (group_id, discipline_id) {
				self.group_id = group_id;
				//self.firstLoadingAfterParametersChanged(true);
				if (group_id == null) {
					self.isStudentsLoading(false);
					//self.onInit(false);
				}
				self.discipline_id = discipline_id;
				self.loadStudents();
			};

			self.setLabs = function (r, labsTable) {
				self.labs = labsTable.labs;
			};

			// ### синхронизация подсветки строк таблицы оценок
			self.$markseditor = $(selectors.marks_editor);
			self.$markseditor.collapse({
				toggle: false
			});
			self.$markseditor.on({
				mouseenter: function () {
					var index = $(this).index();
					$(this).addClass("hover");
					$(".m-table>tbody, .s-table>tbody").each(function (i, item) {
						$($(item).find(">.t-row")[index]).addClass("hover");
					});
				},
				mouseleave: function () {
					$(this).removeClass("hover");
					var index = $(this).index();
					$(".m-table>tbody, .s-table>tbody").each(function (i, item) {
						$($(item).find(">.t-row")[index]).removeClass("hover");
					});
				}
			}, ".m-table>tbody>.t-row,.s-table>tbody>.t-row");
			// --- конец синхронизация подсветки строк таблицы оценок

			// подключаем события, чтобы не закрывалась менюшка
			self.$markseditor.on("click", '.modal-lesson-editor .dropdown-menu', function (e) {
				e.stopPropagation()
			});


			// SERVICE VARIABLES
			self.marksTypes = ko.observableArray();
			self.hideBadStudents = ko.observable(true);
			self.markSelector = new MarkSelector(selectors.marks_selector, self.marksTypes);


			self.processData = function (data) {
				// fill lesson_types list
				self.lesson_types(data.lesson_types);

				// fill mark types, and find max and min value at the same time
				marksTypes = {};
				self.marksTypes(data.mark_types);
				data.mark_types.every(function (item) {
					marksTypes[item['k']] = item['v'];
					if (!marksTypes.max < parseInt(item['k'])) {
						marksTypes.max = parseInt(item['k']);
					}
					if (!marksTypes.min > parseInt(item['k'])) {
						marksTypes.min = parseInt(item['k']);
					}
					return true
				});

				// fill lessons list
				var map_lessons = $.map(data.lessons, function (item) {
					return new Lesson(item, self);
				});
				self.lessons(map_lessons);

				var i = -1;

				function add_item() {
					if (i == -1) {
						self.students.removeAll();
						setTimeout(add_item, 10);
						++i;
					}
					if (i < data.students.length) {
						var item = data.students[i];
						++i;
						item.lessons = self.lessons;
						self.students.push(new Student(item));
						setTimeout(add_item, 10);
					} else {
						self.sortMethod(self.sortMethods[$.cookie(cookies.sorting)]);
						$.cookie(cookies.group_id, self.group_id, {expires: cookies.expires});
						self.resetMarksInterface();
						self.isStudentsLoading(false);
						self.isStudentsAboutToLoading(false);
						self.firstLoadingAfterParametersChanged(false);

						// open / close marksTable collapse according ot saved state
						var keep_mark_table_open = $.cookie(cookies.keep_mark_table_open);
						if (keep_mark_table_open == "false") {
							self.$markseditor.collapse("hide");
						} else {
							self.$markseditor.collapse("show");
						}


						if (!self.students_cache[self.discipline_id]) {
							self.students_cache[self.discipline_id] = {};
						}
						self.students_cache[self.discipline_id][self.group_id] = data;
					}
				}

				if (data.students.length > 0) {
					add_item();
				}
			};


// >>> ЗАГРУЗКИ
			self.loadStudents = function (force) {
				if (self.isStudentsAboutToLoading()) return;
				self.isStudentsAboutToLoading(true);

				var exec = function () {
					self.students.removeAll();

					if (!self.group_id) {
						self.isStudentsAboutToLoading(false);
						self.isStudentsLoading(false);
						return;
					}
					self.isStudentsLoading(true);
					self.hideBadStudents(true);

					if (!force && self.students_cache[self.discipline_id] && self.students_cache[self.discipline_id][self.group_id]) {
						self.processData(self.students_cache[self.discipline_id][self.group_id]);
					} else {
						setTimeout(function () {
							$.get(urls.url.students, {
								'group_id': self.group_id,
								'discipline_id': self.discipline_id
							}).done(function (data) {
								self.processData(data);
							}).always(function () {
								//self.onInit(false);
							}).fail(function () {
								self.resetMarksInterface();
							});
						}, 60);
					}
				};
				if (self.$markseditor.hasClass("in")) {
					self.$markseditor.one("hidden.bs.collapse", exec);
					self.$markseditor.collapse("hide");
				} else {
					exec();
				}
			};

			self.loadStudentsControl = function () {
				window.location = urls.url.students_control + '?' + $.param([
					{name: 'year', value: self.year()},
					{name: 'discipline_id', value: self.discipline_id},
					{name: 'k', value: 0.5}
				])
			};

			// ### РЕИНИЦИЛИЗАЦИЯ ИНТЕРФЕЙСА
			self.resetMarksInterface = function () {
				$('thead [data-toggle="tooltip"]').tooltip({placement: "bottom"});
				$('tfoot [data-toggle="tooltip"]').tooltip({placement: "top"});

				// восстановления последнего скролла значения из куков
				var scroll_container = $(selectors.scroll_container);
				if (scroll_container.size() && $.cookie("lastScroll")) {
					scroll_container[0].scrollLeft = $.cookie("lastScroll");
				}

				// всплывающее меню редактирование занятия
				$(".lesson-edit").qtip(qtipsettings);
			};
// КОНЕЦ РЕИНИЦИАЛИЗАЦИИ ИНТЕРФЕЙСА


// >>> СОРТИРОВКА
			self.sortByStudentsMark = function (left, right) {
				return left.sum() == right.sum() ? 0 : left.sum() < right.sum() ? 1 : -1;
			};
			self.sortByStudentsMark.title = "По цвету";

			self.sortByStudentsName = function (left, right) {
				var s1 = left.sum() >= 0 ? 1 : -1;
				var s2 = right.sum() >= 0 ? 1 : -1;

				// студенты с отрицательными оценками идут в конце
				if (left.second_name < right.second_name) {
					return s1 == s2 ? -1 : s1 < s2 ? 1 : -1;
				} else if (left.second_name > right.second_name) {
					return s1 == s2 ? 1 : s1 < s2 ? 1 : -1;
				} else {
					return 0;
				}
			};
			self.sortByStudentsName.title = "По имени";

			self.sortMethods = {};
			self.sortMethods[self.sortByStudentsMark.title] = self.sortByStudentsMark;
			self.sortMethods[self.sortByStudentsName.title] = self.sortByStudentsName;
			self.sortMethods['undefined'] = self.sortByStudentsName;

			self.sortMethod = ko.observable();
			self.sortMethod.subscribe(function () {
				if (self.sortMethod()) {
					self.students.sort(self.sortMethod());
				}
			});
			self.toggleStudentsSorting = function () {
				self.sortMethod(self.sortMethod() == self.sortByStudentsMark ?
					self.sortByStudentsName : self.sortByStudentsMark);
				$.cookie(cookies.sorting, self.sortMethod().title, {expires: cookies.expires});
			};

/// >>> ОТОБРАЖЕНИЕ ОЦЕНОК
			self.showPercents = ko.observable($.cookie(cookies.score_method) !== 'false');
			self.scoreMethod = ko.pureComputed(function () {
				return self.showPercents() ? "в процентах" : "в баллах"
			}, self.showPercents);
			self.toggleScorePercents = function () {
				self.showPercents(!self.showPercents());
				$.cookie(cookies.score_method, self.showPercents(), {expires: cookies.expires});
			};

			self.toggleBadStudentHiding = function () {
				self.hideBadStudents(!self.hideBadStudents());
				var $selrow = $(selectors.marks_editor).find(".collapsed");
				var $sel = $selrow.find(".t-cell");
				var options = {
					duration: 300,
					easing: 'swing'
				};
				if (self.hideBadStudents()) {
					$sel.slideUp(options);
					$selrow.fadeOut(options);
				} else {
					$sel.slideDown(options);
					$selrow.fadeIn(options);
				}
			};

			// LESSONS CONTROL
			self.lessonHover = function (data) {
				self.lesson(data);
			};

			self.addLesson = function () {
				$.post(urls.url.lesson_add, helpers.csrfize({
					discipline_id: self.discipline_id,
					group_id: self.group_id
				})).done(function () {
					self.loadStudents(true)
				}).fail(function () {
					helpers.showFail();
				});
			};

			self.removeLesson = function (data) {
				data.remove(function () {
					//self.lessons.remove(data);
					self.loadStudents(true);
				});
			};

			self.saveLesson = function (data) {
				$.post(urls.url.lesson_save, helpers.csrfize({
					lesson_id: data.id,
					lesson_type: data.lesson_type(),
					date: data.isodate(),
					multiplier: data.multiplier(),
					description_raw: data.description_raw(),
					score_ignore: data.score_ignore(),
					icon_id: data.icon_id() == null ? -1 : data.icon_id()
				})).done(function (response) {
					if (data.isodate() != data.isodate_old) {
						self.loadStudents(true);
					} else {
						data.description(response.description);
						data.description_raw(response.description_raw);
					}
					helpers.showSuccess();
				}).fail(function () {
					helpers.showFail();
				})
			};

// MARKS CONTROL
			self.saveMarks = function () {
				var marks = [];
				for (var i = 0; i < self.students().length; ++i) {
					var mrks = self.students()[i].modified_marks();
					mrks.every(function (item) {
						marks.push({
							lesson_id: item.lesson_id,
							student_id: item.student_id,
							mark: item.mark()
						});
						return true;
					})
				}

				if (self.labs()) {
					for (var i = 0, l = self.labs().length, labs = self.labs(); i < l; ++i) {
						labs[i].saveTaskMarks();
					}
				}

				helpers.post(urls.url.marks_save, {
					marks: JSON.stringify(marks)
				}, function () {
					for (var i = 0; i < self.students().length; ++i) {
						self.students()[i].reset();
					}
					self.loadStudents();
				});

			};

			self.toExcel = function (data, e) {
				window.location = urls.url.to_excel + '?' + $.param([
					{name: 'group_id', value: self.group_id},
					{name: 'discipline_id', value: self.discipline_id},
				]);
			};

			self.resetCache = function (date, e) {
				$.get(urls.url.reset_cache).done(function () {
					window.location.reload();
				})
			};

			self.clickMark = function (data, e) {
				if (model.containerMoved) {
					return false;
				}
				setTimeout(function () {
					self.markSelector.show(data, e.target);
				}, 10);
			};

			self.clickTask = function (student, task, e) {
				//console.log(task());
				//console.log(student());
			};

			self.increase = function (mark) {
				mark.increase();
			};

			self.decrease = function (mark) {
				mark.decrease();
			};

			self.is_active = ko.pureComputed(function () {
				return self.students().length > 0;
			});
		}
	})
;