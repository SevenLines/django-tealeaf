require.config({
    paths: {
        'knockout': '../../bower_components/knockout/dist/knockout',
        'interface': '../../js/interface',
        'bootstrap': '../../lib/bootstrap/bootstrap.min',
    }
});

require(['knockout', 'app/apptracking', 'interface'], function (ko, AppTracking) {
    ko.applyBindings(new AppTracking());
});