define(['knockout', 'select2'], function (ko, select2) {
    ko.bindingHandlers.select2 = {
        init: function (element, valueAccessor, allBindingsAccessor) {
            var ajaxUrl = element.dataset.ajaxUrl || '';
            var ajaxTerm = element.dataset.ajaxTerm || 'q';
            var minimumInputLength = element.dataset.minimumInputLength || 2;

            $(element).select2({
                minimumInputLength: minimumInputLength,
                multiple: true,
                placeholder: element.dataset.placeholder,
                ajax: {
                    url: ajaxUrl,
                    dataType: 'json',
                    data: function (term, page) {
                        var d = {};
                        d[ajaxTerm] = term;
                        return d;
                    },
                    results: function (data, page) {
                        return {results: data};
                    },
                    cache: true
                }
            });
            $(element).select2('data', ko.utils.unwrapObservable(valueAccessor()));

            $(element).on("change", function () {
                var d = $(element).select2("data");
                valueAccessor()(d);
            });

            ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                $(element).select2('destroy');
            });
        },
        //update: function (element) {
        //    $(element).trigger('change');
        //}
    };
});
