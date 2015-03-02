require.config({
    paths: {
        'knockout': '../../bower_components/knockout/dist/knockout',
    }
});

require(['knockout', 'app/apptracking'], function (ko, AppTracking) {
    ko.applyBindings(new AppTracking());
});