/**
 * Created by m on 21.02.15.
 */
require.config({
    shim: {
        bootstrap: {"deps": ['jquery']}
    },
    paths: {
        'knockout': '../../bower_components/knockout/dist/knockout',
        'prettify': '../../bower_components/google-code-prettify/bin/prettify.min',

        'bootstrap': '../../lib/bootstrap/bootstrap.min',

        'ckeditorinlinebinding': '../bindings/ckeditorinlinebinding',
        'modal_confirm': '../bindings/modal_confirm',

        'interface': '../interface',
        'helpers': '../helpers',
        'jquery.toc': '../jquery.toc',
        'common': '../common'
    }
});

define('jquery', [], function () {
    return jQuery;
});


require(["common"], function () {
    require(["knockout", "mainpage-settings", "app/model", 'ckeditorinlinebinding'],
        function (ko, settings, MainPageModel) {
            ko.applyBindings(new MainPageModel(settings));
        });
});
