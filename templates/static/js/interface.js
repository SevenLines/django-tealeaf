/**
 * Created by m on 24.08.14.
 */

var isTouch = (('ontouchstart' in window) || (navigator.msMaxTouchPoints > 0));

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

// mouse move click prevent, not mine code
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

// collapsable events
$(function () {
    $(".collapsable .collapsable-header").click(function () {
        $(this).siblings(".collapsable-body").slideToggle('fast');
//       console.log("hi");
    });
});


// hack to resize main container according menu list
$(window).load(function () {
    var min_height = $(".menu>ul").height() + 30;
    $(".content").css("min-height", min_height);
});

$(function () {
    // enable click to expand menu for touch devices
    if (isTouch) {
        $(".menu >ul>li").not(".logo").not(".touchable").find(">a").click(function () {
            return false;
        })
    }

    // убираю nojs класс если активирован javascript
    $(".nojs").removeClass("nojs");

    $(window).scroll(function () {
        var w = $(window).width();
        $("#back-to-top").toggleClass("show", w > 750 && $(this).scrollTop() > 200);
    });

    // back-to-top button
    $('#back-to-top').click(function () {
        $('html, body').stop().animate({
            scrollTop: 0
        }, 500)
    });
});

// hack to keep left menu position on container position
$(window).on("scroll resize touchmove", function () {
    var m = $(".menu>ul");
    var left = $(".left-board").offset().left;
    var scrollLeft = $(this).scrollLeft();
    if (scrollLeft == 0) {
        m.css({left: ''});
    } else {
        m.css({
            left: left - scrollLeft
        });
    }
});


(function () {
    function sendData(el, jquery_method, data) {

        if (el.dataset.action == 'undefined') {
            throw new DOMException("action attribute should be defined: ");
        }

        if (data == 'undefined')
            data = {};

        for (var i in el.dataset) {
            if (i != 'action') {
                data[i] = el.dataset[i];
            }
        }

        return jquery_method(el.dataset.action, data);
    }

    window.MethodPostDataset = function (element, data) {
        return sendData(element, $.post, data);
    };


    window.MethodGetDataset = function (element, data) {
        return sendData(element, $.get, data);
    };

})();

dismissRelatedImageLookupPopup = function (win, chosenId, chosenThumbnailUrl, chosenDescriptionTxt) {
    var el;

    var name = win.name;

    if (el = document.getElementById(name + "_image_id")) {
        $(el).val(chosenId).trigger("change");
    }

    if (el = document.getElementById(name + "_image_url")) {
        if (el.tagName == "INPUT") {
            $(el).val(chosenThumbnailUrl).trigger("change");
        } else {
            el.src = chosenThumbnailUrl;
        }
    }

    if (RelatedImageLookupPopupBeforeClose) {
        RelatedImageLookupPopupBeforeClose(win, chosenId, chosenThumbnailUrl, chosenDescriptionTxt);
    }

    win.close();
};


window.input2base64f = function(input_element, callback) {
    var file = input_element.files[0];
    var fileReader = new FileReader();
    fileReader.onload = function (e) {
        if (callback) callback(e);
    };
    fileReader.readAsDataURL(file);
};

window.input2base64 = function (input_element, output_image) {
    input2base64f(input_element, function (e) {
        output_image.src = e.target.result;
    });
};
