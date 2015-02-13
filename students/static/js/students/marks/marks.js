/**
 * Created by m on 11.02.15.
 */
require.config({
    paths: {
        marks: './marks',
        labs: './marks',
        cookies: './cookies',
        utils: './utils',
        knockout: '/static/bower_components/knockout/dist/knockout'
    },
});


// >>> DATE FORMATING
Date.prototype.ddmmyyyy = function () {
    var yyyy = this.getFullYear().toString();
    var mm = (this.getMonth() + 1).toString(); // getMonth() is zero-based
    var dd = this.getDate().toString();

    return (dd[1] ? dd : "0" + dd[0]) + '/' + (mm[1] ? mm : "0" + mm[0]) + '/' + yyyy;
};

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

require(['marks/main', 'knockout'], function (MarksViewModel, ko) {
    var model = new MarksViewModel();
    ko.applyBindings(model);
});
//
//require(['urls', 'labs/main', 'knockout'], function (config, MarksViewModel, ko) {
//    var model = new MarksViewModel(config);
//    ko.applyBindings(model, document.getElementById("marks-editor"));
//});


