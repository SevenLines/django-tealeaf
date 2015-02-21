/**
 * Created by m on 16.02.15.
 */
require.config({
    shim: {
        'ckeditorinlinebinding': {deps: ['knockout']},
        'select2binding': {deps: ['select2']},
        'select2': {deps: ['jquery']},
        'bootstrap': {"deps": ['jquery']},
        'qtip': {"deps": ['jquery']},
        'color': {"deps": ['jquery']},
        'pickmeup': {"deps": ['jquery']}
    },
    paths: {
        'marks': './marks',
        'labs': './labs',
        'qtip': '/static/bower_components/qtip2/jquery.qtip',
        'jquery.cookie': '/static/bower_components/jquery.cookie/jquery.cookie',
        'color': '/static/lib/color',
        'bootstrap': '../../../lib/bootstrap/bootstrap.min',
        'helpers': '../../../js/helpers',
        'interface': '../../../js/interface',
        'knockout': '/static/bower_components/knockout/dist/knockout',
        'jquery': '/static/bower_components/jquery/dist/jquery',
        'ckeditorinlinebinding': '/static/js/bindings/ckeditorinlinebinding',
        'select2binding': '/static/js/bindings/select2binding',
        'select2': '/static/bower_components/select2/select2',
        'jquery-impromptu': '/static/bower_components/jquery-impromptu/dist/jquery-impromptu',
        'pickmeup': '/static/bower_components/pickmeup/js/jquery.pickmeup'
    }
});
//
//define('jquery', [], function () {
//    return jQuery;
//});


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

