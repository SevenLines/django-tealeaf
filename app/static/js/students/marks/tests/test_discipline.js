/**
 * Created by m on 26.04.15.
 */
define(['marks/discipline', 'marks_fixtures', "jquery", "jquery.cookie", "jquery-impromptu"], function (Discipline, Fixtures) {
	describe("Discipline", function () {
		var discipline = new Discipline(Fixtures.disciplines[0]);

		it("should change visible state on toggle", function () {
			var lastVisibleState = discipline.visible();
			expect(function () {
				discipline.toggle()
			}).toThrowError(); // as it immidiatley save we should check for error
			expect(discipline.visible()).toBe(!lastVisibleState);
		});

		beforeAll(function () {
			spyOn($, 'prompt');
			spyOn($, 'post');
		});

		it("should open impromptu on edit", function () {
			discipline.edit();
			expect($.prompt).toHaveBeenCalled();
		});

		it("should open impromptu on remove", function () {
			discipline.remove();
			expect($.prompt).toHaveBeenCalled();
		});
	})
});
