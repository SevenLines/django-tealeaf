require(['config'], function () {

    function lessonIconSelectPopup(triggeringLink) {
        var win, href;
        href = triggeringLink.href + '?_popup=1';
        win = window.open(href, '', 'height=500,width=800,resizable=yes,scrollbars=yes');
        window.RelatedImageLookupPopupBeforeClose = function (win, chosenId, chosenThumbnailUrl) {
            model.lesson().icon_id(chosenId);
            model.lesson().icon_url(chosenThumbnailUrl);
        };
        win.focus();
        return false;
    }

    require(['main',
            'knockout',
            'jquery',
            'interface',
            'ckeditorinlinebinding',
            'select2binding',
            'jquery-impromptu',
            'pickmeup'
        ],
        function (MarksViewModel, ko) {
            var model = new MarksViewModel();
            ko.applyBindings(model);
        });
});