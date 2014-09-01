/**
 * Created by m on 24.08.14.
 */
(function () {
    function InterfaceAlerts() {
        var self = this;

        self.blink = function (color, delay) {
            var bg = $('body');
            var bg_css = bg.css("background");
            bg.css("background-color", color);
            setTimeout(function () {
                $("body").css("background", bg_css);
            }, delay);
        };

        self.showSuccess = function () {
            self.blink("#AAFF88", 1000);
        };
        self.showFail = function () {
            self.blink("#FFAA88", 1000);
        };
    }

    function TableEffects() {
        var self = this;
        self.toggleColumnClass = function (td_target, class_name, toggle) {
            var t = parseInt($(td_target).index()) + 1;
            $('td:nth-child(' + t + ')').toggleClass(class_name, toggle);
        }
    }

    window.TableEffects = new TableEffects();
    window.InterfaceAlerts = new InterfaceAlerts();
}());

// mouse move click prevent
(function ($) {
    var $doc = $(document),
        moved = false,
        pos = {x: null, y: null},
        abs = Math.abs,
        mclick = {
            'mousedown.mclick': function (e) {
                pos.x = e.pageX;
                pos.y = e.pageY;
                moved = false;
            },
            'mouseup.mclick': function (e) {
                moved = abs(pos.x - e.pageX) > $.clickMouseMoved.threshold
                    || abs(pos.y - e.pageY) > $.clickMouseMoved.threshold;
            }
        };

    $doc.on(mclick);

    $.clickMouseMoved = function () {
        return moved;
    };

    $.clickMouseMoved.threshold = 3;
})(jQuery);