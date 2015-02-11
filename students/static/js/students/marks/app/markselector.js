// >>> селектор оценки

define(['knockout'], function (ko) {
    return function (selector, markTypes) {
        var self = this;
        self.mark_selector = $(selector);
        self.type = ko.observable();
        self.mark = null;

        var last_offset = {
            left: 0,
            top: 0
        };

        var visible = false;

        self.show = function (mark, target) {

            self.mark = mark;
            var offset = $(target).offset();
            var width = target.clientWidth * 1.1;
            var height = target.clientHeight;
            var index = $.map(self.mark_types(), function (item) {
                return item.k;
            }).indexOf(mark.mark());

            var item_width = 28;
            var ul_width = self.mark_selector.find("ul").first().width();
            //console.log(ul_width);

            var items = self.mark_selector.show().offset({
                left: offset.left - ul_width / 2 + width / 2,
                top: offset.top - ul_width / 2 + height / 2
            }).find("li");

            last_offset.left = offset.left + (width - item_width) / 2;
            last_offset.top = offset.top + (height - item_width) / 2;

            if (items.size()) {
                var radius = 35;
                var angle = 2 * Math.PI / (items.size());
                items.each(function (i, item) {
                    if (i != index) {
                        $(item).offset({
                            left: last_offset.left + radius * Math.cos(i * angle),
                            top: last_offset.top + radius * Math.sin(i * angle)
                        });
                    } else {
                        $(item).offset({
                            left: last_offset.left,
                            top: last_offset.top
                        });
                    }
                });
            }

            if (self.mark && self.mark.student) {
                self.mark.student.toggleActive(true);
            }

            visible = true;

            self.mark_selector.find(".mark").removeClass("lect exam test current");
            self.mark_selector.find(".mark").toggleClass(mark.lesson.style(), true);
            self.mark_selector.find(".mark." + marksTypes[mark.mark()]).toggleClass("current", true);
        };

        self.close = function () {
            visible = false;
            self.mark_selector.hide();
            if (self.mark && self.mark.student) {
                self.mark.student.toggleActive(false);
            }
            self.mark_selector.find("li").removeAttr('style');
        };

        self.init = function () {
            $("body").click(function () {
                if (visible) {
                    self.close();
                }
            });
            $(document).keypress(function (e) {
                if (e.keyCode == 27) {
                    self.close();
                }
            });
        };

        self.mark_types = markTypes;

        self.setMark = function (data) {
            self.mark.mark(data['k']);
            self.close();
        };

        self.init();
    }
});

// >>> модальное окно управления дисциплиной
//    ModalAddDiscipline.prototype = new ModalConfirm({prototype: true});
//    ModalAddDiscipline.prototype.constructor = ModalConfirm;
//    function ModalAddDiscipline() {
//        var self = this;
//
//        self.title = ko.observable('');
//        arguments[0].custom_modal_body = [
//            '<form class="form" data-bind="submit: function() {}">',
//            '<input class="form-control" data-bind="value: title" />',
//            '</form>'
//        ].join("\n");
//
//        ModalConfirm.apply(this, arguments);
//    }
