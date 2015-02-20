/**
 * Created by m on 21.02.15.
 */
define(['common-settings'], function (settings) {

        Array.prototype.equals = function (array) {
            // if the other array is a falsy value, return
            if (!array)
                return false;

            // compare lengths - can save a lot of time
            if (this.length != array.length)
                return false;

            for (var i = 0, l = this.length; i < l; i++) {
                // Check if we have nested arrays
                if (this[i] instanceof Array && array[i] instanceof Array) {
                    // recurse into the nested arrays
                    if (!this[i].equals(array[i]))
                        return false;
                }
                else if (this[i] != array[i]) {
                    // Warning - two different object instances will never be equal: {x:20} != {x:20}
                    return false;
                }
            }
            return true;
        };

        return {
            blink: function (color, delay) {
                var bg = $('body');
                var bg_css = bg.css("background");
                bg.css("background-color", color);
                setTimeout(function () {
                    $("body").css("background", bg_css);
                }, delay);
            },
            showSuccess: function () {
                this.blink("#AAFF88", 1000);
            },
            showFail: function () {
                this.blink("#FFAA88", 1000);
            },
            csrfize: function csrfize(data) {
                data.csrfmiddlewaretoken = settings.csrf;
                return data;
            },
            post: function (url, data, success, fail) {
                var that = this;
                $.post(url, this.csrfize(data)).done(function (d) {
                    if (success) success(d);
                    that.showSuccess();
                }).fail(function (d) {
                    if (fail) fail(d);
                    that.showFail();
                })
            },
            get: function (url, data, success, fail) {
                var that = this;
                $.get(url, data).done(function (d) {
                    if (success) success(d);
                    that.showSuccess();
                }).fail(function (d) {
                    if (fail) fail(d);
                    that.showFail();
                });
            },
            input2base64f: function (input_element, callback) {
                var file = input_element.files[0];
                var fileReader = new FileReader();
                fileReader.onload = function (e) {
                    if (callback) callback(e);
                };
                fileReader.readAsDataURL(file);
            },
            input2base64: function (input_element, output_image) {
                this.input2base64f(input_element, function (e) {
                    output_image.src = e.target.result;
                })
            }
        }
    }
);