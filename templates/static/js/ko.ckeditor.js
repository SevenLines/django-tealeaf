CKEDITOR.disableAutoInline = true;
ko.bindingHandlers.ckeditorInline = {
    counter: 0,
    prefix: '__cked_',
    init: function (element, valueAccessor, allBindingsAccessor, viewModel) {
        if (!element.id) {
            element.id = ko.bindingHandlers.ckeditorInline.prefix + (++ko.bindingHandlers.ckeditorInline.counter);
        }

        var options = allBindingsAccessor.get("ckeditorOptions") || {};
        var ckUpdate = allBindingsAccessor.get('ckUpdate') || function () {
            };

        options.floatSpaceDockedOffsetY = 0;
        options.extraPlugins = 'sourcedialog';
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

                // handle value changed
                editor.on('change', function () {
                    valueAccessor()(editor.getData());
                });

                $(element).trigger("blur");

                ko.bindingHandlers.ckeditorInline.update(element, valueAccessor, allBindingsAccessor, viewModel);
                return false;
            }
        });


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