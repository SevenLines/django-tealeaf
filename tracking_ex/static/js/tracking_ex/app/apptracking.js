/**
 * Created by m on 22.02.15.
 */
define(['knockout', 'app/visitor', 'app/helpers', 'urls'], function (ko, Visitor, helpers, urls) {
    return function(data) {
        var self = this;

        var page = 1;
        self.no_more_visitors = ko.observable(false);
        self.visitors = ko.observableArray();
        self.visitors_loading = ko.observable(false);

        function resetInterface() {
            $("#visitors .visitor .agent").tooltip();
        }

        function fetchVisitors() {
            self.visitors_loading(true);
            $.get(urls.visitors, {
                page: page
            }).done(function (response) {
                var lastD = null;
                var i = 0;

                function add_item() {
                    if (i < response.visitors.length) {
                        var item = response.visitors[i];
                        var curD = helpers.toLocString(item.start_time).substring(0, 10);
                        if (lastD && curD != lastD) {
                            item.last_of_day = true;
                            console.log(lastD + " " + curD);
                        }
                        lastD = curD;
                        ++i;
                        self.visitors.push(new Visitor(item));
                        setTimeout(add_item, 0);
                    } else {
                        self.no_more_visitors(response.no_more);
                        page++;
                        resetInterface();
                    }
                }

                add_item();
            }).always(function () {
                self.visitors_loading(false);
            });
        }


        function init() {
            fetchVisitors();
        }

        self.resetList = function () {
            page = 1;
            self.visitors.removeAll();
            self.no_more_visitors(false);
            self.fetchMore();
        };

        self.fetchMore = function () {
            if (self.no_more_visitors())
                return;
            fetchVisitors();
        };

        init();
    };
});