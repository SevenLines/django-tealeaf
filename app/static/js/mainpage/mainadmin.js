/**
 * Created by m on 21.02.15.
 */
require.config({
    shim: {
        bootstrap: {"deps": ['jquery']}
    },
    paths: {
        'knockout': '../../bower_components/knockout/dist/knockout',
        'ckeditorinlinebinding': '../bindings/ckeditorinlinebinding',
        'bootstrap': '../../lib/bootstrap/bootstrap.min',
        'interface': '../interface',
        'modal_confirm': '../bindings/modal_confirm',
        'helpers': '../helpers'
    }
});

define('jquery', [], function () {
    return jQuery;
});

require(["knockout", "mainpage-settings", "app/model", "interface", 'ckeditorinlinebinding'],
    function (ko, settings, MainPageModel) {
        ko.applyBindings(new MainPageModel(settings));
    });