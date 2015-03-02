require(['config'], function () {
    define('pickmeup', {});

    require(['main', 'knockout'], function (MarksViewModel, ko) {
        var model = new MarksViewModel();
        ko.applyBindings(model);
    });
});


