/**
 * Created by m on 26.04.15.
 */
define(['marks/student',
		'marks/lesson',
		'marks/markstable',
		'labs/lab',
		'marksmain',
		'marks_fixtures',
		'knockout',
		"jquery.cookie"],
	function (Student, Lesson, MarksTable, Lab, Model, Fixtures, ko) {

	var marksTable = new MarksTable();

	describe("Student only with name", function () {
		var student = new Student({
			name: "Евгения",
			second_name: "Андриевская"
		});

		it("full sum should be equaled zero", function () {
			expect(student.full_sum()).toEqual(0);
		});

		it("full name should return combination on name and second name", function () {
			expect(student.full_name()).toEqual('Андриевская Евгения');
		});

		it("short name should return only first letter of name", function () {
			expect(student.short_name()).toEqual("Е.");
		});

		it("success factor should return correct value", function () {
			expect(student.success_factor()).toEqual(0.3);
		});

		it("should not be regular student as he doesn't has any marks", function () {
			expect(student.regularStudent()).toBeFalsy();
		});

		it("task should return undefined", function () {
			expect(student.task({
				lab: {
					id: -1
				}
			})).toBeUndefined();
		});

	});

	describe("Excellent student with lessons marks", function () {
		var student;

		beforeAll(function () {
			obj = JSON.parse('{"group":55,"name":"Евгения","marks":[{"lid":82,"m":4,"mid":158,"sid":240},{"lid":101,"m":2,"mid":183,"sid":240},{"lid":107,"m":3,"mid":239,"sid":240},{"lid":111,"m":null,"mid":null,"sid":240},{"lid":122,"m":3,"mid":404,"sid":240},{"lid":123,"m":3,"mid":405,"sid":240},{"lid":124,"m":3,"mid":406,"sid":240},{"lid":125,"m":3,"mid":407,"sid":240},{"lid":130,"m":null,"mid":null,"sid":240},{"lid":135,"m":3,"mid":519,"sid":240},{"lid":144,"m":2,"mid":617,"sid":240},{"lid":145,"m":2,"mid":618,"sid":240},{"lid":146,"m":null,"mid":null,"sid":240},{"lid":157,"m":4,"mid":754,"sid":240},{"lid":176,"m":1001,"mid":958,"sid":240},{"lid":183,"m":4,"mid":987,"sid":240},{"lid":191,"m":null,"mid":null,"sid":240},{"lid":195,"m":4,"mid":1141,"sid":240},{"lid":198,"m":null,"mid":null,"sid":240},{"lid":220,"m":null,"mid":null,"sid":240},{"lid":216,"m":3,"mid":1301,"sid":240},{"lid":217,"m":3,"mid":1302,"sid":240},{"lid":218,"m":3,"mid":1303,"sid":240},{"lid":221,"m":3,"mid":1318,"sid":240},{"lid":225,"m":3,"mid":1370,"sid":240},{"lid":228,"m":3,"mid":1401,"sid":240},{"lid":231,"m":5,"mid":1435,"sid":240}],"id":240,"sum":71,"second_name":"Андриевская","sex":0}');
			obj.lessons = Fixtures.lessons;
			obj.lessons = obj.lessons.map(function (item) {
				return new Lesson(item);
			});
			obj.marksTypes = marksTable.convertMarksTypes(Fixtures.markTypes);
			student = new Student(obj);
		});

		it("full sum should return full sum", function () {
			expect(student.full_sum()).toEqual(71);
		});

		it("success factor should return correct value", function () {
			expect(student.success_factor()).toBeCloseTo(1.02);
		});

		it("should be regular student", function () {
			expect(student.regularStudent()).toBeTruthy();
		});

		it("should update sum on if any of it marks change value", function () {

			var mark = student.marks[student.marks.length - 2];
			var current_mark_value = mark.mark();
			var previous_sum = student.sum();
			mark.mark(current_mark_value+1);

			expect(student.sum()-1).toEqual(previous_sum);
		});

		it("task should return undefined", function () {
			expect(student.task({
				lab: {
					id: -1
				}
			})).toBeUndefined();
		});
	});

	describe("Student with labs tasks", function () {
		var student;

		beforeAll(function() {
			obj = JSON.parse('{"group":53,"name":"Екатерина","marks":[],"id":267,"sum":0,"second_name":"Полуботко","sex":0}');
			obj.labs = Fixtures.labs;
			obj.labs = obj.labs.map(function (item) {
				return new Lab(item);
			});

			student = new Student(obj);
		});

		it("tasks should return computed observable array", function () {
			for(var first_lab in student.labs()) {
				break;
			}
			first_lab = student.labs()[first_lab];
			for(var first_task in first_lab.tasks()) {
				break;
			}
			first_task = first_lab.tasks()[first_task];
			var mark = student.task(first_task);
		});

		it("full sum should return full sum", function () {
			expect(student.full_sum()).toEqual(31);
		});

		it("success factor should return correct value", function () {
			expect(student.success_factor()).toBeCloseTo(0.69);
		});

		it("sum should be update on done task changed", function () {
			var sum_before = student.full_sum();

			for(var first_lab in student.labs()) {
				break;
			}
			first_lab = student.labs()[first_lab];

			for(var mark_id in first_lab.marks[student.id]) {
				break;
			}
			first_lab.marks[student.id][mark_id].toggle();
			expect(Math.abs(sum_before - student.full_sum())).toEqual(1);
		});

		it('sum should be updated on toggle not done task', function () {
			var sum_before = student.full_sum();

			for(var last_lab in student.labs()) {
				break;
			}
			last_lab = student.labs()[last_lab];

			for(var mark_id in last_lab.marks[student.id]) {
				break;
			}
			var mark = last_lab.marks[student.id][mark_id];

			if(mark.id != -1) {
				throw new Error("Для работоспособности этого теста, надо убедится что данная задача у студента никогда не засчитывалась");
			}

			mark.toggle();
			expect(Math.abs(sum_before - student.full_sum())).toEqual(1);
		});

		it('success_factor should update on toggle lab without done tasks', function () {
			var success_factor = student.success_factor();

			for(var last_lab in student.labs()) {
			}
			last_lab = student.labs()[last_lab];
			last_lab.toggle();

			expect(success_factor).not.toEqual(student.success_factor());
		});
	})

});