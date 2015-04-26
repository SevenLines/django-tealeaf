/**
 * Created by m on 26.04.15.
 */
define(['marks/mark','marks/markstable','marks_fixtures'], function (Mark, MarksTable, Fixtures) {
	var marksTable = new MarksTable();

	describe("Mark", function () {
		var obj = {"lid":86,"m":3,"mid":177,"sid":256};
		obj.marksTypes = marksTable.convertMarksTypes(Fixtures.markTypes);
		var mark = new Mark(obj);

		it("should return correct class", function () {
			expect(mark.mark_class()).toContain(mark.marksTypes[mark.mark()]);
		});

		it("should return modified class on mark changed", function () {
			mark.mark(mark.mark() + 1);
			expect(mark.mark_class()).toContain("modified");
			expect(mark.mark_class()).toContain(mark.marksTypes[mark.mark()]);
		});

		it("should remove modified class on reseting", function () {
			mark.mark(mark.mark() + 1);
			expect(mark.mark_class()).toContain("modified");

			mark.reset();
			expect(mark.mark_class()).not.toContain("modified");
		});

		it("modified function should return true on changed", function () {
			mark.mark(mark.mark() - 1);
			expect(mark.modified()).toBeTruthy();

			mark.reset();
			expect(mark.modified()).toBeFalsy();
		});
	})
});