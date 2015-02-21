/**
 * Created by m on 14.02.15.
 */
define(['knockout'], function (ko) {
    ko.bindingHandlers.ckeditorInline = {
        counter: 0,
        prefix: '__cked_',
        init: function (element, valueAccessor, allBindingsAccessor, viewModel) {
            setTimeout(function () {
                if (!element.id) {
                    element.id = ko.bindingHandlers.ckeditorInline.prefix + (++ko.bindingHandlers.ckeditorInline.counter);
                }

                var options = allBindingsAccessor.get("ckeditorOptions") || {};

                options.floatSpaceDockedOffsetY = 0;
                options.extraPlugins = options.extraPlugins == "" ? 'sourcedialog' : options.extraPlugins + ",sourcedialog";
                options.removePlugins = 'sourcearea';

                // handle disposal (if KO removes by the template binding)
                ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                    if (CKEDITOR.instances[element.id]) {
                        CKEDITOR.remove(CKEDITOR.instances[element.id]);
                    }
                });

                $(element).on("click", function () {
                    if (!CKEDITOR.instances[element.id]) {
                        var editor = CKEDITOR.inline(element.id, options);
                        editor.config.enterMode = CKEDITOR.ENTER_BR;

                        // handle value changed
                        editor.on('change', function () {
                            valueAccessor()(editor.getData());
                        });

                        //$(element).trigger("blur");

                        ko.bindingHandlers.ckeditorInline.update(element, valueAccessor, allBindingsAccessor, viewModel);
                        return false;
                    }
                });

            }, Math.random());
        },
        update: function (element, valueAccessor, allBindingsAccessor, viewModel) {
            var value = ko.utils.unwrapObservable(valueAccessor());
            var existingEditor = CKEDITOR.instances && CKEDITOR.instances[element.id];

            if (existingEditor) {
                if (value !== existingEditor.getData()) {
                    existingEditor.setData(value, function () {
                        this.checkDirty(); // true
                    });
                }
            } else {
                $(element).html(value);
            }
        }
    };
});