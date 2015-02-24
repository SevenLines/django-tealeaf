require.config({
    shim: {
        'jquery.cookie': {deps: ['jquery']},
        'bootstrap': {deps: ['jquery']}
    },
    paths: {
        'knockout': '/static/bower_components/knockout/dist/knockout',
        'interface': '../../../js/interface',
        'bootstrap': '../../../lib/bootstrap/bootstrap.min',
        'helpers': '../../../js/helpers',
        'modal_confirm': '../../../js/bindings/modal_confirm',
        'jquery.cookie': '/static/bower_components/jquery.cookie/jquery.cookie',
    }
});

define('jquery', [], function () {
    return jQuery;
});


require(["knockout", "app/student_view_model", "student-urls", "bootstrap"], function (ko, StudentViewModel, urls) {
    ko.applyBindings(new StudentViewModel(urls, "#main-modal-form"));
});