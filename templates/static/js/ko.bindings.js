/**
 * Created by m on 06.12.14.
 */
ko.bindingHandlers.img = {
    init: function (element, valueAccessor, allBindingsAccessor) {
        console.log(allBindingsAccessor());
        var image_loaded = allBindingsAccessor().image_loaded;
        if (image_loaded) {
           image_loaded(false);
        }
        element.src = valueAccessor()() == null ? '' : valueAccessor()();
        $(element).on('load', function () {
            image_loaded(true);
            valueAccessor()(element.src);
        })
    },
    update: function (element, valueAccessor, allBindingsAccessor) {
        var image_loaded = allBindingsAccessor().image_loaded;
        if (image_loaded) {
           image_loaded(false);
        }
        element.src = valueAccessor()() == null ? '' : valueAccessor()();
    }
};

ko.bindingHandlers.input = {
    init: function (element, valueAccessor, allBindingsAccessor) {
        element.value = valueAccessor()() == null ? '' : valueAccessor()();
        $(element).on("change", function () {
            valueAccessor()(element.value);
        })
    },
};