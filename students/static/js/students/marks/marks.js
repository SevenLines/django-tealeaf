/**
 * Created by m on 11.02.15.
 */
require.config({
    shim: {
        bootstrap: {"deps": ['jquery']},
        qtip: {"deps": ['jquery']},
        color: {"deps": ['jquery']}
    },
    paths: {
        'marks': './marks',
        'labs': './labs',
        'qtip': '/static/bower_components/qtip2/jquery.qtip',
        'knockout': '/static/bower_components/knockout/dist/knockout',
        'jquery': '/static/bower_components/jquery/dist/jquery',
        'jquery.cookie': '/static/bower_components/jquery.cookie/jquery.cookie',
        'color': '/static/lib/color',
        'bootstrap': '/static/lib/bootstrap/bootstrap.min',
        'helpers': '/static/js/helpers',
        'interface': '/static/js/interface'
        //underscore: '/static/bower_components/underscore/underscore'
    }
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

require(['main', 'knockout', 'interface'], function (MarksViewModel, ko) {
    var model = new MarksViewModel();
    ko.applyBindings(model);
});

