require(['config'], function () {
    define('pickmeup', {});

    require(["common"], function () {
        require(['main', 'knockout'], function (MarksViewModel, ko) {
            var model = new MarksViewModel();
            ko.applyBindings(model);
        });
    });
});


