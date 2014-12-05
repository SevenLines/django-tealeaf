/**
 * Created by m on 06.12.14.
 */
ko.bindingHandlers.img = {
    init: function (element, valueAccessor, allBindingsAccessor) {
        element.src = valueAccessor()() == null ? '' : valueAccessor()();
        $(element).on('load', function () {
            console.log(element.src);
            valueAccessor()(element.src);
        })
    },
    update: function (element, valueAccessor) {
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