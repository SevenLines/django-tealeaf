/**
 * Created by m on 26.04.15.
 */
define(['marks/lesson', 'marks_fixtures', "jquery-impromptu", "jquery.cookie"], function (Lesson, Fixtures) {
	describe("Lesson", function () {
		var lesson = Fixtures.lessons[0];
		lesson = new Lesson(lesson);

		it("should return date in correct format", function () {
			expect(lesson.isodate()).toEqual("2014-09-02");
		});

		it("label should equals day of lesson", function () {
			expect(lesson.label()).toEqual("02");
		});

		it("info should contain description", function () {
			expect(lesson.info()).toContain(lesson.description());
		});

		it("style should return correct style", function () {
			lesson.lesson_type(2);
			expect(lesson.style()).toEqual("test");
			lesson.lesson_type(3);
			expect(lesson.style()).toEqual("lect");
			lesson.lesson_type(4);
			expect(lesson.style()).toEqual("laba");
			lesson.lesson_type(5);
			expect(lesson.style()).toEqual("exam");
			lesson.lesson_type(6);
			expect(lesson.style()).toEqual("");
		});

		it("remove should prompt for confirmation", function () {
			spyOn($, 'prompt');
			lesson.remove();
			expect($.prompt).toHaveBeenCalled();
		});
	});
});