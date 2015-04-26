/**
 * Created by m on 26.04.15.
 */
define(['marks/student'], function (Student) {
	describe("Student", function () {
		var student;

		beforeAll(function () {
			student = new Student({
				id: 1,
				name: 'Лилия',
				second_name: 'Калина',
				sum: 30,
				marksTable: null,
				marks: null
			});
		});

		it("full sum should return full sum", function () {
			expect(student.full_sum).toEqual(30);
		})

	});
});