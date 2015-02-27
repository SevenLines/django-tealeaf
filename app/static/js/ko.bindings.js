/**
 * Created by m on 06.12.14.
 */
ko.bindingHandlers.img = {
    init: function (element, valueAccessor, allBindingsAccessor) {
        var image_loaded = allBindingsAccessor().image_loaded;
        if (image_loaded) {
            image_loaded(false);
        }
        element.src = valueAccessor()() == null ? '' : valueAccessor()();

        $(element).unbind();
        $(element).on('load', function () {
            if (image_loaded) {
                image_loaded(true);
            }
            if (valueAccessor()() != element.src) {
                valueAccessor()(element.src);
            }
        });

        //ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
        //    console.log("removed");
        //});
    },
    update: function (element, valueAccessor, allBindingsAccessor) {
        var image_loaded = allBindingsAccessor().image_loaded;
        if (image_loaded) {
            image_loaded(false);
        }
        if (element.src != valueAccessor()() ) {
            element.src = valueAccessor()() == null ? '' : valueAccessor()();
        }
    }
};

ko.bindingHandlers.input = {
    init: function (element, valueAccessor, allBindingsAccessor) {
        element.value = valueAccessor()() == null ? '' : valueAccessor()();
        $(element).on("change", function () {
            valueAccessor()(element.value);
        });
    },
};