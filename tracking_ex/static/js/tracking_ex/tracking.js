(function () {
    window.AppTracking = function (data) {
        var self = this;
        var url = {
            visitors: data.url.visitors
        };

        var page = 1;
        self.no_more_visitors = ko.observable(false);
        self.visitors = ko.observableArray();
        self.visitors_loading = ko.observable(false);

        function fetchVisitors() {
            self.visitors_loading(true);
            $.get(url.visitors, {
                page: page
            }).done(function (responce) {
                responce.visitors.every(function (item) {
                    self.visitors.push(item);
                    return true;
                });
                self.no_more_visitors(responce.no_more);
                page++;
            }).always(function () {
                self.visitors_loading(false);
            });
        }

        function init() {
            fetchVisitors();
        }

        self.fetchMore = function () {
            fetchVisitors();
        };

        init();
    };
})();