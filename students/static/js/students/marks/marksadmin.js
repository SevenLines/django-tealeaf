/**
 * Created by m on 16.02.15.
 */
require.config({
    paths: {
        //'knockout': '/static/bower_components/knockout/dist/knockout',
        'ckeditorinlinebinding': '/static/js/bindings/ckeditorinlinebinding',
        'select2binding': '/static/js/bindings/select2binding',
        'select2': '/static/bower_components/select2/select2',
        'helpers': '/static/js/helpers',
        'jquery-impromptu': '/static/bower_components/jquery-impromptu/dist/jquery-impromptu',
    }
});

require(['ckeditorinlinebinding','select2binding', 'jquery-impromptu']);
